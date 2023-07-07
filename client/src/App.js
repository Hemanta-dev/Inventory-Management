import './App.scss';

import Home from "../src/Components/home";
import { Login } from './Components/login';
import Signup from './Components/signup';

import { BrowserRouter as Router, RouterProvider, useNavigate,Routes, Route, redirect } from 'react-router-dom';
import ProtectedRoute from './util/ProtectedRoute';

import '@elastic/eui/dist/eui_theme_light.css';
import { EuiProvider } from '@elastic/eui';
import Header from './Components/Header';
function App() {


  return (
   
    <EuiProvider className="body-content" colorMode="light">

   
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
      
          <Route path='/signup' element={<Signup />} />
          
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>}/>
         
           
        </Routes>

      </Router>
 
    </EuiProvider>
    
  );
}

export default App;


