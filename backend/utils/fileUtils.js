// utils/fileUtils.js
import fs from 'fs';

// Fonction pour supprimer un fichier
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Erreur lors de la suppression du fichier ${filePath}:`, err);
    } else {
      console.log(`Fichier ${filePath} supprimé.`);
    }
  });
};

// Fonction pour supprimer plusieurs fichiers
const deleteFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    deleteFile(filePath); // Utiliser directement le chemin stocké
  });
};

export default deleteFiles ;
