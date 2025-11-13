import { Schema, model, Document } from 'mongoose';
import { GenreEnum } from '../../utils/commonEnum'; // optional: if you're organizing types separately
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../utils/commonInterfaces';



const UserSchema = new Schema<IUser>({
  id: { type: String, default: uuidv4() },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    favoriteGenres: [{ type: String,enum: Object.values(GenreEnum), required: true }],
    dislikedGenres: [{ type: String,enum: Object.values(GenreEnum), required: true }],
  },
  watchHistory: [
    {   
      contentId: { type: String, required: true },
      watchedOn: { type: Date, required: true },
      contentType: {type: String, enum: Object.values(GenreEnum), require: true},
      rating: { type: Number },
    },
  ]
},{
    timestamps: true, // adds createdAt and updatedAt automatically
  });

export const UserModel = model<IUser>('User', UserSchema);
