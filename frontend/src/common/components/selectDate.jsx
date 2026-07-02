import React, { useEffect, useState } from "react";

// Obtain the variables from the props of the component:
// - stringDate     --> date in text format (Example: Lundi 1 janvier 2026)
// - decrementDate  --> function to decrement the date (need to put the function itself in the parent component and pass it as a prop to this component)
// - incrementDate  --> function to increment the date (need to put the function itself in the parent component and pass it as a prop to this component)
const SelectDate = ({
    stringDate = "date du jour",
    decrementDate,
    incrementDate
}) => {

    return (<>
        <div className="flex flex-row items-start my-5 md:my-0">
            <button className="text-2xl pl-3 pr-3 mr-1 bg-gray-300" onClick={decrementDate}>◁</button>
            <div className="text-2xl pl-3 pr-3 bg-gray-300">{stringDate}</div>
            <button className="text-2xl pl-3 pr-3 ml-1 bg-gray-300" onClick={incrementDate}>▷</button>
        </div>
    </>);
}

export default SelectDate;

