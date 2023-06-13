import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./index.css";
import Table from "./components/table";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Table />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
