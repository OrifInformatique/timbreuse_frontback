import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminData } from "/src/features/services/dataService";
import Title from "/src/features/components/title";
import { Button } from "@orif-informatique/react-components-library";

const AdminDashboardStudentErrorPage = () => {

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
                const result = await getUserData(idUser);
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
    if (!data) return (<>
        <Button className="p-3 md:ml-10" variant="secondary" label="Retour" onClick={() => navigate("/admin-dashboard")}></Button>
        <div>Chargement...</div>
    </>);

    // Récupère l'id utilisé dans la route pour la page et va chercher dans data le bénéficiaire qui correspond à l'id
    const { id } = useParams();
    const student = data.listStudent.find(
        (s) => s.id === Number(id)
    );

    // Si aucun bénéficiaire correspond à l'id, il affiche que le bénéficiaire est introuvable
    if (!student) return (<>
        <Button className="p-3 md:ml-10" variant="secondary" label="Retour" onClick={() => navigate("/admin-dashboard")}></Button>
        <div>Bénéficiaire introuvable</div>
    </>); 

    return (<>

        {/*Titre de la page*/}
        <div className="flex flex-row justify-center my-10 items-center">
            <Title titre={student.name + " " + student.surname}></Title>
            <Button className="p-3 md:ml-10" variant="secondary" label="Retour" onClick={() => navigate("/admin-dashboard")}></Button>
        </div>    


        
        <div className="flex justify-center w-full mt-20">
            <div className="flex flex-col text-2xl bg-gray-300 min-w-1/3 max-w-2/3 border border-gray-500">
                
                {/*Balise qui indique la balance et si elle est positive ou négative*/}
                <div className="flex flex-row justify-between p-5">
                    <div>{student.errorFound === 0 ? "✅" : "⚠️"}</div>
                    <div className="flex flex-row">
                        <div className="mr-2">
                            Balance :    
                        </div> 
                        <div className={student.workTime.startsWith("+") ? "text-green-500" : "text-red-500"}>
                            {student.workTime}
                        </div>
                    </div>
                </div>

                {/*Affiche s'il y a une anomalie dans le compte du bénéficiaire*/}
                <div className="p-5">
                    Anomalie : {student.whatError !== "" ? student.whatError : "-"}
                </div>

                {/*S'il a détecté une anomalie, il affiche à quel jour elle a été trouvé*/}
                <div className="p-5">
                    Quand : {student.whenError ? 
                                new Date(student.whenError).toLocaleDateString("fr-CH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }) : "-"}
                </div>
            </div>
        </div>

    </>);
}

export default AdminDashboardStudentErrorPage;
