import { findGameById } from '~/server/utils/database'

export default defineEventHandler((event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID is required'
      })
    }

    const game = findGameById(id)

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
