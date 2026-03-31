import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAdminData } from "./services/dataService";
import TableLigne from "./components/tableLigne";
import Title from "./components/title";

const AdminDashboardDaily = () => {
    const navigate = useNavigate();
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
    const days = data.date;
  
    const readingDate = new Date(days).toLocaleDateString("ch-CH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });


    return (<>
    
        <div className="flex flex-col md:flex-row justify-items-center md:justify-center md:min-w-4xl my-10 items-center">
            
            {/*Nom du responsable (administrateur)*/}
            <Title titre={prenom + " " + nom}></Title>
            {/*<p className="font-bold text-3xl mb-5 md:mb-0 md:mr-10">{prenom} {nom}</p>*/}
            
            {/*Balise qui affiche le jour sélectionné (la navigation entre les jour n'est pas encore implémenté)*/}
            <div className="flex flex-row items-start my-5 md:my-0">
                <div className="text-2xl pl-3 pr-3 mr-1 bg-gray-300">◁</div>
                <div className="text-2xl pl-3 pr-3 bg-gray-300">{readingDate}</div>
                <div className="text-2xl pl-3 pr-3 ml-1 bg-gray-300">▷</div>
            </div>

            {/*Bouton qui permet de naviguer à la page qui contient la liste des bénéficiaires*/}
            <button className="p-3 md:ml-10 bg-gray-300 rounded-4xl border-2 border-gray-400" onClick={() => navigate("/admin-dashboard")}>voir les bénéficiaires</button>
        </div>

        <div className="flex flex-col md:flex-row justify-center py-10 items-center md:items-stretch">

            {/*Cette balise représente la colonne des bénéficiaires présents*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <div className="py-2 font-bold text-xl text-blue-600 text-center md:text-left">Bénéficiaires présents</div>
                <table className="flex flex-row justify-center bg-gray-300 border border-gray-400">
                    <tbody className="">
                        {listStudent.map((student) =>(
                            <tr
                                key={student.id}
                            >
                                {student.presence === 0 ? 
                                        <TableLigne id={student.id} surname={student.surname} name={student.name} presence={student.presence} reason={student.reason}></TableLigne>
                                    : ""
                                }
                                {/*
                                J'ai laisser le code qui à été remplacé par le composant
                                
                                <div className="flex flex-row">
                                    <td className={student.presence === 0 ? "py-4 font-bold text-lg" : ""}>
                                        {student.presence === 0 ? "✅" + student.name + " " + student.surname : ""}
                                    </td>
                                    <Link to={`/admin-dashboard-student/${student.id}`} className={student.presence === 0 ? "p-4 text-right" : ""}>
                                        {student.presence === 0 ? <a>🪪</a> : ""}
                                    </Link>
                                </div>
                                */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*Cette balise représente la colonne des bénéficiaires absents*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <div className="py-2 font-bold text-xl text-blue-600 text-center md:text-left">Bénéficiaires absents</div>
                <table className="flex flex-row justify-center bg-gray-300 border border-gray-400">
                    <tbody>
                        {listStudent.map((student) =>(
                            <tr
                                key={student.id}
                            >
                                {student.presence === 1 && student.reason === "" ? 
                                        <TableLigne id={student.id} surname={student.surname} name={student.name} presence={student.presence} reason={student.reason}></TableLigne>
                                    : ""
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*Cette balise représente la colonne des bénéficiaires excusés*/}
            <div className="flex flex-col w-full w-1/6 max-w-3xs min-w-3xs mx-5">
                <div className="py-2 font-bold text-xl text-blue-600 text-center md:text-left">Bénéficiaires excusés</div>
                <table className="flex flex-row justify-center bg-gray-300 border border-gray-400">
                    <tbody>
                        {listStudent.map((student) =>(
                            <tr
                                key={student.id}
                            >
                                {student.presence === 1 && student.reason !== "" ? 
                                        <TableLigne id={student.id} surname={student.surname} name={student.name} presence={student.presence} reason={student.reason}></TableLigne>
                                    : ""
                                }                          
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
    </>);
}

export default AdminDashboardDaily;
