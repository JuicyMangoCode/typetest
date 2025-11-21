import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TypeTest from "./TypeTest";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <TypeTest />
    </StrictMode>
);
