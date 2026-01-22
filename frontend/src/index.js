import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from './common/layouts/MainLayout';

// Modules
import Home from './features/home';
import Contact from './features/contact';
import Login from './features/auth/ui/login';
import Azure from './features/auth/ui/login/azure';
import ChangePassword from './features/auth/ui/change-password';
import ResetPassword from './features/auth/ui/reset-password';
import ApiAuthCall from './features/auth';
import UserDashboard from './features/userDashboard';
import AdminDashboard from './features/adminDashboard';
import AdminDashboardDaily from './features/adminDashboard/indexDaily';
import AdminDashboardStudentPresentPage from './features/adminDashboard/studentPresencePage';
import AdminDashboardStudentErrorPage from './features/adminDashboard/studentErrorPage'

// Utils
import Redirect from './common/utils/Redirect'

// Styles
import '@orif-informatique/react-components-library/styles.css';
import './index.pcss';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter basename={process.env.APP_ROOT}>
        <Routes>
            {/* Standalone routes, not using a specific layout */}
			<Route
				path="/testAPI"
				element={<ApiAuthCall />}
			/>

            {/* 
            Routes nested to the Main layout.
            For each route, the React module specified in "element" is rendered at the place of the
            <Outlet /> tag in the MainLayout.
            */}
            <Route
                path="/"
                element={<MainLayout />}
            >
                <Route
                    index
                    element={<Home />}
                />

                <Route
                    path="contact"
                    element={<Contact />}
                />

                <Route
                    path="*"
                    element={<Redirect to="/" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/azure"
                    element={<Azure />}
                />

                <Route
                    path="/change-password"
                    element={<ChangePassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                <Route
                    path="/user-dashboard"
                    element={<UserDashboard />}
                />

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin-dashboard-daily"
                    element={<AdminDashboardDaily />}
                />

                <Route
                    path="/admin-dashboard-student/:id"
                    element={<AdminDashboardStudentPresentPage />}
                />

                <Route
                    path="/admin-dashboard-student-error/:id"
                    element={<AdminDashboardStudentErrorPage />}
                />
            </Route>
        </Routes>
    </BrowserRouter>
);
