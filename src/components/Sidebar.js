import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeModal from "./EmployeeModal";
import TeamModal from "./TeamModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import { v4 as uuidv4 } from "uuid";

function Sidebar() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const addTeam = (newTeamName) => {
    if (newTeamName) {
      // Check if team name already exists
      if (
        teams.some(
          (team) => team.name.toLowerCase() === newTeamName.toLowerCase()
        )
      ) {
        toast.error(`Team "${newTeamName}" already exists!`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Ensure unique ID for each team
      const newTeam = {
        id: `team-${uuidv4()}`,
        name: newTeamName,
      };
      setTeams([...teams, newTeam]);
      toast.success(`Team "${newTeamName}" added successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
      setShowTeamModal(false);
    }
  };

  const addEmployee = (newEmployee) => {
    // Check if employee name already exists
    if (
      employees.some(
        (emp) => emp.name.toLowerCase() === newEmployee.name.toLowerCase()
      )
    ) {
      toast.error(`Employee "${newEmployee.name}" already exists!`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Ensure unique ID for each employee
    const employeeWithId = {
      ...newEmployee,
      id: `employee-${uuidv4()}`,
      teamId: null,
    };
    setEmployees([...employees, employeeWithId]);
    toast.success(`Employee "${newEmployee.name}" added successfully!`, {
      position: "top-right",
      autoClose: 3000,
    });
    setShowModal(false);
  };

  const deleteEmployee = (id) => {
    // Find the employee before deletion to get their name
    const employeeToDelete = employees.find((emp) => emp.id === id);

    // Check if employee is in a team before deletion
    if (employeeToDelete.teamId) {
      const teamOfEmployee = teams.find(
        (team) => team.id === employeeToDelete.teamId
      );
      toast.error(
        `Cannot delete employee "${employeeToDelete.name}" from ${teamOfEmployee.name}. Remove from team first.`,
        {
          position: "top-right",
          autoClose: 4000,
          type: "error",
        }
      );
      return;
    }

    // Remove the employee
    setEmployees(employees.filter((emp) => emp.id !== id));

    // Show success toast
    toast.success(`Employee "${employeeToDelete.name}" deleted successfully!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const deleteTeam = (id) => {
    const teamToDelete = teams.find((team) => team.id === id);

    // Check if the team has any employees
    const hasEmployees = employees.some((emp) => emp.teamId === id);

    if (hasEmployees) {
      // Show error toast if team has employees
      toast.error(
        `Cannot delete team "${teamToDelete.name}" with assigned employees. Please remove all employees first.`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return; // Exit the function without deleting
    }

    // Remove the team if no employees are assigned
    setTeams(teams.filter((team) => team.id !== id));

    // Show success toast
    toast.success(`Team "${teamToDelete.name}" deleted successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const moveEmployee = (employeeId, targetTeamId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    const previousTeam = employee.teamId
      ? teams.find((team) => team.id === employee.teamId)?.name || "Unassigned"
      : "Unassigned";

    const newTeam =
      targetTeamId === "unassigned"
        ? "Unassigned"
        : teams.find((team) => team.id === targetTeamId)?.name;

    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              teamId: targetTeamId === "unassigned" ? null : targetTeamId,
            }
          : emp
      )
    );

    // Add toast for team movement
    toast.info(`Moved ${employee.name} from ${previousTeam} to ${newTeam}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleDragEnd = (result) => {
    if (!result) return;

    const { destination, source, draggableId } = result;

    // If there's no destination, do nothing
    if (!destination) {
      return;
    }

    // If the destination is the same as the source, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      // Extract the employee ID from the draggableId
      const employeeId = draggableId;

      // Move the employee to the new team
      moveEmployee(employeeId, destination.droppableId);
        // Sort both teams alphabetically
        setAssignedEmployees((prev) =>
          [...prev].sort((a, b) => a.name.localeCompare(b.name))
        );
    setEmployees((prev) =>
      prev.sort((a, b) => a.name.localeCompare(b.name))
    );
    } catch (error) {
      console.error("Error during drag and drop:", error);
      toast.error("Error moving employee", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Get unassigned employees
  const unassignedEmployees = employees?.filter((emp) => !emp.teamId) || [];

  // Create array of team-specific employees
  const teamEmployeesList = teams.map((team) => {
    const teamEmployees = employees.filter((emp) => emp.teamId === team.id);
    return {
      team: team,
      employees: teamEmployees,
      totalCost: teamEmployees.reduce(
        (sum, emp) => sum + parseFloat(emp.cost || 0),
        0
      ),
      averageCost:
        teamEmployees.length > 0
          ? teamEmployees.reduce(
              (sum, emp) => sum + parseFloat(emp.cost || 0),
              0
            ) / teamEmployees.length
          : 0,
    };
  });

  // Custom drag style
  const getDragStyle = (isDragging, draggableStyle) => {
    if (isDragging) {
      return {
        ...draggableStyle,
        display: "flex",
        alignItems: "center",
        background: "#f0f0f0",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        border: "1px solid #ddd",
        borderRadius: "3px",
        padding: "5px 10px",
        width: "auto",
        height: "auto",
      };
    }

    return draggableStyle;
  };

  return (
    <div
      className="container-fluid p-4 bg-light"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row g-4">
          {/* Left sidebar */}
          <div className="col-md-4">
            {/* Teams management */}
            <div className="card shadow-sm border-dark mb-4">
              <div className="card-header text-black d-flex justify-content-between align-items-center">
                <h5 className="mb-1">Teams</h5>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => setShowTeamModal(true)}
                >
                  <i className="bi bi-plus-lg me-1"></i>Add Team
                </button>
              </div>
              <div
                className="card-body"
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {teams.length === 0 ? (
                  <p className="text-muted text-center">No teams created</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {teams.map((team) => (
                      <li
                        key={team.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span className="fw-medium">{team.name}</span>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteTeam(team.id)}
                        >
                          <i
                            className="bi bi-trash"
                            style={{ fontSize: "1rem" }}
                          ></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Unassigned employees */}
            <div className="card shadow-sm border-dark">
              <div className="card-header text-black d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Unassigned Employees</h5>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-person-plus me-1"></i>Add Employee
                </button>
              </div>

              <Droppable droppableId="unassigned" type="EMPLOYEE">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="card-body p-0"
                    style={{
                      minWidth: "200px",
                      maxHeight: "250px",
                      overflowY: "auto",
                      backgroundColor: snapshot.isDraggingOver
                        ? "#e9ecef"
                        : "#f8f9fa",
                    }}
                  >
                    {unassignedEmployees.length === 0 ? (
                      <p className="text-muted text-center p-3">
                        No unassigned employees
                      </p>
                    ) : (
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Skill</th>
                            <th>Cost</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...unassignedEmployees]
                            .sort((a, b) => a.name.localeCompare(b.name))
                          .map((emp, index) => (
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
                                  style={{
                                    ...provided.draggableProps.style,
                                    background: snapshot.isDragging
                                      ? "#e9ecef"
                                      : "white",
                                  }}
                                >
                                  <td>{emp.name}</td>
                                  <td>{emp.skill}</td>
                                  <td>${emp.cost}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => deleteEmployee(emp.id)}
                                    >
                                      <i className="bi bi-trash"></i>
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
          </div>

          {/* Main Team Container */}
          <div className="col-md-8">
      <div className="card shadow-sm border-dark">
        <div className="card-header text-black d-flex justify-content-between align-items-center text-black">
          <h5 className="mb-1">Team Planning</h5>
          <i className="bi bi-kanban" style={{ fontSize: '1.8rem' }}></i>
        </div>
        <div className="card-body bg-light">
          <div className="d-flex flex-row overflow-auto gap-4 p-3">
            {teamEmployeesList.map(({ team, employees: teamEmployees, totalCost, averageCost }) => (
              <div
                key={team.id}
                className="card border-0 shadow-lg rounded-4"
                style={{ minWidth: '250px', maxWidth: '280px', backgroundColor: '#ffffff' }}
              >
                <div className="card-header bg-success text-white text-center rounded-top-4">
                  <h5 className="mb-0">{team.name}</h5>
                </div>
                <Droppable droppableId={team.id} type="EMPLOYEE">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="card-body p-0"
                      style={{
                        minHeight: '280px',
                        backgroundColor: snapshot.isDraggingOver ? '#d1e7dd' : '#ffffff',
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      {teamEmployees.length === 0 ? (
                        <p className="text-muted text-center p-3">Drag employees here</p>
                      ) : (
                        <table className="table table-hover mb-0">
                          <tbody>
                            {teamEmployees.map((emp, index) => (
                              <Draggable key={emp.id} draggableId={emp.id} index={index}>
                                {(provided, snapshot) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...getDragStyle(snapshot.isDragging, provided.draggableProps.style),
                                      backgroundColor: snapshot.isDragging ? '#e9ecef' : 'white',
                                    }}
                                  >
                                    <td>{emp.name}</td>
                                    <td>{emp.skill}</td>
                                    <td>${emp.cost}</td>
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
                <div className="card-footer bg-light rounded-bottom-4">
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Employees: {teamEmployees.length}</small>
                    <small className="text-muted text-end">
                      Total Cost: ${totalCost.toFixed(2)}<br />
                      Average Cost: ${averageCost.toFixed(2)}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

      {showTeamModal && (
        <TeamModal onClose={() => setShowTeamModal(false)} onAdd={addTeam} />
      )}
    </div>
  );
}

export default Sidebar;
