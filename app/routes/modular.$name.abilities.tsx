// Abilities Child Route - Has its own loader!

import { useLoaderData, useRouteLoaderData } from "react-router"
import { capitalizeName, fetchPokemon } from "../api/pokemon-service"
import type { Pokemon } from "../api/types"
import type { Route } from "./+types/modular.$name.abilities"

// CHILD LOADER for abilities
export async function loader({ params }: Route.LoaderArgs) {
	const { name } = params

	console.log(
		`\x1b[36m\x1b[1m⚡ CHILD LOADER (abilities)\x1b[0m \x1b[36m- Loading abilities data for "${name}"\x1b[0m`,
	)

	const pokemon = await fetchPokemon(name)

	return {
		abilitiesLoadedAt: new Date().toISOString(),
		abilities: pokemon.abilities,
	}
}

export default function AbilitiesTab() {
	const { abilitiesLoadedAt, abilities } = useLoaderData<typeof loader>()

	// Access parent data
	const parentData = useRouteLoaderData<{ pokemon: Pokemon }>(
		"routes/modular.$name",
	)

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Abilities</h2>
				<p className="text-sm text-gray-600">
					✅ Loaded by this child route at{" "}
					{new Date(abilitiesLoadedAt).toLocaleTimeString()}
				</p>
			</div>

			<div className="grid gap-4">
				{abilities.map((ability) => (
					<div
						key={ability.ability.name}
						className={`rounded-lg p-5 ${
							ability.is_hidden
								? "bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300"
								: "bg-gray-50 border border-gray-200"
						}`}
					>
						<div className="flex items-start justify-between mb-2">
							<h3 className="text-lg font-bold text-gray-900">
								{capitalizeName(ability.ability.name)}
							</h3>
							{ability.is_hidden && (
								<span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
									HIDDEN
								</span>
							)}
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<span className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">
								Slot {ability.slot}
							</span>
							{ability.is_hidden && (
								<span className="text-purple-700 text-xs">
									• Only available through special methods
								</span>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Info about loading */}
			<div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
				<h3 className="font-bold text-cyan-900 mb-2">🔍 Route Co-location</h3>
				<p className="text-cyan-800 text-sm">
					This tab has its own{" "}
					<code className="bg-cyan-100 px-1 rounded">loader</code> function.
					When you switch between tabs, only the data for that specific tab is
					loaded. This is called <strong>route co-location</strong> - data lives
					with the route that uses it! 📦
				</p>
			</div>

			{parentData && (
				<div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
					<p className="text-purple-800 text-xs">
						💡 Parent data available: {parentData.pokemon.name} (
						{parentData.pokemon.types.length} types)
					</p>
				</div>
			)}
		</div>
	)
}
