import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAdminData, getUserAdminData } from "/src/common/services/dataService";
import Title from "/src/common/components/title";
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

  // Go searching the variable "selectedDateAdmin" in the local storage and paste the data in the constante dateDisplayed
  // He will repeat this method every time that dateDisplayed or idUser change  
  useEffect(() => {
    localStorage.setItem("selectedDate", dateDisplayed);

    // Send a request to get the data in the JSON. If there is no error, he will update the constante data with the data gotten
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

  // Go searching the variable "idUser" in the local storage and paste the data in the constante idUser
  // He will repeat this method every time that idUser change
  useEffect(() => {
    localStorage.setItem("idUser", idUser);
      
    // Send a request to get the data in the JSON. If there is no error, he will update the constante userData with the data gotten
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

  // If data or userData have no data, he display that he did not found data
  if (!data || !userData) {
    return (<>
      <div className="flex flex-row justify-around">
        <div className="flex flex-col">
          <Title titre={userData ? `${userData.name} ${userData.surname}` : "Chargement..."}></Title>
          <Subtitle sousTitre="Liste des bénéficiaires"></Subtitle>
        </div>
        <Button className="p-3 md:ml-10" variant="secondary" label="Présence du jour" onClick={() => navigate("/admin-dashboard-daily")}></Button>
      </div>         
      <div>No data found</div>
    </>);
  }

  const nom = userData.surname;
  const prenom = userData.name;
  const listStudent = data.listStudent;


  return (<>

    <div className="flex flex-row justify-around">
      
      {/*Title of the page*/}
      <div className="flex flex-col">
        <Title titre={nom + " " + prenom}></Title>
        <Subtitle sousTitre="Liste des bénéficiaires"></Subtitle>
      </div>

      {/*Button that when click, will navigate to the view of the presence of the day*/}
      <Button className="p-3 md:ml-10" variant="secondary" label="Présence du jour" onClick={() => navigate("/admin-dashboard-daily")}></Button>
    </div>
    
    {/*List of all the student of the present user*/}
    <div className="flex justify-center my-8 text-2xl">
      <ListAllStudent listStudent={listStudent}></ListAllStudent>
    </div>
    
  </>);
}

export default AdminDashboard;