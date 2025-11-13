import { Request, Response } from "express";
import { IResponse } from "../utils/commonInterfaces"
import { MovieModel } from "../db/models/movie.model";
import { TVShowModel } from "../db/models/tvshow.model";

export async function getMovieList(req: Request, res: Response) {
    const responseBody: IResponse = { status: 200, success: true, message: '' }
    try {
        const { page, limit, search, genre } = req.query;
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        const offset: number = (pageNum - 1) * limitNum;
        let filterCondition: any = {}
        if (search) {
            filterCondition.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]

        }
        if (genre) {
            filterCondition.genres = genre;
        }
        const [movieData, totalCount] = await Promise.all([
            MovieModel.find(filterCondition).skip(offset).limit(limitNum).sort({ title: -1 }).select({ _id: 0, id: 1, title: 1, description: 1, genres: 1, releaseDate: 1, director: 1, actors: 1 }),
            MovieModel.countDocuments(filterCondition)
        ])

        responseBody.status = 200;
        responseBody.success = true;
        if (totalCount) {
            responseBody.message = 'Data Fetched Successfully';
            responseBody.data = {
                totalCount,
                data: movieData,
                allPages: Math.ceil(totalCount / limitNum)

            }
        } else {
            responseBody.message = 'No data found';
            responseBody.data = {}
        }

        return res.status(responseBody.status).json(responseBody)
    } catch (error) {
        console.error("error in getMovieList ", error);
        responseBody.message = 'Internal Server Error';
        responseBody.status = 500;
        responseBody.success = false;
        return res.status(responseBody.status).json(responseBody)
    }
}

export async function getTvShowList(req: Request, res: Response) {
    const responseBody: IResponse = { status: 200, success: true, message: '' }
    try {
        const { page, limit, search, genre } = req.query;
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const offset: number = (pageNum - 1) * limitNum;
        let filterCondition: any = {};
        if (search) {
            filterCondition.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        if (genre) {
            filterCondition.genres = genre;
        }

        const [showData, totalCount] = await Promise.all([
            TVShowModel.find(filterCondition).skip(offset).limit(limitNum).sort({ title: -1 }).select({ _id: 0, id: 1, title: 1, description: 1, genres: 1, episodes: 1 }),
            TVShowModel.countDocuments(filterCondition)
        ])

        if (totalCount) {
            responseBody.message = 'Data Fetched Successfully';
            responseBody.data = {
                totalCount,
                data: showData,
                allPages: Math.ceil(totalCount / limitNum)

            }
        } else {
            responseBody.message = 'No data found';
            responseBody.data = {}
        }

        return res.status(responseBody.status).json(responseBody)

    } catch (error) {
        console.error("error in getTvShowList ", error);
        responseBody.message = 'Internal Server Error';
        responseBody.status = 500;
        responseBody.success = false;
        return res.status(responseBody.status).json(responseBody)
    }
}
