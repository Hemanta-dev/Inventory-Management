import { EuiButton, EuiText, EuiButtonEmpty, EuiForm, EuiFormRow, EuiFieldText, EuiTitle, EuiTextArea, EuiSpacer, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';


import React, { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import '../../../node_modules/react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';


const MyModal = ({ closeModal, handleRequest, showModalData }) => {
 
    const [itemsUser, setItemsUser] = useState({
        itemsName: "",
        itemsUnits: "",
        message: "",
    });
    const resetInput=()=>{
        setItemsUser({
            itemsName: "",
            itemsUnits: "",
            message: "",

        })
    }
    const handleInputs = (e) => {
        const { name, value } = e.target;
        setItemsUser({ ...itemsUser, [name]: value });
    };

    const saveModalData = async () => {
        const { itemsName, itemsUnits, message } = itemsUser;

        if (!itemsName || !itemsUnits || !message) {
            console.log("Please fill all fields");
            return;
        }

        try {
            const cookie = Cookies.get("token");
            const decoded = jwt_decode(cookie);
            const email = decoded.email;
            const response = await fetch("/items-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    itemsName,
                    itemsUnits,
                    message,
                    email

                }),
            });
            const data = await response.json();
            console.log(data, "9999999999999999999999999999999");

            if (response.ok) {
                toast.success("Items Requested Successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 20000
                });
                resetInput();
                console.log("Items Requested Successfully");

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

                    toast.error("Invalid Items Requested", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 20000
                    });
                    console.log("Invalid Items Requested");
                }
            }

        } catch (error) {
            console.log("Error:", error);
            toast.error(error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 20000,
            });
        }

    }


    useEffect(() => {
        setItemsUser({ 'itemsName': showModalData });
    }, [])

    useEffect(() => {
        document.body.style.overflowY = "hidden";
        return () => {
            document.body.style.overflowY = "scroll";
        };
    }, [])
    return (
        <>
            <div className="modal-wrapper" onClick={closeModal}>
            </div>
            <div className="modal-container">
                <EuiForm component="form">
                    <EuiFormRow>
                        <EuiTitle><h3>Items Request Form</h3></EuiTitle>
                    </EuiFormRow>
                    <EuiSpacer size="l" />
                    <EuiSpacer size="l" />

                    <EuiFormRow label="Item Name" >

                        <EuiFieldText name="itemsName" onChange={handleInputs} value={showModalData} readOnly />

                    </EuiFormRow>
                    {/* <EuiFormRow label="Item Description" >
                      <EuiTextArea name="itemsDescription" />
                    </EuiFormRow> */}
                    <EuiFormRow label="Quantity" >
                        <EuiFieldText name="itemsUnits" onChange={handleInputs} value={itemsUser.itemsUnits} />
                    </EuiFormRow>
                    <EuiFormRow label="Message" >
                        <EuiTextArea name="message" onChange={handleInputs} value={itemsUser.message} />
                    </EuiFormRow>
                    <EuiSpacer size="l" />
                    <EuiSpacer size="l" />
                    <EuiFlexGroup justifyContent='space-between'>
                        <EuiFlexItem>
                            <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiButton type="button" color="primary" onClick={saveModalData} fill>Save</EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiForm>

            </div>
            <ToastContainer />
        </>
    )
}
export default MyModal;