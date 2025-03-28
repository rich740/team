import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

import './interceptor';


function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <Router>
    
      <div className="main-content">
        {/* <TeamManagementApp /> */}
       <div>
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar 
        isSidebarVisible={isSidebarVisible} 
        onToggleSidebar={handleToggleSidebar}
      />
    </div>
        <div className="content">
          <Routes>
          
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
