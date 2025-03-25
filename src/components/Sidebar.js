import React, { useState } from "react";
import EmployeeModal from "./EmployeeModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from 'uuid';

function Sidebar() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const addTeam = () => {
    const newTeamName = prompt("Enter Team Name:");
    if (newTeamName) {
      // Ensure unique ID for each team
      const newTeam = { 
        id: `team-${uuidv4()}`, 
        name: newTeamName 
      };
      setTeams([...teams, newTeam]);
    }
  };

  const addEmployee = (newEmployee) => {
    // Ensure unique ID for each employee
    const employeeWithId = { 
      ...newEmployee, 
      id: `employee-${uuidv4()}`, 
      teamId: null 
    };
    setEmployees([...employees, employeeWithId]);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const deleteTeam = (id) => {
    const hasEmployees = employees.some((emp) => emp.teamId === id);
    if (!hasEmployees) {
      setTeams(teams.filter((team) => team.id !== id));
    } else {
      alert(
        "Cannot delete team with assigned employees. Please remove all employees first."
      );
    }
  };

  const moveEmployee = (employeeId, targetTeamId) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId
          ? { 
              ...emp, 
              teamId: targetTeamId === "unassigned" 
                ? null 
                : targetTeamId 
            }
          : emp
      )
    );
  };

  const handleDragEnd = (result) => {
    if (!result) return;
    
    const { destination, source, draggableId } = result;
    
    // If there's no destination, do nothing
    if (!destination) {
      return;
    }
    
    // If the destination is the same as the source, do nothing
    if (destination.droppableId === source.droppableId && 
        destination.index === source.index) {
      return;
    }
    
    try {
      // Extract the employee ID from the draggableId
      const employeeId = draggableId;
      
      // Move the employee to the new team
      moveEmployee(employeeId, destination.droppableId);
    } catch (error) {
      console.error("Error during drag and drop:", error);
    }
  };

  // Get unassigned employees
  const unassignedEmployees = employees.filter((emp) => emp.teamId === null);

  // Create array of team-specific employees
  const teamEmployeesList = teams.map(team => {
    const teamEmployees = employees.filter(emp => emp.teamId === team.id);
    return {
      team: team,
      employees: teamEmployees,
      totalCost: teamEmployees.reduce((sum, emp) => sum + parseFloat(emp.cost || 0), 0),
      averageCost: teamEmployees.length > 0
        ? teamEmployees.reduce((sum, emp) => sum + parseFloat(emp.cost || 0), 0) / teamEmployees.length
        : 0
    };
  });

  // Custom drag style
  const getDragStyle = (isDragging, draggableStyle) => {
    if (isDragging) {
      return {
        ...draggableStyle,
        display: 'flex',
        alignItems: 'center',
        background: '#f0f0f0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        border: '1px solid #ddd',
        borderRadius: '3px',
        padding: '5px 10px',
        width: 'auto',
        height: 'auto',
      };
    }
    
    return draggableStyle;
  };

  return (
    <div className="container-fluid p-3">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          {/* Left sidebar */}
          <div className="col-md-4">
            {/* Teams management */}
            <div className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Teams</h5>
                <button className="btn btn-sm btn-success" onClick={addTeam}>
                  Add Team
                </button>
              </div>
              <div className="card-body"  style={{ maxHeight: "250px", minWidth:"250px", overflowY: "auto" }}>
                <ul className="list-group">
                  {teams.map((team) => {
                    const hasEmployees = employees.some(
                      (emp) => emp.teamId === team.id
                    );
                    return (
                      <li
                        key={team.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {team.name}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteTeam(team.id)}
                          disabled={hasEmployees}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Unassigned employees table */}
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Employees</h5>
                <button className="btn btn-sm btn-success" onClick={() => setShowModal(true)}>
                  Add Employee
                </button>
              </div>
              <Droppable droppableId="unassigned" type="EMPLOYEE">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="card-body p-0"
                    style={{ 
                      minWidth:"250px",
                      maxHeight: "250px",
                      overflowY: "auto",
                      backgroundColor: snapshot.isDraggingOver ? "#f8f9fa" : "" 
                    }}
                  >
                    {unassignedEmployees.length === 0 ? (
                      <p className="text-muted p-3">No unassigned employees</p>
                    ) : (
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Skill</th>
                            <th>Cost</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {unassignedEmployees.map((emp, index) => (
                            <Draggable
                              key={emp.id}
                              draggableId={emp.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getDragStyle(snapshot.isDragging, provided.draggableProps.style)}
                                >
                                  <td>{emp.name}</td>
                                  <td>{emp.skill}</td>
                                  <td>${emp.cost}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => deleteEmployee(emp.id)}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Team cards */}
          <div className="col-md-8">
            <div className="d-flex flex-row overflow-auto">
              {teamEmployeesList.map(({ team, employees: teamEmployees, totalCost, averageCost }) => (
                <div
                  key={team.id}
                  className="card mr-3"
                  style={{ minWidth: "350px", marginRight: "1rem" }}
                >
                  <div className="card-header">
                    <h5 className="mb-0 text-center">{team.name}</h5>
                  </div>
                  <Droppable droppableId={team.id} type="EMPLOYEE">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="card-body p-0"
                        style={{ 
                          minHeight: "420px",
                          backgroundColor: snapshot.isDraggingOver ? "#f8f9fa" : "" 
                        }}
                      >
                        {teamEmployees.length === 0 ? (
                          <p className="text-muted text-center p-3">
                            Drag employees here
                          </p>
                        ) : (
                          <table className="table table-hover mb-0">
                            <thead>
                           
                            </thead>
                            <tbody>
                              {teamEmployees.map((emp, index) => (
                                <Draggable
                                  key={emp.id}
                                  draggableId={emp.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getDragStyle(snapshot.isDragging, provided.draggableProps.style)}
                                    >
                                      <td>{emp.name}</td>
                                      <td>{emp.skill}</td>
                                      <td>${emp.cost}</td>
                                      {/* <td>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() => deleteEmployee(emp.id)}
                                        >
                                          Delete
                                        </button>
                                      </td> */}
                                    </tr>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </Droppable>
                  <div className="card-footer">
                    <small>
                      <div>Total Employees: {teamEmployees.length}</div>
                      <div>Total Cost: ${totalCost.toFixed(2)}</div>
                      <div>Average Cost: ${averageCost.toFixed(2)}</div>
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>

      {showModal && (
        <EmployeeModal
          onClose={() => setShowModal(false)}
          onAdd={addEmployee}
        />
      )}
    </div>
  );
}

export default Sidebar;