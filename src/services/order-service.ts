import { Order } from "@prisma/client"
import { ResponseError } from "../error/response-error"
import {
    OrderCreateRequest,
    OrderResponseWithDetails,
    toOrderResponseWithDetailsList,
    toOrderResponseWithDetails,
    calculateETA,
} from "../model/order-model"
import { prismaClient } from "../utils/database-util"
import { OrderValidation } from "../validations/order-validation"
import { Validation } from "../validations/validation"

export class OrderService {
    static async getAllOrders(): Promise<OrderResponseWithDetails[]> {
        const orders = await prismaClient.order.findMany({
            include: {
                customer: true,
                restaurant: true,
            },
        })
        return toOrderResponseWithDetailsList(orders)
    }

    static async getOrdersByCustomer(
        customerId: number
    ): Promise<OrderResponseWithDetails[]> {
        // ✅ DIPERBAIKI - Check existence dalam satu query
        const orders = await prismaClient.order.findMany({
            where: { customerId: customerId },
            include: {
                customer: true,
                restaurant: true,
            },
        })

        if (orders.length === 0) {
            // Verify customer exists
            const customer = await prismaClient.customer.findUnique({
                where: { id: customerId }
            })
            if (!customer) {
                throw new ResponseError(404, "Customer not found!")
            }
        }

        return toOrderResponseWithDetailsList(orders)
    }

    static async getOrdersByRestaurant(
        restaurantId: number
    ): Promise<OrderResponseWithDetails[]> {
        const orders = await prismaClient.order.findMany({
            where: { restaurantId: restaurantId },
            include: {
                customer: true,
                restaurant: true,
            },
        })

        if (orders.length === 0) {
            const restaurant = await prismaClient.restaurant.findUnique({
                where: { id: restaurantId }
            })
            if (!restaurant) {
                throw new ResponseError(404, "Restaurant not found!")
            }
        }

        return toOrderResponseWithDetailsList(orders)
    }

    // ✅ DIPERBAIKI - Hapus redundant query
    static async getOrder(orderId: number): Promise<OrderResponseWithDetails> {
        const orderWithDetails = await prismaClient.order.findUnique({
            where: { id: orderId },
            include: {
                customer: true,
                restaurant: true,
            },
        })

        if (!orderWithDetails) {
            throw new ResponseError(404, "Order not found!")
        }

        return toOrderResponseWithDetails(
            orderWithDetails,
            orderWithDetails.customer,
            orderWithDetails.restaurant
        )
    }

    static async checkOrderExists(orderId: number): Promise<Order> {  // ✅ DIPERBAIKI
        const order = await prismaClient.order.findUnique({
            where: { id: orderId }
        })

        if (!order) {
            throw new ResponseError(404, "Order not found!")
        }

        return order
    }

    // ✅ DIPERBAIKI - Gunakan transaction
    static async createOrder(
        reqData: OrderCreateRequest
    ): Promise<{ message: string; orderId: number }> {
        const validatedData = Validation.validate(
            OrderValidation.CREATE,
            reqData
        )

        const result = await prismaClient.$transaction(async (tx) => {
            // Check customer exists
            const customer = await tx.customer.findUnique({
                where: { id: validatedData.customerId }
            })
            if (!customer) {
                throw new ResponseError(404, "Customer not found!")
            }

            // Check restaurant exists and is open
            const restaurant = await tx.restaurant.findUnique({
                where: { id: validatedData.restaurantId }
            })
            if (!restaurant) {
                throw new ResponseError(404, "Restaurant not found!")
            }
            if (!restaurant.isOpen) {
                throw new ResponseError(400, "Restaurant is currently closed!")
            }

            // Calculate order time and ETA
            const orderTime = new Date()
            const eta = calculateETA(validatedData.itemCount, orderTime)

            // Create order
            return await tx.order.create({
                data: {
                    customerId: validatedData.customerId,
                    restaurantId: validatedData.restaurantId,
                    itemCount: validatedData.itemCount,
                    orderTime: orderTime,
                    eta: eta,
                },
            })
        })

        return {
            message: "Order has been created successfully!",
            orderId: result.id
        }
    }

    static async deleteOrder(orderId: number): Promise<string> {
        await this.checkOrderExists(orderId)  // ✅ DIPERBAIKI

        await prismaClient.order.delete({
            where: { id: orderId },
        })

        return "Order has been deleted successfully!"
    }
}