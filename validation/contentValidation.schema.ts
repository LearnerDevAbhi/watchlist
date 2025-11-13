import Joi from 'joi';
import { GenreEnum } from '../utils/commonEnum';

export const getMovieQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
  genre:Joi.string().valid(...Object.values(GenreEnum)).optional(),
  search: Joi.string().allow('', null).optional()
});

export const getTvShowSchema = Joi.object({
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
    genre:Joi.string().valid(...Object.values(GenreEnum)).optional(),
    search: Joi.string().allow('', null).optional()
  });
