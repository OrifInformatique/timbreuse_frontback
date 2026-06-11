import axios from 'axios';

let pathJSONUser = "data/mock-data-";

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





