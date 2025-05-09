import React, { useState } from 'react';
import Webcam from 'react-webcam';

const RegisterStudent = ({ onRegister }) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const webcamRef = React.useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!studentId || !name || !image) {
      setMessage('Please fill all fields and capture an image');
      setIsSuccess(false);
      return;
    }

    try {
      // Convert base64 image to blob
      const blob = await fetch(image).then(res => res.blob());
      
      const formData = new FormData();
      formData.append('student_id', studentId);
      formData.append('name', name);
      formData.append('image', blob, 'student.jpg');

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Student registered successfully!');
        setIsSuccess(true);
        setStudentId('');
        setName('');
        setImage(null);
        onRegister();
      } else {
        setMessage(data.error || 'Registration failed');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Error registering student');
      setIsSuccess(false);
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-form">
      <h2>Register New Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button type="button" onClick={captureImage}>Capture Image</button>
        </div>
        
        {image && (
          <div className="preview-container">
            <h4>Captured Image:</h4>
            <img src={image} alt="Captured" className="preview-image" />
          </div>
        )}
        
        <button type="submit" className="submit-btn">Register Student</button>
        
        {message && (
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterStudent;