import multer from "multer"
import { v4 } from "uuid"

const storage = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, "./files")
    },

    filename: (req, file, callback) => {
        callback(null, v4() + "--" + file.originalname)
    }
})

export const upload = multer({ storage })