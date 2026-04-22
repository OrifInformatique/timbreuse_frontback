import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminData } from "./services/dataService";
import Title from "./components/title";
import ListAllStudent from "./components/listAllStudent";

const AdminDashboard = () => {

  const [data, setData] = useState(null);

  // Il va récupérer la variable data dans le json via le dataService.js
  useEffect(() => {
      getAdminData().then(setData);
  }, []);

  // Si data n'a aucune donnée, il n'affiche qu'un chargement
  if (!data) return <div>Chargement...</div>

  const nom = data.surname;
  const prenom = data.name;
  const listStudent = data.listStudent;


  return (<>

    {/*Titre de la page*/}
    <div className="flex flex-col">
      <Title titre={nom + " " + prenom}></Title>
      <p className="font-bold text-2xl">Liste des bénéficiaires</p>
    </div>

    <div className="flex justify-center my-8 text-2xl">
      <ListAllStudent listStudent={listStudent}></ListAllStudent>
    </div>
  </>);
}

export default AdminDashboard;