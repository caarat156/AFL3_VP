import { z, ZodType } from "zod"

export class OrderValidation {
    static readonly CREATE: ZodType = z.object({
        customerId: z
            .number()
            .int("Customer ID must be integer!")
            .positive("Customer ID must be positive number!"),
        restaurantId: z
            .number()
            .int("Restaurant ID must be integer!")
            .positive("Restaurant ID must be positive number!"),
        itemCount: z
            .number()
            .int("Item count must be integer!")
            .positive("Item count must be positive number!")
            .min(1, "Item count must be at least 1!")
            .max(100, "Item count cannot exceed 100!"),
    })
}