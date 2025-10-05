// Evolution Child Route - Has its own loader!

import { Link, useLoaderData, useRouteLoaderData } from "react-router"
import {
	capitalizeName,
	extractIdFromUrl,
	fetchEvolutionChain,
	fetchPokemonSpecies,
} from "../api/pokemon-service"
import type { ChainLink, Pokemon } from "../api/types"
import type { Route } from "./+types/modular.$name.evolution"

// CHILD LOADER for evolution data
export async function loader({ params }: Route.LoaderArgs) {
	const { name } = params

	console.log(
		`\x1b[32m\x1b[1m🔄 CHILD LOADER (evolution)\x1b[0m \x1b[32m- Loading evolution data for "${name}"\x1b[0m`,
	)

	// Fetch species to get evolution chain
	const species = await fetchPokemonSpecies(name)
	const evolutionChainId = extractIdFromUrl(species.evolution_chain.url)
	const evolutionChain = await fetchEvolutionChain(evolutionChainId)

	return {
		evolutionLoadedAt: new Date().toISOString(),
		evolutionChain,
		species,
	}
}

// Flatten evolution chain
function flattenEvolutionChain(chain: ChainLink): string[] {
	const names: string[] = [chain.species.name]
	for (const evolution of chain.evolves_to) {
		names.push(...flattenEvolutionChain(evolution))
	}
	return names
}

export default function EvolutionTab() {
	const { evolutionLoadedAt, evolutionChain, species } =
		useLoaderData<typeof loader>()

	// Access parent data
	const parentData = useRouteLoaderData<{ pokemon: Pokemon }>(
		"routes/modular.$name",
	)

	const evolutionNames = flattenEvolutionChain(evolutionChain.chain)
	const hasEvolution = evolutionNames.length > 1

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Evolution Chain
				</h2>
				<p className="text-sm text-gray-600">
					✅ Loaded by this child route at{" "}
					{new Date(evolutionLoadedAt).toLocaleTimeString()}
				</p>
			</div>

			{hasEvolution ? (
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
					<div className="flex items-center justify-center gap-4 flex-wrap">
						{evolutionNames.map((evoName, index) => (
							<div key={evoName} className="flex items-center gap-4">
								<Link
									to={`/modular/${evoName}/evolution`}
									className={`px-6 py-3 rounded-lg font-bold transition-all ${
										evoName === species.name
											? "bg-green-600 text-white shadow-lg scale-110"
											: "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
									}`}
								>
									{capitalizeName(evoName)}
								</Link>
								{index < evolutionNames.length - 1 && (
									<div className="flex items-center">
										<div className="h-0.5 w-8 bg-green-600" />
										<div className="text-green-600 text-2xl">→</div>
										<div className="h-0.5 w-8 bg-green-600" />
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-gray-200">
					<p className="text-gray-600 text-lg">This Pokémon does not evolve.</p>
				</div>
			)}

			{/* Species Info */}
			<div className="mt-6 grid md:grid-cols-2 gap-4">
				<div className="bg-yellow-50 rounded-lg p-4">
					<h3 className="font-bold text-yellow-900 mb-2">Rarity</h3>
					<div className="space-y-2 text-sm">
						{species.is_legendary && (
							<div className="flex items-center gap-2">
								<span className="text-2xl">⭐</span>
								<span className="font-bold text-yellow-800">Legendary</span>
							</div>
						)}
						{species.is_mythical && (
							<div className="flex items-center gap-2">
								<span className="text-2xl">✨</span>
								<span className="font-bold text-purple-800">Mythical</span>
							</div>
						)}
						{!species.is_legendary && !species.is_mythical && (
							<div className="flex items-center gap-2">
								<span className="text-2xl">🌟</span>
								<span className="font-bold text-gray-800">Regular</span>
							</div>
						)}
					</div>
				</div>

				<div className="bg-blue-50 rounded-lg p-4">
					<h3 className="font-bold text-blue-900 mb-2">Capture Info</h3>
					<div className="space-y-1 text-sm text-blue-800">
						<p>
							<strong>Capture Rate:</strong> {species.capture_rate}/255
						</p>
						<p>
							<strong>Base Happiness:</strong> {species.base_happiness}/255
						</p>
						<p>
							<strong>Hatch Counter:</strong> {species.hatch_counter}
						</p>
					</div>
				</div>
			</div>

			{/* Show parallel loading */}
			<div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
				<h3 className="font-bold text-green-900 mb-2">🚀 Parallel Loading!</h3>
				<p className="text-green-800 text-sm">
					When you navigated to this tab, THREE API calls happened:
				</p>
				<ul className="text-green-800 text-sm mt-2 space-y-1 list-disc list-inside">
					<li>
						<code className="bg-green-100 px-1 rounded">fetchPokemon()</code> -
						Parent loader
					</li>
					<li>
						<code className="bg-green-100 px-1 rounded">
							fetchPokemonSpecies()
						</code>{" "}
						- This child loader
					</li>
					<li>
						<code className="bg-green-100 px-1 rounded">
							fetchEvolutionChain()
						</code>{" "}
						- This child loader
					</li>
				</ul>
				<p className="text-green-800 text-sm mt-2">
					Check your console - the parent loader and child loader started at
					almost the same time! 🔥
				</p>
			</div>

			{parentData && (
				<div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
					<p className="text-purple-800 text-xs">
						💡 Accessing parent: {parentData.pokemon.name}
						(Base XP: {parentData.pokemon.base_experience})
					</p>
				</div>
			)}
		</div>
	)
}
