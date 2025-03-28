import React, { useState, useEffect  } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeModal from "./EmployeeModal";
import TeamModal from "./TeamModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { v4 as uuidv4 } from "uuid";
import "../Library/typography.css";
import { getTeamList, createTeam, deleteTeam } from "../services/teams";
import { getEmployeesList, createEmployees, deleteEmployees, updateEmployees} from "../services/employees";

function Sidebar({ onToggleSidebar, isSidebarVisible }) {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
 
  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams();
    fetchEmployees();
  }, []);

  // Fetch teams from API
  const fetchTeams = async () => {
    try {
      const response = await getTeamList({});
      setTeams(response.data.map(team => ({
        id: `team-${team.id}`,
        name: team.name
      })));
    } catch (error) {
      toast.error("Failed to fetch teams", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

// Fetch employees from API
const fetchEmployees = async () => {
  try {
    const response = await getEmployeesList();
    
    console.log("API Response:", response.data); // Debugging log

    if (!response.data || !response.data.employees) {
      toast.error("No employees found", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const processedEmployees = response.data.employees.map(employee => ({
      ...employee,
      id: employee.id ? `employee-${employee.id}` : `employee-${uuidv4()}`,
      teamId: employee.teamId ? `team-${employee.teamId}` : null
    })).filter(emp => emp.id !== 'employee-undefined');

    setEmployees(processedEmployees);

  } catch (error) {
    console.error("Fetch Employees Error:", error);
    toast.error("Failed to fetch employees", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};


  const addEmployee = async (newEmployee) => {
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

    try {
      // Call API to create employee
      const response = await createEmployees(newEmployee);
      
      // Create employee object with response ID
      const employeeWithId = {
        ...newEmployee,
        id: `employee-${response.id}`,
        teamId: null,
      };
      
      // Update local state
      setEmployees([...employees, employeeWithId]);
      
      toast.success(`Employee "${newEmployee.name}" added successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to add employee", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const deleteEmployee = async (id) => {
    if (!id) {
      toast.error("Invalid employee ID. Unable to delete.");
      return;
    }
  
    try {
      // Remove 'employee-' prefix if present
      const numericId = id.replace('employee-', '');
  
      // Ensure the ID is valid before making the request
      if (!numericId) {
        toast.error("Invalid employee ID format.");
        return;
      }
  
      await deleteEmployees(numericId);
  
      // Remove the employee from local state
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
  
      // Find employee details for the toast message
      const employeeToDelete = employees.find((emp) => emp.id === id);
      
      toast.success(`Employee "${employeeToDelete?.name || 'Unknown'}" deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
  
    } catch (error) {
      console.error("Delete employee error:", error);
  
      if (error.response) {
        toast.error(
          error.response.data?.message || `Failed to delete employee. Status: ${error.response.status}`,
          { position: "top-right", autoClose: 3000 }
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Error processing employee deletion request", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };
  

  const addTeam = async (newTeamName) => {
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

      try {
        // Call API to create team
        const response = await createTeam({ name: newTeamName });
        
        // Create team object with response ID
        const newTeam = {
          id: `team-${response.data.id}`,
          name: newTeamName,
        };
        
        // Update local state
        setTeams([...teams, newTeam]);
        
        toast.success(`Team "${newTeamName}" added successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        setShowTeamModal(false);
      } catch (error) {
        toast.error("Failed to add team", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const deleteTeamHandler = async (id) => {
    // Find the team to delete
    const teamToDelete = teams.find((team) => team.id === id);
    
    // If no team found, exit early
    if (!teamToDelete) {
      toast.error("Team not found", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    // Check if the team has any employees
    const hasEmployees = employees.some((emp) => emp.teamId === id);
  
    if (hasEmployees) {
      // Show error toast if team has employees
      toast.error(
        `Cannot delete team "${teamToDelete.name}" with assigned employees. Please remove all employees first.`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }
  
    try {
      // Ensure we're using the numeric ID for the API call
      const teamNumericId = id.replace('team-', '');
  
      // Call API to delete team
      await deleteTeam(teamNumericId);
  
      // Remove the team from local state
      setTeams(teams.filter((team) => team.id !== id));
  
      // Show success toast
      toast.success(`Team "${teamToDelete.name}" deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      // More detailed error handling
      console.error('Delete team error:', error);
  
      // Check for specific error responses
      if (error.response) {
        // Server responded with an error status
        toast.error(
          error.response.data?.message || 
          `Failed to delete team. Status: ${error.response.status}`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please check your connection.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Something happened in setting up the request
        toast.error("Error processing team deletion request", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };



 

  const moveEmployee = async (employeeId, targetTeamId) => {
    try {
      console.log("Moving Employee:", employeeId, "To Team:", targetTeamId);
  
      if (!employeeId) {
        console.error("Error: employeeId is undefined");
        return;
      }
  
      // Convert IDs correctly
      const numericEmployeeId = employeeId.toString();
      const numericTeamId = targetTeamId === "unassigned" ? null : targetTeamId.toString();
  
      // Find the employee
      const employee = employees.find((emp) => emp.id.toString() === numericEmployeeId);
  
      if (!employee) {
        console.error("Employee not found in list:", numericEmployeeId, "Available employees:", employees);
        return;
      }
  
      // Find previous and new team names
      const previousTeam = employee.teamId
        ? teams.find((team) => team.id.toString() === employee.teamId.toString())?.name || "Unassigned"
        : "Unassigned";
  
      const newTeam = targetTeamId === "unassigned"
        ? "Unassigned"
        : teams.find((team) => team.id.toString() === targetTeamId.toString())?.name || "Unknown Team";
  
      // Call API to update team assignment
      await updateEmployees(numericEmployeeId, numericTeamId);
  
      // Update local state
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id.toString() === numericEmployeeId
            ? { ...emp, teamId: numericTeamId }
            : emp
        )
      );
  
      // Show toast notification
      toast.info(`Moved ${employee.name} from ${previousTeam} to ${newTeam}`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error moving employee:", error);
      toast.error("Failed to move employee", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
  
    if (!destination) return; // If dropped outside a droppable area, return
  
    // Extract employee ID (assuming draggableId includes 'employee-' prefix)
    const numericEmployeeId = draggableId.replace("employee-", "");
  
    // Extract team ID (assuming droppableId includes 'team-' prefix or is 'unassigned')
    const numericTeamId = destination.droppableId === "unassigned"
      ? null
      : destination.droppableId.replace("team-", "");
  
    // Move the employee to the new team
    moveEmployee(numericEmployeeId, numericTeamId);
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
          {isSidebarVisible && (
          <div className="col-md-4">
            {/* Teams management */}
            <div className="card shadow-sm border-dark mb-4">
              <div className="card-header text-black d-flex justify-content-between align-items-center">
                <h5 className="mb-1 font-semibold">Teams</h5>
                <button
                  className="btn btn-sm btn-success font-medium"
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
                  <p className="text-muted text-center text-sm">No teams created</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {teams.map((team) => (
                      <li
                        key={team.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span className="font-medium text-base">{team.name}</span>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>deleteTeamHandler(team.id)}
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
                <h5 className="mb-0 font-semibold">Unassigned Employees</h5>
                <button
                  className="btn btn-sm btn-success font-medium"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-person-plus me-1"></i>Add Employee
                </button>
              </div>
<Droppable droppableId={teams.id} type="EMPLOYEE">

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
                      <p className="text-muted text-center p-3 text-sm">
                        No unassigned employees
                      </p>
                    ) : (
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="text-sm font-medium">Name</th>
                            <th className="text-sm font-medium">Skill</th>
                            <th className="text-sm font-medium">Cost</th>
                            <th className="text-sm font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...unassignedEmployees]
                            .sort((a, b) => a.name.localeCompare(b.name))
                          .map((emp, index) => (
                            <Draggable key={emp.id} draggableId={emp.id.toString()} index={index}>

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
                                  <td className="text-sm">{emp.name}</td>
                                  <td className="text-sm">{emp.skill}</td>
                                  <td className="text-sm">${emp.cost}</td>
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
          )}
          {/* Main Team Container */}
          <div  className={`${isSidebarVisible ? 'col-md-8' : 'col-md-12'}`}>
      <div className="card shadow-sm border-dark">
        <div className="card-header text-black d-flex justify-content-between align-items-center text-black">
          <h5 className="mb-1 font-semibold">Team Planning</h5>
          <i className="bi bi-kanban" style={{ fontSize: '1.8rem' }}></i>
        </div>
        <div className="card-body bg-light">
          <div className="d-flex flex-row overflow-auto gap-4 p-3">
            {teamEmployeesList.map(({ team, employees: teamEmployees, totalCost, averageCost }) => (
              <div
                key={team.id}
                className="card border-0 shadow-lg rounded-4"
                style={{ minWidth: '250px', maxWidth: '250px', backgroundColor: '#ffffff' }}
              >
                <div className="card-header bg-success text-white text-center rounded-top-4">
                  <h5 className="mb-0 font-semibold">{team.name}</h5>
                </div>
                <Droppable droppableId={team.id} type="EMPLOYEE">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="card-body p-0"
                      style={{
                        minHeight: '250px',
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
                                    <td  className="text-sm">{emp.name}</td>
                                    <td  className="text-sm">{emp.skill}</td>
                                    <td  className="text-sm">${emp.cost}</td>
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
                    <small className="text-muted text-xs">Employees: {teamEmployees.length}</small>
                    <small className="text-muted text-xs text-end">
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
