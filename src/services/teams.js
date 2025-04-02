import axios from "axios";
import Endpoint from "./EndPoint";

export const getTeamList = (requestData) => {
   return axios.get(`${Endpoint.getTeamList}`, {params: requestData});
}

export const createTeam = (values) => {
   return axios.post(Endpoint.createTeam, values);
}


// export const deleteTeam = (teamId) => {
//    console.log(teamId, "teamId")
//    return axios.delete(`${Endpoint.deleteTeam}/${teamId}`);
// }

export const deleteTeam = (teamId) => {
   console.log(teamId, "teamId");
   if (!teamId) {
     console.error("Team ID is undefined");
     return Promise.reject(new Error("Team ID is required"));
   }
   return axios.delete(`${Endpoint.deleteTeam}/${teamId}`);
 }

 export const editTeam = (teamId, teamData) => {
  console.log(teamId, "teamId");
  console.log(teamData, "teamData");
  
  if (!teamId) {
    console.error("Team ID is undefined");
    return Promise.reject(new Error("Team ID is required"));
  }
  
  return axios.put(`${Endpoint.editTeam}/${teamId}`, teamData);
};