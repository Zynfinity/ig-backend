import { supabase } from "../config/supabase.js";

const createRoom = async (req, res) => {
    try {
        const { user1, user2 } = req.body;
        const { data: room, error: roomError } = await supabase.from('roomchats').insert({ userid_1: user1, userid_2: user2 }).select('id').single();
        res.json(room)
    } catch (error) {

    }
};
const allChat = async (req, res) => {
    try {
        const { user_id } = req.body;
        const { data: chats, error: chatsError } = await supabase
            .from('roomchats').select(`
            id,
            created_at,
            user_1:users!roomchats_userid_1_fkey(user_metadata),
            user_2:users!roomchats_userid_2_fkey(user_metadata),
            lastmsg:chats!inner(*)`)
            .or(`userid_1.eq.${user_id},userid_2.eq.${user_id}`)
            .limit(1, { foreignTable: 'chats' })
            .order('id', { ascending: false, foreignTable: 'chats' });
        if (chats.length == 0) {
            const { data: chats, error: chatsError } = await supabase
                .from('roomchats').select(`
            id,
            created_at,
            user_1:users!roomchats_userid_1_fkey(user_metadata),
            user_2:users!roomchats_userid_2_fkey(user_metadata)`)
            .or(`userid_1.eq.${user_id},userid_2.eq.${user_id}`)
            console.log(chats);
            return res.json(chats);
        }
        console.log(chatsError);
        console.log(chats);
        res.json(chats);
    } catch (error) {
        res.status(404).json({
            status: false,
            msg: String(error)
        })
    }
};

const chatWith = async (req, res) => {
    try {
        const { user_id, partner_id, room_id } = req.body;
        const { data: msg, error: msgError } = await supabase.from('chats').select().eq('room_id', room_id).order('id', { ascending: true });
        console.log(msg);
        if (!msg || msg.length == 0) {
            const { data: room, error: roomError } = await supabase.from('roomchats').select().eq('id', room_id).single();
            console.log(room);
            return res.json({
                status: false,
                partnerid: room.userid_1 == user_id ? room.userid_2 : room.userid_1
            })
        }
        const msg2 = msg.map(s => {
            let temp = {
                ...s,
                isFromMe: s.sender_id == user_id ? true : false
            };
            return temp;
        });
        res.json(msg2);
    } catch (error) {
        console.log(error);
    }
};
const sendMsg = async (req, res) => {
    try {
        const { user_id, partner_id, room_id, text } = req.body;
        const { data: send, error: sendError } = await supabase.from('chats').insert({ room_id: room_id, sender_id: user_id, receiver_id: partner_id, body: text });
        if (!sendError) res.json({ status: true });
    } catch (error) {
        res.status(404).json({ status: false })
    }
}
export { allChat, chatWith, sendMsg, createRoom };