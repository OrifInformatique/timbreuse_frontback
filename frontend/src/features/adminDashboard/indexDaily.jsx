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

    // Go searching the variable "selectedDateAdmin" in the local storage and paste the data in the constante dateDisplayed
    // He will repeat this method every time that dateDisplayed or idUser change
    useEffect(() => {
        localStorage.setItem("selectedDateAdmin", dateDisplayed);

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
            <div>No data found</div>
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
    
    // Update the constante dateDisplayed by adding a day within it
    function incrementDateDisplayed(stringDate) {
        setDateDisplayed(addOneDay(stringDate));
    }

    // Update the constante dateDisplayed by removing a day within it
    function decrementDateDisplayed(stringDate) {
        setDateDisplayed(removeOneDay(stringDate));
    }

    return (<>
    
        <div className="flex flex-col md:flex-row justify-items-center md:justify-center md:min-w-4xl my-10 items-center">
            
            {/*Name of the present user (administrator)*/}
            <Title titre={prenom + " " + nom}></Title>
            
            {/*Display the day chossen (the arrows will modify the date, updating the view)*/}
            <SelectDate stringDate={readingDate} decrementDate={() => decrementDateDisplayed(dateDisplayed)} incrementDate={() => incrementDateDisplayed(dateDisplayed)}></SelectDate>
            
            {/*Button that when click will navigate at the View that display the list of the students*/}
            <Button className="p-3 md:ml-10" variant="secondary" label="Voire les bénéficiaires" onClick={() => navigate("/admin-dashboard")}></Button>
        </div>

        <div className="flex flex-col md:flex-row justify-center py-10 items-center md:items-stretch">

            {/*this HTML tag represent the column of the students present*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <StudentDailyList titleList="Bénéficiaires présents" listStudent={listStudent} typeList={0}></StudentDailyList>
            </div>

            {/*this HTML tag represent the column of the students not here*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <StudentDailyList titleList="Bénéficiaires absents" listStudent={listStudent} typeList={1}></StudentDailyList>
            </div>

            {/*this HTML tag represent the column of the students plea*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <StudentDailyList titleList="Bénéficiaires excusés" listStudent={listStudent} typeList={2}></StudentDailyList>
            </div>
        </div>
        
    </>);
}

export default AdminDashboardDaily;