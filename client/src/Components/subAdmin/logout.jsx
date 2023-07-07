import Cookies from "js-cookie";
import React,{useNavigate} from "react-router-dom";
const Logout =() =>{
    const navigate = useNavigate();
    const callLogout = async () => {
        try {
          const res = await fetch('/logout', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
    
          if (res.status === 200) {
            Cookies.remove('token');
            navigate('/');
          } else {
            throw new Error('Logout failed');
          }
        } catch (err) {
          console.log(err);
          navigate('/');
        }
      };
    return(
        <>
        <button onClick={callLogout}>Logout</button>
        </>
    )
}
export default Logout;