import { Request, Response } from "express";
import { IResponse } from "../utils/commonInterfaces"
import { UserModel } from "../db/models/user.model";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import helper from "../utils/helper";



async function login(req: Request, res: Response) {
    const responseBody: IResponse = { status: 200, success: true, message: '' }
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || !(bcrypt.compare(password, user.password))) {
            responseBody.message = 'Invalid credentials'
            return res.status(400).json(responseBody);
        }
        const accessToken = helper.getAccessToken(user);
        const refreshToken = helper.getRefreshToken(user);
        responseBody.data = [{
            id: user.id,
            username: user.username,
            email: user.email,
            access_token: accessToken,
            refresh_token: refreshToken
        }]
        return res.status(200).json(responseBody)
    } catch (error) {
        console.error("error in login ", error);
        responseBody.message = 'Internal Server Error';
        responseBody.status = 500;
        responseBody.success = false;
        return res.status(500).json(responseBody)
    }
}


async function refreshToken(req: Request, res: Response) {
    const responseBody: IResponse = { status: 200, success: true, message: '' }
    try {
        const refreshToken = req.headers['refresh_token'] as string;
        if (!refreshToken) {
            responseBody.status = 401;
            responseBody.success = false;
            responseBody.message = "Invalid refresh token";
            return res.status(responseBody.status).send(responseBody)
        }
        const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET as string;
        if (jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)) {
            const decoded: any = jwt.decode(refreshToken)
            if (!decoded?.id && !decoded?.email) {
                responseBody.status = 401
                responseBody.success = false;
                responseBody.message = 'Invalid Refresh Token'
                return res.status(responseBody.status).json(responseBody);
            }
            const accessToken = helper.getAccessToken(decoded)
            responseBody.status = 200
            responseBody.success = true;
            responseBody.message = ''
            responseBody.data = [{ access_token: accessToken }]
            return res.status(responseBody.status).send(responseBody)
        }
        return res.status(responseBody.status).json(responseBody)
    } catch (err: any) {
        console.error("error in refresh token ", err);
        if (err?.name === 'TokenExpiredError') {
            responseBody.message = 'Token expired'
            return res.status(401).json(responseBody);
        }
        if (err.name === 'JsonWebTokenError') {
            responseBody.message = 'Invalid token'
            return res.status(401).json(responseBody);
        }
        responseBody.status = 500;
        responseBody.success = false;
        return res.status(responseBody.status).json(responseBody)
    }
}

export default {
    login,
    refreshToken
}