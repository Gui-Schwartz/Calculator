const addHistory = (setHistory, expression, result) =>{
    const newEntry = `${expression} = ${result}`;
    setHistory(prev=>[...prev, newEntry])    
}
export default addHistory   