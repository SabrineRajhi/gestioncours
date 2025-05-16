import React, { useState } from "react";
import { ajouterElementCours } from "../../Services/services";
import axios from "axios";

const AjouterElementCours = ({ initialData = {}, onSuccess }) => {
  const [visibleEC, setVisibleEC] = useState(initialData.visibleEC || false);
  const [ordreEC, setOrdreEC] = useState(initialData.ordreEC || 1);
  const [dateLimite, setDateLimite] = useState(initialData.dateLimite || "");
  const [idespac, setIdespac] = useState(initialData.idespac || "");
  const [idTE, setIdTE] = useState(initialData.idTE || "");
  const [cheminElt, setCheminElt] = useState(null);
  const [description, setDescription] = useState(initialData.description || "");
  const idEC = initialData.idEC;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cheminElt && !idEC) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("visibleEC", visibleEC);
    formData.append("ordreEC", ordreEC);
    formData.append("dateLimite", dateLimite);
    formData.append("idespac", idespac);
    formData.append("idTE", idTE);
    formData.append("des_elt", description);
    if (cheminElt) formData.append("chemin_elt", cheminElt);

    try {
      if (idEC) {
        // MODIFICATION
        const response = await axios.put(`/updateElementCours/${idEC}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Élément modifié : " + response.data);
      } else {
        // AJOUT
        const response = await ajouterElementCours(formData);
        alert("Élément ajouté : " + response);
      }

      onSuccess && onSuccess();
    } catch (error) {
      alert("Erreur : " + error);
    }
  };

  return (
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
          onChange={(e) => setOrdreEC(parseInt(e.target.value))}
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
        ID Espace Cours:
        <input
          type="number"
          value={idespac}
          onChange={(e) => setIdespac(e.target.value)}
          required
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
        Fichier:
        <input
          type="file"
          onChange={(e) => setCheminElt(e.target.files[0])}
          required={!idEC} // obligatoire seulement en création
        />
      </label>

      <button type="submit">{idEC ? "Modifier" : "Ajouter"} Élément Cours</button>
    </form>
  );
};

export default AjouterElementCours;
