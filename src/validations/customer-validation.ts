import { z, ZodType } from "zod"

export class CustomerValidation {
    static readonly CREATE_UPDATE: ZodType = z.object({
        name: z
            .string()
            .min(1, "Name cannot be empty!")
            .max(100, "Name is too long!"),
        phone: z
            .string()
            .min(10, "Phone number must be at least 10 characters!")
            .max(15, "Phone number is too long!")
            .regex(/^[0-9+\-\s()]+$/, "Phone number can only contain numbers and +, -, (), spaces!"),
    })
}
