import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctbeqcwfhowpvnafedzn.supabase.co'

const supabaseKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YmVxY3dmaG93cHZuYWZlZHpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU2NDk2NywiZXhwIjoyMDcyMTQwOTY3fQ.ElxuWIb1Df2n2Wk_CxQt5xV3PlwbgrObU0B5RNJA6S4";
export const supabase = createClient(supabaseUrl, supabaseKey)

