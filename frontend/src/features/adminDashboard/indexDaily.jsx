import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAdminData } from "./services/dataService";
import Title from "./components/title";
import SelectDate from "./components/selectDate";
import StudentDailyList from "./components/studentDailyList";
import { Button } from "@orif-informatique/react-components-library";

const AdminDashboardDaily = () => {
    const navigate = useNavigate();
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
    const days = data.date;
  
    const readingDate = new Date(days).toLocaleDateString("ch-CH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });


    return (<>
    
        <div className="flex flex-col md:flex-row justify-items-center md:justify-center md:min-w-4xl my-10 items-center">
            
            {/*Nom du responsable (administrateur)*/}
            <Title titre={prenom + " " + nom}></Title>
            {/*<p className="font-bold text-3xl mb-5 md:mb-0 md:mr-10">{prenom} {nom}</p>*/}
            
            {/*Balise qui affiche le jour sélectionné (la navigation entre les jour n'est pas encore implémenté)*/}
            <SelectDate stringDate={readingDate}></SelectDate>

            {/*Bouton qui permet de naviguer à la page qui contient la liste des bénéficiaires*/}
            <Button className="p-3 md:ml-10" variant="secondary" label="Voir les bénéficiaires" onClick={() => navigate("/admin-dashboard")}></Button>
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
