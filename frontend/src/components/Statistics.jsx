import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, Calendar, Users, Clock, BarChart2 } from 'lucide-react';

const Statistics = ({ students, attendance }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    // This would typically fetch data from your API based on dateRange
    // For now, we'll simulate it with mock data
    setLoadingStats(true);
    
    try {
      setTimeout(() => {
        // Mock data for attendance by day
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const mockAttendanceData = days.map(day => ({
          name: day,
          present: Math.floor(Math.random() * (students.length || 20)),
          total: students.length || 20
        }));
        
        // Mock data for attendance by time
        const times = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];
        const mockTimeData = times.map(time => ({
          name: time,
          count: Math.floor(Math.random() * 15) + 1
        }));
        
        // Calculate overall attendance rate
        const totalPresent = mockAttendanceData.reduce((sum, day) => sum + day.present, 0);
        const totalExpected = mockAttendanceData.reduce((sum, day) => sum + day.total, 0);
        const rate = totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;
        
        setAttendanceData(mockAttendanceData);
        setTimeData(mockTimeData);
        setAttendanceRate(rate);
        setLoadingStats(false);
      }, 800); // Simulate API delay
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoadingStats(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  return (
    <div className="content-container">
      <div className="content-header">
        <div className="header-left">
          <h1>
            <BarChart2 size={28} />
            <span>Attendance Statistics</span>
          </h1>
          <p>Analytics and insights about student attendance patterns</p>
        </div>
        <div className="header-right">
          <div className="date-range-selector">
            <button 
              className={`date-btn ${dateRange === 'week' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('week')}
            >
              Week
            </button>
            <button 
              className={`date-btn ${dateRange === 'month' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('month')}
            >
              Month
            </button>
            <button 
              className={`date-btn ${dateRange === 'year' ? 'active' : ''}`}
              onClick={() => handleDateRangeChange('year')}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {loadingStats ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading statistics...</p>
        </div>
      ) : (
        <div className="stats-grid">
          <div className="card stats-card">
            <div className="card-header">
              <h3>
                <Users size={18} />
                <span>Overall Attendance Rate</span>
              </h3>
            </div>
            <div className="card-content rate-content">
              <div className="attendance-rate">
                <span className="rate-value">{attendanceRate}%</span>
                <div className="rate-bar-container">
                  <div 
                    className="rate-bar" 
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="rate-description">
                {attendanceRate >= 80 ? (
                  <span className="good">Excellent attendance rate</span>
                ) : attendanceRate >= 60 ? (
                  <span className="average">Good attendance rate</span>
                ) : (
                  <span className="poor">Poor attendance rate</span>
                )}
              </div>
            </div>
          </div>

          <div className="card stats-card">
            <div className="card-header">
              <h3>
                <Calendar size={18} />
                <span>Attendance by Day</span>
              </h3>
            </div>
            <div className="card-content chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" name="Present" fill="#4361ee" />
                  <Bar dataKey="total" name="Total" fill="#e0e0e0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card stats-card">
            <div className="card-header">
              <h3>
                <Clock size={18} />
                <span>Attendance by Time</span>
              </h3>
            </div>
            <div className="card-content chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Students" fill="#3a86ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card stats-card">
            <div className="card-header">
              <h3>
                <Users size={18} />
                <span>Student Insights</span>
              </h3>
            </div>
            <div className="card-content">
              <div className="stats-list">
                <div className="stats-item">
                  <div className="stats-label">Total Registered Students</div>
                  <div className="stats-value">{students.length || 0}</div>
                </div>
                <div className="stats-item">
                  <div className="stats-label">Most Active Time</div>
                  <div className="stats-value">
                    {timeData.length > 0 ? 
                      timeData.reduce((max, time) => 
                        time.count > max.count ? time : max
                      ).name : 'N/A'}
                  </div>
                </div>
                <div className="stats-item">
                  <div className="stats-label">Most Active Day</div>
                  <div className="stats-value">
                    {attendanceData.length > 0 ? 
                      attendanceData.reduce((max, day) => 
                        day.present > max.present ? day : max
                      ).name : 'N/A'}
                  </div>
                </div>
                <div className="stats-item">
                  <div className="stats-label">Least Active Day</div>
                  <div className="stats-value">
                    {attendanceData.length > 0 ? 
                      attendanceData.reduce((min, day) => 
                        day.present < min.present ? day : min
                      ).name : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;