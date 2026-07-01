import axios from 'axios';

let pathJSON = "/data/mock-data-admin-";
let pathJSONAdminUser = "data/mock-data-admin-users";
let pathJSONUser = "data/mock-data-";

// Need to change the adresse of the request for the backend
export async function getAdminData(dateString, idAdmin) {

  let result = null;
  try {
    result = await axios.get(pathJSON + dateString + ".json");
  } catch (err) {
    throw new Error("Request incorrect");
  }

  if (result === undefined) {
    throw new Error("Erreur data not receive")
  }

  const adminData = result.data.find(
    admin => admin.id_admin === idAdmin
  );

  if (!adminData) {
    throw new Error("Admin not found");
  }
  
  return adminData;
}

export async function getUserAdminData(idUser) {

  let result = null;
  try {
    result = await axios.get(pathJSONAdminUser + ".json");
  } catch (err) {
    throw new Error("Request incorrect");
  }

  if (result === undefined) {
    throw new Error("Erreur data not receive")
  }
  
  const userData = result.data.find(
    user => user.id_admin === idUser    
  );

  if (!userData) {
    throw new Error("User admin not found");
  }  
  
  return userData;
}

export async function getUserData(idUser, dateString) {

  let result = null;
  try {
    result = await axios.get(pathJSONUser + dateString + ".json");
  } catch (err) {
    throw new Error("Request incorrect");
  }

  if (result === undefined) {
    throw new Error("Erreur data not receive")
  }

  const userData = result.data.find(
    user => user.id_user === idUser    
  );

  if (!userData) {
    throw new Error("User not found");
  }  
  
  return userData;
}




