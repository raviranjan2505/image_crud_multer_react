import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUploader from './componets/ImageUploader';
import ImageView from './componets/ImageView';
import ImageList from './componets/ImageList';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [error, setError] = useState(null);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <Router>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Image Upload App</h1>

        {/* Display any global error messages */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Routes */}
        <Routes>
          <Route path="/" exact element={<ImageList />} />
          <Route path="/upload" element={<ImageUploader onError={handleError} />} />
          <Route path="/image/:id" element={<ImageView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
