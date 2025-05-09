import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterStudent from './components/RegisterStudent';
import TakeAttendance from './components/TakeAttendance';
import AttendanceReport from './components/AttendanceReport';
import StudentList from './components/StudentList';
import Sidebar from './components/Sidebar';
import Statistics from './components/Statistics'; // You'll need to create this component
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchStudents();
    fetchTodayAttendance();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/attendance?date=${today}`);
      const data = await response.json();
      setAttendance(data.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <TakeAttendance 
                attendance={attendance} 
                refreshAttendance={fetchTodayAttendance} 
              />
            } />
            <Route path="/register" element={
              <RegisterStudent 
                onRegister={fetchStudents} 
              />
            } />
            <Route path="/report" element={
              <AttendanceReport />
            } />
            <Route path="/students" element={
              <StudentList 
                students={students} 
                isLoading={isLoading}
              />
            } />
            <Route path="/stats" element={
              <Statistics 
                students={students} 
                attendance={attendance}
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;