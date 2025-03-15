const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadImage, getAllImages, getImageById, updateImage, deleteImage } = require("../controllers/imageController")


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage });
const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.get('/images', getAllImages);
router.get('/image/:id', getImageById);
router.put('/image/:id', upload.single('image'), updateImage);
router.delete('/image/:id', deleteImage); // Add DELETE route here

module.exports = router;
