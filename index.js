import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const app = Express();
import dotenv from "dotenv";
import router from "./routes/index.js";
import { supabase } from "./config/supabase.js";
dotenv.config();
app.set("json spaces", 2);
app.use(router);
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://zynfinity.my.id", "http://127.0.0.1:5500", "http://localhost:49974/"]
}));

// Validasi token Login
function accessValidation(req, res, next) {
}

// const { data } = supabase.from('users').on('INSERT', (payload) => {
//     console.log(payload);
//   })
  
  // call unsubscribe to remove the callback
//   data.subscription.unsubscribe()
app.get('/', function (req, res) {
    res.status(200).json({
        endpoint: [
            {
                path: '/database/getUsers',
                description: 'get all user'
            },
            {
                path: '/quiz?type=${type}',
                description: 'Get Quiz by type. 1=Math'
            }
        ],
        maintainer: 'FunQUIZ TEAM'
    })
})
app.listen(process.env['PORT'], async () => {
    console.log("Server listening on port " + process.env['PORT']);
});

