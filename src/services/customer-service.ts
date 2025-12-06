import { Customer } from "@prisma/client"
import { ResponseError } from "../error/response-error"
import {
    CustomerCreateUpdateRequest,
    CustomerResponse,
    toCustomerResponse,
    toCustomerResponseList,
} from "../model/customer-model"
import { prismaClient } from "../utils/database-util"
import { CustomerValidation } from "../validations/customer-validation"
import { Validation } from "../validations/validation"

export class CustomerService {
    static async getAllCustomers(): Promise<CustomerResponse[]> {
        const customers = await prismaClient.customer.findMany()
        return toCustomerResponseList(customers)
    }

    static async getCustomer(customerId: number): Promise<CustomerResponse> {
        const customer = await this.checkCustomerExists(customerId)  
        return toCustomerResponse(customer)
    }

    static async checkCustomerExists(customerId: number): Promise<Customer> {
        const customer = await prismaClient.customer.findUnique({
            where: { id: customerId }
        })

        if (!customer) {
            throw new ResponseError(404, "Customer not found!")
        }

        return customer
    }

    static async createCustomer(
        reqData: CustomerCreateUpdateRequest
    ): Promise<{ message: string; customerId: number }> {  
        const validatedData = Validation.validate(
            CustomerValidation.CREATE_UPDATE,
            reqData
        )

        const customer = await prismaClient.customer.create({
            data: {
                name: validatedData.name,
                phone: validatedData.phone,
            },
        })

        return {
            message: "Customer data has been created successfully!",
            customerId: customer.id
        }
    }

    static async updateCustomer(
        customerId: number,
        reqData: CustomerCreateUpdateRequest
    ): Promise<string> {
        const validatedData = Validation.validate(
            CustomerValidation.CREATE_UPDATE,
            reqData
        )

        await this.checkCustomerExists(customerId)  

        await prismaClient.customer.update({
            where: { id: customerId },
            data: {
                name: validatedData.name,
                phone: validatedData.phone,
            },
        })

        return "Customer data has been updated successfully!"
    }

    static async deleteCustomer(customerId: number): Promise<string> {
        await this.checkCustomerExists(customerId) 

        await prismaClient.customer.delete({
            where: { id: customerId },
        })

        return "Customer data has been deleted successfully!"
    }
}