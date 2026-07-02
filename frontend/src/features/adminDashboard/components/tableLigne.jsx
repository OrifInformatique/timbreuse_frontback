import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@orif-informatique/react-components-library";

// Obtain the variables from the props of the component:
// - id         --> id of the user
// - surname    --> last name of the user
// - name       --> first name of the user
// - presence   --> whether the user is present or not ('0' for present, '1' for absent)
// - reason     --> The reason if the user is absent (used if the user is absent and the field is not empty)

// Rename to PresenceTableLine
const TableLigne = ({
    id = 0,
    surname = "nom",
    name = "prénom",
    presence = 0,
    reason = ""
}) => {

    let content;
    let edit = <><Icon name="meatballs" size="8"></Icon></>

    if (presence === 0) {
        content = <>
            <Icon color="primary" name="check" size="8"></Icon>
        </>
    } else if (presence === 1 && reason === "") {
        content = <>
            <Icon color="danger" name="cross" size="8"></Icon>
        </>
    } else if (presence === 1 && reason !== "") {
        content = <>
            <Icon color="primary" name="history" size="8"></Icon>
        </>
    }

    return (<>

        {/*<td className="flex flex-row">*/}
            <td className="py-4 font-bold text-lg">
                {content}
            </td>
            <td className="py-4 font-bold text-lg">
                {name} {surname}
            </td>
            <td className="p-4 text-right">
                <Link to={`/admin-dashboard-student/${id}`} className="p-4 text-right">
                    {edit}
                </Link>
            </td>
        {/*</td>*/}
    </>);
}

export default TableLigne;

