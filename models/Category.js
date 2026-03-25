import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [50, "Name must be at most 50 characters"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    // type: {
    // ...
    // },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Category", categorySchema);
