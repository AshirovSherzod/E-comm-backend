import Joi from "joi";
import mongoose, { Schema } from 'mongoose'

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
        required: false,
        default: 0
    },
    stock: {
        type: Number,
        required: false,
        default: 0
    },
    rating: {
        type: Number,
        required: false,
        default: 0
    },
    views: {
        type: Number,
        required: false,
        default: 0
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "Admins",
        required: true,
    },
    units: {
        type: String,
        required: true,
        enum: ["kg", "m", "litr", "dona"]
    },
    desc: {
        type: String,
        required: true
    },
    urls: {
        type: Array,
        required: false,
        default: []
    },
    info: {
        type: Array,
        required: false,
        default: []
    },
    available: {
        type: Boolean,
        required: false,
        default: true
    }
}, { timestamps: true })

export const Products = mongoose.model("Products", productsSchema)

export const validateProducts = (body) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        oldPrice: Joi.number().allow(0),
        stock: Joi.number().allow(0),
        rating: Joi.number().allow(0),
        views: Joi.number().allow(0),
        categoryId: Joi.string().required(),
        units: Joi.string().required(),
        desc: Joi.string().required(),
        urls: Joi.array(),
        info: Joi.array(),
        available: Joi.boolean().allow(false),
    })
    return schema.validate(body)
};