import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterStudent from './components/RegisterStudent';
import TakeAttendance from './components/TakeAttendance';
import AttendanceReport from './components/AttendanceReport';
import StudentList from './components/StudentList';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  useEffect(() => {
    fetchStudents();
    fetchTodayAttendance();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/attendance?date=${today}`);
      const data = await response.json();
      setAttendance(data.attendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<TakeAttendance attendance={attendance} />} />
            <Route path="/register" element={<RegisterStudent onRegister={fetchStudents} />} />
            <Route path="/report" element={<AttendanceReport />} />
            <Route path="/students" element={<StudentList students={students} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;