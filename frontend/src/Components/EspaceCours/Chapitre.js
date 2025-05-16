import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Chapitre.css';

const Chapitre = () => {
  const [chapitres, setChapitres] = useState([]);
  const [form, setForm] = useState({ nomchap: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Afficher un message temporaire (succès ou erreur)
  const showTempMessage = (message, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(message);
      setErrorMessage('');
    } else {
      setErrorMessage(message);
      setSuccessMessage('');
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Récupérer tous les chapitres
  const getAllChapitres = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8087/api/chapitre/getAllChapitres');
      setChapitres(
        response.data.map((chap) => ({
          idchap: chap.idchap,
          nomchap: chap.nomchap,
        }))
      );
      showTempMessage('Chapitres chargés avec succès', true);
    } catch (error) {
      console.error('Erreur lors de la récupération des chapitres', error);
      showTempMessage('Erreur lors de la récupération des chapitres', false);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un chapitre
  const addchapitre = async () => {
    if (!form.nomchap.trim()) {
      showTempMessage('Le nom du chapitre est requis', false);
      return;
    }
    try {
      const response = await axios.post('http://localhost:8087/api/chapitre/addchapitre', {
        nomchap: form.nomchap,
      });
      setChapitres([...chapitres, response.data]);
      setForm({ nomchap: '' });
      showTempMessage('Chapitre ajouté avec succès', true);
    } catch (error) {
      showTempMessage(error.response?.data?.message || 'Erreur lors de l’ajout du chapitre', false);
    }
  };

  // Récupérer un chapitre par ID
  const getChapitreById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8087/api/chapitre/getChapitre/${id}`);
      return response.data;
    } catch (error) {
      showTempMessage('Erreur lors de la récupération du chapitre', false);
      return null;
    }
  };

  // Mettre à jour un chapitre
  const updatechapitre = async () => {
    if (!form.nomchap.trim()) {
      showTempMessage('Le nom du chapitre est requis', false);
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8087/api/chapitre/updatechapitre/${editId}`,
        { nomchap: form.nomchap }
      );
      setChapitres(
        chapitres.map((chap) =>
          chap.idchap === editId ? { ...chap, nomchap: response.data.nomchap } : chap
        )
      );
      setForm({ nomchap: '' });
      setIsEditing(false);
      setEditId(null);
      showTempMessage('Chapitre modifié avec succès', true);
    } catch (error) {
      showTempMessage(error.response?.data?.message || 'Erreur lors de la modification', false);
    }
  };

  // Supprimer un chapitre
  const deleteChapitre = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce chapitre ?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8087/api/chapitre/deleteChapitre/${id}`);
      setChapitres(chapitres.filter((chap) => chap.idchap !== id));
      showTempMessage('Chapitre supprimé avec succès', true);
    } catch (error) {
      showTempMessage(error.response?.data?.message || 'Erreur lors de la suppression', false);
    }
  };

  // Préparer l’édition d’un chapitre
  const editChapitre = async (chap) => {
    setForm({ nomchap: chap.nomchap });
    setIsEditing(true);
    setEditId(chap.idchap);
  };

  // Sauvegarder tous les chapitres (simulation)
  const sauvegarderChapitre = () => {
    showTempMessage('Tous les chapitres ont été sauvegardés', true);
    console.log('Chapitres sauvegardés : ', chapitres);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updatechapitre();
    } else {
      addchapitre();
    }
  };

  // Charger les chapitres au montage du composant
  useEffect(() => {
    getAllChapitres();
  }, []);

  return (
    <div className="gestion-chapitres-container">
      <div className="gestion-chapitres-wrapper">
        <h2 className="gestion-chapitres-title">Gestion des Chapitres</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="add-chapitre-form">
          <div className="input-group">
            <input
              type="text"
              name="nomchap"
              value={form.nomchap}
              onChange={handleChange}
              placeholder="Nom du chapitre *"
              className="add-chapitre-input"
            />
          </div>
          <button type="submit" className="add-chapitre-btn">
            {isEditing ? 'Modifier' : 'Ajouter'} le chapitre
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setForm({ nomchap: '' });
                setIsEditing(false);
                setEditId(null);
              }}
              className="cancel-btn"
            >
              Annuler
            </button>
          )}
        </form>

        <ul className="chapitres-list">
          {loading ? (
            <p>Chargement...</p>
          ) : chapitres.length === 0 ? (
            <p className="no-chapitres">Aucun chapitre disponible</p>
          ) : (
            chapitres.map((chap) => (
              <li key={chap.idchap}>
                <div>
                  <p className="chapitre-id">ID : {chap.idchap}</p>
                  <h3 className="chapitre-title">{chap.nomchap || 'Sans nom'}</h3>
                  <div className="chapitre-actions">
                    <button onClick={() => editChapitre(chap)} className="edit-btn">
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteChapitre(chap.idchap)}
                      className="delete-btn"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        {chapitres.length > 0 && (
          <button onClick={sauvegarderChapitre} className="save-all-btn">
            Sauvegarder tous les chapitres
          </button>
        )}

        <Link to="/">Retour à la gestion des cours</Link>
      </div>
    </div>
  );
};

export default Chapitre;