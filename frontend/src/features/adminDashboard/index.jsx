import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminData } from "./services/dataService";
import TableLigneResumeLog from "./components/tableLigneResumeLog";
import Title from "./components/title";

const AdminDashboard = () => {

  const [data, setData] = useState(null);

  // Il va récupérer la variable data dans le json via le dataService.js
  useEffect(() => {
      getAdminData().then(setData);
  }, []);

  // Si data n'a aucune donnée, il n'affiche qu'un chargement
  if (!data) return <div>Chargement...</div>

  const nom = data.surname;
  const prenom = data.name;
  const listStudent = data.listStudent;


  return (<>

    {/*Titre de la page*/}
    <div className="flex flex-col">
      <Title titre={nom + " " + prenom}></Title>
      <p className="font-bold text-2xl">Liste des bénéficiaires</p>
    </div>

    <div className="flex justify-center my-8 text-2xl">

      {/*Tableau qui contiendra la liste de tous les bénéficiaires du responsable*/}
      <table className="py-3 border sm:min-w-2xl max-w-4xl">
        <tbody className="divide-y-1 divide-gray-500">
          {listStudent.map((student) => (
            <tr
              key={student.id}
              className={"bg-gray-200"}
            >
              {/*Composant qui représente une ligne de la liste*/}
              <TableLigneResumeLog id={student.id} surname={student.surname} name={student.name} errorFound={student.errorFound} workTime={student.workTime}></TableLigneResumeLog>

              {/*

              J'ai laisser le code qui à été remplacé par le composant

              <td className="p-2">
                {student.errorFound === 0 ? "✅" : "⚠️"}
              </td>
              <td className="p-2 font-bold text-center">
                {student.name} {student.surname}
              </td>
              <td className={student.workTime.startsWith("+") ? "p-2 text-green-500" : "p-2 text-red-500"}>
                {student.workTime}
              </td>
              <td>
                <Link to={`/admin-dashboard-student-error/${student.id}`}>
                  ✏️
                </Link>
              </td>
              */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>);
}

export default AdminDashboard;