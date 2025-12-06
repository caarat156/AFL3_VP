import { NextFunction, Request, Response } from "express"
import { RestaurantService } from "../services/restaurant-service"
import { RestaurantCreateUpdateRequest } from "../model/restaurant-model"

export class RestaurantController {
    static async getAllRestaurants(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status = req.query.status as string

            let response

            if (status === "open") {
                response = await RestaurantService.getOpenedRestaurants()
            } else if (status === "closed") {
                response = await RestaurantService.getClosedRestaurants()
            } else {
                response = await RestaurantService.getAllRestaurants()
            }

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getRestaurant(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const restaurantId = Number(req.params.restaurantId)

            const response = await RestaurantService.getRestaurant(restaurantId)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async createRestaurant(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const reqData = req.body as RestaurantCreateUpdateRequest

            const response = await RestaurantService.createRestaurant(reqData)

            res.status(201).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateRestaurant(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const restaurantId = Number(req.params.restaurantId)
            const reqData = req.body as RestaurantCreateUpdateRequest

            const response = await RestaurantService.updateRestaurant(
                restaurantId,
                reqData
            )

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateRestaurantStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const restaurantId = Number(req.params.restaurantId)
            const { isOpen } = req.body

            const response = await RestaurantService.updateRestaurantStatus(
                restaurantId,
                isOpen
            )

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteRestaurant(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const restaurantId = Number(req.params.restaurantId)

            const response = await RestaurantService.deleteRestaurant(
                restaurantId
            )

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}