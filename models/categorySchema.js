import Joi from "joi";
import mongoose, { Schema } from "mongoose";

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Admins",
        required: true
    }
})

export const Category = mongoose.model("Category", categorySchema)

export const validateCategory = (body) => {
    const schema = Joi.object({
        title: Joi.string().required()
    })

    return schema.validate(body)
}