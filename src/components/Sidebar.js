import React, { useState } from "react";
import EmployeeModal from "./EmployeeModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar() {
  const [teams, setTeams] = useState([
    { id: 1, name: "Team 1" },
    { id: 2, name: "Team 2" },
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
    setTeams(teams.filter((team) => team.id !== id));
    setEmployees(
      employees.map((emp) =>
        emp.teamId === id ? { ...emp, teamId: null } : emp
      )
    );
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
          <aside className="col-md-4">
            <div className="card p-3 shadow-sm">
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
                  {teams.map((team) => (
                    <tr key={team.id}>
                      <td>{team.name}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteTeam(team.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 className="mb-3">
                Employees
                <button
                  className="btn btn-sm btn-primary float-end"
                  onClick={() => setShowModal(true)}
                >
                  Add Employees
                </button>
              </h4>

              <div className="border rounded p-2 bg-light" style={{ minHeight: "50px" }}>
                <Droppable droppableId="unassigned">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="unassigned-employees"
                    >
                      <h6>Unassigned Employees</h6>
                      {unassignedEmployees.length === 0 ? (
                        <p className="text-muted">No unassigned employees</p>
                      ) : (
                        <div>
                          {unassignedEmployees.map((emp, index) => (
                            <Draggable
                              key={`employee-${emp.id}`}
                              draggableId={`employee-${emp.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-2 my-1 bg-white rounded shadow-sm"
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <strong>{emp.name}</strong> - {emp.skill} - ${emp.cost}
                                    </div>
                                    <button
                                      className="btn btn-danger btn-sm ms-2"
                                      onClick={() => deleteEmployee(emp.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
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
            {teams.map((team) => (
              <Droppable droppableId={team.id.toString()} key={team.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="card p-3 m-2 shadow-sm"
                    style={{ minWidth: "250px" }}
                  >
                    <h5 className="text-center">{team.name}</h5>
                    <div
                      className="border rounded p-2 bg-white"
                      style={{ minHeight: "200px" }}
                    >
                      {employees
                        .filter((emp) => emp.teamId === team.id)
                        .map((emp, index) => (
                          <Draggable
                            key={`employee-${emp.id}`}
                            draggableId={`employee-${emp.id}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 my-1 bg-light rounded shadow-sm text-center"
                              >
                                <strong>{emp.name}</strong> - {emp.skill} - $
                                {emp.cost}
                              </div>
                            )}
                          </Draggable>
                        ))}
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
        </DragDropContext>
      </div>
    </div>
  );
}

export default Sidebar;