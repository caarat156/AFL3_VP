import express from "express"
import { CustomerController } from "../controllers/customer-controller"
import { RestaurantController } from "../controllers/restaurant-controller"
import { OrderController } from "../controllers/order-controller"

export const apiRouter = express.Router()
apiRouter.get("/customers", CustomerController.getAllCustomers)
apiRouter.get("/customers/:customerId", CustomerController.getCustomer)
apiRouter.post("/customers", CustomerController.createCustomer)
apiRouter.put("/customers/:customerId", CustomerController.updateCustomer)
apiRouter.delete("/customers/:customerId", CustomerController.deleteCustomer)

apiRouter.get("/restaurants", RestaurantController.getAllRestaurants)
apiRouter.get("/restaurants/:restaurantId", RestaurantController.getRestaurant)
apiRouter.post("/restaurants", RestaurantController.createRestaurant)
apiRouter.put("/restaurants/:restaurantId", RestaurantController.updateRestaurant)
apiRouter.patch("/restaurants/:restaurantId/status", RestaurantController.updateRestaurantStatus)
apiRouter.delete("/restaurants/:restaurantId", RestaurantController.deleteRestaurant)

apiRouter.get("/orders", OrderController.getAllOrders)
apiRouter.get("/orders/:orderId", OrderController.getOrder)
apiRouter.post("/orders", OrderController.createOrder)
apiRouter.delete("/orders/:orderId", OrderController.deleteOrder)