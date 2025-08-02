import { updateGame, Game } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID is required'
      })
    }
    
    // Validation
    if (!body.category || !body.name || !Array.isArray(body.name)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: category and name array'
      })
    }
    
    // Validate that at least one default language exists
    const hasDefault = body.name.some((name: any) => name.isDefault)
    if (!hasDefault) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one language must be set as default'
      })
    }
    
    // Validate language codes
    const validLanguages = ['EN', 'KO', 'JA']
    const invalidLanguage = body.name.find((name: any) => !validLanguages.includes(name.language))
    if (invalidLanguage) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid language code: ${invalidLanguage.language}. Supported languages: ${validLanguages.join(', ')}`
      })
    }
    
    const game: Game = {
      id: id,
      category: body.category,
      name: body.name
    }
    
    updateGame(id, game)
    
    return {
      message: 'Game updated successfully',
      game
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}) 