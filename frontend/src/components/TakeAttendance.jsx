import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Clock, User, Calendar, Camera } from 'lucide-react';

const TakeAttendance = ({ attendance }) => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const webcamRef = React.useRef(null);

  useEffect(() => {
    // Update the current time every second
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // Format current date for display
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="attendance-container">
      <div className="header-info">
        <div className="header-date">
          <Calendar size={18} />
          <span>{formatDate()}</span>
        </div>
        <div className="header-time">
          <Clock size={18} />
          <span>{currentTime}</span>
        </div>
      </div>

      <h2>Take Attendance</h2>
      
      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="webcam"
        />
        <button 
          onClick={recognizeFace} 
          disabled={isRecognizing}
          className={`webcam-btn ${isRecognizing ? 'loading' : ''}`}
        >
          <Camera size={18} />
          <span>{isRecognizing ? 'Processing...' : 'Recognize Face'}</span>
        </button>
      </div>
      
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <div className="attendance-list">
        <h3>
          <User size={18} />
          <span>Today's Attendance ({attendance.length} students)</span>
        </h3>

        {attendance.length > 0 ? (
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
        ) : (
          <div className="empty-state">No attendance records for today yet</div>
        )}
      </div>
    </div>
  );
};

export default TakeAttendance;