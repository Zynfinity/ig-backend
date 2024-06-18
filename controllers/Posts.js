import { supabase } from "../config/supabase.js"

const getAllPost = async (req, res) => {
    try {
        const { data, error } = await supabase.from('posts').select('*');
        console.log(data)
    } catch (e) {
        console.log(e)
    }
}
const findPost = async(req, res) => {
    try {
        const {user_id, post_id, my_id} = req.body;
        const {data: post, error:postError} = await supabase.from('posts').select('*, users(user_metadata), comments(*, users(user_metadata)), likes(*, users(user_metadata))').eq('user_id', user_id).eq('id', post_id).single();
        res.json({
            ...post,
            isLiked: (post.likes.find(s => s.user_id == my_id)) ? true : false
        });
    } catch (error) {
        console.log(error)
    }
}
const newPost = async (req, res) => {
    try {
        const { id, user_id, imageUrl, caption } = req.body;
        const { data, error } = await supabase.from('posts').insert({ id: id, user_id: user_id, imageUrl: imageUrl, caption: caption });
        if (error) return res.json({ status: false })
        res.json(data)
    } catch (error) {
    }
}
const getPostFromFollowed = async (req, res) => {
    try {
        const { user_id } = req.body;
        const { data: followed, error: followedError } = await supabase.from('follows')
            .select(`followed_id`).eq('follower_id', user_id);
        if(!followed) return res.status(404).json({status: false});
        const {data: posts, error: postsError} = await supabase.from('posts').select(`*, users (user_metadata), comments(*, users(user_metadata)), likes(*, users(user_metadata))`).filter('user_id', 'in', `(${(followed.map(s => s.followed_id)).join(',')})`);
        const posts2 = posts.map(res => {
            const temp = {
                ...res,
                isLiked: (res.likes.find(s => s.user_id == user_id)) ? true : false
            };
            return temp;
        })
        res.json(posts2);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: false,
            msg: 'Post not found'
        });
    }
    
}

export { getAllPost, newPost, getPostFromFollowed, findPost };