import React, { useState } from "react";
import EmployeeModal from "./EmployeeModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const addTeam = () => {
    const newTeamName = prompt("Enter Team Name:");
    if (newTeamName) {
      setTeams([...teams, { id: teams.length + 1, name: newTeamName }]);
    }
  };

  const addEmployee = (newEmployee) => {
    setEmployees([
      ...employees,
      { ...newEmployee, id: employees.length + 1, teamId: null },
    ]);
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

  // Move an employee to a different team
  const moveEmployee = (employeeId, targetTeamId) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId
          ? { ...emp, teamId: targetTeamId === "unassigned" ? null : parseInt(targetTeamId) }
          : emp
      )
    );
  };

  // Handle the end of a drag operation
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the destination is the same as the source, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Extract the employee ID from the draggableId
    const employeeId = parseInt(draggableId.replace("employee-", ""));
    
    // Move the employee to the new team
    moveEmployee(employeeId, destination.droppableId);
  };

  // Get unassigned employees
  const unassignedEmployees = employees.filter((emp) => emp.teamId === null);

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
                <button className="btn btn-sm btn-primary" onClick={addTeam}>
                  Add Team
                </button>
              </div>
              <div className="card-body">
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

            {/* Unassigned employees */}
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Unassigned Employees</h5>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  Add Employee
                </button>
              </div>
              <Droppable droppableId="unassigned">
                {(provided) => (
                  <div
                    className="card-body"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ minHeight: "150px" }}
                  >
                    {unassignedEmployees.length === 0 ? (
                      <p className="text-muted">No unassigned employees</p>
                    ) : (
                      unassignedEmployees.map((emp, index) => (
                        <Draggable
                          key={`employee-${emp.id}`}
                          draggableId={`employee-${emp.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`card mb-2 ${
                                snapshot.isDragging ? "bg-light" : ""
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div className="card-body p-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <strong>{emp.name}</strong>
                                    <br />
                                    <small>
                                      {emp.skill} - ${emp.cost}
                                    </small>
                                  </div>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteEmployee(emp.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Team cards */}
          <div className="col-md-8">
            <div className="d-flex flex-row overflow-auto">
              {teams.map((team) => {
                const teamEmployees = employees.filter(
                  (emp) => emp.teamId === team.id
                );
                const totalCost = teamEmployees.reduce(
                  (sum, emp) => sum + parseFloat(emp.cost || 0),
                  0
                );
                const averageCost =
                  teamEmployees.length > 0
                    ? totalCost / teamEmployees.length
                    : 0;

                return (
                  <div
                    key={team.id}
                    className="card mr-3"
                    style={{ minWidth: "300px", marginRight: "1rem" }}
                  >
                    <div className="card-header">
                      <h5 className="mb-0 text-center">{team.name}</h5>
                    </div>
                    <Droppable droppableId={team.id.toString()}>
                      {(provided) => (
                        <div
                          className="card-body"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{ minHeight: "200px" }}
                        >
                          {teamEmployees.length === 0 ? (
                            <p className="text-muted text-center">
                              Drag employees here
                            </p>
                          ) : (
                            teamEmployees.map((emp, index) => (
                              <Draggable
                                key={`employee-${emp.id}`}
                                draggableId={`employee-${emp.id}`}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`card mb-2 ${
                                      snapshot.isDragging ? "bg-light" : ""
                                    }`}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <div className="card-body p-2">
                                      <strong>{emp.name}</strong>
                                      <br />
                                      <small>
                                        {emp.skill} - ${emp.cost}
                                      </small>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
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
                );
              })}
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