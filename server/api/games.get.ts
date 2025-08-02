import { getGames } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const games = await getGames()
    return { games }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch games',
      data: error.message
    })
  }
}) 