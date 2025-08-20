const formatDisplay = (expression) => {
  const parts = expression.split(/([+\-*/])/g)

  const formatedParts = parts.map(part => {
    if (!isNaN(part.replace(',', '.'))) {
      let [intPart, decimalPart] = part.replace('.', ',').split(',');

      if (!intPart || intPart === "") {
        intPart = "0";
      } else {
        intPart = intPart.replace(/^0+(?!$)/, '');  //remove zero a esquerda
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); //adiciona . a cada 3 numerais
      }

      if (part.endsWith(',')) { //mostra a vírgula no tempo certo
        return `${intPart},`;
      }
      
      return decimalPart ? `${intPart},${decimalPart}` : intPart;
    } else {

      return part;
    }
  })

  return formatedParts.join('');
}

const ShowDisplay = ({ expression }) => {
  if (typeof expression !== 'string') return <div className="display">0</div>;

  return (
    <div className="display" tabIndex={0}>
      {formatDisplay(expression) || 0}
    </div>
  );
};
export default ShowDisplay
