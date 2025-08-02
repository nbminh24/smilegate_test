import { deleteGames } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body.ids || !Array.isArray(body.ids)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'IDs array is required'
      })
    }
    
    if (body.ids.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one game ID is required'
      })
    }
    
    deleteGames(body.ids)
    
    return {
      message: `Successfully deleted ${body.ids.length} game(s)`,
      deletedIds: body.ids
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}) 