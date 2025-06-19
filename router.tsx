import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './src/pages/Login'
import Register from './src/pages/Register';
import Home from './src/pages/Home';
import Profile from './src/pages/Profile';


export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path='/Home' element = {<Home/>} />
        <Route path='/profile' element = {<Profile/>} />

      </Routes>
    </BrowserRouter>
  );
}