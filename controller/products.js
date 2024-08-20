import path from "path";
import { Products, validateProducts } from "../models/productSchema.js";
import fs from "fs";
import { Admins } from "../models/adminSchema.js";

class ProductsController {
  async get(req, res) {
    try {
      let { limit, skip } = req.query;
      const products = await Products.find()
        .populate([
          { path: "adminId", select: ["fname", "username"] },
          { path: "categoryId", select: ["title"] },
        ])
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * skip);

      if (!products.length) {
        return res.status(400).json({
          msg: "Blog is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All Blogs",
        variant: "success",
        payload: products,
        totalCount: products.length,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async getSingleProduct(req, res) {
    try {
      let { id } = req.params;
      const product = await Products.findById(id).populate([
        { path: "adminId", select: ["fname", "username"] },
        { path: "categoryId", select: ["title"] },
      ]);

      res.status(200).json({
        msg: "Product fetched successfully",
        variant: "success",
        payload: product,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async getFromCategory(req, res) {
    try {
      let { categoryId } = req.params;

      const products = await Products.find({ categoryId })
        .populate([
          { path: "adminId", select: ["fname", "username"] },
          { path: "categoryId", select: ["title"] },
        ])
        .sort({ createdAt: -1 });

      if (!products.length) {
        return res.status(400).json({
          msg: "Products is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All Blogs",
        variant: "success",
        payload: products,
        totalCount: products.length,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async getUserSearch(req, res) {
    try {
      let { value = "", limit = 3 } = req.query;
      let text = value.trim();
      if (!text) {
        return res.status(400).json({
          msg: "write something",
          variant: "error",
          payload: null,
        });
      }
      const users = await Admins.find({
        $or: [
          { fname: { $regex: text, $options: "i" } },
          { username: { $regex: text, $options: "i" } },
        ],
      }).limit(limit);
      if (!users.length) {
        return res.status(400).json({
          msg: "user not found",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "user found",
        variant: "success",
        payload: users,
      });
    } catch {
      res.status(500).json({
        msg: "server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async create(req, res) {
    try {
      let urls = req.files.map(
        (i) => `${req.protocol}://${req.get("host")}/images/${i.filename}`
      );

      let {
        title,
        price,
        oldPrice,
        stock,
        rating,
        views,
        units,
        desc,
        info,
        available,
        categoryId,
      } = req.body;

      const existingProduct = await Products.findOne({ title });
      if (existingProduct) {
        return res.status(400).json({
          msg: "Product already exists.",
          variant: "error",
          payload: null,
        });
      }

      let newProduct = {
        title,
        price,
        oldPrice,
        stock,
        rating,
        views,
        categoryId,
        units,
        desc,
        urls,
        info,
        available,
      };

      const { error } = validateProducts(newProduct);

      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "warning",
          payload: null,
        });
      }
      const products = await Products.create({
        ...newProduct,
        adminId: req.admin._id,
      });
      res.status(201).json({
        msg: "Category is created",
        variant: "success",
        payload: products,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const existCategory = await Products.findById(id);
      if (!existCategory) {
        return res.status(400).json({
          msg: "Product is not found",
          variant: "warning",
          payload: null,
        });
      }

      const category = await Products.findByIdAndDelete(id, { new: true });
      res.status(200).json({
        msg: "Product delete successfully",
        variant: "success",
        payload: category,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;

      if (req.body.urls) {
        return res.status(400).json({
          msg: "The images cannot be edited here",
          variant: "warning",
          payload: null,
        });
      }

      const existProducts = Products.findById(id);
      if (!existProducts) {
        return res.status(400).json({
          msg: "Product is not found",
          variant: "warning",
          payload: null,
        });
      }

      const user = await Products.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({
        msg: "Products updated successfully",
        variant: "success",
        payload: user,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async deleteImages(req, res) {
    try {
      let { id } = req.params;
      let product = await Products.findById(id);

      product?.urls?.forEach((el) => {
        let name = el.split("/").slice(-1)[0];
        const filePath = path.join("files", name);
        fs.unlinkSync(filePath);
      });

      await Products.findByIdAndDelete(id);
      res.json("product deleted");
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new ProductsController();
