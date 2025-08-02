import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export interface GameName {
    language: string
    value: string
    isDefault: boolean
}

export interface Game {
    id: string
    category: string
    name: GameName[]
}

const DB_PATH = resolve(process.cwd(), 'server/data/games.json')

export function readGames(): Game[] {
    try {
        const data = readFileSync(DB_PATH, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading games database:', error)
        return []
    }
}

export function writeGames(games: Game[]): void {
    try {
        writeFileSync(DB_PATH, JSON.stringify(games, null, 2), 'utf-8')
    } catch (error) {
        console.error('Error writing games database:', error)
        throw new Error('Failed to save games data')
    }
}

export function findGameById(id: string): Game | undefined {
    const games = readGames()
    return games.find(game => game.id === id)
}

export function addGame(game: Game): void {
    const games = readGames()

    // Check if game ID already exists
    if (games.find(g => g.id === game.id)) {
        throw new Error('Game ID already exists')
    }

    games.push(game)
    writeGames(games)
}

export function updateGame(id: string, updatedGame: Game): void {
    const games = readGames()
    const index = games.findIndex(game => game.id === id)

    if (index === -1) {
        throw new Error('Game not found')
    }

    games[index] = updatedGame
    writeGames(games)
}

export function deleteGame(id: string): void {
    const games = readGames()
    const filteredGames = games.filter(game => game.id !== id)

    if (filteredGames.length === games.length) {
        throw new Error('Game not found')
    }

    writeGames(filteredGames)
}

export function deleteGames(ids: string[]): void {
    const games = readGames()
    const filteredGames = games.filter(game => !ids.includes(game.id))
    writeGames(filteredGames)
} 