import userRoutes from "./user/user.routes.js"
import companyRoutes from "./company/company.routes.js"
import jobRoutes from "./job/job.routes.js"
import applicationRoutes from "./application/application.routes.js"


import { auth } from "../middleware/auth.js"



export const allRoutes=(app)=>{
    app.use("/api/v1/user",userRoutes)
    app.use("/api/v1/company",auth,companyRoutes)
    app.use("/api/v1/job",auth,jobRoutes)
    app.use("/api/v1/application",auth,applicationRoutes)



}