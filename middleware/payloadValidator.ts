import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../utils/commonInterfaces';
import {ValidationSchemas} from  '../utils/commonInterfaces'
export const validateMiddleware = (schemas: ValidationSchemas) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
        if (schemas.body) {
            const { error } = schemas.body.validate(req.body, { abortEarly: false });
            if (error) return formatError(res, error);
        }

        if (schemas.query) {
          const { error } = schemas.query.validate(req.query, { abortEarly: false });
          if (error) return formatError(res, error);
        }
  
        if (schemas.params) {
          const { error } = schemas.params.validate(req.params, { abortEarly: false });
          if (error) return formatError(res, error);
        }
  
        next();
      } catch (err) {
        next(err);       
      }
};

// helper function to format Joi error messages consistently
function formatError(res: Response, error: any) {
   const responseBody:IResponse  = { status:400,success:false,message:'Validation Error' }
    const details = error.details.map((d: any) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, '')
    }));
  responseBody.data =  details;
  return res.status(400).json(responseBody);
}



