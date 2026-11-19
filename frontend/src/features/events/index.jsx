import React, { useEffect, useState, useMemo } from "react";
import { Title, SingleSelect, Button, List, Icon } from "@orif-informatique/react-components-library";
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

        // Get the user selected than is in this group
        //const groupUsers = dataUsers.filter(user => (user.userGroupIds || []).some(id => groupIds.has(id)));

        //const groupUserIds = new Set(groupUsers.map(user => user.id));

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
            items={listItems}
        />
    </>);
}

export default Events;










