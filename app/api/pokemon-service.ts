// Pokemon API Service with Timing Logs

import type {
	EvolutionChain,
	Pokemon,
	PokemonListResponse,
	PokemonSpecies,
	TypeInfo,
} from "./types"

const BASE_URL = "https://pokeapi.co/api/v2"

// Color codes for console logs
const colors = {
	start: "\x1b[36m", // Cyan
	finish: "\x1b[32m", // Green
	error: "\x1b[31m", // Red
	reset: "\x1b[0m",
	dim: "\x1b[2m",
}

function logStart(fnName: string, ...args: unknown[]) {
	const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	const argStr = args.length > 0 ? ` (${args.join(", ")})` : ""
	console.log(
		`${colors.dim}[${timestamp}]${colors.reset} ${colors.start}🚀 Starting:${colors.reset} ${fnName}${argStr}`,
	)
	return performance.now()
}

function logFinish(fnName: string, startTime: number) {
	const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	const duration = Math.round(performance.now() - startTime)
	console.log(
		`${colors.dim}[${timestamp}]${colors.reset} ${colors.finish}✅ Finished:${colors.reset} ${fnName} ${colors.dim}(${duration}ms)${colors.reset}`,
	)
}

function logError(fnName: string, error: unknown, startTime: number) {
	const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	const duration = Math.round(performance.now() - startTime)
	console.log(
		`${colors.dim}[${timestamp}]${colors.reset} ${colors.error}❌ Error:${colors.reset} ${fnName} ${colors.dim}(${duration}ms)${colors.reset}`,
		error,
	)
}

/**
 * Fetch a paginated list of Pokemon
 * @param limit - Number of Pokemon to fetch (default: 20)
 * @param offset - Offset for pagination (default: 0)
 */
export async function fetchPokemonList(
	limit = 20,
	offset = 0,
): Promise<PokemonListResponse> {
	const startTime = logStart(
		"fetchPokemonList",
		`limit=${limit}`,
		`offset=${offset}`,
	)

	try {
		const response = await fetch(
			`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
		)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = (await response.json()) as PokemonListResponse
		logFinish("fetchPokemonList", startTime)
		return data
	} catch (error) {
		logError("fetchPokemonList", error, startTime)
		throw error
	}
}

/**
 * Fetch detailed information about a specific Pokemon
 * @param nameOrId - Pokemon name or ID
 */
export async function fetchPokemon(
	nameOrId: string | number,
): Promise<Pokemon> {
	const startTime = logStart("fetchPokemon", nameOrId)

	try {
		const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)

		if (!response.ok) {
			if (response.status === 404) {
				throw new Response("Pokemon not found", { status: 404 })
			}
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = (await response.json()) as Pokemon
		logFinish("fetchPokemon", startTime)
		return data
	} catch (error) {
		logError("fetchPokemon", error, startTime)
		throw error
	}
}

/**
 * Fetch Pokemon species information (flavor text, evolution chain, etc.)
 * @param nameOrId - Pokemon species name or ID
 */
export async function fetchPokemonSpecies(
	nameOrId: string | number,
): Promise<PokemonSpecies> {
	const startTime = logStart("fetchPokemonSpecies", nameOrId)

	try {
		const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`)

		if (!response.ok) {
			if (response.status === 404) {
				throw new Response("Pokemon species not found", { status: 404 })
			}
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = (await response.json()) as PokemonSpecies
		logFinish("fetchPokemonSpecies", startTime)
		return data
	} catch (error) {
		logError("fetchPokemonSpecies", error, startTime)
		throw error
	}
}

/**
 * Fetch evolution chain information
 * @param id - Evolution chain ID
 */
export async function fetchEvolutionChain(id: number): Promise<EvolutionChain> {
	const startTime = logStart("fetchEvolutionChain", id)

	try {
		const response = await fetch(`${BASE_URL}/evolution-chain/${id}`)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = (await response.json()) as EvolutionChain
		logFinish("fetchEvolutionChain", startTime)
		return data
	} catch (error) {
		logError("fetchEvolutionChain", error, startTime)
		throw error
	}
}

/**
 * Fetch Pokemon type information
 * @param name - Type name (e.g., 'fire', 'water')
 */
export async function fetchType(name: string): Promise<TypeInfo> {
	const startTime = logStart("fetchType", name)

	try {
		const response = await fetch(`${BASE_URL}/type/${name}`)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = (await response.json()) as TypeInfo
		logFinish("fetchType", startTime)
		return data
	} catch (error) {
		logError("fetchType", error, startTime)
		throw error
	}
}

/**
 * Helper function to extract ID from a Pokemon API URL
 */
export function extractIdFromUrl(url: string): number {
	const matches = url.match(/\/(\d+)\/$/)
	return matches ? Number.parseInt(matches[1], 10) : 0
}

/**
 * Helper function to capitalize Pokemon names
 */
export function capitalizeName(name: string): string {
	return name
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

/**
 * Helper function to get Pokemon ID from name (for images)
 */
export async function getPokemonId(name: string): Promise<number> {
	const pokemon = await fetchPokemon(name)
	return pokemon.id
}
