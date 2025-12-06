import express from "express"
import { PORT } from "./utils/env-util"
import { apiRouter } from "./routes/public-api"  
import { errorMiddleware } from "./middlewares/error-middleware"

const app = express()

app.use(express.json())
app.use("/api", apiRouter)  
app.use(errorMiddleware)

app.listen(PORT || 3000, () => {
    console.log(`Server running on port ${PORT || 3000}`)
})