import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

const createToken = (user) => { // funcion que se encargará de crear el token para el user, esta info es la que estará dentro del token y será concocida como req.user
    const token = jwt.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    return token;
};

export const profile = async (req, res) => {

 try {
       const user = await User.findById(req.user.id).select("-password"); // constante de user que busca por le id, coge toda la info menos password

    res.json({
        message: "Perfil del usuario",
        user: user, // ahora en el middle se mete este req.user
    })

 } catch{

    res.status(500).json({ error: "Internal Server Error"});

 }


}

export const login = async (req, res) => {
    try {
    
    const {email, password} = req.body; //sacamos el email y el password

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // expression regular

    // al comprobar si la info es ok, antes de que vaya al server a bsucar al user, evitamos consumir recursos 

    if (!emailRegex.test(email)) { // tiene un metodo test, para probarlo con el const email, y ver si tiene fomrato de email.
        return res.status(400).json({ error: "Formato de email no válido"});
    }

    if (password.length < 5) {
    
        return res.status(400).json({error: "El password debe tener al menos 6 caracteres"});

    }

    if (!email || !password) {
        return res.status(400).json({error: "Correo y contraseña son necesarios"});
    }

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({error: "Datos incorrectos"}); // siempre mensajes genericos para no dar pistas a los maliciosos
    }

    const isMatch = await bcrypt.compare(password, user.password); // comparamos el pass plano como string que se introduce con el hasheado, haciendo una constante booleana

    if(!isMatch) {
        return res.status(400).json({error: "Datos incorrectos"}); // siempre mensajes genéricos para no dar pistas a los maliciosos
    }
    
    const token = createToken(user); // le creamos el token, ya que todo ok

    res.json({token}); // asi para que haga el objeto token con el contenido del token

    } catch {

    res.status(500).json({ error: "Internal Server Error, catastroph!"})

    }
};

export const register = async (req, res) => {
    try {
        // res.send("OK");

    const {email, password} = req.body; // sacamos las propiedades conviertiendolas a la vez en const separadas

    if (!email || !password) {
        return res.status(400).json({error: "Correo o contraseña no validos"});
    }

    // if(!email.includes("@")) {
    //     return res.status(400).json({error: "Email no válido"});
    // }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // expression regular

    if (!emailRegex.test(email)) { // tiene un metodo test, para probarlo con el const email, y ver si tiene fomrato de email.
        return res.status(400).json({ error: "Invalid email"});
    }

    if (password.length < 5) {
    
        return res.status(400).json({error: "El password debe tener al menos 6 caracteres"});

    }

    const userExist = await User.findOne({email}); // constante que busca un email

    if (userExist) { // si existe ya ese email
        return res.status(400).json({ error: "Usuario duplicado"});
    }


    const hash = await bcrypt.hash(password, 10);

    const user = await User.create ({ // creamos el usuario con lo que le metemos en el body
        email,
        password: hash, // para que guarde el password hasheado
    })


    res.status(201).json({ // la respuesta no muestra el password ni el hash, solo esta info:

        id: user.id,
        email: user.email,

    });

    } catch {

        res.status(500).json({ error: "Internal Server Error, catastroph!"})
    }

}