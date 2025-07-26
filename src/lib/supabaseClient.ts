import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xlkaouevqspnqqgejzpv.supabase.co'; // ganti dengan punyamu
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa2FvdWV2cXNwbnFxZ2VqenB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Mzc4NDgsImV4cCI6MjA2OTExMzg0OH0.o33rBwm0hHA318MMKW5FxBei0qtrsKvaf-D9EtmRO64';
export const supabase = createClient(supabaseUrl, supabaseKey);