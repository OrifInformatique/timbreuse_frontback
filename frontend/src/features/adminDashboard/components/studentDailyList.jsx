import React, { useEffect, useState } from "react";
import TableLigne from "./tableLigne";

// Récupère la variable nécessaire
// - titleList      --> Titre de la liste
// - listStudent    --> Liste des étudiants
// - typeList       --> Le type de liyte (0 pour présent, 1 pour absent, 2 pour excusé)
const StudentDailyList = ({
    titleList = "Nom de la liste",
    listStudent = [],
    typeList = 0
}) => {

    return (<>
        <div className="py-2 font-bold text-xl text-blue-600 text-center md:text-left">{titleList}</div>
        <table className="flex flex-row justify-center bg-gray-300 border border-gray-400">
            <tbody className="">
                {listStudent.map((student) =>(
                    <tr
                        key={student.id}
                    >
                        {typeList === 0 ?
                            student.presence === 0 ? 
                                <TableLigne id={student.id} surname={student.surname} name={student.name} presence={student.presence} reason={student.reason}></TableLigne>
                            : ""
                        
                        : typeList === 1 ?
                            student.presence === 1 && student.reason === "" ? 
                                <TableLigne id={student.id} surname={student.surname} name={student.name} presence={student.presence} reason={student.reason}></TableLigne>
                            : ""
                        
                        : typeList === 2 ?
                            student.presence === 1 && student.reason !== "" ? 
                                <TableLigne id={student.id} surname={student.surname} name={student.name} presence={student.presence} reason={student.reason}></TableLigne>
                            : ""
                        
                        : ""}
                    </tr>
                ))}
            </tbody>
        </table>
    </>);
}

export default StudentDailyList;

