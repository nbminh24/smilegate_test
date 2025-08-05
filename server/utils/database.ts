import { supabase } from './supabase'

export interface Game {
  game_id: string
  category: string
  name: Record<string, string>
  default_language: string
  created_at?: string
  updated_at?: string
}

export async function getGames (): Promise<Game[]> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) { throw error }

    // Map game_id to id for frontend compatibility
    return (data || []).map(game => ({
      ...game,
      id: game.game_id // Add id field that matches the frontend's expectation
    }))
  } catch (error) {
    console.error('Error fetching games:', error)
    return []
  }
}

export async function findGameById (gameId: string): Promise<Game | null> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('game_id', gameId)
      .single()

    if (error) { throw error }

    // Add id field for frontend compatibility
    return data ? { ...data, id: data.game_id } : null
  } catch (error) {
    console.error(`Error finding game ${gameId}:`, error)
    return null
  }
}

export async function addGame (game: Omit<Game, 'created_at' | 'updated_at'>): Promise<Game> {
  try {
    const newGame = {
      ...game,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('games')
      .insert([newGame])
      .select()
      .single()

    if (error) { throw error }
    return data
  } catch (error) {
    console.error('Error adding game:', error)
    throw error
  }
}

export async function updateGame (
  gameId: string,
  gameData: Partial<Omit<Game, 'created_at' | 'updated_at'>>
): Promise<Game | null> {
  try {
    const { data, error } = await supabase
      .from('games')
      .update({
        ...gameData,
        updated_at: new Date().toISOString()
      })
      .eq('game_id', gameId)
      .select()
      .single()

    if (error) { throw error }
    return data
  } catch (error) {
    console.error(`Error updating game ${gameId}:`, error)
    throw error
  }
}

export async function deleteGame (gameId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('game_id', gameId)

    if (error) { throw error }
    return true
  } catch (error) {
    console.error(`Error deleting game ${gameId}:`, error)
    return false
  }
}
