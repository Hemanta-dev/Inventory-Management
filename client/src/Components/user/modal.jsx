import React, {useState,useEffect} from "react";
import MyModal from "./showModal";

const Modal = () =>{
    const [showModal, setShowModal] = useState(false);
    const closeModal =() =>{
        return setShowModal(false);
    }
  
    return(
        <>
        <button onClick={()=> setShowModal(true)} >Open Modal</button>
        {showModal && <MyModal closeModal={closeModal}/> }
        </>
    )
}
export default Modal;