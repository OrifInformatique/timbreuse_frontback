/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Events from "./index";
import { getEventDataUserGroups, getEventDataUsers, getEventTypes, getEventSeries, getEventData } from "/src/common/services/dataService";

// --------------------------------------------------
// MOCKS OF THE CALL API
// --------------------------------------------------

jest.mock("/src/common/services/dataService", () => ({
    getEventDataUserGroups: jest.fn(),
    getEventDataUserGroup: jest.fn(),
    getEventDataUsers: jest.fn(),
    getEventDataUser: jest.fn(),
    getEventTypes: jest.fn(),
    getEventType: jest.fn(),
    getEventSeries: jest.fn(),
    getEventSerie: jest.fn(),
    getEventData: jest.fn()
}));

// --------------------------------------------------
// MOCKS OF THE LIBRARIE ORIF
// --------------------------------------------------

jest.mock("@orif-informatique/react-components-library", () => ({
    Title: ({ children }) => <h1>{children}</h1>,
    Button: ({ label, onClick, type = "button" }) => (
        <button type={type} onClick={onClick}>
            {label}
        </button>
    ),
    Icon: ({ name }) => <span data-testid={`icon-${name}`} />,
    PopUp: ({ open, title, children, onClose }) => (
        open ? (
            <div role="dialog" aria-label={title}>
                <h2>{title}</h2>
                {children}
                <button type="button" onClick={onClose}>
                    Fermer
                </button>
            </div>
        ) : null
    ),
    SingleSelect: ({
        name,
        placeholder,
        options = [],
        value,
        defaultValue,
        onChangeFunction,
        disabled
    }) => (
        <select
            aria-label={name || placeholder}
            value={value ?? defaultValue ?? ""}
            onChange={(e) => onChangeFunction?.(e.target.value)}
            disabled={disabled}
        >
            <option value="">{placeholder || "Sélectionner"}</option>

            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    ),
    InputRadio: ({
        label,
        name,
        options = [],
        onChange,
        disabled,
        disabledAll
    }) => (
        <fieldset>
            <legend>{label}</legend>

            {options.map(option => (
                <label key={option.id}>
                    <input
                        type="radio"
                        name={name}
                        value={option.id}
                        defaultChecked={option.defaultChecked}
                        disabled={disabled || disabledAll}
                        onChange={() => onChange?.(option.id)}
                    />
                    {option.label}
                </label>
            ))}
        </fieldset>
    ),
    List: ({ items = [], columns = [], actions = {} }) => (
        <div>
            {items.map(item => (
                <div key={`${item.id}-${item.date}`} data-testid="event-item">
                    {columns.map(column => (
                        <span key={column}>
                            {item[column]}{" "}
                        </span>
                    ))}

                    {actions.edit && (
                        <button
                            type="button"
                            aria-label={`Modifier ${item.id}`}
                            onClick={() => actions.edit.onClick(item)}
                        >
                            Modifier
                        </button>
                    )}

                    {actions.delete && (
                        <button
                            type="button"
                            aria-label={`Supprimer ${item.id}`}
                            onClick={() => actions.delete.onClick(item)}
                        >
                            Supprimer
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}));

// --------------------------------------------------
// DATA OF TEST
// --------------------------------------------------

const mockGroups = [
    {
        id: 15,
        name: "Groupe principal",
        subgroups: [
            {
                id: 16,
                name: "Sous-groupe",
                subgroups: []
            }
        ]
    }
];
const mockUsers = [
    {
        id: 1,
        firstName: "Ada",
        lastName: "Lovelace",
        userGroupIds: [15]
    },
    {
        id: 2,
        firstName: "Alan",
        lastName: "Turing",
        userGroupIds: [99]
    }
];
const mockTypes = [
    {
        id: 3,
        name: "Réunion"
    },
    {
        id: 4,
        name: "Formation"
    }
];
const mockSeries = [
    {
        id: 10,
        daysOfWeek: ["monday", "wednesday"],
        startDate: "2026-11-11",
        endDate: "2026-12-11"
    }
];
const mockEvents = [
    {
        userGroup: { id: 15 },
        events: [
            {
                id: 100,
                eventDate: "2026-11-11",
                startTime: "10:00:00",
                endTime: "11:00:00",
                eventTypeId: 3,
                EventSerieId: null
            },
            {
                id: 101,
                eventDate: "2026-11-11",
                startTime: "14:00:00",
                endTime: "15:00:00",
                eventTypeId: 4,
                EventSerieId: 10
            }
        ]
    },
    {
        user: { id: 1 },
        events: [
            {
                id: 102,
                eventDate: "2026-11-11",
                startTime: "09:00:00",
                endTime: "10:00:00",
                eventTypeId: 3,
                userGroupId: null,
                userId: 1,
                EventSerieId: null
            }
        ]
    }
];

// --------------------------------------------------
// INITIAL BEFORE EVERY TEST
// --------------------------------------------------

beforeEach(() => {
    jest.clearAllMocks();

    getEventData.mockResolvedValue(mockEvents);
    getEventDataUsers.mockResolvedValue(mockUsers);
    getEventDataUserGroups.mockResolvedValue(mockGroups);
    getEventTypes.mockResolvedValue(mockTypes);
    getEventSeries.mockResolvedValue(mockSeries);
});

// --------------------------------------------------
// TESTS 
// --------------------------------------------------

describe("Events", () => {

    
    test("renders the main component", async () => {
        render(<Events />);

        expect(screen.getByText("Planning d'événements")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Nouvel événement" })).toBeInTheDocument();
    });


    test("loads all required data", async () => {
        render(<Events />);

        await waitFor(() => {
            expect(getEventData).toHaveBeenCalledTimes(1);
            expect(getEventDataUsers).toHaveBeenCalledTimes(1);
            expect(getEventDataUserGroups).toHaveBeenCalledTimes(1);
            expect(getEventTypes).toHaveBeenCalledTimes(1);
            expect(getEventSeries).toHaveBeenCalledTimes(1);
        });
    });

    
    test("displays events belonging to the selected group", async () => {
        render(<Events />);

        await waitFor(() => {expect(screen.getAllByTestId("event-item")).toHaveLength(2);});

        expect(screen.getByText("Groupe")).toBeInTheDocument();
        expect(screen.getByText("Réunion")).toBeInTheDocument();
    });


    test("changes the date display to week mode", async () => {
        render(<Events />);

        fireEvent.click(screen.getByRole("button", { name: "Semaine" }));

        expect(screen.getByText("09.11.26 - 13.11.26")).toBeInTheDocument();
    });


    test("changes the date display to month mode", async () => {
        render(<Events />);

        fireEvent.click(screen.getByRole("button", { name: "Mois" }));

        expect(screen.getByText("Novembre 2026")).toBeInTheDocument();
    });


    test("moves to the next periode", async () => {
        render(<Events />);

        fireEvent.click(screen.getByRole("button", { name: "Période suivante" }));

        expect(screen.getByText("12.11.2026")).toBeInTheDocument();
    });


    test("moves to the previous periode", async () => {
        render(<Events />);

        fireEvent.click(screen.getByRole("button", { name: "Période précédente" }));

        expect(screen.getByText("10.11.2026")).toBeInTheDocument();
    });


    test("opens the add event popup", async () => {
        render(<Events />);

        fireEvent.click(screen.getByRole("button", { name: "Nouvel événement" }));

        expect(screen.getByRole("dialog", { name: "Nouvel événement" })).toBeInTheDocument();
        expect(screen.getByLabelText("Date de début")).toHaveValue("");
        expect(screen.getByLabelText("Début")).toHaveValue("");
        expect(screen.getByLabelText("fin")).toHaveValue("");
    });

    test("displays validation errors when submitting an empty form", async () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        render(<Events />);

        fireEvent.click(screen.getByRole("button", { name: "Nouvel événement" }));

        const dialog = await screen.findByRole("dialog", {name: "Nouvel événement"});

        const form = dialog.querySelector("form");

        expect(form).not.toBeNull();

        fireEvent.submit(form);

        expect(await screen.findByText("Veuillez sélectionner un groupe ou un utilisateur.")).toBeInTheDocument();
        expect(screen.getByText("Veuillez sélectionner un type d'événement.")).toBeInTheDocument();
        expect(screen.getByText("Veuillez sélectionner une date.")).toBeInTheDocument();
        expect(screen.getByText("Veuillez indiquer une heure de début.")).toBeInTheDocument();
        expect(screen.getByText("Veuillez indiquer une heure de fin.")).toBeInTheDocument();
        expect(screen.getByText("Veuillez indiquer si l'événement doit être répété.")).toBeInTheDocument();

        logSpy.mockRestore();
    });


    test("rejects an end time earlier than the start time", async () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        render(<Events />);

        fireEvent.click(screen.getByRole("button", { name: "Nouvel événement" }));

        const dialog = await screen.findByRole("dialog", {
            name: "Nouvel événement"
        });

        fireEvent.change(within(dialog).getByLabelText("Début"), {
            target: { value: "14:00" }
        });

        fireEvent.change(within(dialog).getByLabelText("fin"), {
            target: { value: "13:00" }
        });

        const form = within(dialog).getByRole("button", { name: "Ajouter" }).closest("form");

        expect(form).not.toBeNull();

        fireEvent.submit(form);

        expect(
            await within(dialog).findByText("L'heure de fin doit être après l'heure de début.")
        ).toBeInTheDocument();

        logSpy.mockRestore();
    });    


    test("opens the edit popup for a event alone", async () => {
        render(<Events />);

        const editButton = await screen.findByRole("button", {name: "Modifier 100"});

        fireEvent.click(editButton);

        expect(screen.getByRole("dialog", { name: "Modifier l'événement" })).toBeInTheDocument();
        expect(screen.getByLabelText("Date de début")).toHaveValue("2026-11-11");
        expect(screen.getByLabelText("Début")).toHaveValue("10:00");
        expect(screen.getByLabelText("fin")).toHaveValue("11:00");
    });


    test("displays the edit choices for a repeated event", async () => {
        render(<Events />);

        fireEvent.click(await screen.findByRole("button", { name: "Modifier 101" }));

        expect(screen.getByRole("dialog", { name: "Modifier un événement" })).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Modifier uniquement cet événement"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Modifier toute la série"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Modifier cet événement et les suivants"})).toBeInTheDocument();
    });


    test("opens the edit form when selecting a single event in a series", async () => {
        render(<Events />);

        fireEvent.click(await screen.findByRole("button", { name: "Modifier 101" }));
        fireEvent.click(screen.getByRole("button", {name: "Modifier uniquement cet événement"}));

        expect(screen.getByRole("dialog", { name: "Modifier l'événement" })).toBeInTheDocument();
        expect(screen.getByLabelText("Date de début")).toHaveValue("2026-11-11");
        expect(screen.getByLabelText("Début")).toHaveValue("14:00");
    });


    test("resets the form when opening a new event after closing an edit", async () => {
        render(<Events />);

        fireEvent.click(await screen.findByRole("button", { name: "Modifier 100" }));

        expect(screen.getByLabelText("Date de début")).toHaveValue("2026-11-11");

        fireEvent.click(screen.getByRole("button", { name: "Annuler" }));
        fireEvent.click(screen.getByRole("button", { name: "Nouvel événement" }));

        expect(screen.getByLabelText("Date de début")).toHaveValue("");
        expect(screen.getByLabelText("Début")).toHaveValue("");
        expect(screen.getByLabelText("fin")).toHaveValue("");
    });


    test("displays the delete choices for a repeated event", async () => {
        render(<Events />);

        fireEvent.click(await screen.findByRole("button", { name: "Supprimer 101" }));

        expect(screen.getByRole("dialog", { name: "Supprimer un événement" })).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Supprimer uniquement cet événement"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Supprimer toute la série"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Supprimer cet événement et les suivants"})).toBeInTheDocument();
    });

});
