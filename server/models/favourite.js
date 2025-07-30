// models/favourite.js
import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Properties",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Favourite", favouriteSchema);
