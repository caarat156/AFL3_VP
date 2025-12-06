import { NextFunction, Request, Response } from "express"
import { CustomerService } from "../services/customer-service"
import { CustomerCreateUpdateRequest } from "../model/customer-model"

export class CustomerController {
    static async getAllCustomers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const response = await CustomerService.getAllCustomers()
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const customerId = Number(req.params.customerId)
            
            if (isNaN(customerId) || customerId <= 0) {
                return res.status(400).json({
                    success: false,
                    errors: "Invalid customer ID"
                })
            }

            const response = await CustomerService.getCustomer(customerId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async createCustomer(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const reqData = req.body as CustomerCreateUpdateRequest
            const response = await CustomerService.createCustomer(reqData)
            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async updateCustomer(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const customerId = Number(req.params.customerId)
            
            if (isNaN(customerId) || customerId <= 0) {
                return res.status(400).json({
                    success: false,
                    errors: "Invalid customer ID"
                })
            }

            const reqData = req.body as CustomerCreateUpdateRequest
            const response = await CustomerService.updateCustomer(
                customerId,
                reqData
            )
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async deleteCustomer(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const customerId = Number(req.params.customerId)
            
            if (isNaN(customerId) || customerId <= 0) {
                return res.status(400).json({
                    success: false,
                    errors: "Invalid customer ID"
                })
            }

            const response = await CustomerService.deleteCustomer(customerId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}