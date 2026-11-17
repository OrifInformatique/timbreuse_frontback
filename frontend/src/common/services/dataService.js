import axios from 'axios';

let pathJSON = "/data/mock-data-admin-";
let pathJSONAdminUser = "data/mock-data-admin-users";
let pathJSONUser = "data/mock-data-";


// Path of the JSON files for data event
let pathJSONEventType = "data/events/eventTypes.json";
let pathJSONEventUser = "data/events/users.json";
let pathJSONEventGroup = "data/events/userGroups.json";

export async function getAdminData(dateString, idAdmin) {

  // Changer l'adresse de la requête pour le backend et le token d'authentification
  const result = await axios.get(pathJSON + dateString + ".json");
  const adminData = result.data.find(
    admin => admin.id_admin === idAdmin
  );

  if (!adminData) {
    throw new Error("Admin introuvable");
  }

  console.log(adminData);
  
  return adminData;
}

export async function getUserAdminData(idUser) {

  const result = await axios.get(pathJSONAdminUser + ".json");
  const userData = result.data.find(
    user => user.id_admin === idUser    
  );

  if (!userData) {
    throw new Error("Utilisateur admin introuvable");
  }  

  console.log(userData);
  
  return userData;
}

export async function getUserData(idUser, dateString) {

  const result = await axios.get(pathJSONUser + dateString + ".json");
  const userData = result.data.find(
    user => user.id_user === idUser    
  );

  if (!userData) {
    throw new Error("Utilisateur introuvable");
  }  
  
  return userData;
}




