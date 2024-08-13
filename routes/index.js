import express from "express"
import AdminsController from "../controller/admins.js"
import CategoryController from "../controller/category.js"
import { Auth, OwnerOrAdminAuth } from "../middleware/adminAuth.js"
const router = express.Router()

//admins
router.get("/admins", [Auth], AdminsController.get)
router.get("/admins/profile", [OwnerOrAdminAuth], AdminsController.getprofile)
router.get("/admins/:id", [Auth], AdminsController.getOneadmin)
router.post("/admins/sign-up", [Auth], AdminsController.create)
router.post("/admins/sign-in", AdminsController.signin)
router.put("/admins/:id", [Auth], AdminsController.update)
router.delete("/admins/:id", [Auth], AdminsController.delete)

//category 
router.get("/category", [OwnerOrAdminAuth], CategoryController.get)
router.post("/category", [OwnerOrAdminAuth], CategoryController.create)
router.delete("/category/:id", [OwnerOrAdminAuth], CategoryController.delete)
router.put("/category/:id", [OwnerOrAdminAuth], CategoryController.update)



export default router