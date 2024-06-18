import { supabase } from "../config/supabase.js";

const Follow = async (req, res) => {
    try {
        const { action, followed_id, follower_id } = req.body;
        if (action === 'follow') {
            const { data, error } = await supabase.from('follows').insert({ followed_id: followed_id, follower_id: follower_id });
            if (error) return res.status(404).json({ status: false })
            res.json(data);
        } else {
            const { data, error } = await supabase.from('follows').delete().eq('followed_id', followed_id).eq('follower_id', follower_id);
            if (error) return res.status(404).json({ status: false })
            res.json(data);
        }
    } catch (error) {

    }
}

export { Follow };