import { Request, Response } from "express";
import { IResponse } from "../utils/commonInterfaces"
import { MovieModel } from "../db/models/movie.model";
import { TVShowModel } from "../db/models/tvshow.model";
import { UserModel } from "../db/models/user.model";
import { UserListModel } from "../db/models/userList.model";
import { ItemTypeEnum } from "../utils/commonEnum";

export async function addToWatchList(req: Request, res: Response) {
    const responseBody: IResponse = { status: 201, success: true, message: '' }
    try {
        const { userId, movieId, tvShowId, rating } = req.body;
        const userRecord = await UserModel.findOne({ id: userId })
        if (!userRecord) {
            responseBody.status = 400
            responseBody.success = false
            responseBody.message = 'Invlid User'
            return res.status(responseBody.status).json(responseBody)
        }

        if (movieId) {
            const movieRecord = await MovieModel.findOne({ id: movieId })
            if (!movieRecord) {
                responseBody.status = 400
                responseBody.success = false
                responseBody.message = 'Invlid Movie Id'
                return res.status(responseBody.status).json(responseBody)
            }
        }
        if (tvShowId) {
            const showRecord = await TVShowModel.findOne({ id: tvShowId })
            if (!showRecord) {
                responseBody.status = 400
                responseBody.success = false
                responseBody.message = 'Invlid Show Id'
                return res.status(responseBody.status).json(responseBody)
            }
        }

        const listRecord = await UserListModel.create({
            userId,
            movieId: movieId || null,
            tvShowId: tvShowId || null,
            rating: rating || null
        })
        if (listRecord.id) {
            responseBody.message = 'Added to watch list'
            responseBody.data = {}
        } else {
            responseBody.message = 'Issue while adding to watch list'
            responseBody.success = false
            responseBody.status = 400
        }
        return res.status(responseBody.status).json(responseBody);
    } catch (error) {
        console.error("error in addToWatchList ", error);
        responseBody.message = 'Internal Server Error';
        responseBody.status = 500;
        responseBody.success = false;
        return res.status(500).json(responseBody)
    }
}

export async function removeFromWathcList(req: Request, res: Response) {
    const responseBody: IResponse = { status: 200, success: false, message: '' }
    try {
        const { id } = req.params;
        const record = await UserListModel.findOneAndDelete({ id: id });
        if (record?.id) {
            responseBody.message = 'Record deleted successfull'
            responseBody.data = {}
        } else {
            responseBody.message = 'Issue while removing from watch list'
            responseBody.success = false
            responseBody.status = 400
        }
        return res.status(responseBody.status).json(responseBody)
    } catch (error) {
        console.error("error in removeFromWathcList ", error);
        responseBody.message = 'Internal Server Error';
        responseBody.status = 500;
        responseBody.success = false;
        return res.status(500).json(responseBody)
    }
}

export async function getWatchList(req: Request, res: Response) {
    const responseBody: IResponse = { status: 200, success: true, message: '' }
    try {
        const { page, limit, userId, contentType } = req.query;
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const offset: number = (pageNum - 1) * limitNum;

        const pipelineArray: any[] = [{ $match: { userId } }]
        const allCountPipeline: any[] = [{ $match: { userId } }]
        if (contentType == ItemTypeEnum.tvshow) {
            pipelineArray.push({
                $lookup: {
                    from: "tvshows",
                    foreignField: 'id',
                    localField: 'tvShowId',
                    as: 'tvShow',
                    pipeline: [
                        {
                            $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
                        }
                    ]
                }
            },
                {
                    $match: { tvShowId: { $ne: null } }
                },
                { $unwind: { path: "$tvShow", preserveNullAndEmptyArrays: true } }
            );
            allCountPipeline.push({ $match: { tvShowId: { $ne: null } } });
        } else if (contentType == ItemTypeEnum.movie) {
            pipelineArray.push(
                {
                    $lookup: {
                        from: "movies",
                        foreignField: 'id',
                        localField: 'movieId',
                        as: 'movie',
                        pipeline: [
                            {
                                $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
                            }
                        ]
                    }
                },
                {
                    $match: { movieId: { $ne: null } }
                },
                { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } }
            )
            allCountPipeline.push({ $match: { movieId: { $ne: null } } })
        } else {
            pipelineArray.push(
                {
                    $lookup: {
                        from: "movies",
                        foreignField: 'id',
                        localField: 'movieId',
                        as: 'movie',
                        pipeline: [
                            {
                                $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
                            }]
                    }
                },
                {
                    $lookup: {
                        from: "tvshows",
                        foreignField: 'id',
                        localField: 'tvShowId',
                        as: 'tvShow',
                        pipeline: [
                            {
                                $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
                            }
                        ]
                    }
                },
                {
                    $match: {
                        $or: [
                            { movieId: { $ne: null } },
                            { tvShowId: { $ne: null } }
                        ]
                    }
                },
                { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$tvShow", preserveNullAndEmptyArrays: true } }
            )
        }
        allCountPipeline.push({ $count: "totalCount" });

        pipelineArray.push(
            {
                $project: {
                    _id: 0,
                    id: 1,
                    userId: 1,
                    movieId: 1,
                    tvShowId: 1,
                    rating: 1,
                    movie: 1,
                    tvShow: 1
                }
            },
            { $skip: offset },
            { $limit: limitNum },
            { $sort: { createdAt: -1 } },
        )
        const result: any = await UserListModel.aggregate([
            {
                $facet: {
                    data: pipelineArray,
                    totalCount: allCountPipeline
                }
            }
        ])

        if (result[0]?.data) {
            responseBody.message = 'Data Fetched Successfully';
            responseBody.data = {
                totalCount: result[0]?.totalCount[0].totalCount,
                data: result[0]?.data,
                allPages: Math.ceil(result[0]?.totalCount[0]?.totalCount / limitNum)
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
