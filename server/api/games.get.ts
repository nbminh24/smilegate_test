import { readGames } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { category, keyword, page = 1, limit = 10 } = query
    
    let games = readGames()
    
    // Filter by category
    if (category && category !== 'ALL') {
      games = games.filter(game => game.category === category)
    }
    
    // Filter by keyword (search in ID and names)
    if (keyword) {
      const searchTerm = keyword.toString().toLowerCase()
      games = games.filter(game => {
        const idMatch = game.id.toLowerCase().includes(searchTerm)
        const nameMatch = game.name.some(name => 
          name.value.toLowerCase().includes(searchTerm)
        )
        return idMatch || nameMatch
      })
    }
    
    // Pagination
    const pageNum = parseInt(page.toString())
    const limitNum = parseInt(limit.toString())
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedGames = games.slice(startIndex, endIndex)
    
    return {
      games: paginatedGames,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(games.length / limitNum),
        totalItems: games.length,
        itemsPerPage: limitNum
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}) 