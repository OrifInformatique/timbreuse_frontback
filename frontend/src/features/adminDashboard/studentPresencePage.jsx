import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminData } from "/src/common/services/dataService";
import TableDailyHour from "./components/tableDailyHour";
import Title from "/src/common/components/title";
import LabelPresence from "./components/labelPresence";
import { Button } from "@orif-informatique/react-components-library";


const AdminDashboardStudentPresentPage = () => {

    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [idUser] = useState(() => {
        return Number(localStorage.getItem("idUser")) || 1});
    const [dateDisplayed, setDateDisplayed] = useState(() => {
        return localStorage.getItem("selectedDate") || "2026-01-19"});
  
    // Il va récupérer la variable data dans le json via le dataService.js
    useEffect(() => {
        getAdminData(dateDisplayed, idUser).then(setData);
    }, [dateDisplayed]);

    useEffect(() => {
        localStorage.setItem("selectedDate", dateDisplayed);
    }, [dateDisplayed]);

    useEffect(() => {
        localStorage.setItem("idUser", idUser);
    }, [idUser]);

    // Récupère l'id utilisé dans la route pour la page et va chercher dans data le bénéficiaire qui correspond à l'id
    const {id} = useParams();
    
    // Si data n'a aucune donnée, il n'affiche qu'un chargement
    if (!data) return <div>Chargement...</div>
    
    const student = data.listStudent.find(
        (s) => s.id === Number(id)
    );

    // Si aucun bénéficiaire correspond à l'id, il affiche que le bénéficiaire est introuvable
    if (!student) return <div>Bénéficiaire introuvable</div>

    return (<>
    
        {/*Titre de la page*/}
        <div className="flex flex-row justify-center my-10 items-center">
            <Title titre={"Présence : " + student.name + " " + student.surname}></Title>
            <Button className="p-3 md:ml-10" variant="secondary" label="Présence du jour" onClick={() => navigate("/admin-dashboard-daily")}></Button>
        </div>    
        <div className="flex flex-col md:flex-row items-center md:justify-center my-20 md:py-20 md:contend-around gap-5">

            {/*Cette balise affiche l'état de présence de l'utilisateur, s'il est présent, absent ou excusé*/}
            <LabelPresence studentPresence={student.presence} studentReason={student.reason}></LabelPresence>

            {/*Cette balise contient un composant qui affiche l'heure de travail demandé du jour et le temps de travail effectué en temps réel*/}
            <div className="flex mx-5">
                <TableDailyHour dailyHourNeeded={student.dailyHourNeeded} dailyLogs={student.dailyLogs}></TableDailyHour>
            </div>
            {/*<LabelMotif studentPresence={student.presence} studentReason={student.reason}></LabelMotif>*/} 
        </div>
    </>);
}

export default AdminDashboardStudentPresentPage;
