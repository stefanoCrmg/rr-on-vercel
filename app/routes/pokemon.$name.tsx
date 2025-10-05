// Pokemon Detail Route - Demonstrates parallel data loading

import { Link, useLoaderData } from "react-router"
import {
	capitalizeName,
	extractIdFromUrl,
	fetchEvolutionChain,
	fetchPokemon,
	fetchPokemonSpecies,
} from "../api/pokemon-service"
import type { ChainLink } from "../api/types"
import type { Route } from "./+types/pokemon.$name"

// SSR Loader with PARALLEL data fetching
// Multiple API calls happen simultaneously!
export async function loader({ params }: Route.LoaderArgs) {
	const { name } = params

	// Special log to highlight CHILD DETAIL LOADER
	const loaderStartTime = performance.now()
	const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	console.log(
		`\x1b[2m[${timestamp}]\x1b[0m \x1b[33m\x1b[1m🔥 CHILD DETAIL LOADER STARTED\x1b[0m \x1b[33m(pokemon.$name.tsx for "${name}")\x1b[0m`,
	)

	// These three fetches happen in PARALLEL
	// Check your console to see they start at nearly the same time!
	const [pokemon, species] = await Promise.all([
		fetchPokemon(name),
		fetchPokemonSpecies(name),
	])

	// Extract evolution chain ID and fetch it
	const evolutionChainId = extractIdFromUrl(species.evolution_chain.url)
	const evolutionChain = await fetchEvolutionChain(evolutionChainId)

	// Get English flavor text
	const flavorText = species.flavor_text_entries
		.find((entry) => entry.language.name === "en")
		?.flavor_text.replace(/\f/g, " ")

	// Get genus (e.g., "Seed Pokemon")
	const genus = species.genera.find((g) => g.language.name === "en")?.genus

	const loaderDuration = Math.round(performance.now() - loaderStartTime)
	const endTimestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	console.log(
		`\x1b[2m[${endTimestamp}]\x1b[0m \x1b[33m\x1b[1m⚡ CHILD DETAIL LOADER FINISHED\x1b[0m \x1b[2m(${loaderDuration}ms)\x1b[0m`,
	)

	return {
		pokemon,
		species,
		evolutionChain,
		flavorText,
		genus,
	}
}

// Type colors for badges
const typeColors: Record<string, string> = {
	normal: "bg-gray-400",
	fire: "bg-red-500",
	water: "bg-blue-500",
	electric: "bg-yellow-400",
	grass: "bg-green-500",
	ice: "bg-cyan-400",
	fighting: "bg-orange-600",
	poison: "bg-purple-500",
	ground: "bg-yellow-600",
	flying: "bg-indigo-400",
	psychic: "bg-pink-500",
	bug: "bg-lime-500",
	rock: "bg-yellow-700",
	ghost: "bg-purple-700",
	dragon: "bg-indigo-600",
	dark: "bg-gray-700",
	steel: "bg-gray-500",
	fairy: "bg-pink-300",
}

// Flatten evolution chain into array
function flattenEvolutionChain(chain: ChainLink): string[] {
	const names: string[] = [chain.species.name]
	for (const evolution of chain.evolves_to) {
		names.push(...flattenEvolutionChain(evolution))
	}
	return names
}

export default function PokemonDetail() {
	const { pokemon, species, evolutionChain, flavorText, genus } =
		useLoaderData<typeof loader>()

	// Get main sprite
	const sprite =
		pokemon.sprites.other?.["official-artwork"]?.front_default ||
		pokemon.sprites.front_default

	// Evolution chain names
	const evolutionNames = flattenEvolutionChain(evolutionChain.chain)

	return (
		<div className="max-w-5xl mx-auto">
			{/* Navigation buttons */}
			<div className="flex gap-3 mb-6 flex-wrap">
				<Link
					to="/pokemon"
					className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
				>
					← Back to list
				</Link>
				<Link
					to={`/streaming/${pokemon.name}`}
					className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium shadow-md text-sm"
				>
					🌊 Streaming
				</Link>
				<Link
					to={`/modular/${pokemon.name}`}
					className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-md text-sm"
				>
					🧩 Modular
				</Link>
			</div>

			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				{/* Header Section */}
				<div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-blue-100 text-sm mb-1">
								#{pokemon.id.toString().padStart(3, "0")}
							</p>
							<h1 className="text-4xl font-bold mb-2">
								{capitalizeName(pokemon.name)}
							</h1>
							{genus && <p className="text-blue-100">{genus}</p>}
						</div>
						<div className="flex gap-2">
							{pokemon.types.map((t) => (
								<span
									key={t.type.name}
									className={`${typeColors[t.type.name]} px-3 py-1 rounded-full text-sm font-medium text-white shadow-md`}
								>
									{capitalizeName(t.type.name)}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className="grid md:grid-cols-2 gap-8 p-6">
					{/* Left Column - Image and basic info */}
					<div>
						{/* Main Image */}
						<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 mb-6">
							<img
								src={sprite || undefined}
								alt={pokemon.name}
								className="w-full max-w-sm mx-auto"
							/>
						</div>

						{/* Basic Info */}
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-gray-500 text-sm mb-1">Height</p>
								<p className="text-2xl font-bold text-gray-900">
									{(pokemon.height / 10).toFixed(1)}m
								</p>
							</div>
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-gray-500 text-sm mb-1">Weight</p>
								<p className="text-2xl font-bold text-gray-900">
									{(pokemon.weight / 10).toFixed(1)}kg
								</p>
							</div>
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-gray-500 text-sm mb-1">Base XP</p>
								<p className="text-2xl font-bold text-gray-900">
									{pokemon.base_experience}
								</p>
							</div>
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-gray-500 text-sm mb-1">Capture Rate</p>
								<p className="text-2xl font-bold text-gray-900">
									{species.capture_rate}
								</p>
							</div>
						</div>

						{/* Badges */}
						<div className="mt-4 flex flex-wrap gap-2">
							{species.is_legendary && (
								<span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
									⭐ Legendary
								</span>
							)}
							{species.is_mythical && (
								<span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
									✨ Mythical
								</span>
							)}
							{species.is_baby && (
								<span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
									🍼 Baby
								</span>
							)}
						</div>
					</div>

					{/* Right Column - Details */}
					<div>
						{/* Description */}
						{flavorText && (
							<div className="mb-6">
								<h2 className="text-xl font-bold text-gray-900 mb-3">
									Description
								</h2>
								<p className="text-gray-700 leading-relaxed">{flavorText}</p>
							</div>
						)}

						{/* Stats */}
						<div className="mb-6">
							<h2 className="text-xl font-bold text-gray-900 mb-3">Stats</h2>
							<div className="space-y-3">
								{pokemon.stats.map((stat) => {
									const statName = stat.stat.name
										.replace("-", " ")
										.replace(/\b\w/g, (l) => l.toUpperCase())
									const percentage = Math.min((stat.base_stat / 255) * 100, 100)

									return (
										<div key={stat.stat.name}>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium text-gray-700">
													{statName}
												</span>
												<span className="text-sm font-bold text-gray-900">
													{stat.base_stat}
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-blue-600 h-2 rounded-full transition-all"
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									)
								})}
							</div>
						</div>

						{/* Abilities */}
						<div className="mb-6">
							<h2 className="text-xl font-bold text-gray-900 mb-3">
								Abilities
							</h2>
							<div className="flex flex-wrap gap-2">
								{pokemon.abilities.map((ability) => (
									<span
										key={ability.ability.name}
										className={`px-3 py-1 rounded-lg text-sm font-medium ${
											ability.is_hidden
												? "bg-purple-100 text-purple-800 border border-purple-300"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{capitalizeName(ability.ability.name)}
										{ability.is_hidden && " (Hidden)"}
									</span>
								))}
							</div>
						</div>

						{/* Evolution Chain */}
						{evolutionNames.length > 1 && (
							<div>
								<h2 className="text-xl font-bold text-gray-900 mb-3">
									Evolution Chain
								</h2>
								<div className="flex items-center gap-2 flex-wrap">
									{evolutionNames.map((evoName, index) => (
										<div key={evoName} className="flex items-center gap-2">
											<Link
												to={`/pokemon/${evoName}`}
												className={`px-4 py-2 rounded-lg font-medium transition-colors ${
													evoName === pokemon.name
														? "bg-blue-600 text-white"
														: "bg-gray-100 text-gray-700 hover:bg-gray-200"
												}`}
											>
												{capitalizeName(evoName)}
											</Link>
											{index < evolutionNames.length - 1 && (
												<span className="text-gray-400 text-xl">→</span>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Parallel Loading Info Box */}
			<div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
				<h3 className="font-bold text-green-900 mb-2">
					⚡ React Router 7 Concept: Parallel Data Loading
				</h3>
				<p className="text-green-800 text-sm mb-2">
					This page demonstrates parallel data loading! The loader fetches:
				</p>
				<ul className="text-green-800 text-sm list-disc list-inside space-y-1">
					<li>
						<code className="bg-green-100 px-1 rounded">fetchPokemon()</code>{" "}
						and{" "}
						<code className="bg-green-100 px-1 rounded">
							fetchPokemonSpecies()
						</code>{" "}
						- run in parallel using{" "}
						<code className="bg-green-100 px-1 rounded">Promise.all()</code>
					</li>
					<li>
						<code className="bg-green-100 px-1 rounded">
							fetchEvolutionChain()
						</code>{" "}
						- runs after the first two complete (depends on species data)
					</li>
				</ul>
				<p className="text-green-800 text-sm mt-2">
					Check your console logs to see the timing! You'll notice the first two
					API calls start at almost the same time. 🚀
				</p>
			</div>
		</div>
	)
}
