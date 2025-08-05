import { addGame } from '~/server/utils/database'
import { defineEventHandler, createError, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validation
    if (!body.id || !body.category || !body.name || typeof body.name !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: id, category, and name object'
      })
    }

    // Validate ID format (uppercase, no spaces)
    if (!/^[A-Z0-9_]+$/.test(body.id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID must contain only uppercase letters, numbers, and underscores'
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

    // Validate game_id format (alphanumeric, dashes, underscores)
    const gameIdRegex = /^[a-zA-Z0-9_-]{3,50}$/
    if (!gameIdRegex.test(body.id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID must be 3-50 characters long and can only contain letters, numbers, underscores and dashes'
      })
    }

    // Check if game_id already exists
    const existingGame = await findGameById(body.id)
    if (existingGame) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Game ID already exists'
      })
    }

    const newGameData = {
      game_id: body.id,
      category: body.category,
      name: body.name,
      default_language: body.defaultLanguage
    }

    await addGame(newGameData)

    return {
      message: 'Game created successfully',
      game: newGameData
    }
  } catch (error: any) {
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
