import axios from 'axios';

const BASE_API_URL = 'http://localhost:8087/api';
const BASE_API_URL1 = 'http://localhost:8087';
const BASE_API_URL2 = 'http://localhost:8087/api/element';
const ESPACE_COURS_API = `${BASE_API_URL}/espaceCours`;

const BASE_API_URL3 ='http://localhost:8087/api/element-cours';

// Auth
const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur de connexion');
  }
};

// Cours
const fetchEspacesCoursWithElements = async () => {
  try {
    const response = await axios.get(`${ESPACE_COURS_API}/tablcour`);
    return response.data;
  } catch (error) {
    console.error('Erreur récupération espaces de cours :', error);
    throw error;
  }
};

// Upload
const uploadElement = async (file, desElt, typeElementId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('desElt', desElt);
  formData.append('typeElementId', typeElementId);

  try {
    const response = await axios.post(`${BASE_API_URL}/element/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors du téléchargement.');
  }
};

// Service principal pour les fichiers et éléments de cours
export const fileService = {
  // Déterminer le type de fichier
  determineFileType: (filename) => {
    const lowerCaseFilename = filename.toLowerCase();
    if (lowerCaseFilename.endsWith('.jpg') || lowerCaseFilename.endsWith('.jpeg') ||
        lowerCaseFilename.endsWith('.png') || lowerCaseFilename.endsWith('.gif')) {
      return 'Image';
    } else if (lowerCaseFilename.endsWith('.pdf')) {
      return 'PDF';
    } else if (lowerCaseFilename.endsWith('.mp4') || lowerCaseFilename.endsWith('.webm')) {
      return 'Video';
    } else if (lowerCaseFilename.endsWith('.docx')) {
      return 'Document Word';
    }
    return 'UNKNOWN';
  },
// Obtenir le type 
  getContentType: (fileType, filename) => {
    switch (fileType) {
      case 'Image':
        if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
          return 'image/jpeg';
        } else if (filename.toLowerCase().endsWith('.png')) {
          return 'image/png';
        } else if (filename.toLowerCase().endsWith('.gif')) {
          return 'image/gif';
        }
        break;
      case 'PDF':
        return 'application/pdf';
      case 'Video':
        if (filename.toLowerCase().endsWith('.mp4')) {
          return 'video/mp4';
        } else if (filename.toLowerCase().endsWith('.webm')) {
          return 'video/webm';
        }
        break;
      case 'Document Word':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    return 'application/octet-stream';
  },
// Vérifier si le fichier doit être affiché en ligne
  shouldDisplayInline: (fileType) => {
    return fileType === 'Image' || fileType === 'PDF' || fileType === 'Document Word';
  },
// Récupérer un fichier
  getFile: async (filename) => {
    try {
      console.log('Fetching file:', `${BASE_API_URL1}/uploads/elements/${filename}`);
      const response = await axios.get(`${BASE_API_URL1}/uploads/elements/${filename}`, {
        responseType: 'blob',
        headers: { 'Origin': 'http://localhost:3000' }
      });

      console.log('File fetched successfully:', filename);
      const fileType = fileService.determineFileType(filename);
      const contentType = fileService.getContentType(fileType, filename);

      return {
        success: true,
        data: response.data,
        contentType: contentType,
        filename
      };
    } catch (error) {
      console.error('Erreur fichier :', {
        message: error.message,
        status: error.response?.status,
        headers: error.response?.headers,
        filename
      });
      return { success: false, error: error.message };
    }
  },
// Gérer le téléchargement ou la prévisualisation d'un fichier
  handleFile: async (filename) => {
    const result = await fileService.getFile(filename);
    if (!result.success) return result;

    const fileType = fileService.determineFileType(filename);
    const shouldInline = fileService.shouldDisplayInline(fileType);

    const blob = new Blob([result.data], { type: result.contentType });
    const url = window.URL.createObjectURL(blob);

    if (shouldInline) {
      return { success: true, action: 'preview', url, type: result.contentType };
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true, action: 'download' };
    }
  },

  // Télécharger un fichier
  downloadFile: async (filePath) => {
    try {
      // Extract filename from path
      const filename = filePath.split('/').pop();
      
      // Create download link
      const link = document.createElement('a');
      link.href = `${BASE_API_URL2}/download?filename=${encodeURIComponent(filePath)}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Download failed:', error);
      return { 
        success: false, 
        error: error.message || 'Download failed' 
      };
    }
  },
// Récupérer tous les éléments de cours
  getAllElementCour: async () => {
    try {
      const response = await axios.get(`${BASE_API_URL3}/getAllElementCours`);
      return response.data; // Cela renverra un tableau d’éléments comme celui que vous avez montré
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments de cours :', error);
      throw error;
    }
  },

 // Ajouter un élément de cours
  addElementCour: async (elementCour) => {
    try {
      const response = await axios.post(`${BASE_API_URL3}/add`, elementCour);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élément de cours :', error);
      throw error;
    }
  },

  deleteElementCour: async (idEC) => {
    try {
      const response = await axios.delete(`${BASE_API_URL3}/delete/${idEC}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément de cours :', error);
      throw error;
    }
  }
};


export const ajouterElementCours = async (data) => {
  try {
    const response = await axios.post(`${BASE_API_URL3}/addElementCours`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // ou response selon ton besoin
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



 

// Mettre à jour un élément de cours
  export const updateElementCours = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_API_URL3}/updateElementCours/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
  }
};






export { login, uploadElement, fetchEspacesCoursWithElements };