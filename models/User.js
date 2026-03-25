import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email requerido"],
        unique: true, // solo puede haber un registro con ese email.
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password requerido"],
    }
},
{
    timestamps: true,
}
);

export default mongoose.model("User", userSchema);
