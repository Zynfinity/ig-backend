import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const customFileName = req.query.filename || Date.now().toString();
        const fileExtension = path.extname(file.originalname);
        cb(null, customFileName + fileExtension);
    }
});

const upload = multer({ storage: storage });

export default upload;