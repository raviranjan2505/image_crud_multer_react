const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');
const allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
exports.uploadImage = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!allowedFormats.includes(req.file.mimetype)) {
      
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.' });
    }

    const imageUrl = req.file.path; 
    const originalName = req.file.originalname;

   
    const image = new Image({ imageUrl, originalName });
    await image.save();

    res.status(200).json({ message: 'Image uploaded successfully', image });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
};


exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error });
  }
};


exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error });
  }
};


exports.updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

   
    if (req.file) {
      
      if (!allowedFormats.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path); 
        return res.status(400).json({ message: 'Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.' });
      }
      image.imageUrl = req.file.path;
      image.originalName = req.file.originalname;
    }

    await image.save();
    res.status(200).json({ message: 'Image updated successfully', image });
  } catch (error) {
    res.status(500).json({ message: 'Error updating image', error });
  }
};

// Delete an image
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // Delete the image file from the server
    const imagePath = path.join(__dirname, '..', image.imageUrl);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
        return res.status(500).json({ message: 'Error deleting image file' });
      }
    });

    // Delete the image metadata from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image', error });
  }
};
