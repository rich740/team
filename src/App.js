import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';




function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        {/* <TeamManagementApp /> */}
        <Sidebar />
        <div className="content">
          <Routes>
            
            {/* <Route path="/" element={<Dashboard />} /> */}
            {/* <Route path="/teams" element={<Teams />} />
            <Route path="/employees" element={<Employees />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
