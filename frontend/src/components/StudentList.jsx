import React, { useState } from 'react';
import { Users, Search, Filter, Download, Trash2 } from 'lucide-react';

const StudentList = ({ students, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('student_id');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortColumn === 'registration_date') {
      const dateA = new Date(a[sortColumn]);
      const dateB = new Date(b[sortColumn]);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }
  });

  const exportToCSV = () => {
    const headers = ['Student ID', 'Name', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...sortedStudents.map(student => 
        [student.student_id, student.name, student.registration_date].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_list.csv';
    link.click();
  };

  return (
    <div className="content-container">
      <div className="content-header">
        <div className="header-left">
          <h1>
            <Users size={28} />
            <span>Registered Students</span>
          </h1>
          <p>Manage and view all registered students in your system</p>
        </div>
        <div className="header-right">
          <button className="btn btn-primary" onClick={exportToCSV}>
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-container">
            <Filter size={16} />
            <span>{filteredStudents.length} students</span>
          </div>
        </div>

        <div className="table-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading students...</p>
            </div>
          ) : sortedStudents.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('student_id')}>
                    ID {getSortIcon('student_id')}
                  </th>
                  <th onClick={() => handleSort('name')}>
                    Name {getSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('registration_date')}>
                    Registration Date {getSortIcon('registration_date')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    <td>{student.registration_date}</td>
                    <td className="action-cell">
                      <button className="btn-icon btn-danger">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <Users size={48} />
              <h3>No students found</h3>
              <p>Try adjusting your search or add new students to the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;