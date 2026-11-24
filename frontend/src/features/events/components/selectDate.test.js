/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectDate from "./selectDate";
import "@testing-library/jest-dom";


// Mock if the button
jest.mock("@orif-informatique/react-components-library", () => ({
    Icon: ({ name }) => <span data-testid={`icon-${name}`} />
}));


describe("SelectDate", () => {

    const defaultProps = {
        dateString: "2026-11-11",
        funcArrowLeft: jest.fn(),
        funcArrowRight: jest.fn(),
        dateMode: "day"
    };

    test("renders correctly", () => {
        render(<SelectDate {...defaultProps} />);

        expect(screen.getByRole("button", { name: "Période précédente" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Période suivante" })).toBeInTheDocument();
    });

    test("displays the date in day mode", () => {
        render(<SelectDate {...defaultProps} dateMode="day" />);

        expect(screen.getByText("11.11.2026")).toBeInTheDocument();
    });

    test("displays the week from Monday to Friday in week mode", () => {
        render(
            <SelectDate
                {...defaultProps}
                dateString="2026-11-11"
                dateMode="week"
            />
        );

        expect(screen.getByText("09.11.26 - 13.11.26")).toBeInTheDocument();
    });

    test("displays the correct week when the selected date is a Sunday", () => {
        render(
            <SelectDate
                {...defaultProps}
                dateString="2026-11-15"
                dateMode="week"
            />
        );

        expect(screen.getByText("09.11.26 - 13.11.26")).toBeInTheDocument();
    });

    test("displays the month and year in month mode", () => {
        render(
            <SelectDate
                {...defaultProps}
                dateString="2026-01-15"
                dateMode="month"
            />
        );

        expect(screen.getByText("Janvier 2026")).toBeInTheDocument();
    });

    test("displays only the year in year mode", () => {
        render(
            <SelectDate
                {...defaultProps}
                dateString="2026-11-11"
                dateMode="year"
            />
        );

        expect(screen.getByText("2026")).toBeInTheDocument();
    });

    test("displays the full date when dateMode is unknown", () => {
        render(
            <SelectDate
                {...defaultProps}
                dateMode="unknown"
            />
        );

        expect(screen.getByText("11.11.2026")).toBeInTheDocument();
    });

    test("calls funcArrowLeft when clicking the left button", () => {
        const funcArrowLeft = jest.fn();

        render(
            <SelectDate
                {...defaultProps}
                funcArrowLeft={funcArrowLeft}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Période précédente" }));

        expect(funcArrowLeft).toHaveBeenCalledTimes(1);
    });

    test("calls funcArrowRight when clicking the right button", () => {
        const funcArrowRight = jest.fn();

        render(
            <SelectDate
                {...defaultProps}
                funcArrowRight={funcArrowRight}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Période suivante" }));

        expect(funcArrowRight).toHaveBeenCalledTimes(1);
    });


    test("displays the navigation icons", () => {
        render(<SelectDate {...defaultProps} />);

        expect(screen.getByTestId("icon-chevron-double-left")).toBeInTheDocument();
        expect(screen.getByTestId("icon-chevron-double-right")).toBeInTheDocument();
    });

});

