import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ImageView = () => {
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/api/image/${id}`);
        setImage(result.data); 
      } catch (error) {
        setError('Error fetching image');
        console.error('Error fetching image:', error);
      } finally {
        setLoading(false); 
      }
    };
    fetchImage();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/image/${id}`);
      alert('Image deleted successfully');
      navigate('/'); 
    } catch (error) {
      setError('Error deleting image');
      console.error('Error deleting image:', error);
    }
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newImage) {
      alert('Please select a new image to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('image', newImage);

    try {
      await axios.put(`http://localhost:5000/api/image/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Image updated successfully');
      setIsEditing(false); 
      navigate(`/image/${id}`); 
    } catch (error) {
      setError(error.response.data.message);
      console.error('Error updating image:', error);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>{image.originalName}</h2>
          <img
            src={`http://localhost:5000/${image.imageUrl}`}
            alt={image.originalName}
            className="img-fluid mb-3"
            style={{ maxWidth: '300px', height:"300px" }}
          />
          <div className="mb-3">
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Image
            </button>
            
            <button
              className="btn btn-primary ms-3"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Image'}
            </button>
          </div>

        
          {isEditing && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input type="file" className="form-control" onChange={handleImageChange} />
              </div>
              {newImage && (
                <div className="mb-3">
                  <img
                    src={URL.createObjectURL(newImage)} 
                    alt="Preview"
                    style={{ maxWidth: '200px', marginTop: '10px', height:"100px" }}
                  />
                </div>
              )}
              <button type="submit" className="btn btn-primary">
                Change Image
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default ImageView;
