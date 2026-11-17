import React, { useEffect, useState } from "react";
import { Title, SingleSelect, Button, List, Icon } from "@orif-informatique/react-components-library";
import SelectDate from "./components/selectDate";
import { 
    getEventDataUserGroup, 
    getEventDataUsers,
    getEventDataUser, 
    getEventType, 
    getEventSeries, 
    getEventData 
} from "/src/common/services/dataService";


const Events = () => {

    const [dataEvent, setDataEvent] = useState(null);
    const [usersSelect, setUsersSelect] = useState([]);
    const [dataEventGroupUser, setDataEventGroupUser] = useState(null);
    const [dataEventType, setDataEventType] = useState(null);
    const [dataEventSeries, setDataEventSeries] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadDataEvent() {
            try {
                const result = await getEventData();
                setDataEvent(result);
                setError(null);
            } catch(err) {
                setDataEvent(null);
                setError(err);
            }
        }
        loadDataEvent();
    }, []);

    // Loading for the users
    useEffect(() => {
        getEventDataUsers()
            .then(
                data => {
                    setUsersSelect(
                        data.map(user => ({
                            label: user.firstName + " " + user.lastName,
                            value: user.id
                        }))
                    );
                }
            )
        .catch(error => console.error(error));
    }, []);


    return (<>
    
        <Title>Planning d'événements</Title>

        <div className="flex flex-row gap-5 my-5">
            <div className="basis-1/3">
                <SingleSelect name="userGroup" placeholder="Groupe" />
            </div>
            <div className="basis-1/3">
                <SingleSelect 
                    name="user" 
                    placeholder="Utilisateur" 
                    options={usersSelect}
                />
            </div>
        </div>

        
        <div className="flex flex-row gap-5 my-5 bg-blue-300 p-4 my-5 rounded-lg max-w-md justify-center">
            <Button variant="tertiary" label="Jour" />
            <Button variant="tertiary" label="Semaine" />
            <Button variant="tertiary" label="Mois" />
            <Button variant="tertiary" label="Année" />
        </div>

        <SelectDate dateMode="day" dateString="11.11.2026" funcArrowLeft={null} funcArrowRight={null} />

        <Button variant="primary" label="Nouvel événement" icon="plus" className="my-5"/>

        <List
            actions ={{
                delete: {
                    onclick: function lY() {},
                    label: <Icon name="trash" size="small" />
                },
                edit: {
                    onclick: function lY() {},
                    label: <Icon name="edit" size="small" />
                }
            }}
            actionsLabel=""
            columns={[
                'date',
                'hour',
                'repeat',
                'eventType',
                'user'
            ]}
            columnsLabels={{
                date: 'Date',
                hour: 'Heure',
                repeat: 'Répétition',
                eventType: 'Type d\'événement',
                user: 'Utilisateur'
            }}
            items={[
                {
                    date: "11.11.2026",
                    hour: "10:00 - 11:00",
                    repeat: "",
                    eventType: "Rendez-vous",
                    user: "Utilisateur N°1"
                }
            ]}
        />

    </>);
}

export default Events;










