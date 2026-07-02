import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@orif-informatique/react-components-library";

// Obtain the variables from the props of the component:
// - id         --> id of the user
// - surname    --> surname of the user
// - name       --> name of the user
// - errorFound --> If an error was found on the user's profile ('0' for no error, '1' for an error) --> Provided by the backend
// - workTime   --> The user's balance
const TableLigneResumeLog = ({
    id = 0,
    surname = "nom",
    name = "prénom",
    errorFound = 0,
    workTime = ""
}) => {

    let icon;
    let editIcon = <><Icon color="black" name="edit" size="8"></Icon></>

    if (errorFound === 0) {
        icon = <><Icon color="primary" name="check" size="8"></Icon></>
    } else {
        icon = <><Icon color="danger" name="cross" size="8"></Icon></>
    }

    return (<>
        <td className="p-2">
            {icon}
        </td>
        <td className="p-2 font-bold text-center">
            {name} {surname}
        </td>
        <td className={workTime.startsWith("+") ? "p-2 text-green-500" : "p-2 text-red-500"}>
            {workTime}
        </td>
        <td>
            <Link to={`/admin-dashboard-student-error/${id}`}>
                {editIcon}
            </Link>
        </td>
    </>);
}

export default TableLigneResumeLog;

