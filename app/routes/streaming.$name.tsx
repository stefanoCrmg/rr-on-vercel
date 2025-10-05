// Streaming Demo Route - Shows progressive rendering with Suspense

import { Suspense } from "react"
import { Await, Link, useLoaderData } from "react-router"
import {
	capitalizeName,
	fetchEvolutionChainForPokemon,
	fetchPokemon,
	fetchPokemonSpecies,
} from "../api/pokemon-service"
import type { ChainLink, EvolutionChain, PokemonSpecies } from "../api/types"
import type { Route } from "./+types/streaming.$name"

// Helper function to add artificial delay (to make streaming obvious)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper to flatten evolution chain into array of names
function flattenEvolutionChain(chain: ChainLink): string[] {
	const names: string[] = [chain.species.name]
	for (const evolution of chain.evolves_to) {
		names.push(...flattenEvolutionChain(evolution))
	}
	return names
}

// STREAMING LOADER - React Router 7 pattern
// Just return promises directly (without defer)! React Router handles the rest.
export async function loader({ params }: Route.LoaderArgs) {
	const { name } = params

	const startTime = performance.now()
	const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	console.log(
		`\x1b[2m[${timestamp}]\x1b[0m \x1b[36m\x1b[1m🌊 STREAMING LOADER STARTED\x1b[0m \x1b[36m(streaming.$name.tsx for "${name}")\x1b[0m`,
	)

	// Fetch basic pokemon data immediately (blocking - we await this)
	const pokemon = await fetchPokemon(name)

	// Return immediately with the basic data + PROMISES for the rest
	// NOTE: We DON'T await these - we return the promises!
	// The page will render NOW, and the promised data will stream in!
	const endTime = performance.now()
	const duration = Math.round(endTime - startTime)
	console.log(
		`\x1b[2m[${new Date().toLocaleTimeString("en-US", { hour12: false })}]\x1b[0m \x1b[36m\x1b[1m⚡ STREAMING LOADER RETURNED (${duration}ms)\x1b[0m \x1b[36m- Page renders NOW! Promised data will stream in...\x1b[0m`,
	)

	// Fetch species and evolution (awaited - available immediately)
	const species = await fetchPokemonSpecies(name)
	const evolution = await fetchEvolutionChainForPokemon(name)

	return {
		// Available immediately
		pokemon,
		evolution,

		// Only species description streams in with artificial delay
		speciesDescription: (async () => {
			await delay(2000) // Artificial delay to see skeleton
			console.log(`\x1b[32m✅ Species description streamed in!\x1b[0m`)
			return species
		})(),
	}
}

// Type colors
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

// Skeleton components for loading states
function DescriptionSkeleton() {
	return (
		<div className="mb-6 animate-pulse">
			<h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
			<div className="space-y-2">
				<div className="h-4 bg-gray-300 rounded w-full" />
				<div className="h-4 bg-gray-300 rounded w-5/6" />
				<div className="h-4 bg-gray-300 rounded w-4/6" />
			</div>
			<p className="text-sm text-blue-600 mt-2">🌊 Streaming species data...</p>
		</div>
	)
}

function EvolutionSkeleton() {
	return (
		<div className="animate-pulse">
			<h2 className="text-xl font-bold text-gray-900 mb-3">Evolution Chain</h2>
			<div className="flex gap-2">
				<div className="h-10 bg-gray-300 rounded-lg w-24" />
				<div className="h-10 bg-gray-300 rounded-lg w-24" />
				<div className="h-10 bg-gray-300 rounded-lg w-24" />
			</div>
			<p className="text-sm text-blue-600 mt-2">
				🌊 Streaming evolution data...
			</p>
		</div>
	)
}

// Component to render species data
function SpeciesSection({ species }: { species: PokemonSpecies }) {
	const flavorText = species.flavor_text_entries
		.find((entry) => entry.language.name === "en")
		?.flavor_text.replace(/\f/g, " ")

	return (
		<div className="mb-6">
			<h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
			<p className="text-gray-700 leading-relaxed">{flavorText}</p>
			<div className="mt-3 flex flex-wrap gap-2">
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
			</div>
			<p className="text-sm text-green-600 mt-2 font-semibold">
				✅ Species data loaded!
			</p>
		</div>
	)
}

// Component to render evolution chain
function EvolutionSection({ evolution }: { evolution: EvolutionChain }) {
	const flattenChain = (chain: ChainLink): string[] => {
		const names: string[] = [chain.species.name]
		for (const evo of chain.evolves_to) {
			names.push(...flattenChain(evo))
		}
		return names
	}

	const evolutionNames = flattenChain(evolution.chain)

	if (evolutionNames.length <= 1) {
		return null
	}

	return (
		<div>
			<h2 className="text-xl font-bold text-gray-900 mb-3">Evolution Chain</h2>
			<div className="flex items-center gap-2 flex-wrap">
				{evolutionNames.map((evoName, index) => (
					<div key={evoName} className="flex items-center gap-2">
						<Link
							to={`/streaming/${evoName}`}
							className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
						>
							{capitalizeName(evoName)}
						</Link>
						{index < evolutionNames.length - 1 && (
							<span className="text-gray-400 text-xl">→</span>
						)}
					</div>
				))}
			</div>
			<p className="text-sm text-green-600 mt-2 font-semibold">
				✅ Evolution data loaded!
			</p>
		</div>
	)
}

export default function StreamingDemo() {
	const { pokemon, speciesDescription, evolution } =
		useLoaderData<typeof loader>()

	const sprite =
		pokemon.sprites.other?.["official-artwork"]?.front_default ||
		pokemon.sprites.front_default

	return (
		<div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-5xl mx-auto">
					{/* Back buttons */}
					<div className="flex gap-4 mb-6">
						<Link
							to="/pokemon"
							className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
						>
							← Back to list
						</Link>
						<Link
							to={`/pokemon/${pokemon.name}`}
							className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
						>
							Compare with blocking version →
						</Link>
					</div>

					{/* Notice Box */}
					<div className="mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
						<h2 className="text-2xl font-bold mb-2">
							🌊 Streaming/Progressive Rendering
						</h2>
						<p className="text-cyan-100">
							This page returns <strong>promises</strong> from the loader (not
							awaited!). React Router + Suspense handle the rest. The page
							rendered IMMEDIATELY with basic Pokemon data, and the description
							and evolution chain are streaming in progressively!
						</p>
						<p className="text-cyan-100 mt-2 text-sm">
							👀 Watch the console and see the skeletons turn into real content
							as data streams in!
						</p>
					</div>

					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
						{/* Header - Available immediately! */}
						<div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-cyan-100 text-sm mb-1">
										#{pokemon.id.toString().padStart(3, "0")}
									</p>
									<h1 className="text-4xl font-bold mb-2">
										{capitalizeName(pokemon.name)}
									</h1>
									<p className="text-cyan-100 text-sm">
										✅ Loaded immediately!
									</p>
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
							{/* Left Column - Available immediately */}
							<div>
								<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 mb-6">
									<img
										src={sprite || undefined}
										alt={pokemon.name}
										className="w-full max-w-sm mx-auto"
									/>
								</div>

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
								</div>
								<p className="text-sm text-green-600 mt-2 font-semibold">
									✅ Basic data available immediately!
								</p>
							</div>

							{/* Right Column - Partially streamed */}
							<div>
								{/* Species description - Streams in with artificial delay */}
								<Suspense
									key={`species-${pokemon.name}`}
									fallback={<DescriptionSkeleton />}
								>
									<Await resolve={speciesDescription}>
										{(speciesData) => <SpeciesSection species={speciesData} />}
									</Await>
								</Suspense>

								{/* Stats - Available immediately */}
								<div className="mb-6">
									<h2 className="text-xl font-bold text-gray-900 mb-3">
										Stats
									</h2>
									<div className="space-y-3">
										{pokemon.stats.map((stat) => {
											const statName = stat.stat.name
												.replace("-", " ")
												.replace(/\b\w/g, (l) => l.toUpperCase())
											const percentage = Math.min(
												(stat.base_stat / 255) * 100,
												100,
											)

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
															className="bg-cyan-600 h-2 rounded-full transition-all"
															style={{ width: `${percentage}%` }}
														/>
													</div>
												</div>
											)
										})}
									</div>
									<p className="text-sm text-green-600 mt-2 font-semibold">
										✅ Stats available immediately!
									</p>
								</div>

								{/* Evolution - Available immediately */}
								<EvolutionSection evolution={evolution} />
							</div>
						</div>
					</div>

					{/* Explanation */}
					<div className="mt-8 grid md:grid-cols-2 gap-6">
						<div className="bg-red-50 border border-red-200 rounded-lg p-4">
							<h3 className="font-bold text-red-900 mb-2">
								❌ Blocking Approach (Await Everything)
							</h3>
							<ul className="text-red-800 text-sm space-y-1 list-disc list-inside">
								<li>All loaders must complete before ANY rendering</li>
								<li>User sees blank page or loading spinner</li>
								<li>Slower perceived performance</li>
								<li>All data loads, then page appears</li>
							</ul>
							<div className="mt-2 bg-red-100 rounded p-2 font-mono text-xs">
								<code>await fetchA(); await fetchB();</code>
								<br />
								<code>return &#123; a, b &#125;;</code>
							</div>
						</div>

						<div className="bg-green-50 border border-green-200 rounded-lg p-4">
							<h3 className="font-bold text-green-900 mb-2">
								✅ Streaming Approach (Return Promises)
							</h3>
							<ul className="text-green-800 text-sm space-y-1 list-disc list-inside">
								<li>Return promises directly from loader</li>
								<li>Page renders immediately with awaited data</li>
								<li>Suspense boundaries show loading states</li>
								<li>Promised data streams in progressively!</li>
							</ul>
							<div className="mt-2 bg-green-100 rounded p-2 font-mono text-xs">
								<code>const a = await fetchA();</code>
								<br />
								<code>return &#123; a, b: fetchB() &#125;;</code>
							</div>
						</div>
					</div>

					{/* React Router 7 Pattern */}
					<div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
						<h3 className="font-bold text-cyan-900 mb-2">
							💡 React Router 7 Pattern (No defer() needed!)
						</h3>
						<p className="text-cyan-800 text-sm mb-2">
							In RR7, you simply return promises from your loader. No special{" "}
							<code>defer()</code> wrapper needed! React Router automatically
							handles streaming with <code>&lt;Await&gt;</code> and{" "}
							<code>&lt;Suspense&gt;</code>.
						</p>
						<a
							href="https://reactrouter.com/how-to/suspense"
							target="_blank"
							rel="noopener noreferrer"
							className="text-cyan-600 hover:text-cyan-800 text-sm underline"
						>
							📚 Learn more in the official docs →
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
