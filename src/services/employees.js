import axios from "axios";
import Endpoint from "./EndPoint";

export const getEmployeesList = (requestData) => {
   return axios.get(`${Endpoint.getEmployeesList}`, {params: requestData});
}

export const createEmployees = (values) => {
   return axios.post(Endpoint.createEmployees, values);
}


 export const deleteEmployees= (employeeId) => {
   return axios.delete(`${Endpoint.deleteEmployees}/${employeeId}`);
}

export const updateEmployees= (employeeId) => {
   return axios.patch(`${Endpoint.updateEmployees}/${employeeId}`);
}