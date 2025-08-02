import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export interface Game {
    id: string
    category: string
    name: {
        [key: string]: string
    }
    defaultLanguage: string
}

const DB_PATH = resolve(process.cwd(), 'server/data/games.json')

export function getGames(): Game[] {
    try {
        const data = readFileSync(DB_PATH, 'utf-8')
        const json = JSON.parse(data)
        return json.games || []
    } catch (error) {
        console.error('Error reading games:', error)
        return []
    }
}

export function findGameById(id: string): Game | null {
    const games = getGames()
    return games.find(game => game.id === id) || null
}

export function addGame(game: Game): void {
    const games = getGames()
    games.push(game)
    writeFileSync(DB_PATH, JSON.stringify({ games }, null, 2))
}

export function updateGame(id: string, updatedGame: Game): void {
    const games = getGames()
    const index = games.findIndex(game => game.id === id)
    if (index !== -1) {
        games[index] = updatedGame
        writeFileSync(DB_PATH, JSON.stringify({ games }, null, 2))
    }
}

export function deleteGame(id: string): void {
    const games = getGames()
    const filteredGames = games.filter(game => game.id !== id)
    writeFileSync(DB_PATH, JSON.stringify({ games: filteredGames }, null, 2))
} 