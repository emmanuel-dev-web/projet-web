import React from "react";
import { Link } from "react-router-dom";
import {DashboardIcon, TasksIcon, ProjectsIcon, TeamsIcon, CalendarIcon, SettingsIcon, TaskTerminatedIcon, TaskOnGoingIcon, UsersOnLineIcon, LateTaskIcon} from "../assets/icons";

function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Contenu central temporaire */}
            <div className="flex-1 p-10">
                              
              <h1 className="text-2xl font-bold text-gray-800">
                Bienvenue sur le tableau de bord
                
              </h1>
          </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6"> {/**Le responsive design permet que ton application soit belle et utilisable sur tous les appareils, sans que l’utilisateur ait à zoomer ou scroller dans tous les sens. */}
                {/**bloc 1 */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                  <ProjectsIcon className="text-blue-600 text-4xl" />
                  <p className="text-gray-500">
                    Projets
                  </p>
                   <h2 className="text-2xl font-bold text-blue-600">
                    12
                   </h2>

             </div>

             {/**bloc 2 */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                 <TaskOnGoingIcon className="text-blue-600 text-4xl"/>
                  <p className="text-gray-500">
                   Tâches en cours
                  </p>
                   <h2 className="text-2xl font-bold text-blue-600">
                   34
                   </h2>
             </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                 <TeamsIcon className="text-purple-600 text-5xl" />
                  <p className="text-gray-500">
                   Equipes
                  </p>
                   <h2 className="text-2xl font-bold text-blue-600">
                    5
                   </h2>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-md">
                 <TaskTerminatedIcon className="text-blue-600 text-4xl"/>
                  <p className="text-gray-500">
                   Tâches terminées
                  </p>
                   <h2 className="text-2xl font-bold text-green-600">
                    11
                   </h2>
             </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                 <LateTaskIcon className="text-purple-600 text-5xl"/>
                  <p className="text-gray-500">
                   Tâches en retards
                  </p>
                   <h2 className="text-2xl font-bold text-red-600">
                    6
                   </h2>
             </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                 <CalendarIcon className="text-purple-600 text-5xl" />
                  <p className="text-gray-500">
                   Evénements à venir
                  </p>
                   <h2 className="text-2xl font-bold text-purple-600">
                    3
                   </h2>
             </div>

              <div className="bg-white p-6  rounded-xl shadow-md ">
                 <UsersOnLineIcon className="text-purple-600 text-5xl" />
                  <p className="text-gray-500">
                  Utilisateurs actifs
                  </p>
                   <h2 className="text-2xl font-bold text-indigo-600">
                   18
                   </h2>
             </div>
          </div>
       </div>
    );
}

export default Dashboard;
