import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import Home from "./src/pages/Home";
import Profile from "./src/pages/Profile";
import Users from "./src/pages/Users";
import User from "./src/pages/User";
import Documents from "./src/pages/Documents";
import Document from "./src/pages/Document";
import CreateDocument from "./src/pages/CreateDocument";
import ModDocument from "./src/pages/ModDocument";
import UploadDocument from "./src/pages/UploadDocument";
import NewPassword from "./src/pages/NewPassword";
import Asignation from "./src/pages/Asignation";
import NewAsignation from "./src/components/NewAsignation";

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
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/:id" element={<Document />} />
        <Route path="/createDocument" element={<CreateDocument />} />
        <Route path="/modDocument/:id" element={<ModDocument />} />
        <Route path="/UploadDocument/:id" element = {<UploadDocument/>}/>
        <Route path="/newPassword" element={<NewPassword/>}/>
        <Route path="/asignations/:id" element={<Asignation/>}/>
        <Route path="/newAsignation/:id" element={<NewAsignation/>}/>
      </Routes>
    </BrowserRouter>
  );
}
