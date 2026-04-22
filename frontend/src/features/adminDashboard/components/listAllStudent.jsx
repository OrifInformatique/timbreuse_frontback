import React, { useEffect, useState } from "react";
import TableLigneResumeLog from "./tableLigneResumeLog";

// Récupère la variable nécessaire
// - listStudent    --> Liste des étudiants
const ListAllStudent = ({
    listStudent = []
}) => {

    return (<>
        <table className="py-3 border sm:min-w-2xl max-w-4xl">
            <tbody className="divide-y-1 divide-gray-500">
                {listStudent.map((student) => (
                    <tr
                        key={student.id}
                        className={"bg-gray-200"}
                    >
                        {/*Composant qui représente une ligne de la liste*/}
                        <TableLigneResumeLog id={student.id} surname={student.surname} name={student.name} errorFound={student.errorFound} workTime={student.workTime}></TableLigneResumeLog>
                    </tr>
                ))}
            </tbody>
        </table>
    </>);
}

export default ListAllStudent;

