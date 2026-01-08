import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://nyymgzdauvallddjutgx.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImJlZjA0NjhmLWNkZDItNGYwMi1hYWIxLWYzMzg3MTg5NTBhYSJ9.eyJwcm9qZWN0SWQiOiJueXltZ3pkYXV2YWxsZGRqdXRneCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3ODAzODUxLCJleHAiOjIwODMxNjM4NTEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.4ymx04JohYYzHk0Z6kv_8hVu230-eeJjXde6NeDEglc';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };