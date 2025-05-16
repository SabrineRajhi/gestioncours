import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, ListGroup, Modal, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import './NiveauForm.css';

const API_URL = 'http://localhost:8087/api'; // Adjust to your backend URL

const NiveauForm = () => {
  const { id } = useParams(); // Get niveau ID from URL for editing
  const navigate = useNavigate();

  const [niveau, setNiveau] = useState({
    nom: '',
    chapitres: [],
  });
  const [espaceCoursList, setEspaceCoursList] = useState([]);
  const [showChapitreModal, setShowChapitreModal] = useState(false);
  const [currentChapitre, setCurrentChapitre] = useState({ nomchap: '', espaceCoursId: '' });
  const [isEditingChapitre, setIsEditingChapitre] = useState(false);
  const [editChapitreIndex, setEditChapitreIndex] = useState(null);

  // Fetch EspaceCours list for dropdown
  useEffect(() => {
    const fetchEspaceCours = async () => {
      try {
        const response = await axios.get(`${API_URL}/espacescours`);
        setEspaceCoursList(response.data);
      } catch (error) {
        console.error('Error fetching EspaceCours:', error);
      }
    };

    fetchEspaceCours();
  }, []);

  // Fetch Niveau data if editing
  useEffect(() => {
    if (id) {
      const fetchNiveau = async () => {
        try {
          const response = await axios.get(`${API_URL}/niveaux/${id}`);
          setNiveau(response.data);
        } catch (error) {
          console.error('Error fetching Niveau:', error);
        }
      };
      fetchNiveau();
    }
  }, [id]);

  const handleNiveauChange = (e) => {
    setNiveau({ ...niveau, nom: e.target.value });
  };

  const handleChapitreChange = (e) => {
    const { name, value } = e.target;
    setCurrentChapitre({ ...currentChapitre, [name]: value });
  };

  const openChapitreModal = (chapitre = { nomchap: '', espaceCoursId: '' }, index = null) => {
    setCurrentChapitre(chapitre);
    setIsEditingChapitre(index !== null);
    setEditChapitreIndex(index);
    setShowChapitreModal(true);
  };

  const handleAddOrEditChapitre = () => {
    const updatedChapitres = [...niveau.chapitres];
    const chapitreToSave = {
      nomchap: currentChapitre.nomchap,
      espaceCours: { idespc: parseInt(currentChapitre.espaceCoursId) },
    };

    if (isEditingChapitre) {
      updatedChapitres[editChapitreIndex] = chapitreToSave;
    } else {
      updatedChapitres.push(chapitreToSave);
    }

    setNiveau({ ...niveau, chapitres: updatedChapitres });
    setShowChapitreModal(false);
    setCurrentChapitre({ nomchap: '', espaceCoursId: '' });
  };

  const handleDeleteChapitre = (index) => {
    const updatedChapitres = niveau.chapitres.filter((_, i) => i !== index);
    setNiveau({ ...niveau, chapitres: updatedChapitres });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update existing Niveau
        await axios.put(`${API_URL}/niveaux/${id}`, niveau);
      } else {
        // Create new Niveau
        await axios.post(`${API_URL}/niveaux`, niveau);
      }
      navigate('/niveaux'); // Redirect to Niveau list page after save
    } catch (error) {
      console.error('Error saving Niveau:', error);
      alert('Erreur lors de la sauvegarde du niveau.');
    }
  };

  return (
    <div className="niveau-form-container">
      <h2>{id ? 'Modifier le Niveau' : 'Ajouter un Niveau'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nom du Niveau</Form.Label>
          <Form.Control
            type="text"
            value={niveau.nom}
            onChange={handleNiveauChange}
            placeholder="Entrez le nom du niveau"
            required
          />
        </Form.Group>

        <Card className="mb-3">
          <Card.Header>
            Chapitres
            <Button
              variant="primary"
              size="sm"
              className="float-end"
              onClick={() => openChapitreModal()}
            >
              Ajouter un Chapitre
            </Button>
          </Card.Header>
          <ListGroup variant="flush">
            {niveau.chapitres.length > 0 ? (
              niveau.chapitres.map((chapitre, index) => (
                <ListGroup.Item key={index}>
                  {chapitre.nomchap} - EspaceCours ID: {chapitre.espaceCours?.idespc}
                  <Dropdown className="float-end">
                    <Dropdown.Toggle variant="secondary" size="sm">
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => openChapitreModal(chapitre, index)}>
                        Modifier
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleDeleteChapitre(index)}
                        className="text-danger"
                      >
                        Supprimer
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>Aucun chapitre ajouté.</ListGroup.Item>
            )}
          </ListGroup>
        </Card>

        <Button variant="primary" type="submit">
          {id ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate('/niveaux')}
        >
          Annuler
        </Button>
      </Form>

      {/* Modal for adding/editing a Chapitre */}
      <Modal show={showChapitreModal} onHide={() => setShowChapitreModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditingChapitre ? 'Modifier le Chapitre' : 'Ajouter un Chapitre'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom du Chapitre</Form.Label>
              <Form.Control
                type="text"
                name="nomchap"
                value={currentChapitre.nomchap}
                onChange={handleChapitreChange}
                placeholder="Entrez le nom du chapitre"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Espace Cours</Form.Label>
              <Form.Select
                name="espaceCoursId"
                value={currentChapitre.espaceCoursId}
                onChange={handleChapitreChange}
                required
              >
                <option value="">Sélectionner un Espace Cours</option>
                {espaceCoursList.map((espace) => (
                  <option key={espace.idespc} value={espace.idespc}>
                    {espace.titre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChapitreModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddOrEditChapitre}>
            {isEditingChapitre ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NiveauForm;