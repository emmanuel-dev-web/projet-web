import React from "react";
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { DashboardIcon, TasksIcon,TeamsIcon,ProjectsIcon,CalendarIcon,SettingsIcon } from "../assets/icons";
function Sidebar() {
    return(
      <aside className="w-64 bg-white border-r border-gray-200 shadow-md p-6">
      <h2 className="text-3xl text-blue-700 mb-10 font-extrabold tracking-tight">
        AlphaTasks
      </h2>
       <nav className="flex flex-col space-y-6 text-gray-700 text-base">
                    <Link to="/dashboard" className="flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-800 transition">
                        <DashboardIcon />
                        <span>Tableau de bord</span>
                    </Link>

                    <Link to="/tasks" className="flex items-center space-x-2 hover:text-blue-600">
                        <TasksIcon />
                        <span>Mes Tâches</span>
                    </Link>

                    <Link to="/projects" className="flex items-center space-x-2 hover:text-blue-600">
                        <ProjectsIcon/>
                        <span>Projets</span>
                    </Link>

                    <Link to="/teams" className="flex items-center space-x-2 hover:text-blue-600">
                        <TeamsIcon />
                        <span>Équipes</span>
                    </Link>

                    <Link to="/calendar" className="flex items-center space-x-2 hover:text-blue-600">
                        <CalendarIcon />
                        <span>Calendrier</span>
                    </Link>

                    <Link to="/settings" className="flex items-center space-x-2 hover:text-blue-600">
                        <SettingsIcon />
                        <span>Paramètres</span>
                    </Link>
                </nav>

        </aside>
    );
    
};
export default Sidebar;