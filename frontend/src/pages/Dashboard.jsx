import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";  
import {DashboardIcon, TasksIcon, ProjectsIcon, TeamsIcon, CalendarIcon, SettingsIcon, TaskTerminatedIcon, TaskOnGoingIcon, UsersOnLineIcon, LateTaskIcon} from "../assets/icons";

function Dashboard() {
   const [today, setToday] = useState(""); // on va stocker la date actuelle 
   useEffect (() => {
      const date = new Date();
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric"};
      setToday(date.toLocaleDateString("fr-FR", options));
   }, [])
    return (
        <div className="space-y-6">
            {/* Contenu central temporaire */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg text-white">
                              
              <h1 className="text-3xl font-bold">
                 <p className="text-lg mt-1"> 
                  {today}
                 </p>
                Bienvenue sur le tableau de bord
                
               </h1>
          </div>
          <div className="mt-4 md:mt-0">
              <button className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
                + Nouvelle tâche
              </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
            <div>
               <p className="text-gray-500 font-medium">
                  Projets
               </p>
               <h2 className="text-2xl font-bold text-blue-600">
                 12
               </h2>
            </div>
              <ProjectsIcon className = "text-blue-600 text-5xl"/>
          </div>
       </div>
      );
   }

export default Dashboard;
