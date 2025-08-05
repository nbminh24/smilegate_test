import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Kiểm tra kết nối
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('games').select('*').limit(1)
    if (error) throw error
    console.log('✅ Kết nối Supabase thành công!')
    return true
  } catch (error) {
    console.error('❌ Lỗi kết nối Supabase:', error)
    return false
  }
}
