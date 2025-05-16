import React, { useState, useEffect } from 'react'; // Ajout de useEffect
import { Link } from 'react-router-dom';
import './Cours.css';
import axios from 'axios';

function GestionCours() {
    const [cours, setCours] = useState([]);
    
    const [nouveauEspaceCours, setNouveauEspaceCours] = useState({ titre: '', description: '' });
    const [coursEnEdition, setCoursEnEdition] = useState(null);
    const [afficherEspaces, setAfficherEspaces] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ titre: false, description: false });
    const [loading, setLoading] = useState(false);

    // États pour les chapitres
    const [chapitres, setChapitres] = useState([]);
    const [afficherChapitres, setAfficherChapitres] = useState(false);

    // Afficher un message temporaire
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

    // Valider les champs
    const validateFields = (data) => {
        const errors = {
            titre: !data.titre.trim(),
            description: !data.description.trim(),
        };
        setFieldErrors(errors);
        return !errors.titre && !errors.description;
    };

    // Récupérer tous les cours
    const getAllEspaceCours = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8087/api/espacecours/getAllespacecours');
            console.log('Cours récupérés :', response.data);
            setCours(
                response.data.map((c) => ({
                    id: c.idespac,
                    titre: c.titre,
                    description: c.description,
                }))
            );
        } catch (error) {
            console.error('Erreur lors de la récupération des cours', error);
            showTempMessage('Erreur lors de la récupération des cours', false);
        } finally {
            setLoading(false);
        }
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

    // Ajouter un espace de cours
    const ajouterEspaceCours = async () => {
        if (!validateFields(nouveauEspaceCours)) {
            showTempMessage('Veuillez remplir tous les champs obligatoires', false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8087/api/espacecours/addesp', nouveauEspaceCours, {
                headers: { 'Content-Type': 'application/json' },
            });
            setCours((prevCours) => [...prevCours, { id: response.data.idespac, ...response.data }]);
            setNouveauEspaceCours({ titre: '', description: '' });
            showTempMessage(response.data, true); // Utilise le message du backend
            getAllEspaceCours();
        } catch (error) {
            console.error('Erreur lors de l’ajout', error);
            showTempMessage(error.response?.data || 'Erreur lors de l’ajout', false);
        }
    };

    // Modifier un cours
    const modifierCours = async () => {
        if (!coursEnEdition || !validateFields(coursEnEdition)) {
            showTempMessage('Veuillez remplir tous les champs obligatoires pour la modification', false);
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8087/api/espacecours/updateesp/${coursEnEdition.id}`,
                coursEnEdition,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setCours(cours.map((c) => (c.id === coursEnEdition.id ? coursEnEdition : c)));
            setCoursEnEdition(null);
            setFieldErrors({ titre: false, description: false });
            showTempMessage(response.data, true); // Utilise le message du backend
            getAllEspaceCours();
        } catch (error) {
            console.error('Erreur lors de la modification', error);
            showTempMessage(error.response?.data || 'Erreur lors de la modification', false);
        }
    };

    // Supprimer un cours
    const supprimerCours = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet espace de cours ?')) {
            try {
                const response = await axios.delete(`http://localhost:8087/api/espacecours/deleteesp/${id}`);
                setCours(cours.filter((c) => c.id !== id));
                showTempMessage(response.data, true); // Utilise le message du backend
                getAllEspaceCours();
            } catch (error) {
                console.error('Erreur lors de la suppression', error);
                showTempMessage(error.response?.data || 'Erreur lors de la suppression', false);
            }
        }
    };

    // Fonction pour basculer l'affichage des espaces de cours
    const handleAfficherEspaces = () => {
        if (!afficherEspaces) {
            getAllEspaceCours(); // Charger les données uniquement si on affiche
        }
        setAfficherEspaces(!afficherEspaces); // Basculer l'état
    };

    // Fonction pour basculer l'affichage des chapitres
    const handleAfficherChapitres = () => {
        if (!afficherChapitres) {
            getAllChapitres(); // Charger les données uniquement si on affiche
        }
        setAfficherChapitres(!afficherChapitres); // Basculer l'état
    };

    return (
        <div className="gestion-cours-container">
            <div className="gestion-cours-wrapper">
                <h2 className="gestion-cours-title">Gestion des Cours</h2>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="add-course-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Titre *"
                            value={nouveauEspaceCours.titre}
                            onChange={(e) => {
                                setNouveauEspaceCours({ ...nouveauEspaceCours, titre: e.target.value });
                                setFieldErrors({ ...fieldErrors, titre: false });
                            }}
                            className={`add-course-input ${fieldErrors.titre ? 'error-field' : ''}`}
                        />
                        {fieldErrors.titre && <div className="field-error-message">Veuillez renseigner ce champ</div>}
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Description *"
                            value={nouveauEspaceCours.description}
                            onChange={(e) => {
                                setNouveauEspaceCours({ ...nouveauEspaceCours, description: e.target.value });
                                setFieldErrors({ ...fieldErrors, description: false });
                            }}
                            className={`add-course-input ${fieldErrors.description ? 'error-field' : ''}`}
                        />
                        {fieldErrors.description && (
                            <div className="field-error-message">Veuillez renseigner ce champ</div>
                        )}
                    </div>

                    <button onClick={ajouterEspaceCours} className="add-course-btn">
                        Ajouter l'Espace de Cours
                    </button>
                </div>

                {/* Boutons pour basculer l'affichage des cours et des chapitres */}
                <div className="button-group">
                    <button onClick={handleAfficherEspaces} className="toggle-courses-btn">
                        Afficher les espaces de cours
                    </button>

                    <button onClick={handleAfficherChapitres} className="toggle-courses-btn" style={{ marginLeft: '10px' }}>
                        Afficher tous les chapitres
                    </button>
                </div>

                {/* Liste des cours affichée uniquement si afficherEspaces est true */}
                {afficherEspaces && (
                    <ul className="courses-list">
                        {loading ? (
                            <p>Chargement...</p>
                        ) : cours.length === 0 ? (
                            <p className="no-courses">Aucun cours disponible</p>
                        ) : (
                            cours.map((c) => (
                                <li key={c.id}>
                                    {coursEnEdition?.id === c.id ? (
                                        <div className="edit-form">
                                            <p className="course-id">ID : {c.id}</p>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    value={coursEnEdition.titre}
                                                    onChange={(e) =>
                                                        setCoursEnEdition({ ...coursEnEdition, titre: e.target.value })
                                                    }
                                                    className={`add-course-input ${fieldErrors.titre ? 'error-field' : ''}`}
                                                    placeholder="Titre *"
                                                />
                                                {fieldErrors.titre && (
                                                    <div className="field-error-message">Veuillez renseigner ce champ</div>
                                                )}
                                            </div>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    value={coursEnEdition.description}
                                                    onChange={(e) =>
                                                        setCoursEnEdition({ ...coursEnEdition, description: e.target.value })
                                                    }
                                                    className={`add-course-input ${fieldErrors.description ? 'error-field' : ''}`}
                                                    placeholder="Description *"
                                                />
                                                {fieldErrors.description && (
                                                    <div className="field-error-message">Veuillez renseigner ce champ</div>
                                                )}
                                            </div>
                                            <button onClick={modifierCours} className="save-btn">
                                                Sauvegarder
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCoursEnEdition(null);
                                                    setFieldErrors({ titre: false, description: false });
                                                }}
                                                className="cancel-btn"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="course-id">ID : {c.id}</p>
                                            <h3 className="course-title">{c.titre || 'Sans titre'}</h3>
                                            <p className="course-description">{c.description || 'Aucune description'}</p>
                                            <div className="course-actions">
                                                <button
                                                    onClick={() => setCoursEnEdition(c)}
                                                    className="edit-btn"
                                                >
                                                    Modifier l'Espace De Cour
                                                </button>
                                                <button
                                                    onClick={() => supprimerCours(c.id)}
                                                    className="delete-btn"
                                                >
                                                    Supprimer l'Espace De Cour
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                )}

                {/* Liste des chapitres affichée uniquement si afficherChapitres est true */}
                {afficherChapitres && (
                    <div className="chapitres-section">
                        <h2 className="chapitres-title">Liste des Chapitres</h2>
                        <ul className="chapitres-list">
                            {loading ? (
                                <p>Chargement des chapitres...</p>
                            ) : chapitres.length === 0 ? (
                                <p className="no-chapitres">Aucun chapitre disponible</p>
                            ) : (
                                chapitres.map((chap) => (
                                    <li key={chap.idchap}>
                                        <p className="chapitre-id">ID : {chap.idchap}</p>
                                        <h3 className="chapitre-title">{chap.nomchap || 'Sans titre'}</h3>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}

                <Link to="/">Retour à la page d'accueil</Link>
            </div>
        </div>
    );
}

export default GestionCours;