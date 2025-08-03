import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import { UserIcon } from "../assets/icons";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [message, setMessage] = useState("")
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  // Empêche le formulaire de recharger la page par défaut
  e.preventDefault();

  try {
    // Envoie une requête POST au backend
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST", // On veut envoyer des données
      headers: {
        "Content-Type": "application/json", // Le backend attend du JSON
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
      }), // On envoie l'email et le mot de passe dans le corps
    });

    // On récupère le corps de la réponse en JSON
    const data = await response.json();

    // Si la réponse est positive (code 200 OK)
    if (response.ok) {
      // On sauvegarde une info dans le navigateur (ex : pour dire que l’utilisateur est connecté)
      localStorage.setItem("userLoggedIn", "true");

      // On redirige l’utilisateur vers le tableau de bord
      navigate("/dashboard");
    } else {
      // Si erreur (ex : mauvais mot de passe), on affiche le message du backend
      setMessage(data.message);
    }
  } catch (error) {
    // Si le serveur ne répond pas ou qu’il y a une erreur réseau
    console.error("Erreur lors de la connexion", error);
    setMessage("Erreur serveur"); // Message pour l’utilisateur
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        {/* Titre + icône */}
        <div className="text-center">
          <UserIcon className="mx-auto text-blue-600 text-4xl mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">
            Connexion à <span className="text-blue-600">AlphaTasks</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Veuillez vous connecter à votre compte
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit = {handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Bouton se connecter */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Se connecter
          </button>

          {message && (
            <div className="text-red-500 text-sm text-center mt-2">
               {message}
            </div>
            

          )}
          
        </form>

        {/* Liens inscription et mot de passe oublié */}
        <div className="flex justify-between text-sm text-blue-600 font-medium">
          <Link to="/register" className="hover:underline">Pas encore inscrit ?</Link>
          <Link to="/forgot-password" className="hover:underline">Mot de passe oublié ?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
