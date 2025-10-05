// Modular Route - Parent Layout
// This loads the basic Pokemon data that ALL child routes can access

import {
	Link,
	Outlet,
	useLoaderData,
	useLocation,
	useParams,
} from "react-router"
import { capitalizeName, fetchPokemon } from "../api/pokemon-service"
import type { Route } from "./+types/modular.$name"

// PARENT LOADER - Loads basic Pokemon data
export async function loader({ params }: Route.LoaderArgs) {
	const { name } = params

	console.log(
		`\x1b[35m\x1b[1m🎯 PARENT LOADER\x1b[0m \x1b[35m(modular.$name.tsx) - Loading basic data for "${name}"\x1b[0m`,
	)

	const pokemon = await fetchPokemon(name)

	return { pokemon }
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

export default function ModularPokemonLayout() {
	const { pokemon } = useLoaderData<typeof loader>()
	const location = useLocation()
	const params = useParams()

	const sprite =
		pokemon.sprites.other?.["official-artwork"]?.front_default ||
		pokemon.sprites.front_default

	// Tab navigation
	const tabs = [
		{ path: `/modular/${params.name}/stats`, label: "📊 Stats", id: "stats" },
		{
			path: `/modular/${params.name}/abilities`,
			label: "⚡ Abilities",
			id: "abilities",
		},
		{
			path: `/modular/${params.name}/evolution`,
			label: "🔄 Evolution",
			id: "evolution",
		},
	]

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-5xl mx-auto">
					{/* Navigation */}
					<div className="flex gap-4 mb-6">
						<Link
							to="/pokemon"
							className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
						>
							← Back to list
						</Link>
						<Link
							to={`/pokemon/${pokemon.name}`}
							className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
						>
							Compare with monolithic version →
						</Link>
					</div>

					{/* Notice */}
					<div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
						<h2 className="text-2xl font-bold mb-2">
							🧩 Modular Route Pattern
						</h2>
						<p className="text-indigo-100 text-sm">
							This page is split into <strong>multiple nested routes</strong>.
							The parent loads basic Pokemon data, and each child route (tab)
							has its own loader for its specific data. Children can access
							parent data via{" "}
							<code className="bg-white/20 px-1 rounded">
								useRouteLoaderData()
							</code>
							!
						</p>
					</div>

					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
						{/* Header - Loaded by PARENT */}
						<div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-indigo-100 text-sm mb-1">
										#{pokemon.id.toString().padStart(3, "0")}
									</p>
									<h1 className="text-4xl font-bold mb-2">
										{capitalizeName(pokemon.name)}
									</h1>
									<p className="text-indigo-100 text-sm">
										✅ Loaded by parent route
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

						<div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
							{/* Left - Image (from parent data) */}
							<div>
								<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 sticky top-6">
									<img
										src={sprite || undefined}
										alt={pokemon.name}
										className="w-full"
									/>
									<div className="mt-4 grid grid-cols-2 gap-2 text-center">
										<div className="bg-white rounded p-2">
											<p className="text-xs text-gray-500">Height</p>
											<p className="font-bold text-gray-900">
												{(pokemon.height / 10).toFixed(1)}m
											</p>
										</div>
										<div className="bg-white rounded p-2">
											<p className="text-xs text-gray-500">Weight</p>
											<p className="font-bold text-gray-900">
												{(pokemon.weight / 10).toFixed(1)}kg
											</p>
										</div>
									</div>
									<p className="text-xs text-green-600 mt-2 text-center font-semibold">
										✅ From parent loader
									</p>
								</div>
							</div>

							{/* Right - Tabs + Child Routes */}
							<div>
								{/* Tab Navigation */}
								<div className="flex gap-2 mb-6 border-b border-gray-200">
									{tabs.map((tab) => {
										const isActive = location.pathname === tab.path
										return (
											<Link
												key={tab.id}
												to={tab.path}
												className={`px-4 py-2 font-medium transition-colors border-b-2 ${
													isActive
														? "border-indigo-600 text-indigo-600"
														: "border-transparent text-gray-600 hover:text-gray-900"
												}`}
											>
												{tab.label}
											</Link>
										)
									})}
								</div>

								{/* Child routes render here - each with its own loader! */}
								<Outlet />
							</div>
						</div>
					</div>

					{/* Explanation */}
					<div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
						<h3 className="font-bold text-indigo-900 mb-3 text-lg">
							🎓 How This Works
						</h3>
						<div className="space-y-3 text-indigo-800 text-sm">
							<div>
								<strong>1. Parent Route ({`/modular/:name`})</strong>
								<p className="ml-4 text-indigo-700">
									• Has a loader that fetches basic Pokemon data
									<br />• Renders the layout (header, image, tab navigation)
									<br />• Renders{" "}
									<code className="bg-indigo-100 px-1 rounded">
										&lt;Outlet /&gt;
									</code>{" "}
									for child routes
								</p>
							</div>
							<div>
								<strong>
									2. Child Routes ({`/modular/:name/stats`}, etc.)
								</strong>
								<p className="ml-4 text-indigo-700">
									• Each child has its own loader for specific data
									<br />• Can access parent data via{" "}
									<code className="bg-indigo-100 px-1 rounded">
										useRouteLoaderData()
									</code>
									<br />• Renders inside the parent's{" "}
									<code className="bg-indigo-100 px-1 rounded">
										&lt;Outlet /&gt;
									</code>
								</p>
							</div>
							<div>
								<strong>3. All Loaders Run in Parallel!</strong>
								<p className="ml-4 text-indigo-700">
									When you navigate to a child route, both parent and child
									loaders execute simultaneously. Check your console! 🚀
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
