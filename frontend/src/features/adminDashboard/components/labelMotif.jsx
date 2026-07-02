import React, { useEffect, useState } from "react";

// Obtain the variables from the props of the component:
// - studentPresence        --> 0 if present, 1 if absent
// - studentReason          --> Reason for absence
const LabelMotif = ({
    studentPresence = 0,
    studentReason = ""
}) => {

    return (<>
        <div className="flex flex-col md:w-full w-1/2 md:w-1/6 md:max-w-1/6 mx-5 h-30">
            <div className="">Motif</div>
            <div className="bg-gray-300 border-1 border-black-300 h-full max-h-30 p-2 flex text-center items-center">{studentPresence === 1 && studentReason !== "" ? studentReason : ""}</div>
        </div>
    </>);
}

export default LabelMotif;

