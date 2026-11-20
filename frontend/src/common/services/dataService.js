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


////////////////////////////////////////////////////////////////////////////
////  EVENTS                                                              //
////  Function to get the data from the JSON files of the frontend Event  //
////////////////////////////////////////////////////////////////////////////

//////////////////
//  USER GROUP  //
//////////////////

////////////////////////////////////
//  GET USER GROUP FROM GIVEN ID  //    --> id / name / subgroups
////////////////////////////////////
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

//////////////////////////
//  GET ALL USER GROUP  //    --> id / name / subgroups
//////////////////////////
export async function getEventDataUserGroups() {

  const result = await axios.get(pathJSONEventGroup + ".json");

  if (!result.data || !result.data.userGroups) {
    throw new Error("Groupes introuvables")
  }

  return result.data.userGroups;
}



////////////
//  USER  //
////////////

/////////////////////////////////////
//  GET USER PROFIL FROM GIVEN ID  //    --> id / login / firstName / lastName / userGroupIds
/////////////////////////////////////
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

///////////////////////////
//  GET ALL USER PROFIL  //    --> id / login / firstName / lastName / userGroupIds
///////////////////////////
export async function getEventDataUsers() {

  const result = await axios.get(pathJSONEventUser + ".json");

  if (!result.data ||!result.data.users) {
    throw new Error("Utilisateurs introuvable");
  }

  return result.data.users;
}



///////////////////
//  EVENT TYPES  //
///////////////////

////////////////////////////////////
//  GET EVENT TYPE FROM GIVEN ID  //    --> id / name / isGroupEventType / isPersonalEventType
////////////////////////////////////
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

//////////////////////////
//  GET ALL EVENT TYPE  //    --> id / name / isGroupEventType / isPersonalEventType
//////////////////////////
export async function getEventTypes() {
  
  const result = await axios.get(pathJSONEventType + ".json");

  if (!result.data || !result.data.eventTypes) {
    throw new Error("Listes d'événements introuvable");
  }

  return result.data.eventTypes;
}



////////////////////
//  GROUP SERIES  //
////////////////////

/////////////////////////////////////
//  GET EVENT SERIE FROM GIVEN ID  //    --> id / startDate / endDate / daysOfWeek
/////////////////////////////////////
export async function getEventSerie(idSerie) {
  
  const result = await axios.get(pathJSONEventSerie + ".json");
  const eventSerie = result.data.eventSeries.find(
    serie => serie.id === idSerie
  );

  if (!eventSerie) {
    throw new Error("Série d'événements introuvable");
  }

  return eventSerie;
}

////////////////////////////
//  GET ALL EVENT SERIES  //    --> id / startDate / endDate / daysOfWeek
////////////////////////////
export async function getEventSeries() {
  
  const result = await axios.get(pathJSONEventSerie + ".json");

  if (!result.data || !result.data.eventSeries) {
    throw new Error("Les séries d'événements sont introuvable");
  }

  return result.data.eventSeries;
}


///////////////////
//  DATA EVENTS  //
///////////////////

//////////////////////
//  GET ALL EVENTS  //    --> users {id/login/firstName/lastName} --> events {id/EventSerieId/userGroupId/userId/eventTypeId/eventDate/startTime/endTime/isWorkTime}
//////////////////////    --> userGroup {id/name/parentId}        --> events {id/EventSerieId/eventTypeId/eventDate/startTime/endTime/isWorkTime}
export async function getEventData() {
  
  const result = await axios.get(pathJSONAllEvent + ".json");

  if (!result) {
    throw new Error("Événement introuvable");
  }

  return result.data;
}

