import Joi from 'joi';
import { ItemTypeEnum } from '../utils/commonEnum';


export const addToWatchListSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  movieId: Joi.string().uuid().optional(),
  tvShowId: Joi.string().uuid().optional(),
  rating: Joi.number().optional()
}).xor('movieId', 'tvShowId');

export const removeFromWathcListSchema = Joi.object({
  id: Joi.string().uuid().required()
});

export const getWatchListSchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
  contentType: Joi.string().valid(...Object.values(ItemTypeEnum)).optional(),
  userId: Joi.string().uuid().required(),
});


