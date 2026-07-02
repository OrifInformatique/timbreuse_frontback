/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import SelectDate from "./selectDate";
import React from "react";
import "@testing-library/jest-dom";

describe("SelectDate component", () => {
    test("Render the component selectDate correctly", () => {
        render(<SelectDate stringDate="lundi 19 janvier"/>)

        expect(screen.getByText("lundi 19 janvier")).toBeInTheDocument();
    });

    test("Render the component selectDate empty", () => {
        render(<SelectDate />)

        expect(screen.getByText("date du jour")).toBeInTheDocument();
    });

    test("Render increment and decrement buttons", () => {
        render(<SelectDate stringDate="lundi 19 janvier"/>)

        expect(screen.getByText("◁")).toBeInTheDocument();
        expect(screen.getByText("▷")).toBeInTheDocument();
    });

    test("Calls decrementDate when clicking left button", () => {
        const decrementMock = jest.fn();

        render(<SelectDate stringDate="lundi 19 janvier" decrementDate={decrementMock}/>)

        fireEvent.click(screen.getByText("◁"));
        expect(decrementMock).toHaveBeenCalled();
    });

    test("Calls incrementDate when clicking right button", () => {
        const incrementMock = jest.fn();

        render(<SelectDate stringDate="lundi 19 janvier" incrementDate={incrementMock}/>)

        fireEvent.click(screen.getByText("▷"));
        expect(incrementMock).toHaveBeenCalled();
    });

});

