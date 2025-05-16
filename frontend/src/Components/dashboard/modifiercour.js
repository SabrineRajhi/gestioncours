import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { fileService } from '../../Services/services';
import AjouterElementCours from './ajouterElt';
import { useNavigate } from 'react-router-dom';


const ModifierCoursPage = () => {
  const { idespac } = useParams();
  const [elements, setElements] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [elementSelectionne, setElementSelectionne] = useState(null);

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const allElements = await fileService.getAllElementCour();
        console.log('Éléments récupérés :', allElements);

        // Vérifie si idespac est un entier
        const espaceId = parseInt(idespac);
        if (!espaceId) {
          console.warn('ID espace non valide :', idespac);
          return;
        }

        // Filtrage basé sur le champ id_espc si c'est ce que ton API renvoie
        const filteredElements = allElements.filter(
          (ec) => ec.espaceCours?.idespac === espaceId
        );
        

        setElements(filteredElements);
      } catch (error) {
        console.error('Erreur lors de la récupération des éléments :', error);
      }
    };

    fetchElements();
  }, [idespac]);


  const navigate = useNavigate();


  const handleNavigateToEditelement = (ec) => {
    navigate(`/modifierElt/${ec.idEC}`, { state: { ec } });
    console.log(" id :ec ",ec.idEC);
  };
  return (
    <div>
      <h2>Modifier espace Cours ID: {idespac}</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ordre</th>
            <th>Description</th>
            <th>Visible</th>
            <th>Type</th>
            <th>Date limite</th>
            <th>Date ajout</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {elements.map((ec) => (
            <tr key={ec.idec}>
             <td>{ec.idEC}</td>
              <td>{ec.ordreEC ?? 'N/A'}</td>
              <td>{ec.element?.desElt ?? 'N/A'}</td>
              <td>{ec.visibleec ? 'Oui' : 'Non'}</td>
              <td>{ec.element?.typeElement?.nomTE ?? 'N/A'}</td>
              <td>{ec.dateLimite ? new Date(ec.dateLimite).toLocaleDateString() : 'N/A'}</td>
              <td>{ec.dateAjoutEC ? new Date(ec.dateAjoutEC).toLocaleDateString() : 'N/A'}</td>
              <td>

              <button onClick={() => handleNavigateToEditelement(ec)}> Modifier </button>

                <button onClick={() => handleSupprimer(ec.idEC)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setAfficherFormulaire(!afficherFormulaire)}>
  {afficherFormulaire ? "Fermer le formulaire" : "Ajouter un élément"}
</button>
 {afficherFormulaire && (
  <AjouterElementCours
    initialData={elementSelectionne ? {
      idEC: elementSelectionne.idEC,
      visibleEC: elementSelectionne.visibleec,
      ordreEC: elementSelectionne.ordreEC,
      dateLimite: elementSelectionne.dateLimite?.slice(0, 10),
      idespac: elementSelectionne.espaceCours?.idespac,
      idTE: elementSelectionne.element?.typeElement?.idTE,
      description: elementSelectionne.element?.desElt
    } : { idespac: parseInt(idespac) }}
    onSuccess={() => {
      setAfficherFormulaire(false);
      setElementSelectionne(null);
      window.location.reload();
    }}
  />
)}


    </div>
  );
};

// Fonctions d'action (à implémenter selon ta logique)


const handleSupprimer = (idec) => {
  console.log('Supprimer élément', idec);
  // Implémenter la logique de suppression
};

const handlemodifier = () => {
  console.log('Ajouter un nouvel élément');
  // Implémenter la logique d’ajout
};

export default ModifierCoursPage;
