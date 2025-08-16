import React from "react";
import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import MainLayout from "./pages/MainLayout";


import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Calendar from"./pages/Calendar";
import Projects from"./pages/Projects";
import Settings from"./pages/Settings";
import Tasks from"./pages/Tasks";

function App(){
  return(
    <BrowserRouter>
    <Routes>
      {/**Routes pour naviguer vers login NB avec le navigate on n'imbrique pas */}
      <Route path="/" element={<Navigate to="/login" />}>
      </Route>
        
        {/**Route sans sidebar */}
      <Route path="/login" element={<Login/>}/>  
      <Route path="/register" element={<Register/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      

      {/**Route avec sidebar via MainLayout */}
      <Route path="/" element={<MainLayout/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/calendar" element={<Calendar/>}/>
        <Route path="/teams" element={<Teams/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/tasks" element={<Tasks/>}/>
      </Route>
      
    
    </Routes>
    </BrowserRouter>

  );
};
export default App;