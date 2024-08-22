import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./SignUp";
import Logout from "./Logout";
import "../../../Styles/login.css";
import axios from "axios";
// import { AuthProvider } from "../AuthContext";

export function LoginMain() {
    const [currentView, setCurrentView] = useState("login");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        sessionCurrent();
    }, []);

    const sessionCurrent = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/user/current",
                { withCredentials: true }
            );
            if (response.status === 200) {
                setIsAuthenticated(true);
                // AuthProvider.setIsAuthenticated(true);

                setCurrentView("logout");
            }
        } catch (error) {
            console.log("Session error:", error);
        }
    };

    const handleLogin = () => {
        setCurrentView("login");
    };

    const handleSignup = () => {
        setCurrentView("signup");
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/user/logout",
                {},
                { withCredentials: true }
            );
            if (response.status === 200) {
                setIsAuthenticated(false);
                // AuthProvider.setIsAuthenticated(false);

                setCurrentView("login");
                // window.location.href = "main.html";
                window.location.href = "login";
            }
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    const handleSignupSuccess = () => {
        setCurrentView("login");
    };

    const handleConnect = () => {
        // window.location.href = "main.html";
        window.location.href = "home";
    };

    return (
        <div className="LoginMain">
            {currentView === "login" && <Login onSignup={handleSignup} />}
            {currentView === "signup" && (
                <Signup onSuccess={handleSignupSuccess} />
            )}
            {currentView === "logout" && (
                <Logout onLogout={handleLogout} onConnect={handleConnect} />
            )}
        </div>
    );
}

export default LoginMain;
