import express from "express";
import AdminsController from "../controller/admins.js";
import CategoryController from "../controller/category.js";
import ProductsController from "../controller/products.js";
import { Auth, OwnerAuth as OwnerAuth } from "../middleware/adminAuth.js";
import { upload } from "../middleware/uploader.js";
const router = express.Router();

//admins
router.get("/admins", [Auth, OwnerAuth], AdminsController.get);
router.get("/admins/profile", [Auth], AdminsController.getprofile);
router.get("/admins/:id", [Auth, OwnerAuth], AdminsController.getOneAdmin);
router.post("/admins/sign-up", [Auth, OwnerAuth], AdminsController.create);
router.post("/admins/sign-in", AdminsController.signin);
router.patch("/admins/:id", [Auth, OwnerAuth], AdminsController.update);
router.delete("/admins/:id", [Auth, OwnerAuth], AdminsController.delete);

//category
router.get("/category", [Auth], CategoryController.get);
router.post("/category", [Auth], CategoryController.create);
router.delete("/category/:id", [Auth], CategoryController.delete);
router.patch("/category/:id", [Auth], CategoryController.update);

//products
router.get("/products", [Auth], ProductsController.get);
router.get(
  "/products/category/:categoryId",
  [Auth],
  ProductsController.getFromCategory
);
router.post(
  "/products",
  [Auth, upload.array("photos")],
  ProductsController.create
);
router.patch("/products/:id", [Auth], ProductsController.update);
router.delete("/products/images/:id", [Auth], ProductsController.deleteImages);
router.delete("/products/:id", [Auth], ProductsController.deleteImages);

export default router;

