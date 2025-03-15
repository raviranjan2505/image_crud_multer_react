import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await axios.get('http://localhost:5000/api/images');
        setImages(result.data);
      } catch (error) {
        setError('Error fetching images');
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/image/${id}`);
      alert('Image deleted successfully');
      setImages(images.filter((image) => image._id !== id)); // Remove deleted image from list
    } catch (error) {
      setError('Error deleting image');
      console.error('Error deleting image', error);
    }
  };

  const handleView = async (id) => {
    navigate(`/image/${id}`)
  };

  return (
    <div>
      <h2>Image List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <Link to="/upload" className="btn btn-success">
          Upload Image
        </Link>
      </div>
      <div className="row">
        {images.map((image) => (
          <div className="col-md-3 mb-4" key={image._id}>
            <div className="card">
              {/* Link to view individual image */}
              <Link to={`/image/${image._id}`}>
                <img
                  src={`http://localhost:5000/${image.imageUrl}`}
                  alt={image.originalName}
                  className="card-img-top"
                  style={{maxWidth: '300px', height:"300px"}}
                />
              </Link>
              <div className="card-body d-flex justify-content-between">
                <button className="btn btn-danger" onClick={() => handleDelete(image._id)}>
                  Delete
                </button>
                <button className="btn btn-primary" onClick={() => handleView(image._id)}>
                  view Image
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageList;
