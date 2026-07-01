/**
 * @jest-environment jsdom
 */
import React from "react";
import { render,screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableLigne from "./tableLigne";

jest.mock("@orif-informatique/react-components-library", () => ({
    Icon: ({ name }) => (
        <div data-testid="icon">
            {name}
        </div>
    )
}));

jest.mock("react-router-dom", () => ({
    Link: ({ to, children }) => (
        <a href={to}>
            {children}
        </a>
    )
}));

describe("TableLigne component", () => {
    test("renders student full name correctly", () => {
        render(<table><tbody><tr><TableLigne name="Jean" surname="Dupont"/></tr></tbody></table>);

        expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
    });

    test("renders present icon", () => {
        render(<table><tbody><tr><TableLigne presence={0} /></tr></tbody></table>);

        expect(screen.getByText("check")).toBeInTheDocument();
    });

    test("renders absent icon", () => {
        render(<table><tbody><tr><TableLigne presence={1} reason=""/></tr></tbody></table>);

        expect(screen.getByText("cross")).toBeInTheDocument();
    });

    test("renders excused icon", () => {
        render(<table><tbody><tr><TableLigne presence={1} reason="Maladie"/></tr></tbody></table>);

        expect(screen.getByText("history")).toBeInTheDocument();
    });

    test("renders correct navigation link", () => {
        render(<table><tbody><tr><TableLigne id={5} /></tr></tbody></table>);

        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("href", "/admin-dashboard-student/5");
    });

    test("renders edit icon", () => {
        render(<table><tbody><tr><TableLigne /></tr></tbody></table>);

        expect(screen.getByText("meatballs")).toBeInTheDocument();
    });
});