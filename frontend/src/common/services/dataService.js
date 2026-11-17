import axios from 'axios';

let pathJSON = "/data/mock-data-admin-";
let pathJSONAdminUser = "data/mock-data-admin-users";
let pathJSONUser = "data/mock-data-";


// Path of the JSON files for data event
let pathJSONEventType = "data/events/eventTypes";
let pathJSONEventUser = "data/events/users";
let pathJSONEventGroup = "data/events/userGroups";
let pathJSONAllEvent = "data/events/allEvent";
let pathJSONEventSerie = "data/events/eventSeries";

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



// Function to get the data from the JSON files of the frontend Event

// Get all the groups of user
export async function getEventDataUserGroup(idUserGroup) {
  
  const result = await axios.get(pathJSONEventGroup + ".json");
  const eventDataUserGroup = result.data.find(
    group => group.id === idUserGroup
  );

  if (!eventDataUserGroup) {
    throw new Error("Groupe introuvable");
  }

  return eventDataUserGroup;
}

// Get a users by the ID
export async function getEventDataUser(idUser) {
  
  const result = await axios.get(pathJSONEventUser + ".json");
  const eventDataUser = result.data.find(
    user => user.id === idUser
  );

  if (!eventDataUser) {
    throw new Error("Utilisateur introuvable");
  }

  return eventDataUser;
}

// Get all users
export async function getEventDataUsers() {

  const result = await axios.get(pathJSONEventUser + ".json");

  if (!result.data) {
    throw new Error("Utilisateurs introuvable");
  }

  return result.data;
}


// Get all the type of event
export async function getEventType(idType) {
  
  const result = await axios.get(pathJSONEventType + ".json");
  const eventType = result.data.eventTypes.find(
    type => type.id === idType
  );

  if (!eventType) {
    throw new Error("Type d'événement introuvable");
  }

  return eventType;
}

// Get all the event serie
export async function getEventSeries(idSerie) {
  
  const result = await axios.get(pathJSONEventSerie + ".json");
  const eventSerie = result.data.eventSeries.find(
    serie => serie.id === idSerie
  );

  if (!eventSerie) {
    throw new Error("Série d'événements introuvable");
  }

  return eventSerie;
}

// Get all the events
export async function getEventData() {
  
  const result = await axios.get(pathJSONAllEvent + ".json");

  if (!result) {
    throw new Error("Événement introuvable");
  }

  return result;
}




