import Express from "express";
import request from "request";
import { findUser, getUserList, register } from "../controllers/Users.js";
import bodyParser from "body-parser";
import cors from "cors";
import upload from "../controllers/Uploader.js";
import { findPost, getAllPost, getPostFromFollowed, newPost } from "../controllers/Posts.js";
import path from "path";
import { fileURLToPath } from 'url';
import { Follow } from "../controllers/Follows.js";
import { newComment } from "../controllers/Comments.js";
import { supabase } from "../config/supabase.js";
import { allChat, chatWith, createRoom, sendMsg } from "../controllers/Chats.js";
import { addLike } from "../controllers/Likes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Express.Router();
router.use('/uploads', Express.static(path.join(__dirname, '../uploads')));
router.use(bodyParser.json());
router.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://zynfinity.my.id", "http://127.0.0.1:5500", "https://ig-clone-react-three.vercel.app"]
}));
router.post('/api/user/find', findUser);
router.post('/api/user/all', getUserList);
router.post('/api/uploader', upload.single('image'), (req, res) => {
    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});

// post
router.get('/api/post/all', getAllPost);
router.post('/api/post/followed', getPostFromFollowed);
router.post('/api/post/new', newPost);
router.post('/api/post/find', findPost)

// user 
router.post('/api/user/follow', Follow)
router.post('/api/user/register', register)
router.get('/proxy', function (req, res) {
    const url = req.query.url;
    request(url).pipe(res);
});

// comment
router.post('/api/comment/new', newComment);

// chat
router.post('/api/chat/all', allChat);
router.post('/api/chat', chatWith);
router.post('/api/chat/send', sendMsg);
router.post('/api/chat/new', createRoom);

// like
router.post('/api/like', addLike);
export default router;