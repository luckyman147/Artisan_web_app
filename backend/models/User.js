import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'artisan'], 
    default: 'user'           
  },
  email: { type: String, required: true, unique: true },
  phone: { type: Number },
  facebookId: { type: String },
  googleId: { type: String},
  adress: { type: String},
  shopDescription: { type: String},
  registrationDate: { type: Date, default: Date.now },

  company_name: { type: String },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
 