// Stats Child Route - Has its own loader!

import { useLoaderData, useRouteLoaderData } from "react-router"
import { fetchPokemon } from "../api/pokemon-service"
import type { Route } from "./+types/modular.$name.stats"

// CHILD LOADER - Could fetch additional stats data
// For demo purposes, we'll re-fetch to show it has its own loader
export async function loader({ params }: Route.LoaderArgs) {
	const { name } = params

	console.log(
		`\x1b[33m\x1b[1m📊 CHILD LOADER (stats)\x1b[0m \x1b[33m- Loading stats data for "${name}"\x1b[0m`,
	)

	// In a real app, this might fetch additional stats data
	// For demo, we'll just show we can load data here
	const pokemon = await fetchPokemon(name)

	return {
		statsLoadedAt: new Date().toISOString(),
		pokemon,
	}
}

export default function StatsTab() {
	const { statsLoadedAt, pokemon } = useLoaderData<typeof loader>()

	// We can ALSO access the parent's loader data!
	const parentData = useRouteLoaderData<{ pokemon: typeof pokemon }>(
		"routes/modular.$name",
	)

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Base Stats</h2>
				<p className="text-sm text-gray-600">
					✅ Loaded by this child route at{" "}
					{new Date(statsLoadedAt).toLocaleTimeString()}
				</p>
			</div>

			{/* Stats from our loader */}
			<div className="space-y-4">
				{pokemon.stats.map((stat) => {
					const statName = stat.stat.name
						.replace("-", " ")
						.replace(/\b\w/g, (l) => l.toUpperCase())
					const percentage = Math.min((stat.base_stat / 255) * 100, 100)

					// Color based on value
					let color = "bg-gray-400"
					if (stat.base_stat >= 100) color = "bg-green-600"
					else if (stat.base_stat >= 70) color = "bg-blue-600"
					else if (stat.base_stat >= 40) color = "bg-yellow-600"
					else color = "bg-red-600"

					return (
						<div key={stat.stat.name} className="bg-gray-50 rounded-lg p-4">
							<div className="flex justify-between mb-2">
								<span className="font-medium text-gray-700">{statName}</span>
								<span className="font-bold text-gray-900">
									{stat.base_stat}
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-3">
								<div
									className={`${color} h-3 rounded-full transition-all duration-500`}
									style={{ width: `${percentage}%` }}
								/>
							</div>
							<div className="flex justify-between mt-1 text-xs text-gray-500">
								<span>Min: 0</span>
								<span>Max: 255</span>
							</div>
						</div>
					)
				})}
			</div>

			{/* Total stats */}
			<div className="mt-6 bg-indigo-50 rounded-lg p-4">
				<div className="flex justify-between items-center">
					<span className="font-bold text-indigo-900">Total Base Stats</span>
					<span className="text-2xl font-bold text-indigo-600">
						{pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
					</span>
				</div>
			</div>

			{/* Show we can access parent data */}
			{parentData && (
				<div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
					<h3 className="font-bold text-purple-900 mb-2">
						💡 Accessing Parent Data
					</h3>
					<p className="text-purple-800 text-sm">
						This child route can access the parent's loader data!
						<br />
						Parent loaded: <strong>{parentData.pokemon.name}</strong> (ID:{" "}
						{parentData.pokemon.id})
					</p>
					<code className="block mt-2 bg-purple-100 rounded p-2 text-xs">
						useRouteLoaderData("routes/modular.$name")
					</code>
				</div>
			)}
		</div>
	)
}
