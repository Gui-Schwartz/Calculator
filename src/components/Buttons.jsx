import './Buttons.css'
import { Plus, Minus, Divide, X, Equal, Percent, Delete, Calculator} from 'lucide-react';

export const buttons = [
    //Primeira linha
    { id: 'btn-ac', value: 'AC', type: "control" },
    { id: 'btn-sign', value: '+/-', type: "control" },
    { id: 'percentage', value: '%', type: "control" },
    { id: 'divider', value: '/', type: "operator" }, 

    //Segunda linha
    { id: 'btn-7', value: '7', type: "number" },
    { id: 'btn-8', value: '8', type: "number" },
    { id: 'btn-9', value: "9", type: "number" },
    { id: 'multiplier', value: '*', type: "operator" }, 

    //Terceira linha
    { id: 'btn-4', value: '4', type: "number" },
    { id: 'btn-5', value: '5', type: "number" },
    { id: 'btn-6', value: '6', type: "number" },
    { id: 'subtraction', value: '-', type: "operator" },

    //Quarta linha
    { id: 'btn-1', value: '1', type: "number" },
    { id: 'btn-2', value: '2', type: "number" },
    { id: 'btn-3', value: '3', type: "number" },
    { id: 'sum', value: '+', type: "operator" },

    //Quinta linha 
    { id: 'btn-option', value: 'option', type: "system" },
    { id: 'btn-0', value: '0', type: "number" },
    { id: 'btn-comma', value: ',', type: "number" }, 
    { id: 'btn-equal', value: '=', type: "control" }
]

const Buttons = ({onButtonClick, onACMouseDown,  onACMouseUp, systemButtonRef}) => { 
    const iconMap = {
        "+": <Plus size={30} />,
        "-": <Minus size={30} />,
        "*": <X size={30} />,
        "/": <Divide size={30} />,
        "=": <Equal size={30} />,
        "%": <Percent size={30} />,
        "AC": <Delete size={30} />,
        "option": <Calculator size={30}/>
    };
    
    return (
        <>
            {buttons.map((btn) => {
                let classes = `btn btn-${btn.type}`;
                
                if (btn.id === 'btn-equal') {
                    classes += ' btn-equal';
                }
                if (btn.id === 'btn-option') {
                    classes += ' btn-system'; 
                }

                return (
                    <button
                        key={btn.id}
                        className={classes}
                        onMouseDown={btn.id === 'btn-ac' ? onACMouseDown : undefined}
                        onMouseUp={btn.id === 'btn-ac' ? onACMouseUp : undefined}
                        onClick={(e) => { 
                            onButtonClick(btn.value, btn.type);
                            e.currentTarget.blur();
                        }}
                        ref={btn.id === 'btn-option' ? systemButtonRef : null}    
                        >
                        {iconMap[btn.value] || btn.value}
                    </button>

                );
            })}
        </>
    )
}

export default Buttons