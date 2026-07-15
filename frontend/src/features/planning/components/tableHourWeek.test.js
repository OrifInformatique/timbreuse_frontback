/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableHourWeek from "./tableHourWeek";

describe("TableHourWeek component", () => {

    const planning = [
        {
            day: "Lundi",
            workTime: "08:12",
            breakTime: "00:30"
        },
        {
            day: "Mardi",
            workTime: "08:12",
            breakTime: "00:30"
        },
        {
            day: "Mercredi",
            workTime: "08:12",
            breakTime: "00:30"
        },
        {
            day: "Jeudi",
            workTime: "08:12",
            breakTime: "00:30"
        },
        {
            day: "Vendredi",
            workTime: "08:12",
            breakTime: "00:30"
        }
    ];

    test("renders all weekdays", () => {
        render(<TableHourWeek data={planning} modifierJour={jest.fn()} />);

        expect(screen.getByText("Lundi")).toBeInTheDocument();
        expect(screen.getByText("Mardi")).toBeInTheDocument();
        expect(screen.getByText("Mercredi")).toBeInTheDocument();
        expect(screen.getByText("Jeudi")).toBeInTheDocument();
        expect(screen.getByText("Vendredi")).toBeInTheDocument();
    });

    test("renders work time inputs", () => {
        render(<TableHourWeek data={planning} modifierJour={jest.fn()} />);

        expect(screen.getAllByDisplayValue("08:12")).toHaveLength(5);
    });

    test("renders break time inputs", () => {
        render(<TableHourWeek data={planning} modifierJour={jest.fn()} />);

        const inputs = screen.getAllByDisplayValue("00:30");

        expect(inputs).toHaveLength(5);
    });

    test("calls modifierJour when work time changes", () => {
        const modifierJour = jest.fn();

        render(<TableHourWeek data={planning} modifierJour={modifierJour} />);

        const inputs = screen.getAllByDisplayValue("08:12");

        fireEvent.change(inputs[0], {
            target: {
                value: "07:30"
            }
        });

        expect(modifierJour).toHaveBeenCalledWith(0, "workTime", "07:30");
    });

    test("calls modifierJour when break time changes", () => {
        const modifierJour = jest.fn();

        render(<TableHourWeek data={planning} modifierJour={modifierJour} />);

        const inputs = screen.getAllByDisplayValue("00:30");

        fireEvent.change(inputs[1], {
            target: {
                value: "00:45"
            }
        });

        expect(modifierJour).toHaveBeenCalledWith(1, "breakTime", "00:45");
    });

    test("renders labels", () => {
        render(<TableHourWeek data={planning} modifierJour={jest.fn()} />);

        expect(screen.getByText("Temps de travail")).toBeInTheDocument();
        expect(screen.getByText("Pause offerte")).toBeInTheDocument();
    });

    test("renders correctly with empty data", () => {
        render(<TableHourWeek data={[]} modifierJour={jest.fn()} />);

        expect(screen.getByText("Temps de travail")).toBeInTheDocument();
        expect(screen.getByText("Pause offerte")).toBeInTheDocument();

        expect(screen.queryByDisplayValue("08:12")).not.toBeInTheDocument();
    });
});