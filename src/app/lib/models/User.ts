import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  cart: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, default: 1, required: true }
    }
  ],
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);