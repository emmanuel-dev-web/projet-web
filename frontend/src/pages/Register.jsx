import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassWord] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
  e.preventDefault(); // empêche le rechargement de la page

  const response = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name})
  });

  const data = await response.json();
 if (response.ok) {
  setMessage("Inscription réussie !");
  setIsError(false);
  setTimeout(() => {
    navigate("/login");
  }, 2000);
} else {
   setMessage(data.message || 'Une erreur est survenue');
      setIsError(true);
   }
 };

    
    return(
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-gray-100 " >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform hover:scale-105 transition duration-200">
                <h1 className="text-4xl text-blue-600 font-extrabold mb-8">
                    Créer un compte 
                </h1>
                <form onSubmit={handleSubmit}>

                    {/**section nom */}

                    <div className="mb-4">
                        <label htmlFor="nom" className="block text-sm font-medium  text-gray-600">
                            nom

                        </label>

                        <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white transition duration-200"
                        
                        />
                    </div>

                    {/**section por l'email */}

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Adresse email

                        </label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white transition duration-200"

                        />
                        
                    </div>

                    {/**section mot de passe */}

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ">
                            Mot de passe

                        </label>

                        <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassWord(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white transition duration-200"

                        />

                    </div>

                    <button
                    type="submit"
                    className="w-full text-white bg-green-500 px-4 py-2 rounded-lg hover: bg-green-700 transition-duration-200 "
                    >
                        S'inscrire
                    </button>

                    {message && (
                        <div style={{ color: isError ? 'red' : 'green', marginTop: '10px' }}>
                         {message}
                         </div>
                    )}

                </form>

            </div>

        </div>
    );
};
export default Register;