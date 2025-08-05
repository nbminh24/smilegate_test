import { findGameById } from '~/server/utils/database'
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const gameId = getRouterParam(event, 'id')

    if (!gameId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID is required'
      })
    }

    const game = await findGameById(gameId)

    if (!game) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Game not found'
      })
    }

    return game
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
