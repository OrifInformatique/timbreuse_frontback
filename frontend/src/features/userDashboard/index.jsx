import React, { useEffect, useState } from "react";
import { Button } from "@orif-informatique/react-components-library";
import SelectDate from "/src/common/components/selectDate";
import Title from "/src/common/components/title";
import InfoBubble from "./components/infoBubble";
import { getUserData } from "/src/common/services/dataService";
import { workTime, formatDuration, reformatDate, displayReformatedDateBubble } from "./utils/index.utils";

const UserDashboard = () => {

  const [userData, setUserData] = useState(null);
  const [idUser] = useState(() => {
    return Number(localStorage.getItem("idUser")) || 1});
  const [dateDisplayed, setDateDisplayed] = useState(() => {
    return localStorage.getItem("selectedDateUser") || "2026-01-21"});
  const [whenNewLogButtonClick, setWhenNewLogButtonClick] = useState(false);
  
  useEffect(() => {
    localStorage.setItem("selectedDateUser", dateDisplayed);

    async function loadDataUser() {
      try {
        const result = await getUserData(idUser, dateDisplayed);
        setUserData(result);
        console.log(result);
      } catch(err) {
        setUserData(null);
      }
    }
    loadDataUser();
  }, [dateDisplayed, idUser]); 

  if (!userData) return <div>Chargement...</div>;

  const nom = userData.surname;
  const prenom = userData.name;
  const date = userData.date;
  const logs = userData.logs;

  const pauseGiven = userData.pauseGiven;
  const workTimeNeeded = userData.workTimeNeeded;

  const workTimeFinish = workTime(logs) + pauseGiven;
  const balance = formatDuration((workTime(logs) + pauseGiven) - workTimeNeeded);

  const readingDate = new Date(date).toLocaleDateString("ch-CH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  /*
  function workTime(logs) {
    const duration = [];

    for (let i = 0; i < logs.length - 1; i++) {
      const startTime = logs[i];
      const endTime = logs[i+1];

      if (startTime.log_type === 1 && endTime.log_type === 0) {
        const start = new Date(startTime.time);
        const end = new Date(endTime.time);

        const diff = end-start;
        duration.push(diff);
      }
      console.log(duration);
    }
    return duration.reduce((acc, currentVal) => acc + currentVal, 0);
  }

  function formatDuration(time) {
    let isTimeNegative = false;

    if (time < 0) {
      time *= -1;
      isTimeNegative = true;
    }

    time /= 3600000;

    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    const HH = String(hours).padStart(2, "0");
    const MM = String(minutes).padStart(2, "0");

    if (isTimeNegative)
      return `-${HH}:${MM}`;  
    else
      return `${HH}:${MM}`;
  }

  const handleNewLog = () => {
    setWhenNewLogButtonClick(true);
  }

  function displayReformatedDateBubble(dateString) {
    const date = new Date(dateString).toLocaleDateString("ch-CH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric" 
    });

    const dayCut = date.slice(0, 2);
    const formatDateNumeric = reformatDate(new Date(date));
    const dateToDisplay = `${dayCut} ${formatDateNumeric}`;

    return dateToDisplay;
  }

  function reformatDate(dateToReform) {
    const month = String(dateToReform.getMonth() + 1).padStart(2, "0");
    const day = String(dateToReform.getDate()).padStart(2, "0");
    const dateFormated = `${day}.${month}`;
  
    return dateFormated;
  }
  */

  return (<>
      <nav>
        <ol className="flex justify-center padding-left bg-gray-300">
          <li><div className="p-3 text-blue-500 pl-15 pr-15">Timbrage</div></li>
          <li><div className="p-3 text-blue-500 pl-15 pr-15">Planning</div></li>
          <li><div className="p-3 text-blue-500 pl-15 pr-15">Événements</div></li>
          <li><div className="p-3 text-blue-500 pl-15 pr-15">Groupes</div></li>
        </ol>
      </nav>      

      <div className="flex flex-col lg:flex-row justify-items-center lg:justify-center lg:min-w-4xl my-10 items-center"> 
        <Title titre={prenom + " " + nom}></Title>
        <SelectDate stringDate={readingDate}></SelectDate>
        <nav className="ml-3">
          <ol className="flex flex-row justify-center text-center">
            <InfoBubble textDate={displayReformatedDateBubble("2026-01-19")} textTime="+00:15" state={1}></InfoBubble>
            <InfoBubble textDate={displayReformatedDateBubble("2026-01-20")} textTime="⁉️" state={2}></InfoBubble>
            <InfoBubble textDate={displayReformatedDateBubble("2026-01-21")} textTime="Today" state={1}></InfoBubble>
          </ol>
        </nav>            
      </div>      

      <div className="my-10 md:ml-10">
        <div className="flex flex-col md:flex-row justify-items-center">
          <table className="md:w-2/3 w-full max-w-300 border-collapse divide-y-2">
            <thead>
              <tr>
                <th scope="col" className="p-3 text-left">Entrée/Sortie</th>
                <th scope="col" className="p-3 text-left">Heure</th>
              </tr>
            </thead>
            <tbody className="divide-y-1 divide-gray-500">
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={index % 2 === 0 ? "bg-gray-300" : ""}
                >
                  <td className="py-2 pl-3">
                    {log.log_type === 1 ? "Entrée" : "Sortie"}               
                  </td>

                  <td className="py-2 pl-3">
                    {new Date(log.time).toLocaleTimeString("fr-CH", {
                      hour: "2-digit",
                      minute: "2-digit" 
                    })}
                  </td>

                  <td className="py-2 pl-3">✏️</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex md:w-1/3 w-2/3 m-4 p-4 bg-gray-300 border">
            <table className="w-full">
              <tbody>
                <tr>
                  <th scope="row" className="text-left">Temps de travail</th>
                  <td className="text-right">{formatDuration(workTime(logs))}</td>
                </tr>
                <tr>
                  <th scope="row" className="text-left border-b-2">Pauses offertes</th>
                  <td className="text-right border-b-2">+{formatDuration(pauseGiven)}</td>
                </tr>
                <tr>
                  <th scope="row" className="text-left pt-3">Temps total</th>
                  <td className="text-right pt-3">{formatDuration(workTimeFinish)}</td>
                </tr>
                <tr>
                  <th scope="row" className="text-left border-b-2">Temps exigé</th>
                  <td className="text-right border-b-2">-{formatDuration(workTimeNeeded)}</td>
                </tr>
                <tr>
                  <th scope="row" className="text-left pt-3">Balance</th>
                  <td className={workTimeFinish < workTimeNeeded ? "text-right text-red-600 pt-3" : "text-right text-green-500 pt-3"}>{balance}</td>
                </tr>           
              </tbody>
            </table>
          </div>
        </div>

        <div className="my-5">
          {!whenNewLogButtonClick ? (
            <Button label="Nouveau timbrage" onClick={handleNewLog}></Button>
          ) : (
            <div>
              <p className="font-bold text-2xl">Nouveau timbrage</p>

              <div className="my-5">heure : </div>
              <textarea className="bg-gray-300 resize-none max-h-10 justify-center field-sizing-content" rows="1"></textarea>

            </div>
          )}
          
        </div>
      </div>
  </>);
}

export default UserDashboard;
