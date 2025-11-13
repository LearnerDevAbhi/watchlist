import { Schema, model, Document } from 'mongoose';
import { GenreEnum } from '../../utils/commonEnum';
import { v4 as uuidv4 } from 'uuid';
import { IMovie } from '../../utils/commonInterfaces';


  
  const MovieSchema = new Schema<IMovie>({
    id: { type: String, default: uuidv4() },
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: [{ type: String,enum: Object.values(GenreEnum), required: true }],
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: [{ type: String, required: true }],
  },{
    timestamps: true, // adds createdAt and updatedAt automatically
  });
  
  export const MovieModel = model<IMovie>('Movie', MovieSchema);
  