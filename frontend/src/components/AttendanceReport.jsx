import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/attendance?date=${dateStr}`);
      const data = await response.json();
      setAttendance(data.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const csvContent = [
      ['ID', 'Name', 'Date', 'Time'],
      ...attendance.map(record => [
        record.student_id,
        record.name,
        record.date,
        record.time
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${dateStr}.csv`;
    link.click();
  };

  return (
    <div className="report-container">
      <h2>Attendance Report</h2>
      
      <div className="date-selector">
        <label>Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
        <button onClick={exportToCSV} className="export-btn">
          Export to CSV
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="report-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map(record => (
                  <tr key={record.id}>
                    <td>{record.student_id}</td>
                    <td>{record.name}</td>
                    <td>{record.date}</td>
                    <td>{record.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No attendance records for selected date</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;