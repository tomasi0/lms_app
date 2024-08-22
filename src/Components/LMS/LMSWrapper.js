import { Outlet } from "react-router-dom";
import { useState, createContext } from "react";

export const LMSContext = createContext();

export function LMSWrapper() {
    const [category, setCategory] = useState(0);
    return (
        <>
            <LMSContext.Provider value={{ category, setCategory }}>
                <Outlet />
            </LMSContext.Provider>
        </>
    );
}
