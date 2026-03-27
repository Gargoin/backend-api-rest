import Cart from "../models/Cart.js"
import Product from "../models/Product.js";





//////////////// AÑADIR EL CARRITO /////////////////////////////////////////////////////

// export const addProduct = async (req, res) => {

//    try {
//     //  console.log(req.body, req.user);

//     // NO validamos user

//     // Validamos que el producto exista

//     if (req.body.product == "undefined"){ // esto si pasase evita consultar a base de datos
//         return res.status(422).json({ error: "No product id" });
//     }
    
//     const product = await Product.findById(req.body.product);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }


//     if(req.body.quantity == undefined) { // si no hay un valor metido en quantity y nos saca un undefined, entonces pon "1" que es el undefined del model
//       req.body.quantity = 1;
//     };

//     // Si viene la cantidad, tiene que ser mayor o igual a 1

//     if (!Number.isInteger(req.body.quantity || req.body.quantity < 1 )) {
//     return res.status(404).json({ error: "Invalid quantity" });

//     }

//     // validamos que tengamos stock
    
//     if (product.stock < req.body.quantity) {
//         return res.status(404).json({ error: "Not enough stock" });
//     }
//     console.log(req.body);


//     const cartExisting = await Cart.findOne({ // prgunatmos a la base de datos si el user ya tiene un carrito
//       user: req.user.id,
//     });


//     if (!cartExisting) {


//       const cart = new Cart({ // aqui definimos el cart
      
//       user: req.user.id,
//       products: []

//     })

//     const item = { // esto seria un producto, hacemos una const 
//       product: product.id,
//       quantity: req.body.quantity
//     }


//     cart.products.push(item); // se inserta el item el products del cart

//     await cart.save();

//     res.status(201).json({message: "Carrito creado", cart});

//     } else { // en esta parte el carrito ya existe de antes
      
//       const item = { // esto seria un producto, hacemos una const 
//       product: product.id,
//       quantity: req.body.quantity
//     }

//     cartExisting.products.push(item); 
  
//     await cartExisting.save();
//     res.status(201).json({message: "Carrito actualizado", cartExisting});

//     }

//    }catch (error) {
//     // console.log(error);
//     res.status(500).json({error: "Internal Server Error"});
//    }
// };

export const addProduct = async (req, res) => {
};

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

  const productExist = cart.products.find(p => p.product === productId); // busca en el array "products" y por cada producto, compara el campo product con el productId (del req) y me devuelve si hay coincidencia

  if(productExist){



  } else {

  const newProduct = { // creamos el nuevo producto
 
    product: productId,
    quantity: quantity,

  }

    cart.products.push(newProduct); // agregamos el producto


  }

    await cart.save(); // guardamos

    res.status(202).json({ message: "Carrito creado, cart"});


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
