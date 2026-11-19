import React, { useEffect, useState, useMemo } from "react";
import { Title, SingleSelect, Button, List, Icon } from "@orif-informatique/react-components-library";
import SelectDate from "./components/selectDate";
import AreaButton from "./components/areaButton";
import { 
    getEventDataUserGroups, getEventDataUserGroup, 
    getEventDataUsers, getEventDataUser, 
    getEventTypes, getEventType, 
    getEventSeries, 
    getEventData 
} from "/src/common/services/dataService";



/////////////////////////////
// FUNCTIONS OUSTIDE EVENT //
/////////////////////////////

/////////////////////////////
//                         //
/////////////////////////////
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

/////////////////////////////
//                         //
/////////////////////////////
function getDateRange(dateString, mode) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month-1, day);

    let start = new Date(date);
    let end = new Date(date);

    switch (mode) {
        case "day":
            break;
        case "week": {
            const dayOfWeek = date.getDate();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

            start.setDate(date.getDate() + diff);

            end = new Date(start);
            end.setDate(start.getDate() + 4);
            break;
        }
        case "month":
            start = new Date(year, 0, 1);
            end = new Date(year, 11, 31);
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

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

const Events = () => {

    // Display for the select
    const [usersSelect, setUsersSelect] = useState([]);
    const [userGroupSelect, setUserGroupSelect] = useState([]);

    // Display for the default select
    const [selectedGroup, setSelectedGroup] = useState(15);
    const [selectedUser, setSelectedUser] = useState(null);


    // All of the event
    const [dataEvent, setDataEvent] = useState(null);


    const [groupsData, setGroupsData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [currentDate, setCurrentDate] = useState("2026-11-11");


    // Can be "day" / "week" / "month" / "year"
    const [dataEventFilter, setDataEventFilter] = useState("day");
    const [error, setError] = useState(null);


    const [dataEventSeries, setDataEventSeries] = useState(null);


    const [listEventTypes, setListEventTypes] = useState([]);


    /////////////////////////////////////////
    /////////        UseEffect      /////////
    /////////////////////////////////////////

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
    
    useEffect(() => {
        // Loading for the users
        async function loadAllUsers() {
            try {
                const result = await getEventDataUsers();

                setUsersData(result);
                setUsersSelect([
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

        // Loading for the groups of users
        async function loadAllGroupsUser() {
            try {
                const result = await getEventDataUserGroups();

                setGroupsData(result);

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
                setUserGroupSelect(groups);
            
            } catch (err) {
                console.error(err);
            }
        }

        loadAllUsers();
        loadAllGroupsUser();
    }, []);

    useEffect(() => {
        async function loadEventTypes() {
            try {
                const result = await getEventTypes();
                setListEventTypes(result);

            } catch (err) {
                console.error("Erorr during loading of the types : ", err);
            }
        }

        loadEventTypes();
    }, []);


    /////////////////////////////
    //  FUNCTIONS - VARIABLES  //
    /////////////////////////////

    const filteredUserSelect = useMemo(() => {

        // If no group is selected, then display all user
        if (selectedGroup === null) {
            return [
                { label: "— Aucun utilisateur —", value: "" },
                ...usersData.map(user => ({
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.id
                }))
            ];
        }

        // Get the ID of the selected group and his subgroups
        const groupIds = getGroupIds(groupsData, selectedGroup);

        // Keep only the users than are in the group
        const filteredUsers = usersData.filter(user =>
            (user.userGroupIds || []).length === 0 ||
            user.userGroupIds.some(id => groupIds.has(id))
        );

        return [
            { label: "— Aucun utilisateur —", value: "" },
            ...filteredUsers.map(user => ({
                label: `${user.firstName} ${user.lastName}`,
                value: user.id
            }))
        ];        
    }, [usersData, groupsData, selectedGroup])


    const filteredEvents = useMemo(() => {

        if (!dataEvent ||!groupsData.length) {
            return [];
        }

        // Get the group selected and his subgroups
        const groupIds = getGroupIds(groupsData, selectedGroup);

        // Get the user selected than is in this group
        const groupUsers = usersData.filter(user => 
            (user.userGroupIds || []).some(id => groupIds.has(id))
        );

        const groupUserIds = new Set(groupUsers.map(user => user.id));

        const events = new Map();

        function addEvent(event, groupId = null) {

            if (groupId !== null && groupIds.has(groupId)) {
                const key = `group-${groupId}-${event.id}-${event.eventDate}`;

                events.set(key, {
                    ...event,
                    groupId
                });
            
            } else if (
                event.userId !== null && 
                event.userId !== undefined &&
                groupUserIds.has(event.userId)
            ) {
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
                    addEvent(event, entry.userGroup.id);
                });
            }

            if (entry.user) {
                entry.events.forEach(event => {
                    
                    if (event.userGroupId !== null) {
                        addEvent(event, event.userGroupId);
                    }else if (event.userId === entry.user.id) {
                        addEvent(event);
                    }
                });
            }

        });

        let result = Array.from(events.values());

        if (selectedUser !== null) {

            const selectedUserData = usersData.find(
                user => user.id === selectedUser
            );

            const selectedUserGroups = selectedUserData?.userGroupIds || [];

            result = result.filter(event => 
                event.userId === selectedUser || 
                (
                    event.userId == null &&
                    (
                        event.groupId === selectedGroup ||
                        selectedUserGroups.includes(event.groupId)
                    )
                )
            );
        }

        return result;

    }, [dataEvent, groupsData, usersData, selectedGroup, selectedUser]);


    const eventsByDate = useMemo(() => {

        const { start, end } = getDateRange(
            currentDate,
            dataEventFilter
        );

        return filteredEvents
            .filter(event =>
                event.eventDate >= start &&
                event.eventDate <= end
            )
            .sort((a, b) => 
                a.eventDate.localeCompare(b.eventDate) ||
                a.startTime.localeCompare(b.startTime)
            );
    }, [filteredEvents, currentDate, dataEventFilter]);


    const listItems = eventsByDate.map(event => {

        const user = usersData.find(
            user => user.id === event.userId
        );

        return {
            date: event.eventDate.split("-").reverse().join("."),
            hour: `${event.startTime.slice(0, 5)} - ${event.endTime.slice(0, 5)}`,
            repeat: event.EventSerieId ? "Oui" : "-",
            eventType: listEventTypes.find(type => type.id === event.eventTypeId)?.name || "Type inconnu",
            user: user ? `${user.firstName} ${user.lastName}` : getGroupName(groupsData, event.groupId) || "Groupe inconnu"
        };
    })

    function changeDate(direction) {
        const [year, month, day] = currentDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        switch (dataEventFilter) {
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
                    options={userGroupSelect} 
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
            funcFilterDay={() => setDataEventFilter("day")} 
            funcFilterWeek={() => setDataEventFilter("week")} 
            funcFilterMonth={() => setDataEventFilter("month")} 
            funcFilterYear={() => setDataEventFilter("year")}
        />

        <SelectDate 
            dateMode={dataEventFilter} 
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










