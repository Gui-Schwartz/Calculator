export const addToHistory = (historyRef,expression, result) =>{
    const newEntry = `${expression} = ${result}`;
    historyRef.current = [...historyRef.current, newEntry];
}

export const cleanHistory = (historyRef) =>{
    historyRef.current = [];
}