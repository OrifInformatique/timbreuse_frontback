import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const AdminDashboardStudentPresentPage = ({ logsData }) => {

  const navigate = useNavigate();
  const [data, setData] = useState(logsData || null);

  useEffect(() => {
    if (!logsData) {
      fetch('/data/mock-data-admin.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erreur JSON :", err));
    }
  }, [logsData]);  

  if (!data) return <div>Chargement...</div>;

  const { id } = useParams();

  const student = data.listStudent.find(
    (s) => s.id === Number(id)
  );

  if (!student) return <div>Bénéficiaire introuvable</div>

  return (<>
  
    <div className="flex flex-row justify-center my-10 items-center">
        <p className="font-bold text-3xl mr-10">Présence : {student.name} {student.surname}</p>
    </div>    

    <div className="flex justify-between my-20 py-20">
        <div className="flex flex-row w-1/4 h-30 justify-center p-3 border border-black-400">
            <div className={
                student.presence === 0 ? "flex text-green-500 text-2xl font-bold items-center" : 
                    student.presence === 1 && student.reason === "" ? "flex text-red-500 text-2xl font-bold items-center" :
                        student.presence === 1 && student.reason !== "" ? "flex text-orange-500 text-2xl font-bold items-center" : ""}>
                
                {student.presence === 0 ? "✅ Présent" : 
                    student.presence === 1 && student.reason === "" ? "‼️ Absent" :
                        student.presence === 1 && student.reason !== "" ? "👍 Excusé" : ""}
            </div>
        </div>
        <div className="flex">
            <table className="w-full">
                <tbody className="divide-y-1 divide-black-400">
                    <tr>
                        <th scope="row" className="text-left px-3">Temps exigé du jour</th>
                        <td className="text-right px-3">08:12</td>
                    </tr>
                    <tr>
                        <th scope="row" className="text-left px-3">Temps de travail</th>
                        <td className="text-right px-3">00:00</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="flex flex-col w-full max-w-1/3">
            <div className="">Motif</div>
            <div className="bg-gray-300 border-1 border-black-300 h-full max-h-30 p-2">{student.presence === 1 && student.reason !== "" ? student.reason : ""}</div>
        </div>
    </div>

  </>);
}

export default AdminDashboardStudentPresentPage;
