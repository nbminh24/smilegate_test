import { testConnection } from '~/server/utils/supabase'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const isConnected = await testConnection()
  return { 
    status: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  }
})
