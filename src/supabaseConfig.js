import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bykxizmcuentxxepalhs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5a3hpem1jdWVudHh4ZXBhbGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjU4NzAsImV4cCI6MjA3NDA0MTg3MH0.7l2O63Tsn6HDChroWBOjtI2AslzR7GH2puTJj9eE31s'

export const supabase = createClient(supabaseUrl, supabaseKey)
