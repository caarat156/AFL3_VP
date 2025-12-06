import { Customer } from "@prisma/client"

export interface CustomerResponse {
    id: number
    name: string
    phone: string
}

export function toCustomerResponseList(prismaCustomer: Customer[]): CustomerResponse[] {
    return prismaCustomer.map((customer) => {
        return {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
        }
    })
}

export function toCustomerResponse(prismaCustomer: Customer): CustomerResponse {
    return {
        id: prismaCustomer.id,
        name: prismaCustomer.name,
        phone: prismaCustomer.phone,
    }
}

export interface CustomerCreateUpdateRequest {
    name: string
    phone: string
}