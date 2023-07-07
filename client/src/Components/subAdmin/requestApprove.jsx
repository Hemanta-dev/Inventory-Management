import { useEffect,useState } from "react";
import Cookies from "js-cookie";
import { EuiForm, EuiFormRow, EuiTabbedContent, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiFieldText, EuiLink, EuiSelect, EuiFilePicker, EuiTableHeader, EuiTableRow, EuiTableRowCell, EuiTableBody, EuiTable, EuiTableHeaderCell, EuiButton, EuiSpacer, EuiTitle, EuiText } from "@elastic/eui";


const RequestApprove=()=>{
    const [userRequests, setUserRequests] = useState([]);
    const [googleRequests, setGoogleRequests] = useState([]);


  const userRequestList = async () => {
    try {
      const cookieValue = Cookies.get('token');
      const res = await fetch('/register-list', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookieValue,
        },
        credentials: 'include',
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setUserRequests(data.pendingUsers);
      } else {
        throw new Error('Failed to fetch user requests');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptUserRequest = async (id) => {
    try {
      const cookieValue = Cookies.get('token');
      console.log(cookieValue, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      console.log(id);
      const res = await fetch(`/approve/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookieValue,
        },
        credentials: 'include',
      });

      if (res.status === 200) {

        // Request approved successfully
        // You can update the userRequests state or perform any other action as needed
        // For example, remove the approved request from the list
        const updatedRequests = userRequests.filter((request) => request._id !== id);
        setUserRequests(updatedRequests);

      } else {
        throw new Error('Failed to approve user request');
      }
    } catch (error) {
      console.log(error);
    }
  };


  //   const rejectUserRequest = async (id) => {
  //     try {
  //       const cookieValue = Cookies.get('token');
  //       console.log(cookieValue,"^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  //       console.log(id);
  //       const res = await fetch(`/reject/${id}`, {
  //         method: 'PUT',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //           Authorization: 'Bearer ' + cookieValue,
  //         },
  //         credentials: 'include',
  //       });

  //       if (res.status === 200) {
  //         window.location("User Request Rejected Successfully");
  //         // Request approved successfully
  //         // You can update the userRequests state or perform any other action as needed
  //         // For example, remove the approved request from the list
  //         const updatedRequests = userRequests.filter((request) => request._id !== id);
  //         setUserRequests(updatedRequests);

  //       } else {
  //         throw new Error('Failed to approve user request');
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const rejectUserRequest = async (id) => {
    try {
      const cookieValue = Cookies.get('token');
      console.log(cookieValue, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      console.log(id);
      const res = await fetch(`/reject/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookieValue,
        },
        credentials: 'include',
      });

      if (res.status === 200) {
        // Request rejected successfully
        // You can update the userRequests state or perform any other action as needed
        // For example, remove the rejected request from the list
        const updatedRequests = userRequests.filter((request) => request._id !== id);
        setUserRequests(updatedRequests);
        window.alert("User Request Rejected Successfully");
      } else {
        throw new Error('Failed to reject user request');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //oauth
  const googleRequestList = async () => {
    try {
      const cookieValue = Cookies.get('token');
      const res = await fetch('/oauth-register-list', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookieValue,
        },
        credentials: 'include',
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setGoogleRequests(data.pendingUsers);
      } else {
        throw new Error('Failed to fetch user requests');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleacceptUserRequest = async (id) => {
    try {
      const cookieValue = Cookies.get('token');
      console.log(cookieValue, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      console.log(id);
      const res = await fetch(`/google-approve/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookieValue,
        },
        credentials: 'include',
      });

      if (res.status === 200) {

        // Request approved successfully
        // You can update the userRequests state or perform any other action as needed
        // For example, remove the approved request from the list
        const updatedRequests = googleRequests.filter((request) => request._id !== id);
        setGoogleRequests(updatedRequests);

      } else {
        throw new Error('Failed to approve user request');
      }
    } catch (error) {
      console.log(error);
    }
  };




  const googlerejectUserRequest = async (id) => {
    try {
      const cookieValue = Cookies.get('token');
      console.log(cookieValue, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      console.log(id);
      const res = await fetch(`/google-reject/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookieValue,
        },
        credentials: 'include',
      });

      if (res.status === 200) {
        // Request rejected successfully
        // You can update the userRequests state or perform any other action as needed
        // For example, remove the rejected request from the list
        const updatedRequests = googleRequests.filter((request) => request._id !== id);
        setGoogleRequests(updatedRequests);
        window.alert("User Request Rejected Successfully");
      } else {
        throw new Error('Failed to reject user request');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    userRequestList();
    googleRequestList();

  },[])
    return(
        <>
        <EuiSpacer size='l' />

        <EuiText textAlign="left">
          <strong>
            Normal Signup Request:
          </strong>
        </EuiText>

        <EuiSpacer size='l' />
        <EuiTable>
          <EuiTableHeader>
            <EuiTableHeaderCell>S.N</EuiTableHeaderCell>
            <EuiTableHeaderCell>Email</EuiTableHeaderCell>
            <EuiTableHeaderCell>Location</EuiTableHeaderCell>
            <EuiTableHeaderCell>Action</EuiTableHeaderCell>
          </EuiTableHeader>
          <EuiTableBody>
            {userRequests.map((item, index) => (
              <EuiTableRow key={index}>
                <EuiTableRowCell>{index + 1}</EuiTableRowCell>
                <EuiTableRowCell>{item.email}</EuiTableRowCell>
                <EuiTableRowCell>{item.location}</EuiTableRowCell>
                <EuiTableRowCell>
                  <EuiButton color="primary" fill size="s" onClick={() => acceptUserRequest(item._id)}>Approve</EuiButton>
                  <EuiButton color="danger" fill size='s' onClick={() => rejectUserRequest(item._id)}>Reject</EuiButton>
                </EuiTableRowCell>

              </EuiTableRow>
            ))}
          </EuiTableBody>
        </EuiTable>
        <EuiSpacer size='l' />


        <EuiText textAlign="left">
          <strong>
            Google Sign Up Request:
          </strong>
        </EuiText>

        <EuiSpacer size='l' />
        <EuiTable >
          <EuiTableHeader>
            <EuiTableHeaderCell>S.N</EuiTableHeaderCell>
            <EuiTableHeaderCell>Email</EuiTableHeaderCell>
            <EuiTableHeaderCell>User Name</EuiTableHeaderCell>
            <EuiTableHeaderCell>Action</EuiTableHeaderCell>
          </EuiTableHeader>
          <EuiTableBody>
            {googleRequests.map((item, index) => (
              <EuiTableRow key={index}>
                <EuiTableRowCell>{index + 1}</EuiTableRowCell>
                <EuiTableRowCell>{item.email}</EuiTableRowCell>
                <EuiTableRowCell>{item.username}</EuiTableRowCell>
                <EuiTableRowCell>
                  <EuiButton color="primary" fill size="s" onClick={() => googleacceptUserRequest(item._id)}>Approve</EuiButton>
                  <EuiButton color="danger" fill size='s' onClick={() => googlerejectUserRequest(item._id)}>Reject</EuiButton>
                </EuiTableRowCell>

              </EuiTableRow>
            ))}
          </EuiTableBody>
        </EuiTable>

      </>
    )
}

export default RequestApprove;