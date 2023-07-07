import React, { useState, useEffect } from "react";
import { EuiForm, EuiFormRow, EuiTabbedContent, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiFieldText, EuiLink, EuiSelect, EuiFilePicker, EuiTableHeader, EuiTableRow, EuiTableRowCell, EuiTableBody, EuiTable, EuiTableHeaderCell, EuiButton, EuiSpacer, EuiTitle, EuiText } from "@elastic/eui";


const Request = ({ onClickCallback }) => {
  const [requestItem, setRequestItems] = useState([]);
  const RequestUserItemList = async () => {
    try {
      const res = await fetch('/items-user-request', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setRequestItems(data.itemUserRequest);
      } else {
        throw new Error('Failed to fetch items');
      }
    } catch (error) {
      console.log(error);
    }
  }

 

  const acceptHandleButton = async (id) => {
    try {
        const res = await fetch(`/items-user-request-reject/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
         },
        });

      if (res.status === 200) {
        const updatedRequests = requestItem.filter((request) => request._id !== id);
        setRequestItems(updatedRequests);
        window.alert("Approved user request for itemSuccessfully");
      

      } else {
        throw new Error('Failed to approve user request for item');
      }
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(()=>{
  //   if(changeButton){
  //     acceptHandleButton();
  //   }
  // })

  




  const rejectHandleButton = async (id) => {
    try {
      const res = await fetch(`/items-user-request-reject/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        const deletedRequests = requestItem.filter((request) => request._id !== id);
        setRequestItems(deletedRequests);
        window.alert("User Request for Items Rejected Successfully");
      } else {
        throw new Error('Failed to reject User Request for Items');
      }
    } catch (error) {
      console.log(error);
    }

  }
  useEffect(() => {
    if (onClickCallback) {
      RequestUserItemList();
    }
  }, [onClickCallback]);

  return (
    <>
      <EuiTable >
        <EuiTableHeader>
          <EuiTableHeaderCell>S.N</EuiTableHeaderCell>
          <EuiTableHeaderCell>User Name</EuiTableHeaderCell>
          <EuiTableHeaderCell>Request Item</EuiTableHeaderCell>
          <EuiTableHeaderCell>Request Item Unit</EuiTableHeaderCell>
          <EuiTableHeaderCell>Mesaage</EuiTableHeaderCell>
          <EuiTableHeaderCell>Action</EuiTableHeaderCell>
        </EuiTableHeader>
        <EuiTableBody>
          {requestItem.map((item, index) => (
            <EuiTableRow key={index}>
              <EuiTableRowCell>{index + 1}</EuiTableRowCell>
              <EuiTableRowCell>{item.email}</EuiTableRowCell>
              <EuiTableRowCell>{item.itemsName}</EuiTableRowCell>
              <EuiTableRowCell>{item.itemsUnits}</EuiTableRowCell>
              <EuiTableRowCell>{item.message}</EuiTableRowCell>
              <EuiTableRowCell>
                <EuiFlexGroup>
                    {item.isApproved ? 
                        <EuiFlexItem ><EuiButton color="success" fill size="s">Accepted</EuiButton></EuiFlexItem >
                     : 
                        <EuiFlexItem ><EuiButton color="primary" fill size="s" onClick={() => acceptHandleButton(item._id)}>Pending</EuiButton></EuiFlexItem >
                    }
                  <EuiFlexItem ><EuiButton color="danger" fill onClick={() => rejectHandleButton(item._id)} size="s">Reject</EuiButton></EuiFlexItem>
                </EuiFlexGroup>

              </EuiTableRowCell>

            </EuiTableRow>
          ))}
        </EuiTableBody>

      </EuiTable>
    </>
  )
}
export default Request;