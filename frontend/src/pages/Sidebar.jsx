import React from "react";
import { NavLink } from "react-router-dom";
import { 
  DashboardIcon, 
  TasksIcon, 
  TeamsIcon, 
  ProjectsIcon, 
  CalendarIcon, 
  SettingsIcon 
} from "../assets/icons";

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md p-6">
      <h2 className="text-3xl text-blue-700 mb-10 font-extrabold tracking-tight">
        AlphaTasks
      </h2>

      <nav className="flex flex-col space-y-6 text-base">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <DashboardIcon />
          <span>Tableau de bord</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <TasksIcon />
          <span>Mes Tâches</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <ProjectsIcon />
          <span>Projets</span>
        </NavLink>

        <NavLink
          to="/teams"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <TeamsIcon />
          <span>Équipes</span>
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <CalendarIcon />
          <span>Calendrier</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-semibold transition ${
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          <SettingsIcon />
          <span>Paramètres</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
