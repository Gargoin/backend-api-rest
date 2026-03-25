// export const validateStock = (stock) => {
//     if (stock == undefined || isNaN(stock) || stock < 0) {
//         return false;
//     } else {
//         return true;
//     }
// }

export const validateStock = (stock) => {

    const num = Number(stock);
    return Number.isInteger(num) && num >= 0 ; // esto pregunta si el numero es un entero y ademas positivo
  }

export const validatePrice = (price) => {
    const num = Number(price);
    return Number.isFinite(num) && num >= 0 //chequea si el numero es finito y mayor de 0.
}; 

