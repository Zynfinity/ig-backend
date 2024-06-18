import { supabase } from "../config/supabase.js";

const addLike = async(req, res) => {
    try {
        const {user_id, post_id, action} = req.body;
        if(action == 'like'){
            const {data: like, error:likeError} = await supabase.from('likes').insert({post_id: post_id, user_id: user_id}).select('id').single();
            res.json(like);
        }else {
            const {data: like, error:likeError} = await supabase.from('likes').delete().eq('post_id', post_id).eq('user_id', user_id);
            res.json(like);
        }
    } catch (error) {
        
    }
}

export {addLike};