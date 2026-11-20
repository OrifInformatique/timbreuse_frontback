import React, { useEffect, useState, useMemo } from "react";
import { 
    Title, 
    SingleSelect, 
    Button, 
    List, 
    Icon, 
    PopUp,
    InputRadio 
} from "@orif-informatique/react-components-library";
import SelectDate from "./components/selectDate";
import AreaButton from "./components/areaButton";
import { 
    getEventDataUserGroups, getEventDataUserGroup, 
    getEventDataUsers, getEventDataUser, 
    getEventTypes, getEventType, 
    getEventSeries, getEventSerie, 
    getEventData 
} from "/src/common/services/dataService";



/////////////////////////////
// FUNCTIONS OUSTIDE EVENT //
/////////////////////////////

////////
//    //
////////
function getGroupIds(groups, selectedId) {
    const ids = new Set();

    function addAllSubgroups(group) {
        ids.add(group.id);

        (group.subgroups || []).forEach(subgroup => {
            addAllSubgroups(subgroup);
        });
    }

    function findGroup(groupList) {
        for (const group of groupList) {
            if (group.id === selectedId) {
                addAllSubgroups(group);
                return true;
            }

            if (findGroup(group.subgroups || [])) {
                return true;
            }
        }

        return false;
    }

    findGroup(groups);

    return ids;
}

////////
//    //
////////
function getDateRange(dateString, mode) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month-1, day);

    let start = new Date(date);
    let end = new Date(date);

    switch (mode) {
        case "day":
            break;
        case "week": {
            const dayOfWeek = date.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

            start.setDate(date.getDate() + diff);

            end = new Date(start);
            end.setDate(start.getDate() + 4);
            break;
        }
        case "month":
            start = new Date(year, month-1, 1);
            end = new Date(year, month, 0);
            break;
        case "year":
            start = new Date(year, 0, 1);
            end = new Date(year, 11, 31);
            break;
    }

    const format = date => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");

        return `${y}-${m}-${d}`;
    }

    return {
        start: format(start),
        end: format(end)
    };
}

///////////////////////////////////////////////////
//  GET NAME OF USER_GROUP FROM GIVEN GROUPE_ID  //
///////////////////////////////////////////////////
function getGroupName(groups, groupId) {
    for (const group of groups) {
        if (group.id === groupId) {
            return group.name;
        }
        
        const found = getGroupName(
            group.subgroups || [],
            groupId
        );

        if (found) {
            return found;
        }
    }

    return null;
}


//////////////////////////////////
//  GET GROUP AND GROUP_PARENT  //
//////////////////////////////////
function getGroupAndParents(groups, selectedId) {
    function findPath(groupList, path = []) {
        for (const group of groupList) {
            const currentPath = [...path, group.id];

            if (group.id === selectedId) {
                return currentPath;
            }

            const found = findPath(
                group.subgroups || [],
                currentPath
            );

            if (found) return found;
        }

        return null;
    }

    return new Set(findPath(groups) || []);
}





/********************************************/
/*                  EVENTS                  */
/********************************************/

const Events = () => {

    // Display for the select
    const [selectUser, setSelectUser] = useState([]);
    const [selectUserGroup, setSelectUserGroup] = useState([]);

    // Display for the default select
    const [selectedGroup, setSelectedGroup] = useState(15);
    const [selectedUser, setSelectedUser] = useState(null);

    // Data 
    const [dataEvent, setDataEvent] = useState(null);               // Data of all the events
    const [dataEventSeries, setDataEventSeries] = useState(null);   // Data of all the events series
    const [dataEventTypes, setDataEventTypes] = useState([]);       // Data of all the types of event
    const [dataGroups, setDataGroups] = useState([]);               // Data of all the groups of user
    const [dataUsers, setDataUsers] = useState([]);                 // Data of all the profil of the users

    // For Error
    const [error, setError] = useState(null);

    // Can be "day" / "week" / "month" / "year"
    const [triggerButtonFilter, setTriggerButtonFilter] = useState("day");  

    // Date of today (or substitute date for dev)
    const [currentDate, setCurrentDate] = useState("2026-11-11");

    // Display of the type of popup     --> null / add / edit / delete
    const [popupDisplay, setPopupDisplay] = useState(null);


    // UseState for Popup
    // In the select, the ID of the button radio for the type of user (groups = 1 or users = 2)
    const [popupTypeUser, setPopupTypeUser] = useState(1);
    
    // In the field to indicate the strarting date of the event
    const [popupEventDate, setPopupEventDate] = useState("");
    
    // Int the two fields, value of the starting time and ending time
    const [popupStartTime, setPopupStartTime] = useState("");
    const [popupEndTime, setPopupEndTime] = useState("");
    
    // For the repeat, popupRepeat is for the yes/no radio button (1 = Yes / 2 = no)
    // popupDaysOfWeek is for save the days selected if there is a repeat
    // popupRepeatUntil is until when the repeatition is active
    const [repeatEvent, setRepeatEvent] = useState(null);
    const [repeatDays, setRepeatDays] = useState([]);
    const [repeatEndDate, setRepeatEndDate] = useState("");

    // For the handleSubmit oof the popup
    const [selectedTarget, setSelectedTarget] = useState("");
    const [selectedEventType, setSelectedEventType] = useState("");

    // Form if there is an error in the popup submit
    const [formErrors, setFormErrors] = useState({});


    // UseEffect for modify an event by popup
    // Event to edit
    const [eventToEdit, setEventToEdit] = useState(null);

    // Type of edit authorize --> null / single / all / future
    const [editMode, setEditMode] = useState(null);
    
    // Popup for update an event
    const [popupEditChoice, setPopupEditChoice] = useState(false);

    // edit / delete
    const [seriesAction, setSeriesAction] = useState(null);

    //////////////////
    //  USE_EFFECT  //
    //////////////////

    useEffect(() => {
        // Loading of all the events
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

        // Loading the data of all the profils of the users
        async function loadAllUsers() {
            try {
                const result = await getEventDataUsers();
                setDataUsers(result);
                setSelectUser([
                    { 
                        label: "— Aucun utilisateur —", value: "" 
                    },
                    ...result.map(user => ({
                        label: user.firstName + " " + user.lastName,
                        value: user.id
                    }))
                ]);
            } catch (err) {
                console.error(err);
            }
        }

        // Loading the data of all the profil of the groups
        async function loadAllGroupsUser() {
            try {
                const result = await getEventDataUserGroups();
                setDataGroups(result);
                const groups = [
                    {
                        label: "-- Aucun groupe --", value: ""
                    },
                    ...result.flatMap(group => [
                        {
                            label: group.name,
                            value: group.id                        
                        },
                        ...(group.subgroups || []).flatMap(subgroup => [
                            {
                                label: subgroup.name,
                                value: subgroup.id
                            },
                            ...(subgroup.subgroups || []).map(subsubgroup => ({
                                label: subsubgroup.name,
                                value: subsubgroup.id                                
                            }))
                        ])
                    ])
                ];    
                setSelectUserGroup(groups);
            } catch (err) {
                console.error(err);
            }
        }

        // Loading of all the data of the type of event
        async function loadEventTypes() {
            try {
                const result = await getEventTypes();
                setDataEventTypes(result);
            } catch (err) {
                console.error("Erorr during loading of the types : ", err);
            }
        }

        // Loading of all the data of the profil of every series of event
        async function loadEventSeries() {
            try {
                const result = await getEventSeries();
                setDataEventSeries(result);
            } catch (err) {
                console.log(err);
            }
        }

        loadDataEvent();
        loadAllUsers();
        loadAllGroupsUser();
        loadEventTypes();
        loadEventSeries();

    }, []);


    /////////////////////////////
    //  FUNCTIONS - VARIABLES  //
    /////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  RETURN THE LIST OF ALL THE USER BASE LINK BY THE ID OF THE GROUP (IF THERE'S A GROUPE SELECTED)       //
    //  UPDATE IF THE DATAS OF ALL THE USERS / GROUPS IS MODIFY, OR THAT THE ID OF THE GROUP SELECTED CHANGE  //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const filteredUserSelect = useMemo(() => {
        // If no group is selected, then display all user
        if (selectedGroup === null) {
            return [
                { 
                    label: "— Aucun utilisateur —", value: "" 
                },
                ...dataUsers.map(user => (
                    {
                        label: `${user.firstName} ${user.lastName}`,
                        value: user.id
                    }
                ))
            ];
        }

        // Get the ID of the selected group and his subgroups
        const groupIds = getGroupIds(dataGroups, selectedGroup);

        // Keep only the users than are in the group
        const filteredUsers = dataUsers.filter(user => (user.userGroupIds || []).length === 0 || user.userGroupIds.some(id => groupIds.has(id)));

        return [
            { 
                label: "— Aucun utilisateur —", value: "" 
            },
            ...filteredUsers.map(user => (
                {
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.id
                }
            ))
        ];        
    }, [dataUsers, dataGroups, selectedGroup])


    const filteredEvents = useMemo(() => {
        if (!dataEvent || !dataGroups.length) {
            return [];
        }

        // Get the group selected and his subgroups id the selected group is not empty
        const groupIds = selectedGroup !== null ? getGroupAndParents(dataGroups, selectedGroup) : new Set();

        const events = new Map();

        function addGroupEvent(event, groupId) {
            if (groupId == null || !groupIds.has(groupId)) {
                return;
            }
        
            const key = `group-${groupId}-${event.id}-${event.eventDate}`;

            events.set(key, {
                ...event,
                groupId,
                userId: null
            });
        }

        function addPersonalEvent(event) {
            if (selectedUser !== null && event.userId === selectedUser) {
                const key = `user-${event.userId}-${event.id}-${event.eventDate}`;

                events.set(key, {
                    ...event,
                    groupId: null
                });
            }
        }

        dataEvent.forEach(entry => {
            if (entry.userGroup) {
                entry.events.forEach(event => {
                    addGroupEvent(event, entry.userGroup.id);
                });
            }

            if (entry.user) {
                entry.events.forEach(event => {
                    if (event.userGroupId != null) {
                        addGroupEvent(event, event.userGroupId);
                    } else {
                        addPersonalEvent(event);
                    }
                });
            }
        });

        return Array.from(events.values());

    }, [dataEvent, dataGroups, selectedGroup, selectedUser]);


    const eventsByDate = useMemo(() => {
        const { start, end } = getDateRange(currentDate, triggerButtonFilter);

        return filteredEvents.filter(event => event.eventDate >= start && event.eventDate <= end)
            .sort((a, b) => a.eventDate.localeCompare(b.eventDate) || a.startTime.localeCompare(b.startTime));
    }, [filteredEvents, currentDate, triggerButtonFilter]);


    const listItems = eventsByDate.map(event => {
        const user = dataUsers.find(user => user.id === event.userId);

        return {
            id: event.id,
            event,
            date: event.eventDate.split("-").reverse().join("."),
            hour: `${event.startTime.slice(0, 5)} - ${event.endTime.slice(0, 5)}`,
            repeat: (() => {
                const serie = dataEventSeries.find(
                    serie => serie.id === event.EventSerieId
                );

                if (!serie) return "-";

                return `${translateDays(serie.daysOfWeek)} - ${formatDateRange(
                    serie.startDate,
                    serie.endDate
                )}`;
            })(),
            eventType: dataEventTypes.find(type => type.id === event.eventTypeId)?.name || "Type inconnu",
            user: user ? `${user.firstName} ${user.lastName}` : getGroupName(dataGroups, event.groupId) || "Groupe inconnu"
        };
    })

    function changeDate(direction) {
        const [year, month, day] = currentDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        switch (triggerButtonFilter) {
            case "day":
                date.setDate(date.getDate() + direction);
                break;

            case "week":
                date.setDate(date.getDate() + direction * 7);
                break;

            case "month":
                date.setMonth(date.getMonth() + direction);
                break;

            case "year":
                date.setFullYear(date.getFullYear() + direction);
                break;

            default:
                break;
        }

        const formatedDate = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");

        setCurrentDate(formatedDate);
    }

    function translateDays(daysOfWeek) {
        const days = {
            monday: "Lu",
            tuesday: "Ma",
            wednesday: "Me",
            thursday: "Je",
            friday: "Ve"
        };

        return daysOfWeek.map(day => days[day]).join(", ");
    }

    function formatDate(date) {
        return date.split("-").reverse().join(".");
    }
    
    function formatDateRange(startDate, endDate) {
        return `Du ${formatDate(startDate)} au ${formatDate(endDate)}`;
    }


    ///////////////////////
    //  HANDLER - POPUP  //
    ///////////////////////

    const handleClosePopup = () => {
        setPopupTypeUser(1);
        setPopupDisplay(null);
    }

    const selectOptions = popupTypeUser === 1 ? selectUserGroup : selectUser;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for errors
        const errors = {};

        const today = new Date();
        const todayString = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        const currentTime = [
            String(today.getHours()).padStart(2, "0"),
            String(today.getMinutes()).padStart(2, "0")
        ].join(":");

        // Check if there is a group/user selected
        if (!selectedTarget) {
            errors.target = "Veuillez sélectionner un groupe ou un utilisateur.";
        }

        // Check if there is a type of event
        if (!selectedEventType) {
            errors.eventType = "Veuillez sélectionner un type d'événement.";
        }

        // Check the date
        if (!popupEventDate) {
            errors.popupEventDate = "Veuillez sélectionner une date.";
        } else if (popupEventDate < todayString) {
            errors.popupEventDate = "La date ne peut pas être antérieure à aujourd'hui.";
        }        
        
        // Check if there is a starting hour and a ending hour
        if (!popupStartTime) {
            errors.popupStartTime = "Veuillez indiquer une heure de début.";
        }

        if (!popupEndTime) {
            errors.popupEndTime = "Veuillez indiquer une heure de fin.";
        }

        if (popupStartTime && popupEndTime) {
            if (popupEndTime <= popupStartTime) {
                errors.popupEndTime = "L'heure de fin doit être après l'heure de début.";
            }

            if (popupEventDate === todayString && popupStartTime <= currentTime) {
                errors.popupStartTime = "L'heure de début doit être ultérieure à l'heure actuelle.";
            }
        }

        // Check the repeat
        if (repeatEvent === null) {
            errors.repeatEvent = "Veuillez indiquer si l'événement doit être répété.";
        }

        if (repeatEvent === 1) {
            if (repeatDays.length === 0) {
                errors.repeatDays = "Veuillez sélectionner au moins un jour.";
            }

            if (!repeatEndDate) {
                errors.repeatEndDate = "Veuillez indiquer une date de fin.";
            } else if (popupEventDate && repeatEndDate < popupEventDate) {
                errors.repeatEndDate = "La date de fin doit être égale ou postérieure à la date de début.";
            }
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            console.log("Erreurs du formulaire :", errors);
            return;
        }

        const newEvent = {
            targetType: popupTypeUser === 1 ? "userGroup" : "user",
            targetId: selectedTarget,
            eventTypeId: selectedEventType,
            popupEventDate,
            popupStartTime,
            popupEndTime,
            repeat: repeatEvent === 1,
            daysOfWeek: repeatEvent === 1 ? repeatDays : [],
            repeatEndDate: repeatEvent === 1 ? repeatEndDate : null
        };

        console.log("Nouvel événement : ", newEvent);
        handleClosePopup();
    };


    const handleEditEvent = (event) => {
        setEventToEdit(event);

        // The event is in a serie
        const isRepeated = dataEventSeries?.some(
            serie => serie.id === event.EventSerieId
        );

        if (isRepeated) {
            setPopupEditChoice(true);
        
        } else {
            setEditMode("single");
            openEditPopup(event, "single");
        }
    }

    const openEditPopup = (event, mode) => {
        const serie = dataEventSeries?.find(
            (serie) => serie.id === event.EventSerieId
        );

        setEventToEdit(event);
        setEditMode(mode);

        // Type de cible : groupe ou utilisateur
        if (event.userId) {
            setPopupTypeUser(2);
            setSelectedTarget(event.userId);
        } else {
            setPopupTypeUser(1);
            setSelectedTarget(event.groupId);
        }

        setSelectedEventType(event.eventTypeId);

        // Informations de l'événement
        setSelectedEventType(String(event.eventTypeId));
        setPopupEventDate(event.eventDate);
        setPopupStartTime(event.startTime?.slice(0, 5) || "");
        setPopupEndTime(event.endTime?.slice(0, 5) || "");

        // Informations de répétition
        setRepeatEvent(serie ? 1 : 2);
        setRepeatDays(serie?.daysOfWeek || []);
        setRepeatEndDate(serie?.endDate || "");

        setPopupEditChoice(false);
        setPopupDisplay("edit");
    };

    const isEditing = popupDisplay === "edit";

    const isFullEdit = !isEditing || editMode === "all" || (editMode === "single" && !eventToEdit?.EventSerieId);

    const handleDeleteEvent = (event) => {
        setEventToEdit(event);

        const isRepeated = event.EventSerieId != null && dataEventSeries?.some(serie => serie.id === event.EventSerieId);

        if (isRepeated) {
            setSeriesAction("delete");
            setPopupEditChoice(true);
        } else {

            console.log("Suppression d'un événement :", {
                scope: "single",
                event: event
            });
        }
    };

    ////////////////
    //  FRONTEND  //
    ////////////////

    return (<>
    
        <Title>Planning d'événements</Title>

        <div className="flex flex-row gap-5 my-5">
            <div className="basis-1/3">
                <SingleSelect 
                    name="userGroup" 
                    placeholder="Groupe" 
                    options={selectUserGroup} 
                    value={selectedGroup ?? ""}
                    onChangeFunction={value => {
                        setSelectedGroup(value === "" ? null : Number(value));
                        setSelectedUser(null);
                    }}    
                />
            </div>
            <div className="basis-1/3">
                <SingleSelect 
                    name="user" 
                    placeholder="Utilisateur" 
                    options={filteredUserSelect} 
                    value={selectedUser ?? ""}
                    onChangeFunction={value => 
                        setSelectedUser(value === "" ? null : Number(value))
                    }    
                />
            </div>
        </div>
        
        <AreaButton 
            funcFilterDay={() => setTriggerButtonFilter("day")} 
            funcFilterWeek={() => setTriggerButtonFilter("week")} 
            funcFilterMonth={() => setTriggerButtonFilter("month")} 
            funcFilterYear={() => setTriggerButtonFilter("year")}
        />

        <SelectDate 
            dateMode={triggerButtonFilter} 
            dateString={currentDate} 
            funcArrowLeft={() => changeDate(-1)} 
            funcArrowRight={() => changeDate(1)} 
        />


        <Button 
            variant="primary" 
            label="Nouvel événement" 
            icon="plus" 
            className="my-5"
            onClick={() => setPopupDisplay("add")}
        />

        <List
            actions={{
                delete: {
                    onClick: (item) => handleDeleteEvent(item.event),
                    label: <Icon name="trash" size="small" />
                },
                edit: {
                    onClick: (item) => {
                        setSeriesAction("edit");
                        handleEditEvent(item.event);
                    },
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
            items={listItems}
        />


        {popupEditChoice && (
            <PopUp
                open={true}
                title={seriesAction === "delete" ? "Supprimer un événement" : "Modifier un événement"}
                onClose={() => setPopupEditChoice(false)}
            >
                <div className="flex flex-col gap-4">
                    <p>
                        Cet événement fait partie d'une série.
                        Sélectionner l'option souhaitée :
                    </p>

                    <Button
                        label={seriesAction === "delete" ? "Supprimer uniquement cet événement" : "Modifier uniquement cet événement"}
                        variant="primary"
                        onClick={() => {
                            if (seriesAction === "delete") {
                                console.log("Suppression :", {
                                    scope: "single",
                                    event: eventToEdit
                                });
                                setPopupEditChoice(false);
                            } else {
                                openEditPopup(eventToEdit, "single");
                            }
                        }}
                    />

                    <Button
                        label={seriesAction === "delete" ? "Supprimer toute la série" : "Modifier toute la série"}
                        variant="primary"
                        onClick={() => {
                            if (seriesAction === "delete") {
                                console.log("Suppression :", {
                                    scope: "all",
                                    event: eventToEdit,
                                    serieId: eventToEdit.EventSerieId
                                });
                                setPopupEditChoice(false);
                            } else {
                                openEditPopup(eventToEdit, "all");
                            }
                        }}
                    />

                    <Button
                        label={seriesAction === "delete" ? "Supprimer cet événement et les suivants" : "Modifier cet événement et les suivants"}
                        variant="primary"
                        onClick={() => {
                            if (seriesAction === "delete") {
                                console.log("Suppression :", {
                                    scope: "future",
                                    event: eventToEdit,
                                    serieId: eventToEdit.EventSerieId
                                });
                                setPopupEditChoice(false);
                            } else {
                                openEditPopup(eventToEdit, "future");
                            }
                        }}
                    />
                </div>
            </PopUp>
        )}



        {(popupDisplay === "add" || popupDisplay === "edit") && (
            <PopUp 
                open={true}
                title={popupDisplay === "add" ? "Nouvel événement" : "Modifier l'événement"}
                onClose={handleClosePopup}
            >
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-4">
                        <InputRadio 
                            key={`userType-${popupDisplay}-${popupTypeUser}`}
                            label="Type d'utilisateur"
                            name="Type"
                            options={[
                                { id: 1, label: "Groupe utilisateur", defaultChecked: popupTypeUser === 1 },
                                { id: 2, label: "Utilisateur", defaultChecked: popupTypeUser === 2 }
                            ]}  
                            value={popupTypeUser}
                            onChange={(value) => {
                                console.log("Val : ", value);
                                setPopupTypeUser(Number(value))
                            }} 
                            disabled={isEditing && !isFullEdit}
                        />                   
                        <div className="mb-4">
                            <SingleSelect 
                                key={`user-${popupDisplay}-${selectedTarget}`}
                                name="user"
                                placeholder={popupTypeUser === 1 ? "Sélectionner un groupe..." : "Sélectionner un utilisateur..."}
                                options={selectOptions}
                                defaultValue={selectedTarget}
                                onChangeFunction={(value) => setSelectedTarget(value)}
                                disabled={isEditing && !isFullEdit}
                            />
                            
                            {formErrors.target && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.target}</p>
                            )}
                        </div>
                    </div>    

                    <div className="mb-4">
                        <SingleSelect
                            key={`event-${popupDisplay}-${selectedEventType}`}
                            label="Type d'événement"
                            name="eventType"
                            placeholder="Sélectionner un type d'événement"
                            options={dataEventTypes.map(type => ({
                                label: type.name,
                                value: type.id
                            }))}
                            defaultValue={selectedEventType}
                            onChangeFunction={(value) => setSelectedEventType(value)}
                            disabled={isEditing && !isFullEdit}
                        />
                        
                        {formErrors.eventType && (
                            <p className="text-red-500 text-sm mt-1">
                                {formErrors.eventType}
                            </p>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="popupEventDate" className="block mb-2">
                            Date de début
                        </label>
                        <input
                            type="date"
                            id="popupEventDate"
                            name="popupEventDate"
                            value={popupEventDate}
                            onChange={(e) => setPopupEventDate(e.target.value)}
                            className="w-full border rounded p-1"
                            required
                            disabled={isEditing && editMode === "future"}
                        />
                    </div>           

                    <div className="flex mb-4 gap-4">
                        <div className="w-1/2">
                            <label htmlFor="popupStartTime" className="block mb-2">
                                Début
                            </label>
                            <input
                                type="time"
                                id="popupStartTime"
                                name="popupStartTime"
                                value={popupStartTime}
                                onChange={(e) => setPopupStartTime(e.target.value)}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="popupEndTime" className="block mb-2">
                                fin
                            </label>
                            <input
                                type="time"
                                id="popupEndTime"
                                name="popupEndTime"
                                value={popupEndTime}
                                onChange={(e) => setPopupEndTime(e.target.value)}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <InputRadio 
                            key={`repeat-${popupDisplay}-${repeatEvent}`}
                            label="Répéter cet événement ?"
                            name="repeatEvent"
                            options={[
                                { id: 1, label: "Oui", defaultChecked: repeatEvent === 1 },
                                { id: 2, label: "Non", defaultChecked: repeatEvent === 2  }
                            ]}
                            value={repeatEvent}
                            onChange={(value) => setRepeatEvent(Number(value))}
                            disabledAll={isEditing && !isFullEdit}
                        />

                        {repeatEvent === 1 && (
                            <div className="mb-4">
                                <label className="block mb-2">
                                    Jours de répétition
                                </label>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    {[
                                        { label: "Lu", value: "monday" },
                                        { label: "Ma", value: "tuesday" },
                                        { label: "Me", value: "wednesday" },
                                        { label: "Je", value: "thursday" },
                                        { label: "Ve", value: "friday" }
                                    ].map(day => (
                                        <label key={day.value} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={repeatDays.includes(day.value)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setRepeatDays([...repeatDays, day.value]);
                                                    } else {
                                                        setRepeatDays(
                                                            repeatDays.filter(d => d !== day.value)
                                                        );
                                                    }
                                                }}
                                                disabled={isEditing && !isFullEdit}
                                            />
                                            {day.label}
                                        </label>
                                    ))}
                                </div>

                                <label htmlFor="repeatEndDate" className="block mb-2">
                                    Fin de répétition
                                </label>

                                <input
                                    type="date"
                                    id="repeatEndDate"
                                    name="repeatEndDate"
                                    value={repeatEndDate}
                                    onChange={(e) => setRepeatEndDate(e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                    disabled={isEditing && !isFullEdit}
                                />              
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={handleClosePopup}>
                            Annuler
                        </button>

                        <button type="submit">
                            Ajouter
                        </button>
                    </div>
                </form>
            </PopUp>
        )}
    </>);
}

export default Events;










