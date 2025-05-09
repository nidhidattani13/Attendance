import React, { useState } from 'react';
import Webcam from 'react-webcam';

const TakeAttendance = ({ attendance }) => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const webcamRef = React.useRef(null);

  const recognizeFace = async () => {
    setIsRecognizing(true);
    setMessage('Recognizing face...');
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then(res => res.blob());
      
      const formData = new FormData();
      formData.append('image', blob, 'face.jpg');

      const response = await fetch('/api/recognize', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setMessage(`Recognized: ${data.match.name} (ID: ${data.match.student_id}) with ${Math.round(data.match.confidence * 100)}% confidence`);
          setIsSuccess(true);
        } else {
          setMessage(data.message || 'No match found');
          setIsSuccess(false);
        }
      } else {
        setMessage(data.error || 'Recognition failed');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Error recognizing face');
      setIsSuccess(false);
      console.error('Error:', error);
    } finally {
      setIsRecognizing(false);
    }
  };

  return (
    <div className="attendance-container">
      <h2>Take Attendance</h2>
      
      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
        />
        <button 
          onClick={recognizeFace} 
          disabled={isRecognizing}
          className="recognize-btn"
        >
          {isRecognizing ? 'Processing...' : 'Recognize Face'}
        </button>
      </div>
      
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <div className="attendance-list">
        <h3>Today's Attendance</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record.id}>
                <td>{record.student_id}</td>
                <td>{record.name}</td>
                <td>{record.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TakeAttendance;