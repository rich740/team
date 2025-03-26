import React, { useState } from 'react';

const AddTeamModal = ({ onClose, onAdd }) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAdd = () => {
    if (newMemberName.trim()) {
      onAdd(newMemberName);
      onClose(); // Close the modal after adding the team
      setNewMemberName('');
    }
  };

  return (
    <div
    className="modal fade show d-flex align-items-center justify-content-center"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
  >
      <div className="modal-dialog modal-dialog-centered modal-lg" >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Team Member</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              placeholder="Enter team member name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-sm btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-sm btn-success" onClick={handleAdd}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeamModal;