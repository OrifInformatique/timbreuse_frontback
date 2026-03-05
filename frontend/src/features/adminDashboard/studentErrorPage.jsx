import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminData } from "./services/dataService";


const AdminDashboardStudentErrorPage = () => {

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  
      useEffect(() => {
          getAdminData().then(setData);
      }, []);
  
      if (!data) return <div>Chargement...</div>

  const { id } = useParams();
  const student = data.listStudent.find(
    (s) => s.id === Number(id)
  );

  if (!student) return <div>Bénéficiaire introuvable</div>

  return (<>
  
    <div className="flex flex-row justify-center my-10 items-center">
        <p className="font-bold text-3xl mr-10">Présence : {student.name} {student.surname}</p>
    </div>    

    <div className="flex justify-center w-full mt-20">
        <div className="flex flex-col text-2xl bg-gray-300 min-w-1/3 max-w-2/3 border border-gray-500">
            <div className="flex flex-row justify-between p-5">
                <div>{student.errorFound === 0 ? "✅" : "⚠️"}</div>
                <div className="flex flex-row">
                    <div className="mr-2">
                        Balance :    
                    </div> 
                    <div className={student.workTime.startsWith("+") ? "text-green-500" : "text-red-500"}>
                        {student.workTime}
                    </div>
                </div>
            </div>
            <div className="p-5">
                Anomalie : {student.whatError !== "" ? student.whatError : "-"}
            </div>
            <div className="p-5">
                Quand : {student.whenError ? 
                            new Date(student.whenError).toLocaleDateString("fr-CH", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }) : "-"}
            </div>
        </div>
    </div>

  </>);
}

export default AdminDashboardStudentErrorPage;
