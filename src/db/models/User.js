import { model, Schema } from 'mongoose';
import { ROLES } from '../../constants/index.js';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // email: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: ROLES.AUTOR,
    },
  },
  { timestamps: true, versionKey: false },
);

 export const UsersCollection = model('user', usersSchema);

