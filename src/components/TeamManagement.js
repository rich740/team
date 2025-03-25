import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Modal, Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const TeamManagementApp = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newTeam, setNewTeam] = useState('');
  const [draggedEmployee, setDraggedEmployee] = useState(null);
  
  // New state for employee modal
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    skill: '',
    cost: ''
  });

  const addTeam = () => {
    if (newTeam.trim()) {
      const newTeamObj = {
        id: generateUniqueId(),
        name: newTeam,
        employeeIds: []
      };
      setTeams([...teams, newTeamObj]);
      setNewTeam('');
    }
  };

  const deleteTeam = (teamToDelete) => {
    // Remove the team
    const updatedTeams = teams.filter(team => team.id !== teamToDelete.id);
    
    // Move back employees from deleted team to main pool
    const deletedTeamEmployeeIds = teamToDelete.employeeIds;
    const updatedEmployees = employees.map(emp => {
      if (deletedTeamEmployeeIds.includes(emp.id)) {
        return { ...emp, teamId: null };
      }
      return emp;
    });

    setTeams(updatedTeams);
    setEmployees(updatedEmployees);
  };

  const addEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.skill || !newEmployeeData.cost) {
      alert('Please fill in all employee details');
      return;
    }

    const newEmployeeObj = {
      id: generateUniqueId(),
      name: newEmployeeData.name,
      skill: newEmployeeData.skill,
      cost: newEmployeeData.cost,
      teamId: null
    };

    setEmployees([...employees, newEmployeeObj]);
    
    // Reset modal and data
    setNewEmployeeData({
      name: '',
      skill: '',
      cost: ''
    });
    setIsEmployeeModalOpen(false);
  };

  const deleteEmployee = (employeeToDelete) => {
    setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
  };

  const handleDragStart = (employee) => {
    setDraggedEmployee(employee);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToTeam = (team) => {
    if (!draggedEmployee) return;

    const updatedEmployees = employees.map(emp => 
      emp.id === draggedEmployee.id ? { ...emp, teamId: team.id } : emp
    );

    const updatedTeams = teams.map(t => {
      if (t.id === team.id) {
        return {
          ...t,
          employeeIds: [...t.employeeIds, draggedEmployee.id]
        };
      }
      // Remove employee from other teams
      return {
        ...t,
        employeeIds: t.employeeIds.filter(id => id !== draggedEmployee.id)
      };
    });

    setEmployees(updatedEmployees);
    setTeams(updatedTeams);
    setDraggedEmployee(null);
  };

  const handleDropToUnassigned = () => {
    if (!draggedEmployee) return;

    const updatedEmployees = employees.map(emp => 
      emp.id === draggedEmployee.id ? { ...emp, teamId: null } : emp
    );

    const updatedTeams = teams.map(team => ({
      ...team,
      employeeIds: team.employeeIds.filter(id => id !== draggedEmployee.id)
    }));

    setEmployees(updatedEmployees);
    setTeams(updatedTeams);
    setDraggedEmployee(null);
  };

  const calculateTotals = (employeeList) => {
    const totalCost = employeeList.reduce((sum, emp) => sum + parseFloat(emp.cost), 0);
    const averageCost = employeeList.length > 0 ? totalCost / employeeList.length : 0;

    return { 
      totalEmployees: employeeList.length, 
      totalCost, 
      averageCost 
    };
  };

  return (
    <Container fluid className="p-4">
      {/* Add Team Section */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex">
            <Form.Control 
              value={newTeam} 
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="Enter team name" 
              className="me-2"
            />
            <Button 
              onClick={addTeam} 
              variant="primary"
            >
              Add Team
            </Button>
          </div>
        </Col>
      </Row>

      {/* Employee Modal */}
      <Modal 
        show={isEmployeeModalOpen} 
        onHide={() => setIsEmployeeModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newEmployeeData.name}
                onChange={(e) => setNewEmployeeData({...newEmployeeData, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Skill</Form.Label>
              <Form.Control
                value={newEmployeeData.skill}
                onChange={(e) => setNewEmployeeData({...newEmployeeData, skill: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                value={newEmployeeData.cost}
                onChange={(e) => setNewEmployeeData({...newEmployeeData, cost: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setIsEmployeeModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={addEmployee}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Employee Button */}
      <Row className="mb-3">
        <Col>
          <Button 
            variant="success" 
            onClick={() => setIsEmployeeModalOpen(true)}
          >
            <Plus className="me-2" /> Add Employee
          </Button>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row>
        {/* Unassigned Employees */}
        <Col 
          onDragOver={handleDragOver}
          onDrop={handleDropToUnassigned}
        >
          <div className="border rounded p-3">
            <h2 className="mb-3">Unassigned Employees</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Skill</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.filter(emp => !emp.teamId).map((emp) => (
                  <tr 
                    key={emp.id} 
                    draggable
                    onDragStart={() => handleDragStart(emp)}
                  >
                    <td>{emp.name}</td>
                    <td>{emp.skill}</td>
                    <td>${emp.cost}</td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => deleteEmployee(emp)}
                      >
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="bg-light p-2 rounded">
              {(() => {
                const unassignedEmployees = employees.filter(emp => !emp.teamId);
                const totals = calculateTotals(unassignedEmployees);
                return (
                  <>
                    <div>Total Employees: {totals.totalEmployees}</div>
                    <div>Total Cost: ${totals.totalCost.toFixed(2)}</div>
                    <div>Average Cost: ${totals.averageCost.toFixed(2)}</div>
                  </>
                );
              })()}
            </div>
          </div>
        </Col>

        {/* Teams Section */}
        {teams.map((team) => (
          <Col 
            key={team.id} 
            onDragOver={handleDragOver}
            onDrop={() => handleDropToTeam(team)}
          >
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{team.name}</h2>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => deleteTeam(team)}
                >
                  <Trash2 />
                </Button>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Skill</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {employees
                    .filter(emp => emp.teamId === team.id)
                    .map((emp) => (
                      <tr 
                        key={emp.id} 
                        draggable
                        onDragStart={() => handleDragStart(emp)}
                      >
                        <td>{emp.name}</td>
                        <td>{emp.skill}</td>
                        <td>${emp.cost}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              <div className="bg-light p-2 rounded">
                {(() => {
                  const teamEmployees = employees.filter(emp => emp.teamId === team.id);
                  const totals = calculateTotals(teamEmployees);
                  return (
                    <>
                      <div>Total Employees: {totals.totalEmployees}</div>
                      <div>Total Cost: ${totals.totalCost.toFixed(2)}</div>
                      <div>Average Cost: ${totals.averageCost.toFixed(2)}</div>
                    </>
                  );
                })()}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TeamManagementApp;