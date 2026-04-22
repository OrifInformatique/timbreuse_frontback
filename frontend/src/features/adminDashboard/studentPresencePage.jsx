import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminData } from "./services/dataService";
import TableDailyHour from "./components/tableDailyHour";
import Title from "./components/title";
import LabelMotif from "./components/labelMotif";
import LabelPresence from "./components/labelPresence";

const AdminDashboardStudentPresentPage = () => {

    const navigate = useNavigate();
    const [data, setData] = useState(null);
  
    // Il va récupérer la variable data dans le json via le dataService.js
    useEffect(() => {
        getAdminData().then(setData);
    }, []);
  
    // Si data n'a aucune donnée, il n'affiche qu'un chargement
    if (!data) return <div>Chargement...</div>

    // Récupère l'id utilisé dans la route pour la page et va chercher dans data le bénéficiaire qui correspond à l'id
    const { id } = useParams();
    const student = data.listStudent.find(
        (s) => s.id === Number(id)
    );

    // Si aucun bénéficiaire correspond à l'id, il affiche que le bénéficiaire est introuvable
    if (!student) return <div>Bénéficiaire introuvable</div>

    return (<>
    
        {/*Titre de la page*/}
        <div className="flex flex-row justify-center my-10 items-center">
            <Title titre={"Présence : " + student.name + " " + student.surname}></Title>
        </div>    
        <div className="flex flex-col md:flex-row items-center md:justify-center my-20 md:py-20 md:contend-around gap-5">

            {/*Cette balise affiche l'état de présence de l'utilisateur, s'il est présent, absent ou excusé*/}
            <LabelPresence studentPresence={student.presence} studentReason={student.reason}></LabelPresence>

            {/*Cette balise contient un composant qui affiche l'heure de travail demandé du jour et le temps de travail effectué en temps réel*/}
            <div className="flex mx-5">
                <TableDailyHour dailyHourNeeded={student.dailyHourNeeded} dailyLogs={student.dailyLogs}></TableDailyHour>
            </div>
            <LabelMotif studentPresence={student.presence} studentReason={student.reason}></LabelMotif>
        </div>
    </>);
}

export default AdminDashboardStudentPresentPage;
