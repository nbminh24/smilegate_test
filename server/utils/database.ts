import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export interface Game {
    id: string
    category: string
    name: {
        [key: string]: string
    }
    defaultLanguage: string
    createdAt: string
    updatedAt: string
}

const DB_PATH = resolve(process.cwd(), 'server/data/games.json')

export function getGames(): Game[] {
    try {
        const data = readFileSync(DB_PATH, 'utf-8');
        const json = JSON.parse(data);
        const games: Game[] = json.games || [];
        // Sort games by updatedAt in descending order, handling missing timestamps
        return games.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return dateB - dateA;
        });
    } catch (error) {
        console.error('Error reading games:', error);
        return [];
    }
}

export function findGameById(id: string): Game | null {
    const games = getGames()
    return games.find(game => game.id === id) || null
}

export function addGame(game: Omit<Game, 'createdAt' | 'updatedAt'>): void {
    const games = getGames();
    const now = new Date().toISOString();
    const newGame: Game = {
        ...game,
        createdAt: now,
        updatedAt: now
    };
    games.unshift(newGame); // Add to the beginning
    writeFileSync(DB_PATH, JSON.stringify({ games }, null, 2));
}

export function updateGame(id: string, updatedGameData: Omit<Game, 'createdAt' | 'updatedAt'>): void {
    const games = getGames();
    const index = games.findIndex(game => game.id === id);
    if (index !== -1) {
        const originalGame = games[index];
        games[index] = {
            ...originalGame, // Preserve original createdAt
            ...updatedGameData, // Apply new data
            updatedAt: new Date().toISOString() // Set new updatedAt
        };
        writeFileSync(DB_PATH, JSON.stringify({ games }, null, 2));
    }
}

export function deleteGame(id: string): void {
    const games = getGames()
    const filteredGames = games.filter(game => game.id !== id)
    writeFileSync(DB_PATH, JSON.stringify({ games: filteredGames }, null, 2))
}