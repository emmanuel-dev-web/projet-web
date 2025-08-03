import React from "react";
import { Link } from "react-router-dom";
function ForgotPassword(){
    return(
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-gray-100">
           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform hover:scale-105 transition duration-200">
            <h1 className="text-4xl text-blue-700 font-extrabold mb-8 text-center">
                Réinitialiser votre mot de passe

            </h1>
            <form>

                {/**champ email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm text-gray-700 font-medium mb-1">
                    Adresse mail
                </label>
                <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white transition duration-200"
                />
                </div>
                
                {/**bouton pour soumettre */}

                <div className="mt-6">
                     <button
                 type="submit"
                 className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-200 "
                >
                 Envoyer le lien de réinitialisation
                </button>

                </div>
               
            </form>
           </div>


        </div>
    );
};
export default ForgotPassword