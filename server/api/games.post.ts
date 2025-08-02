import { addGame, Game } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validation
    if (!body.id || !body.category || !body.name || !Array.isArray(body.name)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: id, category, and name array'
      })
    }
    
    // Validate ID format (uppercase, no spaces)
    if (!/^[A-Z0-9_]+$/.test(body.id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID must contain only uppercase letters, numbers, and underscores'
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
      id: body.id,
      category: body.category,
      name: body.name
    }
    
    addGame(game)
    
    return {
      message: 'Game created successfully',
      game
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw createError({
        statusCode: 409,
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