import { Link } from "react-router"

export function meta() {
	return [
		{ title: "React Router 7 + Pokémon API Demo" },
		{
			name: "description",
			content: "Learn React Router 7 concepts with Pokémon!",
		},
	]
}

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
			<div className="max-w-4xl w-full">
				{/* Main Card */}
				<div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
					<div className="text-center mb-8">
						<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
							⚡ React Router 7
						</h1>
						<p className="text-xl text-gray-600 mb-2">
							Learn by Example: Pokémon Edition
						</p>
						<p className="text-gray-500">
							Explore SSR, parallel loading, nested routes, and more!
						</p>
					</div>

					{/* Feature Cards */}
					<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
						<Link
							to="/pokemon"
							className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 transition-all hover:shadow-lg group"
						>
							<div className="text-4xl mb-3">📋</div>
							<h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
								Pokémon List
							</h3>
							<p className="text-sm text-gray-600">
								SSR loader with pagination
							</p>
						</Link>

						<Link
							to="/streaming/pikachu"
							className="bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 rounded-xl p-6 transition-all hover:shadow-lg group border-2 border-cyan-300"
						>
							<div className="text-4xl mb-3">🌊</div>
							<h3 className="font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
								Streaming
							</h3>
							<p className="text-sm text-gray-600">Progressive rendering</p>
						</Link>

						<Link
							to="/modular/charizard"
							className="bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-xl p-6 transition-all hover:shadow-lg group border-2 border-indigo-300"
						>
							<div className="text-4xl mb-3">🧩</div>
							<h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
								Modular
							</h3>
							<p className="text-sm text-gray-600">
								Nested routes + child loaders
							</p>
						</Link>

						<Link
							to="/types"
							className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-6 transition-all hover:shadow-lg group"
						>
							<div className="text-4xl mb-3">🏷️</div>
							<h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
								Type System
							</h3>
							<p className="text-sm text-gray-600">
								Massive parallel loading (18 requests!)
							</p>
						</Link>

						<Link
							to="/demo"
							className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl p-6 transition-all hover:shadow-lg group"
						>
							<div className="text-4xl mb-3">🔬</div>
							<h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
								SSR vs Client
							</h3>
							<p className="text-sm text-gray-600">Compare loader strategies</p>
						</Link>
					</div>

					{/* What You'll Learn */}
					<div className="bg-gray-50 rounded-xl p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							🎓 What You'll Learn
						</h2>
						<div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
							<div className="flex items-start gap-2">
								<span className="text-green-600 mt-0.5">✓</span>
								<span>Server-side rendering (SSR) with loaders</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-green-600 mt-0.5">✓</span>
								<span>Parallel data loading with Promise.all()</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-green-600 mt-0.5">✓</span>
								<span>Nested routes and layouts</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-green-600 mt-0.5">✓</span>
								<span>Client-side loaders for browser APIs</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-green-600 mt-0.5">✓</span>
								<span>Mixed mode (SSR + client loaders)</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-green-600 mt-0.5">✓</span>
								<span>Streaming/progressive rendering with defer()</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-green-600 mt-0.5">✓</span>
								<span>Suspense boundaries for loading states</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-green-600 mt-0.5">✓</span>
								<span>Timing logs for performance insights</span>
							</div>
						</div>
					</div>

					{/* Prefetch Demo */}
					<div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
						<h3 className="font-bold text-gray-900 mb-3 text-lg">
							🚀 Smart Prefetching (Built-in!)
						</h3>
						<p className="text-sm text-gray-600 mb-4">
							React Router 7 prefetches routes automatically. Hover over these
							links and watch the Network tab!
						</p>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{/* Default: intent (hover/focus) */}
							<Link
								to="/pokemon/pikachu"
								className="bg-white hover:bg-green-50 border-2 border-green-300 rounded-lg p-3 text-center transition-all hover:shadow-md"
							>
								<div className="text-2xl mb-1">⚡</div>
								<div className="text-xs font-semibold text-gray-700">
									Pikachu
								</div>
								<div className="text-xs text-green-600 mt-1">
									prefetch: default
								</div>
							</Link>

							{/* Explicit intent */}
							<Link
								to="/pokemon/charizard"
								prefetch="intent"
								className="bg-white hover:bg-green-50 border-2 border-green-300 rounded-lg p-3 text-center transition-all hover:shadow-md"
							>
								<div className="text-2xl mb-1">🔥</div>
								<div className="text-xs font-semibold text-gray-700">
									Charizard
								</div>
								<div className="text-xs text-green-600 mt-1">
									prefetch: intent
								</div>
							</Link>

							{/* No prefetch */}
							<Link
								to="/pokemon/bulbasaur"
								prefetch="none"
								className="bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-center transition-all hover:shadow-md"
							>
								<div className="text-2xl mb-1">🌱</div>
								<div className="text-xs font-semibold text-gray-700">
									Bulbasaur
								</div>
								<div className="text-xs text-red-600 mt-1">prefetch: none</div>
							</Link>

							{/* Render (prefetch when rendered) */}
							<Link
								to="/pokemon/squirtle"
								prefetch="render"
								className="bg-white hover:bg-green-50 border-2 border-blue-300 rounded-lg p-3 text-center transition-all hover:shadow-md"
							>
								<div className="text-2xl mb-1">💧</div>
								<div className="text-xs font-semibold text-gray-700">
									Squirtle
								</div>
								<div className="text-xs text-blue-600 mt-1">
									prefetch: render
								</div>
							</Link>
						</div>
						<p className="text-xs text-gray-500 mt-4">
							💡 <strong>intent</strong> (default): Prefetches on hover/focus •{" "}
							<strong>render</strong>: Prefetches immediately •{" "}
							<strong>none</strong>: No prefetch
						</p>
						<div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
							<p className="text-xs text-gray-700">
								<strong>Test it:</strong> Hover Pikachu for 2sec → watch
								terminal → click → navigation is INSTANT (no loading)! Loaders
								re-run for fresh data, but the UI transition is smooth.
							</p>
						</div>
					</div>

					{/* Call to Action */}
					<div className="mt-8 text-center">
						<Link
							to="/pokemon"
							className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
						>
							Start Exploring →
						</Link>
						<p className="text-sm text-gray-500 mt-4">
							💡 Check your browser console & Network tab for timing logs!
						</p>
					</div>
				</div>

				{/* Tech Stack */}
				<div className="mt-6 text-center text-white/80 text-sm">
					<p>Built with React Router 7 • TypeScript • Tailwind CSS • PokéAPI</p>
				</div>
			</div>
		</div>
	)
}
