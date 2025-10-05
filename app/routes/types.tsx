// Types Route - Demonstrates parallel loading of multiple types

import { Link, useLoaderData } from "react-router"
import { capitalizeName, fetchType } from "../api/pokemon-service"

// Load multiple types in parallel
export async function loader() {
	const typeNames = [
		"normal",
		"fire",
		"water",
		"electric",
		"grass",
		"ice",
		"fighting",
		"poison",
		"ground",
		"flying",
		"psychic",
		"bug",
		"rock",
		"ghost",
		"dragon",
		"dark",
		"steel",
		"fairy",
	]

	// Fetch ALL types in parallel - check console for timing!
	const types = await Promise.all(typeNames.map((name) => fetchType(name)))

	return { types }
}

const typeColors: Record<string, string> = {
	normal: "from-gray-400 to-gray-500",
	fire: "from-red-500 to-orange-500",
	water: "from-blue-500 to-cyan-500",
	electric: "from-yellow-400 to-yellow-500",
	grass: "from-green-500 to-lime-500",
	ice: "from-cyan-400 to-blue-400",
	fighting: "from-orange-600 to-red-600",
	poison: "from-purple-500 to-purple-600",
	ground: "from-yellow-600 to-yellow-700",
	flying: "from-indigo-400 to-blue-400",
	psychic: "from-pink-500 to-purple-500",
	bug: "from-lime-500 to-green-500",
	rock: "from-yellow-700 to-gray-600",
	ghost: "from-purple-700 to-indigo-700",
	dragon: "from-indigo-600 to-purple-600",
	dark: "from-gray-700 to-gray-800",
	steel: "from-gray-500 to-gray-600",
	fairy: "from-pink-300 to-pink-400",
}

export default function Types() {
	const { types } = useLoaderData<typeof loader>()

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						to="/pokemon"
						className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
					>
						← Back to Pokédex
					</Link>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						🏷️ Pokémon Types
					</h1>
					<p className="text-gray-600">
						All {types.length} types loaded in parallel
					</p>
				</div>

				{/* Types Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
					{types.map((type) => (
						<div
							key={type.name}
							className={`bg-gradient-to-br ${typeColors[type.name]} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
						>
							<h2 className="text-2xl font-bold mb-2 capitalize">
								{type.name}
							</h2>
							<p className="text-white/90 text-sm mb-4">
								{type.pokemon.length} Pokémon
							</p>

							{/* Damage Relations */}
							<div className="space-y-2 text-sm">
								{type.damage_relations.double_damage_to.length > 0 && (
									<div>
										<p className="font-semibold text-white/80 mb-1">
											Strong against:
										</p>
										<div className="flex flex-wrap gap-1">
											{type.damage_relations.double_damage_to
												.slice(0, 3)
												.map((t) => (
													<span
														key={t.name}
														className="bg-white/20 px-2 py-0.5 rounded text-xs"
													>
														{capitalizeName(t.name)}
													</span>
												))}
											{type.damage_relations.double_damage_to.length > 3 && (
												<span className="text-white/60 text-xs">
													+{type.damage_relations.double_damage_to.length - 3}{" "}
													more
												</span>
											)}
										</div>
									</div>
								)}

								{type.damage_relations.double_damage_from.length > 0 && (
									<div>
										<p className="font-semibold text-white/80 mb-1">
											Weak against:
										</p>
										<div className="flex flex-wrap gap-1">
											{type.damage_relations.double_damage_from
												.slice(0, 3)
												.map((t) => (
													<span
														key={t.name}
														className="bg-black/20 px-2 py-0.5 rounded text-xs"
													>
														{capitalizeName(t.name)}
													</span>
												))}
											{type.damage_relations.double_damage_from.length > 3 && (
												<span className="text-white/60 text-xs">
													+{type.damage_relations.double_damage_from.length - 3}{" "}
													more
												</span>
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Parallel Loading Info Box */}
				<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
					<h3 className="font-bold text-purple-900 mb-2">
						⚡ React Router 7 Concept: Massive Parallel Loading
					</h3>
					<p className="text-purple-800 text-sm mb-2">
						This page demonstrates the power of parallel data loading! Instead
						of fetching 18 types sequentially (which would take ~18 seconds), we
						use{" "}
						<code className="bg-purple-100 px-1 rounded">Promise.all()</code> to
						fetch them all at once.
					</p>
					<p className="text-purple-800 text-sm">
						Check your console logs - you'll see all{" "}
						<code className="bg-purple-100 px-1 rounded">fetchType()</code>{" "}
						calls start at nearly the same time! 🚀 The total load time is
						roughly equal to the slowest individual request, not the sum of all
						requests.
					</p>
				</div>
			</div>
		</div>
	)
}
