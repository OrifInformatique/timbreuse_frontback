import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAdminData, getUserAdminData } from "/src/features/services/dataService";
import Title from "/src/features/components/title";
import ListAllStudent from "./components/listAllStudent";
import Subtitle from "./components/subtitle";
import { Button } from "@orif-informatique/react-components-library";

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [idUser] = useState(() => {
    return Number(localStorage.getItem("idUser")) || 1});
  const [dateDisplayed, setDateDisplayed] = useState(() => {
      return localStorage.getItem("selectedDate") || "2026-01-19"});
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    localStorage.setItem("selectedDate", dateDisplayed);

    async function loadData() {
        try {
          const result = await getAdminData(dateDisplayed, idUser);
          setData(result);
          setError(false);

        } catch(err) {
          setError(true);
          setData(null);
        }
    }
    loadData();
  }, [dateDisplayed, idUser]);

  useEffect(() => {
    localStorage.setItem("idUser", idUser);
      
    async function loadDataUser() {
        try {
          const result = await getUserAdminData(idUser);
          setError(false);
          setUserData(result);

        } catch(err) {
          setError(true);
          setUserData(null);
        }              
      }
      loadDataUser();
  }, [idUser]);

  // Si data n'a aucune donnée, il n'affiche qu'un chargement
  if (!data) {
    return (<>
      <div className="flex flex-row justify-around">
        <div className="flex flex-col">
          <Title titre={userData ? `${userData.name} ${userData.surname}` : "Chargement..."}></Title>
          <Subtitle sousTitre="Liste des bénéficiaires"></Subtitle>
        </div>
        <Button className="p-3 md:ml-10" variant="secondary" label="Présence du jour" onClick={() => navigate("/admin-dashboard-daily")}></Button>
      </div>         
      <div>Chargement...</div>
    </>);
  }

  const nom = userData.surname;
  const prenom = userData.name;
  const listStudent = data.listStudent;


  return (<>

    <div className="flex flex-row justify-around">
      {/*Titre de la page*/}
      <div className="flex flex-col">
        <Title titre={nom + " " + prenom}></Title>
        {/*Composant sous-titre*/}
        <Subtitle sousTitre="Liste des bénéficiaires"></Subtitle>
      </div>
      <Button className="p-3 md:ml-10" variant="secondary" label="Présence du jour" onClick={() => navigate("/admin-dashboard-daily")}></Button>
    </div>
    
    <div className="flex justify-center my-8 text-2xl">
      <ListAllStudent listStudent={listStudent}></ListAllStudent>
    </div>
  </>);
}

export default AdminDashboard;