import axios from 'axios';

let pathJSON = "/data/mock-data-admin-";
let pathJSONUser = "data/mock-data-admin-users";

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
/*
  promise = axios.get(pathJSON + dateString + ".json")
    .then((res) => {
      data = res.data;  
      return data;
    })
    .catch((err) => {
      promise = null;
      throw err;
    });
*/
  //console.log(promise);
  
  return adminData;
}

export async function getUserData(idUser) {

  const result = await axios.get(pathJSONUser + ".json");

  const userData = result.data.find(
    user => user.id_admin === idUser    
  );

  if (!userData) {
    throw new Error("Utilisateur introuvable");
  }  

  console.log(userData);
  return userData;
}





