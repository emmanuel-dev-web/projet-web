import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
function MainLayout() {
    return(
        <div className="flex h-screen bg-gray-100">
            <Sidebar/>

            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet/>

            </main>

        </div>

    );
    
};
export default MainLayout;