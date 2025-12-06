import { Restaurant } from "@prisma/client"
import { ResponseError } from "../error/response-error"
import {
    RestaurantCreateUpdateRequest,
    RestaurantResponse,
    toRestaurantResponse,
    toRestaurantResponseList,
} from "../model/restaurant-model"
import { prismaClient } from "../utils/database-util"
import { RestaurantValidation } from "../validation/restaurant-validation"
import { Validation } from "../validation/validation"

export class RestaurantService {
    // Get all restaurants
    static async getAllRestaurants(): Promise<RestaurantResponse[]> {
        const restaurants = await prismaClient.restaurant.findMany()
        return toRestaurantResponseList(restaurants)
    }

    // Get opened restaurants only
    static async getOpenedRestaurants(): Promise<RestaurantResponse[]> {
        const restaurants = await prismaClient.restaurant.findMany({
            where: {
                isOpen: true,
            },
        })
        return toRestaurantResponseList(restaurants)
    }

    // Get closed restaurants only
    static async getClosedRestaurants(): Promise<RestaurantResponse[]> {
        const restaurants = await prismaClient.restaurant.findMany({
            where: {
                isOpen: false,
            },
        })
        return toRestaurantResponseList(restaurants)
    }

    // Get restaurant by ID
    static async getRestaurant(restaurantId: number): Promise<RestaurantResponse> {
        const restaurant = await this.checkRestaurantIsEmpty(restaurantId)
        return toRestaurantResponse(restaurant)
    }

    // Check if restaurant exists
    static async checkRestaurantIsEmpty(restaurantId: number): Promise<Restaurant> {
        const restaurant = await prismaClient.restaurant.findFirst({
            where: {
                id: restaurantId,
            },
        })

        if (!restaurant) {
            throw new ResponseError(404, "Restaurant not found!")
        }

        return restaurant
    }

    // Create new restaurant
    static async createRestaurant(
        reqData: RestaurantCreateUpdateRequest
    ): Promise<string> {
        const validatedData = Validation.validate(
            RestaurantValidation.CREATE_UPDATE,
            reqData
        )

        await prismaClient.restaurant.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                isOpen: validatedData.isOpen,
            },
        })

        return "Restaurant data has been created successfully!"
    }

    // Update restaurant
    static async updateRestaurant(
        restaurantId: number,
        reqData: RestaurantCreateUpdateRequest
    ): Promise<string> {
        const validatedData = Validation.validate(
            RestaurantValidation.CREATE_UPDATE,
            reqData
        )

        await this.checkRestaurantIsEmpty(restaurantId)

        await prismaClient.restaurant.update({
            where: {
                id: restaurantId,
            },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                isOpen: validatedData.isOpen,
            },
        })

        return "Restaurant data has been updated successfully!"
    }

    // Update restaurant status (open/closed)
    static async updateRestaurantStatus(
        restaurantId: number,
        isOpen: boolean
    ): Promise<string> {
        await this.checkRestaurantIsEmpty(restaurantId)

        await prismaClient.restaurant.update({
            where: {
                id: restaurantId,
            },
            data: {
                isOpen: isOpen,
            },
        })

        return `Restaurant status has been updated to ${isOpen ? "open" : "closed"}!`
    }

    // Delete restaurant
    static async deleteRestaurant(restaurantId: number): Promise<string> {
        await this.checkRestaurantIsEmpty(restaurantId)

        await prismaClient.restaurant.delete({
            where: {
                id: restaurantId,
            },
        })

        return "Restaurant data has been deleted successfully!"
    }
}