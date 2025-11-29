import React, { createContext, useState, useContext } from 'react';

const ModeContext = createContext();

export const useMode = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
};

export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState('citizen'); // 'citizen' or 'analyst'

    const toggleMode = () => {
        setMode(prevMode => prevMode === 'citizen' ? 'analyst' : 'citizen');
    };

    const isCitizen = mode === 'citizen';
    const isAnalyst = mode === 'analyst';

    return (
        <ModeContext.Provider value={{ mode, setMode, toggleMode, isCitizen, isAnalyst }}>
            {children}
        </ModeContext.Provider>
    );
};
