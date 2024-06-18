import {  supabase } from "../config/supabase.js"

const register = async(req, res) => {
    try{
        const {user_id} = req.body;
        const {data: {user}, error:userError} = await supabase.auth.admin.getUserById(user_id);
        // return console.log(user);
        const {data:newUser, error:newUserError} = await supabase.from('users').insert({
            id: user.id,
            sid: user.id,
            aud: user.aud,
            role: user.role,
            email: user.email,
            email_confirmed_at: user.email_confirmed_at,
            app_metadata: user.app_metadata,
            user_metadata: {
                id:user.id,
                ...user.user_metadata
            }
        });
        res.json({status:true});
    }catch(e){
        console.log(e);
        res.status(401).json({status:false})
    }
}
const findUser = async (req, res) => {
    try {
        const { user_id, my_id } = req.body;
        console.log(req.body)
        const { data: user, error } = await supabase.from('users').select('*').eq('id', user_id).single();
        if (!user) return res.status(404).json({
            status: false,
            msg: 'User not found!'
        });
        const { data: follows, error: followsError } = await supabase
            .from('follows')
            .select('*');
        if (followsError) {
            console.error('Error fetching follows:', followsError.message);
            return;
        }
        const { data: posts, error: postsError } = await supabase.from('posts').select('*').eq('user_id', user_id);
        const userFollowers = follows.filter(follower => follower.followed_id === user.id);
        const userFollowings = follows.filter(following => following.follower_id === user.id);
        user.user_metadata.followers = userFollowers;
        user.user_metadata.followings = userFollowings;
        user.user_metadata.isFollower = (userFollowings.find(s => s.followed_id == my_id)) ? true : false;
        user.user_metadata.isFollowing = (userFollowers.find(s => s.follower_id == my_id)) ? true : false;
        user.user_metadata.posts = posts;
        res.json(user);
    } catch (e) {
        res.status(404).json({
            status: false,
            msg: String(e)
        })
    }
}
const getUserList = async (req, res) => {
    try {
        const { user_id } = req.body;
        const { data, error } = await supabase.from('users').select();
        if (!data) return res.status(404).json({
            status: false,
            msg: 'User not found!'
        });
        const { data: follows, error: followsError } = await supabase
            .from('follows')
            .select('*');
        if (followsError) {
            console.error('Error fetching follows:', followsError.message);
            return;
        }

        // Gabungkan data pengguna dengan data pengikut dan diikuti oleh mereka
        const users = data.filter(us => us.id != user_id && (Object.keys(us.user_metadata)).length > 0);
        const usersWithFollowData = users.map(user => {
            const userFollowers = follows.filter(follower => follower.followed_id === user.id);
            const userFollowings = follows.filter(following => following.follower_id === user.id);
            user.user_metadata.followers = userFollowers;
            user.user_metadata.followings = userFollowings;
            user.user_metadata.isFollower = (userFollowings.find(s => s.followed_id == user_id)) ? true : false;
            user.user_metadata.isFollowing = (userFollowers.find(s => s.follower_id == user_id)) ? true : false;
            return user;
        });
        res.json(usersWithFollowData);
    } catch (e) {
        res.status(404).json({
            status: false,
            msg: String(e)
        })
    }
}
export { findUser, getUserList, register }