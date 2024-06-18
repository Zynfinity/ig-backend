import { supabase } from "../config/supabase.js";

const newComment = async(req, res) => {
    try {
        const {user_id, post_id, comment} = req.body;
        const {data, error} = await supabase.from('comments').insert({post_id: post_id, user_id: user_id, body: comment});
        res.json(data);
    } catch (error) {
        console.log(error);
    }
}

export {newComment};