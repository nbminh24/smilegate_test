import { deleteGame } from '~/server/utils/database'
import { defineEventHandler, createError, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id: gameId } = body

    if (!gameId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID is required'
      })
    }

    const success = await deleteGame(gameId)
    
    if (!success) {
      throw new Error('Failed to delete game')
    }

    return {
      success: true,
      message: 'Game deleted successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete game',
      data: error.message
    })
  }
})
