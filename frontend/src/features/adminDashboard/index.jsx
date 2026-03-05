import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminData } from "./services/dataService";
import TableLigneResumeLog from "./components/tableLigneResumeLog";


const AdminDashboard = () => {

  const [data, setData] = useState(null);

    useEffect(() => {
        getAdminData().then(setData);
    }, []);

    if (!data) return <div>Chargement...</div>

  const nom = data.surname;
  const prenom = data.name;
  const listStudent = data.listStudent;


  return (<>
    <div className="flex flex-col">
      <h1 className="font-bold text-3xl">{nom} {prenom}</h1>
      <p className="font-bold text-2xl">Liste des bénéficiaires</p>
    </div>
    <div className="flex justify-center my-8 text-2xl">
      <table className="py-3 border min-w-2/5 max-w-1/2">
        <tbody className="divide-y-1 divide-gray-500">
          {listStudent.map((student) => (
            <tr
              key={student.id}
              className={"bg-gray-200"}
            >
              <TableLigneResumeLog id={student.id} surname={student.surname} name={student.name} errorFound={student.errorFound} workTime={student.workTime}></TableLigneResumeLog>

              {/*
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