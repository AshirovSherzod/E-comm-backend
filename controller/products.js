import { Products, validateProducts } from "../models/productSchema.js"

class ProductsController {
    async get(req, res) {
        try {

            let { limit, skip } = req.query
            const products = await Products.find().populate([
                { path: "adminId", select: ["fname", "username"] }
            ]).sort({ createdAt: -1 }).limit(limit).skip(limit * skip)

            if (!products.length) {
                return res.status(400).json({
                    msg: "Blog is not defined",
                    variant: "error",
                    payload: null
                })
            }
            res.status(200).json({
                msg: "All Blogs",
                variant: "success",
                payload: products,
                totalCount: products.length
            })
        } catch (error) {

            res.status(500).json({
                msg: "Server error",
                variant: "error",
                payload: null
            })
        }
    }
    async create(req, res) {
        try {
            const { error } = validateProducts(req.body)

            if (error) {
                return res.status(400).json({
                    msg: error.details[0].message,
                    variant: "warning",
                    payload: null
                })
            }
            const products = await Products.create({ ...req.body, adminId: req.admin._id })
            res.status(201).json({
                msg: "Category is created",
                variant: "success",
                payload: products
            })
        } catch {
            res.status(500).json({
                msg: "Server error",
                variant: "error",
                payload: null
            })
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const existCategory = await Products.findById(id)
            if (!existCategory) {
                return res.status(400).json({
                    msg: "Product is not found",
                    variant: "warning",
                    payload: null
                })
            }
            const category = await Products.findByIdAndDelete(id, { new: true })

            res.status(200).json({
                msg: "Product delete successfully",
                variant: "success",
                payload: category
            })
        } catch {
            res.status(500).json({
                msg: "Server error",
                variant: "error",
                payload: null
            })
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params

            const existProducts = Products.findById(id)
            if (!existProducts) {
                return res.status(400).json({
                    msg: "Product is not found",
                    variant: "warning",
                    payload: null
                })
            }

            const user = await Products.findByIdAndUpdate(id, req.body, { new: true })
            res.status(200).json({
                msg: "Products updated successfully",
                variant: "success",
                payload: user
            })
        } catch {
            res.status(500).json({
                msg: "Server error",
                variant: "error",
                payload: null
            })
        }
    }
}

export default new ProductsController()