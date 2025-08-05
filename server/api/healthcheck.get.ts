import { defineEventHandler } from 'h3'
import { testConnection } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const isConnected = await testConnection()
  return {
    status: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  }
})
