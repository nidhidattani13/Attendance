import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, UserPlus, Image, RefreshCcw } from 'lucide-react';

const RegisterStudent = ({ onRegister }) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webcamRef = React.useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const resetImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!studentId || !name || !image) {
      setMessage('Please fill all fields and capture an image');
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-form">
      <h2>
        <UserPlus size={24} />
        <span>Register New Student</span>
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentId">Student ID:</label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student's full name"
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>
            <Camera size={18} />
            <span>Capture Student Photo</span>
          </h3>
          
          <div className="media-container">
            <div className="webcam-container">
              {!image ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="webcam"
                  />
                  <button 
                    type="button" 
                    onClick={captureImage}
                    className="webcam-btn"
                  >
                    <Camera size={18} />
                    <span>Capture Photo</span>
                  </button>
                </>
              ) : (
                <div className="preview-container">
                  <h4>
                    <Image size={18} />
                    <span>Captured Photo</span>
                  </h4>
                  <img src={image} alt="Captured" className="preview-image" />
                  <button 
                    type="button" 
                    onClick={resetImage} 
                    className="reset-btn"
                  >
                    <RefreshCcw size={18} />
                    <span>Retake Photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || !studentId || !name || !image}
          >
            <UserPlus size={18} />
            <span>{isSubmitting ? 'Registering...' : 'Register Student'}</span>
          </button>
        </div>
        
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