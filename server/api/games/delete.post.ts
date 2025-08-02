import { deleteGame } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID is required'
      })
    }

    deleteGame(id)

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