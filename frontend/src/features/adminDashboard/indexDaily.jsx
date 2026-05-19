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
    //const [dateDemande, setDateDemande] = useState("2026-01-21");
    const [dateDemande, setDateDemande] = useState(() => {
        return localStorage.getItem("selectedDate") || "2026-01-21"});
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    // Il va récupérer la variable data dans le json via le dataService.js
    /*
    useEffect(() => {
        getAdminData(dateDemande).then(setData);
    }, [dateDemande]); 
    */

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getAdminData(dateDemande);
                setData(result);
                setError(false);
            } catch(err) {
                setError(true);
                setData(null);
            }
        }
        loadData();
    }, [dateDemande]);

    useEffect(() => {
        localStorage.setItem("selectedDate", dateDemande);
    }, [dateDemande]); 

    // Si data n'a aucune donnée, il n'affiche qu'un chargement
    if (!data) 
        return (<>
            <div className="flex flex-col md:flex-row justify-items-center md:justify-center md:min-w-4xl my-10 items-center">
                <Title titre={prenom + " " + nom}></Title>
                {/*Balise qui affiche le jour sélectionné (la navigation entre les jour n'est pas encore implémenté)*/}
                <SelectDate stringDate={"Erreur"} decrementDate={() => decrementDate(dateDemande)} incrementDate={() => incrementDate(dateDemande)}></SelectDate>
                <Button className="p-3 md:ml-10" variant="secondary" label="Voir les bénéficiaires" onClick={() => navigate("/admin-dashboard")}></Button>
            </div>
            <div>Aucune données trouvées</div>
        </>)



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

    function addOneDay(dateString) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);

        return reformatDate(date);
    }

    function removeOneDay(dateString) {
        const date = new Date(dateString);
        date.setDate(date.getDate() - 1);

        return reformatDate(date);
    }

    function reformatDate(dateToReform) {
        const year = dateToReform.getFullYear();
        const month = String(dateToReform.getMonth() + 1).padStart(2, "0");
        const day = String(dateToReform.getDate()).padStart(2, "0");
        const dateFormated = `${year}-${month}-${day}`;

        return dateFormated;
    }

    function incrementDate(stringDate) {
        setDateDemande(addOneDay(stringDate));
    }

    function decrementDate(stringDate) {
        setDateDemande(removeOneDay(stringDate));
    }

    return (<>
    
        <div className="flex flex-col md:flex-row justify-items-center md:justify-center md:min-w-4xl my-10 items-center">
            
            {/*Nom du responsable (administrateur)*/}
            <Title titre={prenom + " " + nom}></Title>
            {/*<p className="font-bold text-3xl mb-5 md:mb-0 md:mr-10">{prenom} {nom}</p>*/}
            
            {/*Balise qui affiche le jour sélectionné (la navigation entre les jour n'est pas encore implémenté)*/}
            <SelectDate stringDate={readingDate} decrementDate={() => decrementDate(dateDemande)} incrementDate={() => incrementDate(dateDemande)}></SelectDate>
            

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
