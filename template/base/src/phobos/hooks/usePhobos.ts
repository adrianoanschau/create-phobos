import { useContext } from "react";
import { PhobosContext } from "../context";

export const usePhobos = () => {
    const context = useContext(PhobosContext);

    if (!context) {
        throw new Error('usePhobos must be used within a PhobosProvider');
    }

    return context;
};