const SUPABASE_URL = "https://jpwjsaknniejzpokmire.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwd2pzYWtubmllanpwb2ttaXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzA2NjgsImV4cCI6MjA5ODMwNjY2OH0.0ur8EhnBmwZGNvBW_ql5pVzOy6OQ9pdDpds_BtYivMg";


const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);    
    
window.db = db;


console.log("✅ Supabase Connected");
alert("Supabase Loaded");
console.log(window.db);
