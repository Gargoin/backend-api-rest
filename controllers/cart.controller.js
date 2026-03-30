import Cart from "../models/Cart.js"
import Product from "../models/Product.js";
import { getCategoryProducts } from "./categories.controller.js";


 //////////////// OBTENER EL CARRITO /////////////////////////////////////////////////////

export const getCart = async (req,res) => {
  try {
    const cart = await Cart.findOne({ // prgunatmos a la base de datos si el user ya tiene un carrito
      user: req.user.id,
    }).populate("products.product", "name price"); // populamos para mostrar el name y price tb en el carrito

       if (!cart) { // si no lo hay pintamos uno vacio
        const newCart = new Cart({ // aqui definimos el cart
      
        user: req.user.id,
        products: []
        });

        return res.json(newCart);
      }

  res.json(cart); // mostramos el carrito si lo hay
  }catch (error){
    res.status(500).json({error: "Internal Server Error"});
  }

};


 //////////////// AGREGAR UN PRODUCTO AL CARRITO /////////////////////////////////////////////////////


 export const addToCart = async (req, res) => {

  try{
    const {product: productId, quantity = 1} = req.body; // desestructuramos del req body lo que nos interesa, el product y la cantidad, en este caso le ponemos un defalt = 1, si viniera un valor se pondria el que viene, al product le ponemos un alias, productId para no confundirnos
  const{id: userId} = req.user; // igual, desestructuramos el req.user para tener su id, y lo ponemos con un alias, userId


  if(!productId){

    return res.status(422).json({error: "El Id del producto es obligatorio"});

  }
  if(!Number.isInteger(quantity) || quantity < 1){ // si quantity no es un número entero o es menor a 1

    return res.status(400).json({error: "La cantidad del producto no es correcta"});

  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({error: "Product Not Found"});
  }

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
    if(productExist.quantity + quantity > product.stock) {
      return res.status(400).json({error: "No hay suficiente stock"}); // si no existe, se suman y  si se pasa de cantidad con respecto al stock
    }

      productExist.quantity += quantity; // esto igual, suma lo que hay
   

  } else {
    
    if(quantity > product.stock) {
      return res.status(400).json({error: "No hay suficiente stock"}); // si existe y se pasa de cantidad con respecto al stock
    }

  const newProduct = { // creamos el nuevo producto
 
    product: productId,
    quantity: quantity,

  }

    cart.products.push(newProduct); // agregamos el producto

  }
    
    await cart.save(); // guardamos
    cart = await Cart.findOne({ // prgunatmos a la base de datos si el user ya tiene un carrito
      user: req.user.id,
    }).populate("products.product", "name price");

    res.status(202).json({ message: "Carrito creado", cart});
  
  }catch (error) {

    if(error.name == "CastError"){ // esto si el error es por poner mal algo
      res.status(400).json({error: "Invalid ID"});
    }

    res.status(500).json({error: "Internal Server Error"});
  
  }


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
        const newCart = new Cart({ // aqui definimos el cart
      
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




//////////////// BORRAR UN SOLO PRODUCTO DEL CARRITO /////////////////////////////////////////////////////

export const removeProductFromCart = async (req, res) => {
try{

  const { productId } = req.params;
  const {id: userId} = req.user;

  const cart = await Cart.findOne({ user: userId,});

  if(!cart) {
    return res.status(404).json({error: "No hay carrito"});
  }

    const filtered = cart.products.filter((p) => p.product != productId);

    

    // res.json({filtered, products: cart.products});

    if (filtered.lenght == cart.products.length) {

      return res.status(404).json({ error: "No se encontró el producto para borrar" });
    }

      cart.products = filtered;

        await cart.save();
      return res.json({message: "Porudcto eliminado del carrito", cart});

} catch {

   res.status(500).json({error: "Internal Server Error"});

}
};
 
