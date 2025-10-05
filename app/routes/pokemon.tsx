// Pokemon Layout Route - Wraps all pokemon-related routes

import { Link, Outlet, useLoaderData, useLocation } from "react-router"
import { fetchPokemonList } from "../api/pokemon-service"

// Layout Loader - This will run IN PARALLEL with child route loaders!
// When you visit /pokemon/pikachu, this loader AND the detail page loader
// will both start at the same time. Check your console!
export async function loader() {
	// Special log to highlight PARENT LAYOUT LOADER
	const startTime = performance.now()
	const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	console.log(
		`\x1b[2m[${timestamp}]\x1b[0m \x1b[35m\x1b[1m🎯 PARENT LAYOUT LOADER STARTED\x1b[0m \x1b[35m(pokemon.tsx)\x1b[0m`,
	)

	// Fetch a small sample of pokemon for the layout's "Quick Access" feature
	const data = await fetchPokemonList(6, 0)

	const duration = Math.round(performance.now() - startTime)
	const endTimestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	console.log(
		`\x1b[2m[${endTimestamp}]\x1b[0m \x1b[35m\x1b[1m✨ PARENT LAYOUT LOADER FINISHED\x1b[0m \x1b[2m(${duration}ms)\x1b[0m`,
	)

	return {
		quickAccessPokemon: data.results,
	}
}

export default function PokemonLayout() {
	const { quickAccessPokemon } = useLoaderData<typeof loader>()
	const location = useLocation()
	const isListPage = location.pathname === "/pokemon"

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<header className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold text-gray-900 mb-2">
								⚡ PokéDex
							</h1>
							<p className="text-gray-600">React Router 7 + PokeAPI Demo</p>
						</div>
						<nav className="flex gap-4">
							<Link
								to="/pokemon"
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									isListPage
										? "bg-blue-600 text-white"
										: "bg-white text-gray-700 hover:bg-gray-100"
								}`}
							>
								📋 List
							</Link>
							<Link
								to="/types"
								className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors"
							>
								🏷️ Types
							</Link>
							<Link
								to="/demo"
								className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors"
							>
								🔬 Demo
							</Link>
						</nav>
					</div>
				</header>

				{/* Child routes render here */}
				<Outlet />

				{/* Quick Access - Data loaded by parent layout loader */}
				<div className="mt-8 bg-white rounded-lg shadow-lg p-4">
					<h3 className="font-bold text-gray-900 mb-3">⚡ Quick Access</h3>
					<div className="flex gap-2 overflow-x-auto">
						{quickAccessPokemon.map((p) => (
							<Link
								key={p.name}
								to={`/pokemon/${p.name}`}
								className="flex-shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors capitalize"
							>
								{p.name}
							</Link>
						))}
					</div>
					<p className="text-xs text-gray-500 mt-2">
						💡 This data was loaded by the parent layout's loader
					</p>
				</div>
			</div>

			{/* Parallel Loading Info */}
			<div className="fixed bottom-4 right-4 max-w-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-2xl p-4 border-4 border-yellow-400 animate-pulse">
				<h4 className="font-bold mb-2 text-lg">
					🚀 Nested Route Parallel Loading!
				</h4>
				<p className="text-sm text-white/90 mb-2">
					This layout has a loader that fetches "Quick Access" pokemon. When you
					navigate to a pokemon detail page, BOTH loaders run in parallel:
				</p>
				<ul className="text-xs text-white/90 mt-2 space-y-1 bg-black/20 rounded p-2">
					<li>
						• <span className="text-purple-300">🎯 PARENT:</span>{" "}
						fetchPokemonList (Quick Access)
					</li>
					<li>
						• <span className="text-yellow-300">🔥 CHILD:</span> fetchPokemon +
						fetchPokemonSpecies
					</li>
				</ul>
				<p className="text-sm text-yellow-200 mt-3 font-bold bg-black/30 rounded p-2 text-center">
					👀 CHECK YOUR TERMINAL CONSOLE NOW! 👀
				</p>
				<p className="text-xs text-white/80 mt-2 text-center">
					Look for color-coded parallel loader logs!
				</p>
			</div>
		</div>
	)
}
