import Cart from "../models/Cart.js"
import Product from "../models/Product.js";
import { getCategoryProducts } from "./categories.controller.js";


 //////////////// OBTENER EL CARRITO /////////////////////////////////////////////////////

export const getCart = async (req,res) => {
  try {
    const cart = await Cart.findOne({ // prgunatmos a la base de datos si el user ya tiene un carrito
      user: req.user.id,
    });

       if (!cart) { // si no lo hay pintamos uno vacio
        const cart = new Cart({ // aqui definimos el cart
      
        user: req.user.id,
        products: []
        });

        return res.json(newCart);
      }

  res.json(cart); // mostramos el carrito si lo hay
  }catch{
    res.status(500).json({error: "Internal Server Error"});
  }

};


 //////////////// AGREGAR UN PRODUCTO AL CARRITO /////////////////////////////////////////////////////


 export const addToCart = async (req, res) => {

  const {product: productId, quantity = 1} = req.body; // desestructuramos del req body lo que nos interesa, el product y la cantidad, en este caso le ponemos un defalt = 1, si viniera un valor se pondria el que viene, al product le ponemos un alias, productId para no confundirnos
  const{id: userId} = req.user; // igual, desestructuramos el req.user para tener su id, y lo ponemos con un alias, userId

  let cart = await Cart.findOne({user: userId}); //comparamos el user con userId, para ver si hay un carrito

  if (!cart) { // si no lo hay creamos uno vacio
    cart =new Cart({
      user: userId, // user con su alias
      products: [],
    })
  };
  // console.log(cart.products);

  const productExist = cart.products.find((p) => p.product == productId); // busca en el array "products" y por cada producto, compara el campo product con el productId (del req) y me devuelve si hay coincidencia esto con == si pongo === falla, haria duplicados es demasiado estricto

  

  if(productExist){

   productExist.quantity += quantity; // sumamos las cnatidades del req y lo que hay 
   

    

  } else {

  const newProduct = { // creamos el nuevo producto
 
    product: productId,
    quantity: quantity,

  }

    cart.products.push(newProduct); // agregamos el producto


  }
    
    

    await cart.save(); // guardamos

    res.status(202).json({ message: "Carrito creado", cart});


};

// agregar un product al carrito

// Ver si existe el carrito
// -Pasar el token para el middleware
// -req.user (id, emai)

// recibo id del producto y la cantidad, a traves del req.body
// - comprobamos si la id existe
// - que ahya mas stock del que piden

//ver si existe el carrito
// const cart = await Cart.findOne({
    //   user: req.user.id,
    // });

// si no existe se crea uno
// ver stock con el req.body.quantity

//si existe el carrito Ver si ya existe el producto
// si no lo tiene, vemos el stock, si hay stock, se agrega y guarda


//stock

// teng 10 unidades
// Lo tengo en el carrito 3 unidades, donde stesa registrado card.porducts[{quantity: 3}]
// Quiero agragar al carrito 5 unidades, donde esta registrado, req.body.quantity




//////////////// BORRAR EL CONTENIDO DEL CARRITO /////////////////////////////////////////////////////

export const clearCart = async (req,res) => {

  try {
    const cart = await Cart.findOne({ // prgunatmos a la base de datos si el user ya tiene un carrito
      user: req.user.id,
    });

  if (!cart) { // si no lo hay pintamos uno vacio
        const cart = new Cart({ // aqui definimos el cart
      
        user: req.user.id,
        products: []
        });

        return res.json(newCart);
      }

      cart.products = []; // le damos un valor vacio
      await cart.save();

      res.json(cart);

  }catch{
    res.status(500).json({error: "Internal Server Error"});
  }
  


};
