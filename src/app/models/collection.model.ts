import mongoose from "mongoose";

// const GeoCollectionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   placeName: { type: String, required: true },
//   category: { type: String, required: true },
//   keyword: { type: String, required: true },
//   batchId: { type: String, required: true },
//   collectionName: { type: String, required: true }, // Changed to collectionName
//   createdAt: { type: Date, default: Date.now },
//   rating: { type: Number },
//   formatted_phone_number: { type: String },
//   formatted_address: { type: String },
//   price_level: { type: Number },
//   // photos: { type: [String] },
// });
const GeoCollectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  placeName: { type: String, required: true },
  category: { type: String, required: true },
  keyword: { type: String, required: true },
  batchId: { type: String, required: true },
  collectionName: { type: String, required: true,}, // Default value for collectionName
  createdAt: { type: Date, default: Date.now }, // Already has default value
  rating: { type: Number, default: null }, // Default value for rating
  formatted_phone_number: { type: String, default: null }, // Default value for formatted_phone_number
  formatted_address: { type: String, default: null }, // Default value for formatted_address
  price_level: { type: Number, default: null}, // Already has default value
  // photos: { type: [String] }, // You can uncomment and add default value if needed
});

const GeoCollection =
  mongoose.models.GeoCollection ||
  mongoose.model("GeoCollection", GeoCollectionSchema);

export default GeoCollection;
