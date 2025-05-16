// src/components/Connecter.js
/*
import React, { useState } from 'react';
import './login.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import {login} from '../../Services/services'; // Auth service

// Validation de l'email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validation du mot de passe
const isValidMotdepasse = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

function Connecter() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    motdepasse: ""
  });

  const [globalError, setGlobalError] = useState('');
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    setGlobalError('');

    const isEmailEmpty = !formData.email;
    const isPasswordEmpty = !formData.motdepasse;

    if (isEmailEmpty && isPasswordEmpty) {
      setGlobalError("Veuillez renseigner tous les champs.");
      return false;
    }

    if (isEmailEmpty) {
      newErrors.email = "Email requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (isPasswordEmpty) {
      newErrors.motdepasse = "Mot de passe requis";
    } else if (!isValidMotdepasse(formData.motdepasse)) {
      newErrors.motdepasse = "Le mot de passe doit contenir au moins 8 caractères, une lettre, un chiffre et un caractère spécial.";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la modification des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setError(prevErrors => ({ ...prevErrors, [name]: "" }));
    setGlobalError('');
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const { email, role } = await login(formData.email, formData.motdepasse);

        localStorage.setItem('user', JSON.stringify({ email, role }));

        setSuccessMessage('Connexion réussie!');
        setTimeout(() => {
          navigate("/dashbord");
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        setErrorMessage("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className='wrapper'>
      <div className="from-box connecter">
        <form onSubmit={handleSubmit}>
          <h1>Se Connecter</h1>

          {globalError && <p className="error-text" style={{ textAlign: 'center' }}>{globalError}</p>}

          <div className="input-box">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder='E-mail'
            />
            <FaUser className='icon' />
            {error.email && <p className="error-text">{error.email}</p>}
          </div>

          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              name="motdepasse"
              value={formData.motdepasse}
              onChange={handleChange}
              required
              placeholder='Mot de passe'
            />
            <FaLock className='icon' />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
            {error.motdepasse && <p className="error-text">{error.motdepasse}</p>}
          </div>

          <div className="se-souvenir">
            <label><input type="checkbox" /> Se souvenir de moi</label>
            <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
          </div>

          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? "Connexion en cours ..." : "Se Connecter"}
          </button>

          {successMessage && <p className="success-text">{successMessage}</p>}
          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <div className="lien-inscription">
            <p>Vous n'avez pas de compte ? <Link to="/inscription">Inscription</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Connecter;
*/