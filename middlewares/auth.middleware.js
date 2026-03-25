import jwt from "jsonwebtoken"; // importamos JWT par ahacer la verificación

export const authMiddleware = (req, res, next) => { // tiene tres objetos req res y next, filtra, si no tiene creedenciales corresctas, se corta y manda un aviso al usuario si no, pasa a next

    try {
        const authHeader = req.headers.authorization; //const header de authorization

    if(!authHeader) {
        return res.status(401).json({error: "No token provided"}); // si no existe se madna nada
    }

    if(!authHeader.startsWith("Bearer ")){ // si no empieza con bearer , entonces no es valido tampoco
        return res.status(401).json({error: "Invalid token format"});
    } 


    // console.log(authHeader.Split(" ")[1]); // esta seria una formad e lelgar al token

    // const array = authHeader.split(" "); // hacemos una costante con los elementos del authhedaer separados, se corta por el elemento que los separa, un espacio.

    // const [portador, token] = array; //desestrcuturamos el array


    const [, token] = authHeader.split(" "); // esta es otra manera
    // console.log(token); // llamamos al token

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //verificamos el token, token, y process.env con el secretkey
    
    // res.send("OK");
    // console.log(decoded);

    req.user = decoded; 

    next();

    } catch (error) {

    res.status(401).json({ error: "Invalid token"});

    }

};