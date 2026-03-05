let data = null;
let isLoading = false;
let promise = null;

export function getAdminData() {

  if (data) {
    return Promise.resolve(data);
  }

  if (isLoading) {
    return promise;
  }

  isLoading = true;

  promise = fetch('/data/mock-data-admin.json')
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erreur chargement JSON");
      }
      return res.json();
    })
    .then((json) => {
      data = json;   
      return data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

  return promise;
}