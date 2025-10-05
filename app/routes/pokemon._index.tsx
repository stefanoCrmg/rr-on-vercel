// Pokemon List Route - Demonstrates SSR loader with pagination

import { Link, useLoaderData, useSearchParams } from "react-router"
import { capitalizeName, fetchPokemonList } from "../api/pokemon-service"
import type { Route } from "./+types/pokemon._index"

// SSR Loader - runs on the server during initial page load
// and on the client during navigation
export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const page = Number.parseInt(url.searchParams.get("page") || "1", 10)
	const limit = 20
	const offset = (page - 1) * limit

	// Special log to highlight INDEX LIST LOADER
	const startTime = performance.now()
	const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	console.log(
		`\x1b[2m[${timestamp}]\x1b[0m \x1b[34m\x1b[1m📋 INDEX LIST LOADER STARTED\x1b[0m \x1b[34m(pokemon._index.tsx, page ${page})\x1b[0m`,
	)

	const data = await fetchPokemonList(limit, offset)

	const duration = Math.round(performance.now() - startTime)
	const endTimestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
	console.log(
		`\x1b[2m[${endTimestamp}]\x1b[0m \x1b[34m\x1b[1m✅ INDEX LIST LOADER FINISHED\x1b[0m \x1b[2m(${duration}ms)\x1b[0m`,
	)

	return {
		pokemon: data.results,
		count: data.count,
		currentPage: page,
		totalPages: Math.ceil(data.count / limit),
		hasNext: data.next !== null,
		hasPrevious: data.previous !== null,
	}
}

export default function PokemonIndex() {
	const { pokemon, count, currentPage, totalPages, hasNext, hasPrevious } =
		useLoaderData<typeof loader>()
	const [searchParams] = useSearchParams()

	// Generate pagination links
	const getPaginationLink = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set("page", page.toString())
		return `/pokemon?${params.toString()}`
	}

	// Get Pokemon ID from URL for image
	const getPokemonId = (url: string): number => {
		const matches = url.match(/\/(\d+)\/$/)
		return matches ? Number.parseInt(matches[1], 10) : 0
	}

	return (
		<div>
			{/* Stats */}
			<div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
				<p className="text-gray-600">
					Showing{" "}
					<span className="font-bold text-gray-900">{pokemon.length}</span> of{" "}
					<span className="font-bold text-gray-900">{count}</span> Pokémon
					{" • "}
					Page <span className="font-bold text-gray-900">{currentPage}</span> of{" "}
					<span className="font-bold text-gray-900">{totalPages}</span>
				</p>
			</div>

			{/* Pokemon Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
				{pokemon.map((p) => {
					const id = getPokemonId(p.url)
					return (
						<Link
							key={p.name}
							to={`/pokemon/${p.name}`}
							className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
						>
							<div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
								<img
									src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
									alt={p.name}
									className="w-full h-full object-contain group-hover:scale-110 transition-transform"
									loading="lazy"
								/>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-500 mb-1">
									#{id.toString().padStart(3, "0")}
								</p>
								<h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
									{capitalizeName(p.name)}
								</h3>
							</div>
						</Link>
					)
				})}
			</div>

			{/* Pagination */}
			<div className="flex justify-center items-center gap-2">
				<Link
					to={getPaginationLink(currentPage - 1)}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						hasPrevious
							? "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
							: "bg-gray-100 text-gray-400 cursor-not-allowed"
					}`}
					aria-disabled={!hasPrevious}
					onClick={(e) => {
						if (!hasPrevious) e.preventDefault()
					}}
				>
					← Previous
				</Link>

				<div className="flex gap-1">
					{/* Show page numbers */}
					{[...Array(Math.min(5, totalPages))].map((_, i) => {
						let pageNum: number
						if (totalPages <= 5) {
							pageNum = i + 1
						} else if (currentPage <= 3) {
							pageNum = i + 1
						} else if (currentPage >= totalPages - 2) {
							pageNum = totalPages - 4 + i
						} else {
							pageNum = currentPage - 2 + i
						}

						return (
							<Link
								key={pageNum}
								to={getPaginationLink(pageNum)}
								className={`w-10 h-10 rounded-lg font-medium transition-colors flex items-center justify-center ${
									pageNum === currentPage
										? "bg-blue-600 text-white"
										: "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
								}`}
							>
								{pageNum}
							</Link>
						)
					})}
				</div>

				<Link
					to={getPaginationLink(currentPage + 1)}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						hasNext
							? "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
							: "bg-gray-100 text-gray-400 cursor-not-allowed"
					}`}
					aria-disabled={!hasNext}
					onClick={(e) => {
						if (!hasNext) e.preventDefault()
					}}
				>
					Next →
				</Link>
			</div>

			{/* SSR Info Box */}
			<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-bold text-blue-900 mb-2">
					🔍 React Router 7 Concept: SSR Loader
				</h3>
				<p className="text-blue-800 text-sm">
					This page uses a{" "}
					<code className="bg-blue-100 px-1 rounded">loader</code> function that
					runs on the server during SSR. Check your console to see the timing
					logs! The data is fetched before the page renders, making it instantly
					available without loading states.
				</p>
			</div>
		</div>
	)
}
