import './Buttons.css'

export const buttons = [
    // PRIMEIRA LINHA
    { id: 'btn-ac', value: 'AC', type: "control" },
    { id: 'btn-sign', value: '+/-', type: "control" },
    { id: 'percentage', value: '%', type: "control" },
    { id: 'divider', value: '/', type: "operator" }, 

    // SEGUNDA LINHA
    { id: 'btn-7', value: '7', type: "number" },
    { id: 'btn-8', value: '8', type: "number" },
    { id: 'btn-9', value: "9", type: "number" },
    { id: 'multiplier', value: 'x', type: "operator" }, 

    // TERCEIRA LINHA
    { id: 'btn-4', value: '4', type: "number" },
    { id: 'btn-5', value: '5', type: "number" },
    { id: 'btn-6', value: '6', type: "number" },
    { id: 'subtraction', value: '-', type: "operator" },

    // QUARTA LINHA
    { id: 'btn-1', value: '1', type: "number" },
    { id: 'btn-2', value: '2', type: "number" },
    { id: 'btn-3', value: '3', type: "number" },
    { id: 'sum', value: '+', type: "operator" },

    // QUINTA LINHA
    { id: 'btn-option', value: 'option', type: "system" },
    { id: 'btn-0', value: '0', type: "number" },
    { id: 'btn-comma', value: ',', type: "number" }, 
    { id: 'btn-equal', value: '=', type: "control" }
]

const Buttons = ({onButtonClick, onACMouseDown,  onACMouseUp, systemButtonRef}) => { 
    
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
                        onClick={() => onButtonClick(btn.value, btn.type)}
                        ref={btn.id === 'btn-option' ? systemButtonRef : null}
                        >
                        {btn.value}
                        </button>

                );
            })}
        </>
    )
}

export default Buttons