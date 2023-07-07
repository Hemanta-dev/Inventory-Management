import React, { useState } from 'react';
import { EuiForm, EuiFormRow, EuiFlexGroup, EuiFlexItem, EuiFieldText, EuiFilePicker, EuiButton, EuiSpacer, EuiTitle, EuiText } from "@elastic/eui";
import { ToastContainer, toast } from 'react-toastify';
import ImageComponent from "../base64StringToImage";

const ManageItems = () => {
  const [itemsAdmin, setItemsAdmin] = useState({
    itemsName: "",
    itemsUnits: "",
    damageItemsUnits: "",
    remarks: "",
    selectedFileName: "",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setItemsAdmin({ ...itemsAdmin, [name]: value });
  };

  const [imageUrl, setImageUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleImageChange = async (files) => {
    if (files && files.length > 0) {
      const imageFile = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setImageUrl(base64String);
      };

      reader.readAsDataURL(imageFile);
    }
  };

  const resetFields = () => {
    setItemsAdmin({
      itemsName: "",
      itemsUnits: "",
      damageItemsUnits: "",
      remarks: "",
    });
    setImageUrl("");
    setSelectedFileName("");
  };

  const postItems = async () => {
    const { itemsName, itemsUnits, damageItemsUnits, remarks, fileName } = itemsAdmin;

    if (!itemsName || !itemsUnits || !damageItemsUnits || !remarks) {
      console.log("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/items-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemsName,
          itemsUnits,
          damageItemsUnits,
          remarks,
          imageUrl,
          selectedFileName: fileName,
        }),
      });
      const data = await response.json();
      console.log(data, "9999999999999999999999999999999");

      if (response.ok) {
        notify();
        resetFields();
        console.log("Items Added Successfully");
      } else {
        const errors = data.errors;
        if (errors) {
          console.log("Backend Errors:", Object.values(errors).join("\n"));
          const errorMessage = Object.values(errors).join("\n");
          toast.error(errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 20000
          });
        } else {
          toast.error("Invalid Items Added", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 20000
          });
          console.log("Invalid Items Added");
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const notify = () => toast.success("Items Added Successfully", {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 20000
  });

  return (
    <div>
      <ToastContainer />
      <EuiTitle size="m">
        <h1>Manage Items</h1>
      </EuiTitle>
      <EuiSpacer size="l" />

      <EuiForm>
        <EuiFormRow label="Item Name">
          <EuiFieldText name="itemsName" value={itemsAdmin.itemsName} onChange={handleInputs} />
        </EuiFormRow>
        <EuiFormRow label="Item Units">
          <EuiFieldText name="itemsUnits" value={itemsAdmin.itemsUnits} onChange={handleInputs} />
        </EuiFormRow>
        <EuiFormRow label="Damage Item Units">
          <EuiFieldText name="damageItemsUnits" value={itemsAdmin.damageItemsUnits} onChange={handleInputs} />
        </EuiFormRow>
        <EuiFormRow label="Remarks">
          <EuiFieldText name="remarks" value={itemsAdmin.remarks} onChange={handleInputs} />
        </EuiFormRow>
        <EuiFormRow label="Image">
          <EuiFilePicker
            onChange={handleImageChange}
            display="large"
            initialPromptText="Upload or drag and drop an image"
          />
        </EuiFormRow>
        <EuiSpacer size="l" />
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={postItems}>Save</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiForm>
      <EuiSpacer size="l" />
      <ImageComponent base64String={imageUrl} selectedFileName={selectedFileName} />
    </div>
  );
};

export default ManageItems;
