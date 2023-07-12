import React, { useState, useEffect } from "react";
import { EuiText, EuiPageTemplate, EuiFlexGroup, EuiFlexItem, EuiCard, EuiSpacer, EuiButton } from "@elastic/eui";
import Cookies from 'js-cookie';
import ImageComponent from "../base64StringToImage";
// import jwt from 'jsonwebtoken';


import MyModal from "./showModal";


const ListUser = () => {
    const [items, setItem] = useState([]);
    const cookiee = Cookies.get('token');
    // const decodedToken = jwt.verify(cookiee, "my_screte_key");
    // const role = decodedToken.role;
    const [showDataList, setShowDataList] =useState([]);

    const [showModal, setShowModal] = useState(false);
    const closeModal =() =>{
        ListView();
        return setShowModal(false);
    }
   
    const handleRequest =async(id)=>{
    
        try{
            const cookie = Cookies.get('token');
            const res = await fetch(`/items-list/${id}`, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookie
                },
                credentials: 'include',
              });
        
              if (res.status === 200) {
                const data = await res.json();
                setShowDataList(data.item.itemsName)
                console.log(data.item,"3333333333333333333333333333333333333333333333")
                setShowModal(true);
         
                
              } else {
                throw new Error('Item Request Failed');
              }
            } catch (err) {
              console.log(err);
              
            }
        }
    

    const ListView = async () => {
        const cookie = Cookies.get('token');

        try {
            const response = await fetch("/items-list", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + cookie
                },
                credentials: "include"
            })

            if (response.status === 200) {
                const data = await response.json();
                setItem(data.itemsList);
                console.log(data, "999999999999999999999999999999999")
            }

        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        ListView()
    }, [])
    return (
        <>
            <EuiPageTemplate.Section grow={false} color="subdued" bottomBorder="extended">
                <EuiText textAlign="center">
                    <strong>
                        Welcome, {items.role}
                    </strong>
                </EuiText>
            </EuiPageTemplate.Section>
            <EuiPageTemplate.Section grow={false} color="subdued" bottomBorder="extended">
                <EuiText textAlign="start">
                    <strong>
                        We have the following items available for request.
                    </strong>
                </EuiText>
                <EuiSpacer size="m" />
                <EuiFlexGroup justifyContent="between">
                    {items.map((item) => (

                        <EuiFlexItem grow={false}><EuiCard textAlign="left" image={<ImageComponent base64String={item.imageUrl} contentType={item.imageContentType} className="conversion-image" />} title={item.itemsName} description={item.itemsUnits} footer={
                            <EuiFlexGroup justifyContent="flexEnd">
                                <EuiFlexItem grow={false}>
                                    <EuiButton  onClick={() => handleRequest(item._id)}>Request</EuiButton>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        } /></EuiFlexItem>
                    ))}

                </EuiFlexGroup>
                <EuiSpacer size="m" />
            </EuiPageTemplate.Section>
            {showModal && <MyModal closeModal={closeModal} handleRequest={handleRequest} ListView={ListView} showModalData={showDataList} /> }
        </>
    )
}
export default ListUser;