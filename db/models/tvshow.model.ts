import { GenreEnum } from "../../utils/commonEnum";
import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ITVShow } from "../../utils/commonInterfaces";


  
  const TVShowSchema = new Schema<ITVShow>({
    id:{type:String, default:uuidv4()},
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: [{ type: String,enum: Object.values(GenreEnum), required: true }],
    episodes: [
      {
        episodeNumber: { type: Number, required: true },
        seasonNumber: { type: Number, required: true },
        releaseDate: { type: Date, required: true },
        director: { type: String, required: true },
        actors: [{ type: String, required: true }],
      },
    ],
  },{
    timestamps: true, // adds createdAt and updatedAt automatically
  });
  TVShowSchema.index({title:1})
  export const TVShowModel = model<ITVShow>('TVShow', TVShowSchema);
  
