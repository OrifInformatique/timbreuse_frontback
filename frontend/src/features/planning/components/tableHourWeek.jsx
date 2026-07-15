import React, { useEffect, useState } from "react";

export default function TableHourWeek({
  data = [],
  modifierJour
}) {

  const modifierValeur = (index, champ, valeur) => {
    modifierJour(index, champ, valeur);
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div></div>

        {data.map((jour) => (
          <div
            key={jour.day}
            className="text-center font-semibold"
          >
            {jour.day}
          </div>
        ))}

        {/* Temps de travail */}
        <div className="text-right font-medium">
          Temps de travail
        </div>
        
        {data.map((jour, index) => (
          <input
            key={jour.day + "-travail"}
            type="time"
            step="60"
            value={jour.workTime}
            onChange={(e) =>
              modifierValeur(index, "workTime", e.target.value)
            }
            className="border border-gray-300 rounded px-2 py-1"
          />
        ))}

        {/* Pause */}
        <div className="text-right font-medium">
          Pause offerte
        </div>

        {data.map((jour, index) => (
          <input
            key={jour.day + "-pause"}
            type="time"
            step="60"
            value={jour.breakTime}
            onChange={(e) =>
              modifierValeur(index, "breakTime", e.target.value)
            }
            className="border border-gray-300 rounded px-2 py-1"
          />
        ))}
      </div>

      {/* Pour voir les données    
      <div className="mt-8">
        <h2 className="font-bold mb-2">Planning :</h2>

        <pre className="bg-gray-100 p-3 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
 */} 
    </div>
  );
}

