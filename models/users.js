import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true
    },
    username: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    role: {
      type: String,
      require: true,
      enum: ['user', 'admin'],
      default: 'user'
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true
    },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'User' }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
