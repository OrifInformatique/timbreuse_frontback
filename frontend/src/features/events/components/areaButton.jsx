import React, { useState, useEffect } from "react";
import { Button } from "@orif-informatique/react-components-library";


const AreaButton = ({
    funcFilterDay = () => {},
    funcFilterWeek = () => {},
    funcFilterMonth = () => {},
    funcFilterYear = () => {}
}) => {

    return (<>
        
        <div className="flex flex-row gap-5 my-5 bg-blue-300 p-4 my-5 rounded-lg max-w-md justify-center">
            <Button variant="tertiary" label="Jour" onClick={funcFilterDay}/>
            <Button variant="tertiary" label="Semaine" onClick={funcFilterWeek}/>
            <Button variant="tertiary" label="Mois" onClick={funcFilterMonth}/>
            <Button variant="tertiary" label="Année" onClick={funcFilterYear}/>
        </div>

    </>);
}

export default AreaButton;


