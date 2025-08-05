import { updateGame } from '~/server/utils/database'
import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const gameId = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!gameId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID is required'
      })
    }

    // Validation
    if (!body.category || !body.name || typeof body.name !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: category and name object'
      })
    }

    // Validate that at least one language has a name
    const languageNames = Object.values(body.name)
    const hasName = languageNames.some(name => name && typeof name === 'string' && name.trim())
    if (!hasName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one language must have a name'
      })
    }

    // Validate default language exists and has a name
    if (!body.defaultLanguage || !body.name[body.defaultLanguage]?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Default language must be specified and have a name'
      })
    }

    // Validate language codes
    const validLanguages = ['en', 'ko', 'ja', 'zh', 'fr', 'de', 'es', 'pt']
    const invalidLanguage = Object.keys(body.name).find(lang => !validLanguages.includes(lang))
    if (invalidLanguage) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid language code: ${invalidLanguage}. Supported languages: ${validLanguages.join(', ')}`
      })
    }

    // Don't allow changing game_id through update
    const updatedGameData = {
      category: body.category,
      name: body.name,
      default_language: body.defaultLanguage
    }

    await updateGame(gameId, updatedGameData)

    return {
      message: 'Game updated successfully',
      game: updatedGameData
    }
  } catch (error: any) {
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
