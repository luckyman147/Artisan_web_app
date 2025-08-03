import multer from 'multer';
import path from 'path';

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: photoStorage });

// Avatar-specific uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatar'); // Folder for avatars
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const uploadAvatar = multer({ storage: avatarStorage });

export { upload, uploadAvatar };
