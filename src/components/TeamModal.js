import React, { useState, useEffect } from "react";

function TeamModal({ onClose, onAdd, onEdit, team, isEditing }) {
  const [name, setName] = useState("");
  
  // Initialize form with team data if in edit mode
  useEffect(() => {
    if (isEditing && team) {
      setName(team.name || "");
    }
  }, [isEditing, team]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing && team) {
      // If editing, include the team ID
      onEdit({
        id: team.id,
        name: name.trim()
      });
    } else {
      // If adding new team
      onAdd(name.trim());
    }
  };

  return (
    <div
    className="modal fade show d-flex align-items-center justify-content-center"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
  > 
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? "Edit Team" : "Add Team"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="teamName" className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="teamName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="text-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamModal;