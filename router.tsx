import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import Home from "./src/pages/Home";
import Profile from "./src/pages/Profile";
import Users from "./src/pages/Users";
import User from "./src/pages/User";
import Documents from "./src/pages/Documents";
import Document from "./src/pages/Document";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/usuario/:id" element={<User />} />
        <Route path="/documents" element={<Documents/>}/>
        <Route path="/documents/:id" element={<Document/>}/>
      </Routes>
    </BrowserRouter>
  );
}
