import { Category, validateCategory } from "../models/categorySchema.js"

class CategoryController {
    async get(req, res) {
        try {
            const blogs = await Category.find().populate([
                { path: "userId", select: ["fname", "username"] }
            ]).sort({ createdAt: -1 })
            if (!blogs.length) {
                return res.status(400).json({
                    msg: "Blog is not defined",
                    variant: "error",
                    payload: null
                })
            }
            res.status(200).json({
                msg: "All Blogs",
                variant: "success",
                payload: blogs
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
            const { error } = validateCategory(req.body)

            if (error) {
                return res.status(400).json({
                    msg: error.details[0].message,
                    variant: "warning",
                    payload: null
                })
            }
            const category = await Category.create({ ...req.body, userId: req.admin._id })
            res.status(201).json({
                msg: "Category is created",
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
    async delete(req, res) {
        try {
            const { id } = req.params
            const existCategory = await Category.findById(id)
            if (!existCategory) {
                return res.status(400).json({
                    msg: "Category is not found",
                    variant: "warning",
                    payload: null
                })
            }
            const category = await Category.findByIdAndDelete(id, { new: true })

            res.status(200).json({
                msg: "Category is deleted",
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

            const existCategory = Category.findById(id)
            if (!existCategory) {
                return res.status(400).json({
                    msg: "Category is not found",
                    variant: "warning",
                    payload: null
                })
            }

            const user = await Category.findByIdAndUpdate(id, req.body, { new: true })
            res.status(200).json({
                msg: "User is updated",
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

export default new CategoryController()