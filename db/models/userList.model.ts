import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUserContent } from '../../utils/commonInterfaces';
import { v4 as uuidv4 } from 'uuid';



  const UserContentSchema = new Schema<IUserContent>(
    {
      id: { type: String, default: uuidv4() },
      userId: { type: String, required: true },
      movieId: { type: String, required: false },
      tvShowId: { type: String, required: false },
      rating:{type:Number, required:false},
      
    },
    {
      timestamps: true, // adds createdAt and updatedAt automatically
    }
  );
  


export const UserListModel =  mongoose.model<IUserContent>('UserList', UserContentSchema);
