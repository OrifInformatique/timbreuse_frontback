import React, { useEffect, useState } from "react";
import Title from "/src/common/components/title";
import TableHourWeek from "./tableHourWeek";

const PlanningComponent = ({
    id = 1,
    name = "prénom",
    surname = "nom",
    dataPlanning = []
}) => {

    return (<>
        <Title titre={`Planning hebdomadaire ${name} ${surname}`} />

        <div className="flex flex-row items-center justify-start mt-10 w-full max-w-3xl">
            <div className="basis-1/5 text-center">Valable du </div>
            <input type="date" className="border-2 border-gray-300 basis-1/4" />
            <div className="basis-1/6 text-center">au </div>
            <input type="date" className="border-2 border-gray-300 basis-1/4" />
        </div>


        <div className="flex flex-row items-center justify-start mt-5 w-full max-w-3xl">
            <div className="basis-1/5 text-center">Titre du planning</div>
            <input type="text" className="border-2 border-gray-300 basis-2/3" />
        </div>


        {/* If it's for create a new planning, then it's TableHourWeek without a parameter
        If it's for modify, then it's TableHourWeek with data */}

        <TableHourWeek data={dataPlanning?.days || []}/>
        {/* <TableHourWeek /> */}

    </>);


};
    

export default PlanningComponent;



