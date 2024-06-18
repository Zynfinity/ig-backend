// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv";
// import pg from 'pg'
// const { Client } = pg
// const pgs = new Client({
//     user: 'postgres.lkspibhamdmpbihzuyzz',
//     host: 'aws-0-us-east-1.pooler.supabase.com',
//     database: 'postgres',
//     password: 'xWW3SMW5hsoOUrB0',
//     port: 6543, // Port default PostgreSQL
//     ssl: {
//         rejectUnauthorized: false, // Opsional, jika Anda menggunakan SSL
//     },
// })
// pgs.connect();
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseRole);

export {supabase};