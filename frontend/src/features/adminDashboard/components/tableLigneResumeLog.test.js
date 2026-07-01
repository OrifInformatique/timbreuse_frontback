/**
 * @jest-environment jsdom
 */
import React from "react";
import { render,screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableLigneResumeLog from "./tableLigneResumeLog";

jest.mock("react-router-dom", () => ({
    Link: ({ to, children }) => (
        <a href={to}>
            {children}
        </a>
    )
}));

jest.mock(
    "@orif-informatique/react-components-library",
    () => ({
        Icon: ({ name }) => (
            <span>{name}</span>
        )
    })
);

describe("TableLigneResumeLog component", () => {
    test("renders student with full name correctly", () => {
        render(<table><tbody><tr><TableLigneResumeLog name="Jean" surname="Dupont" /></tr></tbody></table>);

        expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
    });

    test("renders check icon when no error is found", () => {
        render(<table><tbody><tr><TableLigneResumeLog errorFound={0} /></tr></tbody></table>);

        expect(screen.getByText("check")).toBeInTheDocument();
    });


    test("renders cross icon when an error is found", () => {
        render(<table><tbody><tr><TableLigneResumeLog errorFound={1} /></tr></tbody></table>);

        expect(screen.getByText("cross")).toBeInTheDocument();
    });

    test("renders positive work time in green", () => {
        render(<table><tbody><tr><TableLigneResumeLog workTime="+08:12" /></tr></tbody></table>);

        const workTimeElement = screen.getByText("+08:12");

        expect(workTimeElement).toHaveClass("text-green-500");
    });

    test("renders negative work time in red", () => {
        render(<table><tbody><tr><TableLigneResumeLog workTime="-01:30" /></tr></tbody></table>);

        const workTimeElement = screen.getByText("-01:30");

        expect(workTimeElement).toHaveClass("text-red-500");
    });

    test("renders correct navigation link", () => {
        render(<table><tbody><tr><TableLigneResumeLog id={5} /></tr></tbody></table>);

        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("href","/admin-dashboard-student-error/5");
    });
       
    test("renders edit icon", () => {
        render(<table><tbody><tr><TableLigneResumeLog /></tr></tbody></table>);

        expect(screen.getByText("edit")).toBeInTheDocument();
    });
});