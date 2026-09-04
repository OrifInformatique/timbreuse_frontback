import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const AdminDashboardDaily = ({ logsData }) => {

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

  const nom = data.surname;
  const prenom = data.name;
  const listStudent = data.listStudent;
  const days = data.date;
  
  const readingDate = new Date(days).toLocaleDateString("ch-CH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });


  return (<>
  
    <div className="flex flex-row justify-center my-10 items-center">
        <p className="font-bold text-3xl mr-10">{prenom} {nom}</p>
        <div className="flex flex-row items-start">
            <div className="text-2xl pl-3 pr-3 mr-1 bg-gray-300">◁</div>
            <div className="text-2xl pl-3 pr-3 bg-gray-300">{readingDate}</div>
            <div className="text-2xl pl-3 pr-3 ml-1 bg-gray-300">▷</div>
        </div>
        <button className="p-3 ml-10 bg-gray-300 rounded-4xl border-2 border-gray-400" onClick={() => navigate("/admin-dashboard")}>voir les bénéficiaires</button>
    </div>

    <div className="flex flex-row justify-center mb-20 pt-10">
        <div className="flex flex-col w-full max-w-1/6 min-w-3xs mx-5">
            <div className="py-2 font-bold text-xl text-blue-600">Bénéficiaires présents</div>
            <table className="flex flex-row justify-center bg-gray-300 border border-gray-400">
                <tbody className="">
                    {listStudent.map((student) =>(
                        <tr
                            key={student.id}
                        >
                            <div className="flex flex-row">
                                <td className={student.presence === 0 ? "py-4 font-bold text-lg" : ""}>
                                    {student.presence === 0 ? "✅" + student.name + " " + student.surname : ""}
                                </td>
                                <Link to={`/admin-dashboard-student/${student.id}`} className={student.presence === 0 ? "p-4 text-right" : ""}>
                                    {student.presence === 0 ? <a>🪪</a> : ""}
                                </Link>
                            </div>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="flex flex-col w-full max-w-1/6 min-w-3xs mx-5">
            <div className="py-2 font-bold text-xl text-blue-600">Bénéficiaires absents</div>
            <table className="flex flex-row justify-center bg-gray-300 border border-gray-400">
                <tbody>
                    {listStudent.map((student) =>(
                        <tr
                            key={student.id}
                        >
                            <div className="flex flex-row">
                                <td className={student.presence === 1 && student.reason === "" ? "py-4 font-bold text-lg" : ""}>
                                    {student.presence === 1 && student.reason === "" ? "‼️" + student.name + " " + student.surname : ""}
                                </td>
                                <Link to={`/admin-dashboard-student/${student.id}`} className={student.presence === 1 && student.reason === "" ? "p-4 text-right" : ""}>
                                        {student.presence === 1 && student.reason === "" ? <a>🪪</a> : ""}
                                </Link>
                            </div>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="flex flex-col w-full max-w-1/6 min-w-3xs mx-5">
            <div className="py-2 font-bold text-xl text-blue-600">Bénéficiaires excusés</div>
            <table className="flex flex-row justify-center bg-gray-300 border border-gray-400">
                <tbody>
                    {listStudent.map((student) =>(
                        <tr
                            key={student.id}
                        >
                            <div className="flex flex-row">
                                <td className={student.presence === 1 && student.reason !== "" ? "py-4 font-bold text-lg" : ""}>
                                    {student.presence === 1 && student.reason !== "" ? "⚠️" + student.name + " " + student.surname : ""}
                                </td>
                                <Link to={`/admin-dashboard-student/${student.id}`} className={student.presence === 1 && student.reason !== "" ? "p-4 text-right" : ""}>
                                        {student.presence === 1 && student.reason !== "" ? <a>🪪</a> : ""}
                                </Link>
                            </div>                           
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
      
  </>);
}

export default AdminDashboardDaily;
