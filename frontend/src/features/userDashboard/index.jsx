import React, { useEffect, useState } from "react";

import { 
  Button
} from "@orif-informatique/react-components-library";

const UserDashboard = ({ logsData }) => {

  const [data, setData] = useState(logsData || null);
  const [whenNewLogButtonClick, setWhenNewLogButtonClick] = useState(false);

  useEffect(() => {
    if (!logsData) {
      fetch('/data/mock-data.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erreur JSON :", err));
    }
  }, [logsData]);  

  if (!data) return <div>Chargement...</div>;

  const nom = data.surname;
  const prenom = data.name;
  const days = data.days[0];
  const logs = days.logs;

  //Doit être indiquée en millisecondes
  const pauseGiven = 1800000;
  const workTimeNeeded = 29520000;

  const workTimeFinish = workTime(logs) + pauseGiven;
  const balance = formatDuration((workTime(logs) + pauseGiven) - workTimeNeeded);

  const readingDate = new Date(days.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

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


  return (<>
      <nav>
        <ol className="flex justify-center padding-left bg-gray-300">
          <li><div className="p-3 text-blue-500 pl-15 pr-15">Timbrage</div></li>
          <li><div className="p-3 text-blue-500 pl-15 pr-15">Planning</div></li>
          <li><div className="p-3 text-blue-500 pl-15 pr-15">Événements</div></li>
          <li><div className="p-3 text-blue-500 pl-15 pr-15">Groupes</div></li>
        </ol>
      </nav>

      
      <div className="flex flex-row justify-center my-10 items-center">
        <p className="font-bold text-3xl mr-10">{nom} {prenom}</p>
        <div className="flex flex-row items-start">
          <div className="text-2xl pl-3 pr-3 mr-1 bg-gray-300">◁</div>
          <div className="text-2xl pl-3 pr-3 bg-gray-300">{readingDate}</div>
          <div className="text-2xl pl-3 pr-3 ml-1 bg-gray-300">▷</div>
        </div>
        <nav className="ml-3">
          <ol className="flex flex-row justify-center text-center">
            <li className="py-3 px-5 m-3 border-2 border-gray-400 bg-gray-300 rounded-4xl"><div>Me 29.10 <br />+00:15</div></li>
            <li className="py-3 px-5 m-3 border-2 border-orange-400 bg-orange-300 rounded-4xl"><div>Je 30.10 <br />⁉️</div></li>
            <li className="py-3 px-5 m-3 border-2 border-gray-400 bg-gray-300 rounded-4xl"><div>Ve 31.10 <br />Today</div></li>
          </ol>
        </nav>
      </div>
      <div className="ml-10">
        <div className="flex">
          <table className="w-2/3 max-w-300 border-collapse divide-y-2">
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
          <div className="flex w-1/3 m-4 p-4 bg-gray-300 border">
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
