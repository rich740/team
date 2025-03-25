import React, { useState } from 'react';

const AddTeamModal = ({ onClose, onAdd }) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAdd = () => {
    if (newMemberName.trim()) {
      onAdd(newMemberName);
      setNewMemberName('');
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
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
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleAdd}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeamModal;