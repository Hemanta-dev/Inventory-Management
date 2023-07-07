import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Admin from '../Components/admin/admin';
import User from '../Components/user/user';

const Home = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

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
        Cookies.remove('token'); // Assuming you store the token in a cookie named 'token'
        navigate('/'); // Redirect to the homepage or login page
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      console.log(err);
      navigate('/');
    }
  };

  const callAboutPage = async () => {
    try {
      const cookieValue = Cookies.get('token');

      const res = await fetch('/home', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookieValue,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.log(err);
      callLogout();
    }
  };

  useEffect(() => {
    callAboutPage();
  }, []);

  return (
    <div className="Home">
  
      {
        role === 'superuser' ?
           <Admin />
          :
          <User />
      }
          {/* <button onClick={callLogout}>Logout</button> */}
      
    </div>
  );
};

export default Home;
