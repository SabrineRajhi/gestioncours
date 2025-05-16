import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { BrowserRouter, Route, Routes } from 'react-router-dom';


import './Inscription.css';
import axios from "axios";

const checkPasswordStrength = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[\w@#$%^&+=!]{8,}$/;
  return passwordRegex.test(password);
};

// Nouvelle fonction pour valider le format de l'email
const checkEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
};

function Inscription() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    confirmmotdepasse: "",
    cle: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "motdepasse") {
      setPasswordStrength(checkPasswordStrength(value) ? "Strong" : "Weak");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Nom requis";
    if (!formData.prenom) newErrors.prenom = "Prénom requis";
    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!checkEmailFormat(formData.email)) {
      newErrors.email = "L'email doit être une adresse Gmail valide (ex: nom@gmail.com)";
    }
    if (!formData.motdepasse) {
      newErrors.motdepasse = "Mot de passe requis";
    } else if (!checkPasswordStrength(formData.motdepasse)) {
      newErrors.motdepasse = "Le mot de passe doit comporter au moins 8 caractères incluant une majuscule, une minuscule, un chiffre et un caractère spécial.";
    }
    if (formData.motdepasse !== formData.confirmmotdepasse) {
      newErrors.confirmmotdepasse = "Les mots de passe ne correspondent pas.";
    }
    if (!formData.cle) newErrors.cle = "Clé requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post("http://localhost:8087/auth/signup", {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.motdepasse,
          confirm_password: formData.confirmmotdepasse,
          cle: formData.cle,
        });
        if (response.status === 200) {
          navigate("/confirmation");
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        setErrors({ email: "Une erreur est survenue. Veuillez réessayer." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="registration-form">
      <h2 className="form-title">S'inscrire</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} />
          {errors.nom && <p className="error">{errors.nom}</p>}
        </div>

        <div>
          <label>Prénom:</label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} />
          {errors.prenom && <p className="error">{errors.prenom}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Mot de passe:</label>
          <input type="password" name="motdepasse" value={formData.motdepasse} onChange={handleChange} />
          {errors.motdepasse && <p className="error">{errors.motdepasse}</p>}
          {passwordStrength && <p className={`password-strength ${passwordStrength.toLowerCase()}`}>Force du mot de passe: {passwordStrength}</p>}
        </div>

        <div>
          <label>Confirmer mot de passe:</label>
          <input type="password" name="confirmmotdepasse" value={formData.confirmmotdepasse} onChange={handleChange} />
          {errors.confirmmotdepasse && <p className="error">{errors.confirmmotdepasse}</p>}
        </div>

        <div>
          <label>Clé:</label>
          <input type="text" name="cle" value={formData.cle} onChange={handleChange} />
          {errors.cle && <p className="error">{errors.cle}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

export default Inscription;