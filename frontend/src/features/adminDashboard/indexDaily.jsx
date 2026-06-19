import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAdminData, getUserAdminData } from "/src/common/services/dataService";
import Title from "/src/common/components/title";
import SelectDate from "/src/common/components/selectDate";
import StudentDailyList from "./components/studentDailyList";
import { Button } from "@orif-informatique/react-components-library";
import { addOneDay, removeOneDay } from "./utils";

const AdminDashboardDaily = () => {
    
    const navigate = useNavigate();
    const [idUser] = useState(() => {
        return Number(localStorage.getItem("idUser")) || 2});
    const [dateDisplayed, setDateDisplayed] = useState(() => {
        return localStorage.getItem("selectedDateAdmin") || "2026-01-19"});
    const [data, setData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        localStorage.setItem("selectedDateAdmin", dateDisplayed);

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
    
    // Si data ou userData n'ont aucune donnée, il affiche qu'il n'a trouvé aucune donnée
    if (!data || !userData) {

        let date = new Date(dateDisplayed).toLocaleDateString("ch-CH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric" 
        });

        return (<>
            <div className="flex flex-col md:flex-row justify-items-center md:justify-center md:min-w-4xl my-10 items-center">
                <Title titre={userData ? `${userData.name} ${userData.surname}` : "Chargement..."}></Title>
                <SelectDate stringDate={date} decrementDate={() => decrementDateDisplayed(dateDisplayed)} incrementDate={() => incrementDateDisplayed(dateDisplayed)}></SelectDate>
                <Button className="p-3 md:ml-10" variant="secondary" label="Voir les bénéficiaires" onClick={() => navigate("/admin-dashboard")}></Button>
            </div>
            <div>Aucune données trouvées</div>
        </>)
    }

    const nom = userData.surname;
    const prenom = userData.name;
    const listStudent = data.listStudent;
    const days = data.date;
  
    const readingDate = new Date(days).toLocaleDateString("ch-CH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    
    // Permet de mettre à jour la constante dateDisplayed en ajoutant un jour à celle-ci
    function incrementDateDisplayed(stringDate) {
        setDateDisplayed(addOneDay(stringDate));
    }

    // Permet de mettre à jour la constante dateDisplayed en retirant un jour à celle-ci
    function decrementDateDisplayed(stringDate) {
        setDateDisplayed(removeOneDay(stringDate));
    }

    return (<>
    
        <div className="flex flex-col md:flex-row justify-items-center md:justify-center md:min-w-4xl my-10 items-center">
            
            {/*Nom du responsable (administrateur)*/}
            <Title titre={prenom + " " + nom}></Title>
            
            {/*Balise qui affiche le jour sélectionné (la navigation entre les jour n'est pas encore implémenté)*/}
            <SelectDate stringDate={readingDate} decrementDate={() => decrementDateDisplayed(dateDisplayed)} incrementDate={() => incrementDateDisplayed(dateDisplayed)}></SelectDate>
            
            {/*Bouton qui permet de naviguer à la page qui contient la liste des bénéficiaires*/}
            <Button className="p-3 md:ml-10" variant="secondary" label="Voire les bénéficiaires" onClick={() => navigate("/admin-dashboard")}></Button>
        </div>

        <div className="flex flex-col md:flex-row justify-center py-10 items-center md:items-stretch">

            {/*Cette balise représente la colonne des bénéficiaires présents*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <StudentDailyList titleList="Bénéficiaires présents" listStudent={listStudent} typeList={0}></StudentDailyList>
            </div>

            {/*Cette balise représente la colonne des bénéficiaires absents*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <StudentDailyList titleList="Bénéficiaires absents" listStudent={listStudent} typeList={1}></StudentDailyList>
            </div>

            {/*Cette balise représente la colonne des bénéficiaires excusés*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <StudentDailyList titleList="Bénéficiaires excusés" listStudent={listStudent} typeList={2}></StudentDailyList>
            </div>
        </div>
        
    </>);
}

export default AdminDashboardDaily;