import mongoose from "mongoose";

const favSchema = new mongoose.Schema( 
{
    user:{ 
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          require: true,
          unique: true, 
        },
    
    products: [{

        product: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Product",
            require: true,
        },

    }],
    
},


{timestamps: true,}
);

export default mongoose.model("Favorites", favSchema);