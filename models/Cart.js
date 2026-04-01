import mongoose from "mongoose";

const cartSchema = new mongoose.Schema( //dbee tener un propiertario y varios productos, estos en un array
{
    user:{ 
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          require: true,
          unique: true, // solo puede haber uno
        },
    
    products: [{

        product: {
            type: mongoose.Schema.Types.ObjectId, // se guardará la id del producto
            ref: "Product",
            require: true,
        },
        
        quantity: {
            type: Number,
            // required: true,
            default: 1, // predeterminado si no se le pasa una cantidad pone esa por defecto
            min: 1,
            
        },

    }],
    
},


{timestamps: true,}
);

export default mongoose.model("Cart", cartSchema);