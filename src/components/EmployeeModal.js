import React, { useState, useEffect } from "react";

function EmployeeModal({ onClose, onAdd, onEdit, employee, isEditing }) {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [cost, setCost] = useState("");
  
  // Initialize form with employee data if in edit mode
  useEffect(() => {
    if (isEditing && employee) {
      setName(employee.name || "");
      setSkill(employee.skill || "");
      setCost(employee.cost || "");
    }
  }, [isEditing, employee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeData = {
      name,
      skill,
      cost: parseFloat(cost)
    };
    
    if (isEditing && employee) {
      // If editing, include the ID and team ID
      onEdit({
        ...employeeData,
        id: employee.id,
        teamId: employee.teamId
      });
    } else {
      // If adding new employee
      onAdd(employeeData);
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
            <h5 className="modal-title">{isEditing ? "Edit Employee" : "Add Employee"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="skill" className="form-label">Skill</label>
                <input
                  type="text"
                  className="form-control"
                  id="skill"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="cost" className="form-label">Cost ($)</label>
                <input
                  type="number"
                  className="form-control"
                  id="cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  min="0"
                  step="0.01"
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

export default EmployeeModal;