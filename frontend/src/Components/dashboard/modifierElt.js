import { React, useState, useEffect } from "react";
import { fileService } from "../../Services/services";
import { useParams } from 'react-router-dom';
import './modifierElt.css';

const ModifierElement = ({ initialData = {}, onSuccess }) => {
  const { idEC } = useParams();
  const [visibleEC, setVisibleEC] = useState(initialData.visibleEC || false);
  const [ordreEC, setOrdreEC] = useState(initialData.ordreEC || 1);
  const [dateLimite, setDateLimite] = useState(initialData.dateLimite || "");
  const [idTE, setIdTE] = useState(initialData.idTE || "");
  const [cheminElt, setCheminElt] = useState(null);
  const [description, setDescription] = useState(initialData.description || "");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElement = async () => {
      try {
        const allElements = await fileService.getAllElementCour();
        const element = allElements.find(el => el.idEC === parseInt(idEC));

        if (!element) {
          setError("Élément non trouvé.");
          return;
        }

        setVisibleEC(element.visibleEC || false);
        setOrdreEC(element.ordreEC || 1);
        setDateLimite(element.dateLimite?.slice(0, 10) || "");
        setIdTE(element.idTE || "");
        setDescription(element.element?.desElt || "");

        console.log("Élément récupéré :", element);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement de l'élément.");
      }
    };

    if (idEC) {
      fetchElement();
    }
  }, [idEC]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idEC) {
      setError("Aucun ID d'élément de cours fourni pour la modification.");
      return;
    }

    const formData = new FormData();
    formData.append("visibleEC", visibleEC);
    formData.append("ordreEC", ordreEC);
    formData.append("dateLimite", dateLimite);
    formData.append("idTE", idTE);
    formData.append("des_elt", description);
    if (cheminElt) formData.append("chemin_elt", cheminElt);

    try {
      const response = await fileService.updateElementCours(idEC, formData);
      alert("Élément cours mis à jour avec succès : " + response.message);
      if (onSuccess) onSuccess();
    } catch (error) {
      setError("Erreur lors de la mise à jour : " + error.message);
    }
  };

  const handleFileChange = (e) => {
    setCheminElt(e.target.files[0]);
  };


  return (
    <div className="modifier-element-cours">
      <h3>Modifier Élément Cours (ID: {idEC})</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">

        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Ordre:
          <input
            type="number"
            value={ordreEC}
            onChange={(e) => setOrdreEC(parseInt(e.target.value) || 1)}
            required
          />
        </label>

        <label>
          Date Limite:
          <input
            type="date"
            value={dateLimite}
            onChange={(e) => setDateLimite(e.target.value)}
            required
          />
        </label>

        <label>
          Visible:
          <input
            type="checkbox"
            checked={visibleEC}
            onChange={(e) => setVisibleEC(e.target.checked)}
          />
        </label>

        <label>
          Type d'Élément :
          <select value={idTE} onChange={(e) => setIdTE(e.target.value)} required>
            <option value="">-- Choisir un type --</option>
            <option value="1">Image</option>
            <option value="2">PDF</option>
            <option value="5">Document</option>
            <option value="3">Vidéo</option>
          </select>
        </label>

        <label>
          Fichier (optionnel):
          <input type="file" onChange={handleFileChange} />
        </label>

        <button type="submit">Modifier Élément Cours</button>
      </form>
    </div>
  );
};

export default ModifierElement;
