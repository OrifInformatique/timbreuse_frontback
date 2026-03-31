import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminData } from "./services/dataService";
import TableDailyHour from "./components/tableDailyHour";
import Title from "./components/title";

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
            <div className="flex flex-row md:max-w-1/4 w-1/2 md:min-w-1/8 h-30 mx-5 justify-center md:p-3 border border-black-400">
                <div className={
                    student.presence === 0 ? "flex text-green-500 text-2xl font-bold items-center" : 
                        student.presence === 1 && student.reason === "" ? "flex text-red-500 text-2xl font-bold items-center" :
                            student.presence === 1 && student.reason !== "" ? "flex text-orange-500 text-2xl font-bold items-center" : ""}>
                    
                    {student.presence === 0 ? "✅ Présent" : 
                        student.presence === 1 && student.reason === "" ? "‼️ Absent" :
                            student.presence === 1 && student.reason !== "" ? "👍 Excusé" : ""}
                </div>
            </div>

            {/*Cette balise contient un composant qui affiche l'heure de travail demandé du jour et le temps de travail effectué en temps réel*/}
            <div className="flex mx-5">
                <TableDailyHour dailyHourNeeded={student.dailyHourNeeded} dailyLogs={student.dailyLogs}></TableDailyHour>
                {/*
                J'ai laisser le code qui à été remplacé par le composant

                <table className="w-full">
                    <tbody className="divide-y-1 divide-black-400">
                        <tr>
                            <th scope="row" className="text-left px-3 py-2">Temps exigé du jour</th>
                            <td className="text-right px-3">{student.dailyHourNeeded}</td>
                        </tr>
                        <tr>
                            <th scope="row" className="text-left px-3 py-2">Temps de travail</th>
                            <td className="text-right px-3">00:00</td>
                        </tr>
                    </tbody>
                </table>
                */}
            </div>
            <div className="flex flex-col md:w-full w-1/2 md:w-1/6 md:max-w-1/6 mx-5 h-30">
                <div className="">Motif</div>
                <div className="bg-gray-300 border-1 border-black-300 h-full max-h-30 p-2 flex text-center items-center">{student.presence === 1 && student.reason !== "" ? student.reason : ""}</div>
            </div>
        </div>
    </>);
}

export default AdminDashboardStudentPresentPage;
