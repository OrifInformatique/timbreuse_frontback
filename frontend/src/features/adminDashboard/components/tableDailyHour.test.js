/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import TableDailyHour from "./tableDailyHour";
import React from "react";
import "@testing-library/jest-dom";

beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(
        new Date("2026-01-19T12:00:00")
    );
});

afterAll(() => {
    jest.useRealTimers();
});


describe("TableDailyHour component", () => {
    test("renders table correctly", () => {
        render(<TableDailyHour />);

        expect(screen.getByText("Temps exigé du jour")).toBeInTheDocument();
        expect(screen.getByText("Temps de travail")).toBeInTheDocument();
    });

    test("displays required daily hour", () => {
        render(<TableDailyHour dailyHourNeeded="08:12"/>);

        expect(screen.getByText("08:12")).toBeInTheDocument();
    });

    test("calculates worked time correctly", () => {
        const logs = [
            {typeLog: 1, hour: "08:00"},
            {typeLog: 0, hour: "09:45"}
        ];

        render(<TableDailyHour dailyLogs={logs}/>);

        expect(screen.getByText("01:45")).toBeInTheDocument();
    });

    test("calculates multiple work sessions", () => {
        const logs = [
            {typeLog: 1, hour: "08:00"},
            {typeLog: 0, hour: "09:45"},
            {typeLog: 1, hour: "10:00"},
            {typeLog: 0, hour: "12:00"}
        ];

        render(<TableDailyHour dailyLogs={logs}/>);

        expect(screen.getByText("03:45")).toBeInTheDocument();
    });

    test("calculates open session until current time", () => {
        const logs = [
            {typeLog: 1, hour: "08:00"}
        ];

        render(<TableDailyHour dailyLogs={logs}/>);

        expect(screen.getByText("04:00")).toBeInTheDocument();
    });

    test("uses default props correctly", () => {

        render(<TableDailyHour />);

        expect(screen.getByText("08:12")).toBeInTheDocument();
    });
});