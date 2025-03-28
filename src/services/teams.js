import axios from "axios";
import Endpoint from "./EndPoint";

export const getTeamList = (requestData) => {
   return axios.get(`${Endpoint.getTeamList}`, {params: requestData});
}

export const createTeam = (values) => {
   return axios.post(Endpoint.createTeam, values);
}


export const deleteTeam = (teamId) => {
   return axios.delete(`${Endpoint.deleteTeam}/${teamId}`);
}