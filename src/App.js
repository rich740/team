import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    <BrowserRouter basename='/teamManagement'> 
    {/* <BrowserRouter>  */}
      <div className="main-content">
        <Header onToggleSidebar={handleToggleSidebar} />
        <Sidebar 
          isSidebarVisible={isSidebarVisible} 
          onToggleSidebar={handleToggleSidebar}
        />
      </div>
    </BrowserRouter> 
  );
}

export default App;
