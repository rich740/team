import React, { useState } from "react";
import EmployeeModal from "./EmployeeModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar() {
  const [teams, setTeams] = useState([
    // { id: 1, name: "Team 1" },
    // { id: 2, name: "Team 2" },
  ]);
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
    // Check if the team has any employees
    const hasEmployees = employees.some((emp) => emp.teamId === id);

    // Only allow deletion if the team has no employees
    if (!hasEmployees) {
      setTeams(teams.filter((team) => team.id !== id));
    } else {
      // Show an alert that team can't be deleted
      alert(
        "Cannot delete team with assigned employees. Please remove all employees first."
      );
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Drop outside any droppable
    if (!destination) {
      return;
    }

    // Drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Extract employee ID from draggableId (removing any prefix if present)
    const employeeId = parseInt(draggableId.replace("employee-", ""), 10);

    // Update employee team assignment
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              teamId:
                destination.droppableId === "unassigned"
                  ? null
                  : parseInt(destination.droppableId, 10),
            }
          : emp
      )
    );
  };

  // Get unassigned employees
  const unassignedEmployees = employees.filter((emp) => emp.teamId === null);

  return (
    <div className="container-fluid p-3">
      <div className="row">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Sidebar Section */}
          <aside className="col-md-4 d-flex flex-column">
            <div className="card p-3 shadow-sm mb-3">
              <h4 className="mb-3">
                Teams
                <button
                  className="btn btn-sm btn-primary float-end"
                  onClick={addTeam}
                >
                  Add Team
                </button>
              </h4>
              <table className="table table-bordered">
                <tbody>
                  {teams.map((team) => {
                    // Check if team has employees to determine if delete button should be enabled
                    const hasEmployees = employees.some(
                      (emp) => emp.teamId === team.id
                    );

                    return (
                      <tr key={team.id}>
                        <td>{team.name}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteTeam(team.id)}
                            disabled={hasEmployees}
                            title={
                              hasEmployees
                                ? "Remove all employees first"
                                : "Delete team"
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
           
            <div className="card p-3 shadow-sm mb-3">
              <h4 className="mb-3">
                Employees
                <button
                  className="btn btn-sm btn-primary float-end"
                  onClick={() => setShowModal(true)}
                >
                  Add Employees
                </button>
              </h4>

              <Droppable droppableId="unassigned">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="border rounded p-2 bg-light"
                    style={{
                      minHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    <h6>Unassigned Employees</h6>
                    {unassignedEmployees.length === 0 ? (
                      <p className="text-muted">No unassigned employees</p>
                    ) : (
                      <table className="table table-sm table-striped bg-white">
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
                              key={`employee-${emp.id}`}
                              draggableId={`employee-${emp.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white"
                                >
                                  <td><strong>{emp.name}</strong></td>
                                  <td>{emp.skill}</td>
                                  <td>${emp.cost}</td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => deleteEmployee(emp.id)}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            {showModal && (
              <EmployeeModal
                onClose={() => setShowModal(false)}
                onAdd={addEmployee}
              />
            )}
          </aside>

          {/* Teams Section */}
          <div className="col-md-8 d-flex overflow-auto">
            <div className="d-flex flex-row">
              {teams.map((team) => (
                <Droppable droppableId={team.id.toString()} key={team.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="card p-3 m-2 shadow-sm"
                      style={{ minWidth: "300px" }}
                    >
                      <h5 className="text-center">{team.name}</h5>
                      <div
                        className="border rounded p-2 bg-white"
                        style={{ minHeight: "200px" }}
                      >
                        {employees.filter((emp) => emp.teamId === team.id).length === 0 ? (
                          <p className="text-muted text-center my-3">No employees assigned</p>
                        ) : (
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Skill</th>
                                <th>Cost</th>
                              </tr>
                            </thead>
                            <tbody>
                              {employees
                                .filter((emp) => emp.teamId === team.id)
                                .map((emp, index) => (
                                  <Draggable
                                    key={`employee-${emp.id}`}
                                    draggableId={`employee-${emp.id}`}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="bg-light"
                                      >
                                        <td><strong>{emp.name}</strong></td>
                                        <td>{emp.skill}</td>
                                        <td>${emp.cost}</td>
                                      </tr>
                                    )}
                                  </Draggable>
                                ))}
                            </tbody>
                          </table>
                        )}
                        {provided.placeholder}
                      </div>
                      <hr />
                      <div className="text-muted">
                        <small>
                          Total Employees:{" "}
                          {
                            employees.filter((emp) => emp.teamId === team.id)
                              .length
                          }
                        </small>
                        <br />
                        <small>
                          Total Cost: $
                          {employees
                            .filter((emp) => emp.teamId === team.id)
                            .reduce(
                              (sum, emp) => sum + parseFloat(emp.cost || 0),
                              0
                            )
                            .toFixed(2)}
                        </small>
                        <br />
                        <small>
                          Average Cost: $
                          {(() => {
                            const teamEmployees = employees.filter(
                              (emp) => emp.teamId === team.id
                            );
                            const totalCost = teamEmployees.reduce(
                              (sum, emp) => sum + parseFloat(emp.cost || 0),
                              0
                            );
                            return teamEmployees.length > 0
                              ? (totalCost / teamEmployees.length).toFixed(2)
                              : "0.00";
                          })()}
                        </small>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Sidebar;