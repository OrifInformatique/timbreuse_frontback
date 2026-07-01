import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminData } from "/src/common/services/dataService";
import Title from "/src/common/components/title";
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
  
    // If data have no data, he display that he did not found data
    if (!data) return (<>
        <Button className="p-3 md:ml-10" variant="secondary" label="Retour" onClick={() => navigate("/admin-dashboard")}></Button>
        <div>No data found</div>
    </>);

    // Take the id used in the route by the View and will search in data the student that have this id
    const { id } = useParams();
    const student = data.listStudent.find(
        (s) => s.id === Number(id)
    );

    // If no student have the id, he will display that the student is not found
    if (!student) return (<>
        <Button className="p-3 md:ml-10" variant="secondary" label="Retour" onClick={() => navigate("/admin-dashboard")}></Button>
        <div>Student not found</div>
    </>); 

    return (<>

        {/*Title of the page*/}
        <div className="flex flex-row justify-center my-10 items-center">
            <Title titre={student.name + " " + student.surname}></Title>

            {/*Button that when click will navigate at the View that display the list of the students*/}
            <Button className="p-3 md:ml-10" variant="secondary" label="Retour" onClick={() => navigate("/admin-dashboard")}></Button>
        </div>    
        
        <div className="flex justify-center w-full mt-20">
            <div className="flex flex-col text-2xl bg-gray-300 min-w-1/3 max-w-2/3 border border-gray-500">
                
                {/*HTML tag that display the balance and if she's positive or negative*/}
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

                {/*Display if there is a error in the profil of the student*/}
                <div className="p-5">
                    Anomalie : {student.whatError !== "" ? student.whatError : "-"}
                </div>

                {/*If a error was found, he display when that error was found*/}
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
