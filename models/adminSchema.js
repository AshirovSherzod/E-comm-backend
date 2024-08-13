import Joi from "joi";
import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: false,
        default: ""
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        enum: ["owner", "admin"],
        default: "admin"
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
}, { timestamps: true })

export const Admins = mongoose.model("Admins", adminSchema)

export const validateAdmins = (body) => {
    const schema = Joi.object({
        fname: Joi.string().required(),
        lname: Joi.string().allow(""),
        phone: Joi.string().required(),
        role: Joi.string().allow("admin"),
        username: Joi.string().required(),
        password: Joi.string().required(),
        isActive: Joi.boolean().allow(true),
    })
    return schema.validate(body)
};