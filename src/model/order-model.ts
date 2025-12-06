import { Order, Customer, Restaurant } from "@prisma/client"
import { CustomerResponse, toCustomerResponse } from "./customer-model"
import { RestaurantResponse, toRestaurantResponse } from "./restaurant-model"

export interface OrderResponse {
    id: number
    customerId: number
    restaurantId: number
    itemCount: number
    orderTime: Date
    eta: Date
}

export interface OrderResponseWithDetails extends OrderResponse {
    customer: CustomerResponse
    restaurant: RestaurantResponse
}

export function toOrderResponseList(prismaOrder: Order[]): OrderResponse[] {
    return prismaOrder.map((order) => {
        return {
            id: order.id,
            customerId: order.customerId,
            restaurantId: order.restaurantId,
            itemCount: order.itemCount,
            orderTime: order.orderTime,
            eta: order.eta,
        }
    })
}

export function toOrderResponse(prismaOrder: Order): OrderResponse {
    return {
        id: prismaOrder.id,
        customerId: prismaOrder.customerId,
        restaurantId: prismaOrder.restaurantId,
        itemCount: prismaOrder.itemCount,
        orderTime: prismaOrder.orderTime,
        eta: prismaOrder.eta,
    }
}

export function toOrderResponseWithDetails(
    prismaOrder: Order,
    customer: Customer,
    restaurant: Restaurant
): OrderResponseWithDetails {
    return {
        id: prismaOrder.id,
        customerId: prismaOrder.customerId,
        restaurantId: prismaOrder.restaurantId,
        itemCount: prismaOrder.itemCount,
        orderTime: prismaOrder.orderTime,
        eta: prismaOrder.eta,
        customer: toCustomerResponse(customer),
        restaurant: toRestaurantResponse(restaurant),
    }
}

export function toOrderResponseWithDetailsList(
    prismaOrders: Array<Order & { customer: Customer; restaurant: Restaurant }>
): OrderResponseWithDetails[] {
    return prismaOrders.map((order) => {
        return {
            id: order.id,
            customerId: order.customerId,
            restaurantId: order.restaurantId,
            itemCount: order.itemCount,
            orderTime: order.orderTime,
            eta: order.eta,
            customer: toCustomerResponse(order.customer),
            restaurant: toRestaurantResponse(order.restaurant),
        }
    })
}

export interface OrderCreateRequest {
    customerId: number
    restaurantId: number
    itemCount: number
}

export function calculateETA(itemCount: number, orderTime: Date): Date {
    const totalMinutes = (itemCount * 10) + 10
    const eta = new Date(orderTime)
    eta.setMinutes(eta.getMinutes() + totalMinutes)
    return eta
}