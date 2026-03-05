import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const TableLigneResumeLog = ({
    id = 0,
    surname = "nom",
    name = "prénom",
    errorFound = 0,
    workTime = ""
}) => {

    return (<>
        <td className="p-2">
            {errorFound === 0 ? "✅" : "⚠️"}
        </td>
        <td className="p-2 font-bold text-center">
            {name} {surname}
        </td>
        <td className={workTime.startsWith("+") ? "p-2 text-green-500" : "p-2 text-red-500"}>
            {workTime}
        </td>
        <td>
            <Link to={`/admin-dashboard-student-error/${id}`}>
                ✏️
            </Link>
        </td>
    </>);
}

export default TableLigneResumeLog;

