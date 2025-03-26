import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Header() {
  return (
    <header className="bg-success text-white d-flex align-items-center justify-content-center py-2">
      <i className="bi bi-people-fill me-2" style={{ fontSize: '2.5rem' }}></i>
      <h1 className="mb-0">Team Management Board</h1>
    </header>
  );
}

export default Header;
