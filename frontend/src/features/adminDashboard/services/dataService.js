import axios from 'axios';

let data = null;
let promise = null;

export function getAdminData() {

  if (data) {
    return Promise.resolve(data);
  }

  if (!promise) {

    // Récupère les données du JSON
    // Modification futur : changer l'adresse de la requête par l'adresse des données backend
    //                      et intégrer le code du token d'authentification 
    
    promise = axios.get('/data/mock-data-admin.json')
        .then((res) => {
          data = res.data;   
          return data;
        })
        .catch((err) => {
          promise = null;
          throw err;
        });
  }

  return promise;
}





