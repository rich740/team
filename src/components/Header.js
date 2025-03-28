import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Header({ onToggleSidebar }) {
  return (
    <header className="bg-success text-white d-flex align-items-center justify-content-start py-2 px-3">
       <button 
          className="btn btn-success me-2" 
          onClick={onToggleSidebar}
          style={{ fontSize: '2rem' }}
        >
          <i className="bi bi-list"></i>
        </button>
        <div className="d-flex align-items-center flex-grow-1 justify-content-center">
    <i className="bi bi-people-fill me-2" style={{ fontSize: '2.5rem' }}></i>
    <h3 className="mb-0">Team Management Board</h3>
  </div>
    </header>
  );
}

export default Header;
