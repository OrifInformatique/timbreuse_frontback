import React, { use, useEffect, useState } from "react";
import Title from "/src/common/components/title";
import TableHourWeek from "./tableHourWeek";
import { Button } from "@orif-informatique/react-components-library";

const PlanningComponent = ({
    id = 1,
    name = "prénom",
    surname = "nom",
    titlePlanning = "Planning",
    startingDatePlanning = "",
    endingDatePlanning = "",
    dataPlanning = null
}) => {

    const formatDate = (date) => {
        if (!date) return "";
        const [jour, mois, annee] = date.split(".");
    
        return `${annee}-${mois}-${jour}`;
    };
    
    const FULL_TIME_MINUTES = 41 * 60; // 41 hours in minutes
    const [dateDebut, setDateDebut] = useState(formatDate(startingDatePlanning));
    const [dateFin, setDateFin] = useState(formatDate(endingDatePlanning));
    const [titrePlanning, setTitrePlanning] = useState(titlePlanning);
    const [days, setDays] = useState(dataPlanning?.days || []);


    useEffect(() => {
        setDateDebut(formatDate(startingDatePlanning));
    }, [startingDatePlanning]);

    useEffect(() => {
        setDateFin(formatDate(endingDatePlanning));
    }, [endingDatePlanning]);

    useEffect(() => {
        setTitrePlanning(titlePlanning);
    }, [titlePlanning]);

    useEffect(() => {
        setDays(dataPlanning?.days || []);
    }, [dataPlanning]);


    const convertTimeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const calculateTotalMinutes = (days) => {
        return days.reduce((total, { workTime }) => {
            return total + convertTimeToMinutes(workTime);
        }, 0);
    };

    const calculatePresenceRate = (days) => {
        const totalMinutes = calculateTotalMinutes(days);
        return ((totalMinutes / FULL_TIME_MINUTES) * 100).toFixed(0);
    };

    const tauxPresence = calculatePresenceRate(days);

    const modifierJour = (index, champ, valeur) => {
        setDays((prevDays) =>
            prevDays.map((jour, i) =>
                i === index
                    ? { ...jour, [champ]: valeur }
                    : jour
            )
        );
    };

    return (<>
        <Title titre={`Planning hebdomadaire ${name} ${surname}`} />

        <div className="flex flex-row items-center justify-start mt-10 w-full max-w-3xl">
            <div className="basis-1/5 text-center">Valable du </div>
            <input type="date" className="border-2 border-gray-300 basis-1/4" value={dateDebut} max={dateFin} onChange={(e) => setDateDebut(e.target.value)} />
            <div className="basis-1/6 text-center">au </div>
            <input type="date" className="border-2 border-gray-300 basis-1/4" value={dateFin !== "" ? dateFin : ""} min={dateDebut} onChange={(e) => setDateFin(e.target.value)} />
        </div>

        <div className="flex flex-row items-center justify-start mt-5 w-full max-w-3xl">
            <div className="basis-1/5 text-center">Titre du planning</div>
            <input type="text" className="border-2 border-gray-300 basis-2/3" value={titrePlanning} onChange={(e) => setTitrePlanning(e.target.value)} />
        </div>

        <TableHourWeek data={days} modifierJour={modifierJour} />

        <div className="flex flex-row mt-10 items-center w-full max-w-3xl">
            <div className="basis-1/5 text-center">Taux</div>
            <input type="text" disabled className="border-2 border-gray-300 basis-1/4" value={`${tauxPresence} %`} />
            <Button className="p-3 m-3" variant="secondary" label="Annuler" onClick={() => console.log("Annuler")} />
            <Button className="p-3" variant="primary" label="Valider" onClick={() => titrePlanning !== "" ? console.log("Valider") : console.log("Planning incorrect")} />
        </div>

    </>);


};
    

export default PlanningComponent;



