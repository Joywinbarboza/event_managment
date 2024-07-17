// models/geoCollection.model.js
import mongoose from 'mongoose';

const GeoCollectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  placeName: { type: String, required: true },
  category: { type: String, required: true },
  keyword: { type: String, required: true },
  batchId: { type: String, required: true }, // Add batchId field
  createdAt: { type: Date, default: Date.now },
  // You can add more fields as needed
});

const GeoCollection = mongoose.models.GeoCollection || mongoose.model("GeoCollection", GeoCollectionSchema);

export default GeoCollection;
