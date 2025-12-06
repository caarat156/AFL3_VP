import { z, ZodType } from "zod"

export class RestaurantValidation {
    static readonly CREATE_UPDATE: ZodType = z.object({
        name: z
            .string()
            .min(1, "Name cannot be empty!")
            .max(100, "Name is too long!"),
        description: z
            .string()
            .min(1, "Description cannot be empty!")
            .max(500, "Description is too long!"),
        isOpen: z.boolean(),
    })

    static readonly UPDATE_STATUS: ZodType = z.object({
        isOpen: z.boolean(),
    })
}