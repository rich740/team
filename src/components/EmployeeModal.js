import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function EmployeeModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [cost, setCost] = useState('');

  const handleAdd = () => {
    if (!name || !skill || !cost) {
      alert('All fields are required!');
      return;
    }
    if (isNaN(cost) || Number(cost) <= 0) {
      alert('Please enter a valid numeric cost.');
      return;
    }
    onAdd({ name, skill, cost: parseFloat(cost) });
    onClose();
  };

  return (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Increased size using modal-lg */}
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Employee</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Name:</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Skill:</label>
                  <input type="text" className="form-control" value={skill} onChange={(e) => setSkill(e.target.value)} />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Cost:</label>
                  <input type="text" className="form-control" value={cost} onChange={(e) => setCost(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleAdd}>Add Employee</button>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeModal;
