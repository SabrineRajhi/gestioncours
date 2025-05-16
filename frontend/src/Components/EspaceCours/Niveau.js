import { useState, useEffect } from "react";
import axios from "axios";
import './Niveau.css';

 function Niveau() {
  const [search, setSearch] = useState("");
  const [niveaux, setNiveaux] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newNiveau, setNewNiveau] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showLevels, setShowLevels] = useState(false);
  const [loading, setLoading] = useState(false);

  // Afficher un message temporaire (succès ou erreur)
  const showTempMessage = (msg, isSuccess = true) => {
    if (isSuccess) {
      setMessage(msg);
      setError("");
    } else {
      setError(msg);
      setMessage("");
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  // Récupérer tous les niveaux
  const getAllNiveaux = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8087/api/niveau/getAllNiveau");
      setNiveaux(response.data);
      showTempMessage("Niveaux chargés avec succès", true);
    } catch (err) {
      console.error("Erreur lors de la récupération des niveaux:", err.response || err.message);
      showTempMessage(
        err.response?.data || "Erreur lors de la récupération des niveaux",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  // Charger les niveaux lorsque showLevels passe à true
  useEffect(() => {
    if (showLevels) {
      getAllNiveaux();
    }
  }, [showLevels]);

  // Ajouter un niveau
  const ajouterNiveau = async () => {
    if (!newNiveau.trim()) {
      setError("Le nom du niveau ne peut pas être vide");
      return;
    }

    try {
      await axios.post("http://localhost:8087/api/niveau/addNiveau", {
        nom: newNiveau,
      });
      setNewNiveau("");
      setError("");
      getAllNiveaux(); // Recharger la liste pour refléter le nouvel ajout
      showTempMessage("Niveau ajouté avec succès", true);
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err.response || err.message);
      showTempMessage(
        err.response?.data || "Erreur lors de l'ajout du niveau",
        false
      );
    }
  };

  // Récupérer un niveau par ID (pour pré-remplir le formulaire de modification)
  const getNiveauById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8087/api/niveau/getNiveau/${id}`);
      setNewNiveau(response.data.nom);
      setEditingId(id);
    } catch (err) {
      console.error("Erreur lors de la récupération du niveau:", err.response || err.message);
      showTempMessage(
        err.response?.data || "Erreur lors de la récupération du niveau",
        false
      );
    }
  };

  // Mettre à jour un niveau
  const modifierNiveau = async () => {
    if (!newNiveau.trim()) {
      setError("Le nom du niveau ne peut pas être vide");
      return;
    }

    try {
      await axios.put(`http://localhost:8087/api/niveau/updateNiveau/${editingId}`, {
        nom: newNiveau,
      });
      setEditingId(null);
      setNewNiveau("");
      getAllNiveaux(); // Recharger la liste pour refléter la modification
      showTempMessage("Niveau modifié avec succès", true);
    } catch (err) {
      console.error("Erreur lors de la modification:", err.response || err.message);
      showTempMessage(
        err.response?.data || "Erreur lors de la modification du niveau",
        false
      );
    }
  };

  // Supprimer un niveau
  const supprimerNiveau = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce niveau ?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8087/api/niveau/deleteNiveau/${id}`);
      getAllNiveaux(); // Recharger la liste pour refléter la suppression
      showTempMessage("Niveau supprimé avec succès", true);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err.response || err.message);
      showTempMessage(
        err.response?.data || "Erreur lors de la suppression du niveau",
        false
      );
    }
  };

  // Préparer l'édition d'un niveau
  const startEditing = (id) => {
    getNiveauById(id);
  };

  // Basculer l'affichage des niveaux
  const toggleShowLevels = () => {
    setShowLevels(!showLevels);
  };

  // Filtrer les niveaux pour la recherche
  const niveauxFiltres = niveaux.filter((niveau) =>
    niveau.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recherche-container">
      <div className="crud-header">
        <h2>Gestion des Niveaux</h2>

        <div className="input-group">
          <input
            type="text"
            className="recherche-input"
            placeholder="Ajouter un nouveau niveau..."
            value={newNiveau}
            onChange={(e) => {
              setNewNiveau(e.target.value);
              setError("");
            }}
          />
          <button
            className="add-btn"
            onClick={editingId === null ? ajouterNiveau : modifierNiveau}
          >
            {editingId === null ? "Ajouter" : "Modifier"}
          </button>

          <button className="toggle-btn" onClick={toggleShowLevels}>
            {showLevels ? "Masquer les niveaux" : "Afficher les niveaux"}
          </button>

          {editingId !== null && (
            <button
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setNewNiveau("");
              }}
            >
              Annuler
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
      </div>

      {showLevels && (
        <>
          <div className="search-section">
            <input
              type="text"
              className="recherche-input"
              placeholder="Rechercher un niveau..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ul className="recherche-liste">
            {loading ? (
              <p>Chargement...</p>
            ) : niveauxFiltres.length === 0 ? (
              <p className="no-niveaux">Aucun niveau disponible</p>
            ) : (
              niveauxFiltres.map((niveau) => (
                <li key={niveau.id} className="niveau-item">
                  {editingId === niveau.id ? (
                    <input
                      type="text"
                      value={newNiveau}
                      onChange={(e) => setNewNiveau(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{niveau.nom}</span>
                  )}

                  <div className="action-buttons">
                    {editingId === niveau.id ? (
                      <button className="save-btn" onClick={modifierNiveau}>
                        Enregistrer
                      </button>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(niveau.id)}
                        >
                          Modifier
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => supprimerNiveau(niveau.id)}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
export default Niveau;