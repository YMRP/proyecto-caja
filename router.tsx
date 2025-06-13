import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './src/pages/Login'
import Register from './src/pages/Register';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}