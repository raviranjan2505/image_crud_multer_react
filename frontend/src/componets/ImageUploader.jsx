import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate()
   

  
  const handleChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    
   
    if (selectedImage) {
      setPreview(URL.createObjectURL(selectedImage));
    } else {
      setPreview(null); 
  };
  }
  
  const handleUpload = async () => {
    console.log("handleUpload called");
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
     
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

     
      console.log(response);
      alert(response.data.message);
      navigate("/")

    } catch (err) {
     
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("An unexpected error occurred while uploading the image.");
      }
      console.log('Error uploading image:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Upload Image</h2>
      
     
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Choose an image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    onChange={handleChange}
                  />
                </div>

                {/* Image Preview */}
                {preview && (
                  <div className="mb-3 text-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-fluid"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                )}

                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpload}
                  >
                    Upload Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
