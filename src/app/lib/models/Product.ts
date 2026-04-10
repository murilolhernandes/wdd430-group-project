import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  artisan: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  featured: { type: Boolean, default: false },
  imageAlt: { type: String, required: true },
  imageSrc: { type: String, required: true },
  material: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0},
  shippingEstimate: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);