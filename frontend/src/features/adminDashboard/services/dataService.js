import axios from 'axios';

let data = null;
let promise = null;
// Changer l'adresse de la requête pour le backend et le token d'authentification
let pathJSON = "/data/mock-data-admin-";


// Export function

export async function getAdminData(dateString) {

  const result = await axios.get(pathJSON + dateString + ".json");
  console.log(result.data);
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
  
  return result.data;
}





