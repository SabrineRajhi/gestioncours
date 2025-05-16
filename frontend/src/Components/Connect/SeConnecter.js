import React, { useState, useContext } from 'react';
import './SeConnecter.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import DOMPurify from 'dompurify';
import { AuthContext } from '../context/AuthContext';

// Validation de l'email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validation du mot de passe
const isValidMotdepasse = (password) => {
  return password.length >= 6; // Ajusté selon les exigences du backend
};

function Connecter() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    motdepasse: '',
  });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Ajout de rememberMe
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sanitisation des entrées
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    const sanitizedEmail = sanitizeInput(formData.email);
    const motdepasse = formData.motdepasse; // Pas de sanitisation pour le mot de passe

    if (!sanitizedEmail) {
      newErrors.email = 'Email requis';
    } else if (!validateEmail(sanitizedEmail)) {
      newErrors.email = 'Email invalide';
    }

    if (!motdepasse) {
      newErrors.motdepasse = 'Mot de passe requis';
    } else if (!isValidMotdepasse(motdepasse)) {
      newErrors.motdepasse = 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setErrorMessage('');
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      setErrorMessage('Veuillez remplir tous les champs correctement.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Appel API vers le backend
      const response = await login(sanitizeInput(formData.email), formData.motdepasse);
      const { accessToken, refreshToken, isActive, roles, user } = response;

      if (isActive) {
        setSuccessMessage('Connexion réussie !');

        // Stocker les informations utilisateur
        const userData = { email: user.email, roles };
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('accessToken', accessToken);
        storage.setItem('refreshToken', refreshToken);
        storage.setItem('roles', JSON.stringify(roles));
        storage.setItem('user', JSON.stringify(userData));

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setErrorMessage('Compte non approuvé. Veuillez contacter l\'administration.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      const errorMsg = error || 'Une erreur est survenue. Veuillez réessayer.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="from-box connecter">
        <form onSubmit={handleSubmit}>
          <h1>Se Connecter</h1>

          <div className="input-box">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="E-mail"
            />
            <FaUser className="icon" />
            {error.email && <p className="error-text">{error.email}</p>}
          </div>

          <div className="input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              name="motdepasse"
              value={formData.motdepasse}
              onChange={handleChange}
              required
              placeholder="Mot de passe"
            />
            <FaLock className="icon" />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
            {error.motdepasse && <p className="error-text">{error.motdepasse}</p>}
          </div>

          <div className="se-souvenir">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />{' '}
              Se souvenir de moi
            </label>
            <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion en cours...' : 'Se Connecter'}
          </button>

          {successMessage && <p className="success-text">{successMessage}</p>}
          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <div className="lien-inscription">
            <p>
              Vous n'avez pas de compte ? <Link to="/inscription">Inscription</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Connecter;