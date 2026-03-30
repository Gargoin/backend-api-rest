import Favorites from "../models/Favorites.js"


 //////////////// AGREGAR A FAVORITOS /////////////////////////////////////////////////////

 export const addFavorites = async (req, res) => {

try {
      const {product: productId} = req.body; 
    const{id: userId} = req.user;

  let favorites = await Favorites.findOne({user: userId});


  if (!favorites) {
      favorites = new Favorites({
        user: userId,
        products: [],
      })
    };

    const productExist = favorites.products.some((p) => p.product == productId);

  if(productExist){

   return res.status(400).json({ error: "Ese producto ya está en favoritos"});
    

  } else {

    const newProduct = {
    product: productId,

  }

    favorites.products.push(newProduct);

  }
    
    await favorites.save();
    res.status(202).json({ message: "Producto favorito agregado", favorites});

}catch{

    res.status(500).json({error: "Internal Server Error"});
}

};


//////////////// OBTENER FAVORITOS /////////////////////////////////////////////////////

export const getFavorites = async (req, res) => {

  try {

    const favorites = await Favorites.findOne({ 
      user: req.user.id,
    });

       if (!favorites) { 
        const favorites = new Favorites({ 
        user: req.user.id,
        products: []
        });
         return res.json({message: "No tienes favoritos:", favorites});
      }
        

        if(favorites.products.length === 0){
          return res.json({message: "No tienes favoritos:", favorites});
        }

       

  res.json({message: "Favoritos:",favorites}); 

  }catch{
    res.status(500).json({error: "Internal Server Error"});
  }

};


//////////////// BORRAR TODOS LOS FAVORITOS /////////////////////////////////////////////////////

export const clearFavorites = async (req,res) => {

  try {
    const favorites = await Favorites.findOne({ 
      user: req.user.id,
    });

  if (!favorites) { 
        const favorites = new Favorites({ 
      
        user: req.user.id,
        products: []
        });

        return res.json({message: "No tienes favoritos que borrar:", favorites});
      }

      favorites.products = []; 
      await favorites.save();

      res.json({ message: "Todos los favoritos borrados", favorites });

  }catch{
    res.status(500).json({error: "Internal Server Error"});
  }
  

};



//////////////// BORRAR UN SOLO FAVORITO /////////////////////////////////////////////////////

export const deleteFavorite = async (req, res) => {
  try {

    const favorites = await Favorites.findOne({ 
      user: req.user.id,
    });

    const { id } = req.params; 

    const favorite = await Favorites.findOne({"products.product": id});

    if (!favorite) {
      return res.status(404).json({ error: "Este favorito no existe" });
    }

    
    favorite.products = favorite.products.filter((item) => item.product.toString() !== id);
    await favorite.save();

    res.status(200).send({ message: "Favorito borrado" });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Favorito no válido" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};