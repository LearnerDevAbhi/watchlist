import { Request, Response, NextFunction, request, response} from "express";
import { IResponse } from "../utils/commonInterfaces";
import * as jwt from 'jsonwebtoken';

export async function validateToken(req: Request, res: Response, next : NextFunction) {
    const responseBody:IResponse  = {status:401,success:false,message:'Unauthorized Access'}
    try{
        const access_token = req.headers.access_token as string  | undefined;
        if(!access_token){
           return res.status(401).json(responseBody)
        }
        const bearerToken = access_token.startsWith("Bearer ")? access_token.split(" ")[1]: access_token;

        if (!bearerToken) {
            res.status(401).json(responseBody)
        }
        const verifyToken  =   jwt.verify(bearerToken, process.env.JWT_ACCESS_SECRET as string,{})
        if(!verifyToken){
            res.status(401).json(responseBody)
        }
        next();
    }catch(err:any){
        if (err.name === 'TokenExpiredError') {
            responseBody.message = 'Token expired'
            return res.status(401).json(responseBody);
          }
          if (err.name === 'JsonWebTokenError') {
            responseBody.message = 'Invalid token'
            return res.status(401).json(responseBody);
          }
        console.log("Error while validating the token",err)

    }
    
}

