import { Restaurant } from "@prisma/client"

export interface RestaurantResponse {
    id: number
    name: string
    description: string
    isOpen: boolean
}

export function toRestaurantResponseList(prismaRestaurant: Restaurant[]): RestaurantResponse[] {
    return prismaRestaurant.map((restaurant) => {
        return {
            id: restaurant.id,
            name: restaurant.name,
            description: restaurant.description,
            isOpen: restaurant.isOpen,
        }
    })
}

export function toRestaurantResponse(prismaRestaurant: Restaurant): RestaurantResponse {
    return {
        id: prismaRestaurant.id,
        name: prismaRestaurant.name,
        description: prismaRestaurant.description,
        isOpen: prismaRestaurant.isOpen,
    }
}

export interface RestaurantCreateUpdateRequest {
    name: string
    description: string
    isOpen: boolean
}