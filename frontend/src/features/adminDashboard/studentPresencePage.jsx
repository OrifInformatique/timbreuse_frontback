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
        <Button className="p-3 md:ml-10" variant="secondary" label="Retour" onClick={() => navigate("/admin-dashboard-daily")}></Button>
        <div>No data found</div>
    </>);
        
    // Take the id used in the route by the View and will search in data the student that have this id
    const {id} = useParams();
    const student = data.listStudent.find(
        (s) => s.id === Number(id)
    );

    // If no student have the id, he will display that the student is not found
    if (!student) return (<>
        <Button className="p-3 md:ml-10" variant="secondary" label="Retour" onClick={() => navigate("/admin-dashboard-daily")}></Button>
        <div>Student not found</div>
    </>); 

    return (<>
    
        {/*Title of the page*/}
        <div className="flex flex-row justify-center my-10 items-center">
            <Title titre={"Présence : " + student.name + " " + student.surname}></Title>

            {/*Button that when click, will navigate to the view of the presence of the day*/}
            <Button className="p-3 md:ml-10" variant="secondary" label="Présence du jour" onClick={() => navigate("/admin-dashboard-daily")}></Button>
        </div>    
        <div className="flex flex-col md:flex-row items-center md:justify-center my-20 md:py-20 md:contend-around gap-5">

            {/*This HTML tag display the presence state of the student (if he's present, not here or plea)*/}
            <LabelPresence studentPresence={student.presence} studentReason={student.reason}></LabelPresence>

            {/*This HTML tag contain a component that display the time of work needed of the day and the time of work already done in real time*/}
            <div className="flex mx-5">
                <TableDailyHour dailyHourNeeded={student.dailyHourNeeded} dailyLogs={student.dailyLogs}></TableDailyHour>
            </div>
        </div>
    </>);
}

export default AdminDashboardStudentPresentPage;
