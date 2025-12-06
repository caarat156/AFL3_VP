import { NextFunction, Request, Response } from "express"
import { OrderService } from "../services/order-service"
import { OrderCreateRequest } from "../model/order-model"

export class OrderController {
    static async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const customerId = req.query.customerId
                ? Number(req.query.customerId)
                : undefined
            const restaurantId = req.query.restaurantId
                ? Number(req.query.restaurantId)
                : undefined

            let response

            if (customerId) {
                response = await OrderService.getOrdersByCustomer(customerId)
            } else if (restaurantId) {
                response = await OrderService.getOrdersByRestaurant(restaurantId)
            } else {
                response = await OrderService.getAllOrders()
            }

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = Number(req.params.orderId)

            const response = await OrderService.getOrder(orderId)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const reqData = req.body as OrderCreateRequest

            const response = await OrderService.createOrder(reqData)

            res.status(201).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = Number(req.params.orderId)

            const response = await OrderService.deleteOrder(orderId)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}