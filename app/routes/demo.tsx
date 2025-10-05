// Demo Route - Shows SSR loader vs clientLoader

import { Link, useLoaderData } from "react-router"
import { fetchPokemon } from "../api/pokemon-service"

// SSR Loader - runs on server during initial load
// and on both server + client during navigation (depending on context)
export async function loader() {
	console.log(
		"%c🖥️  LOADER (SSR) - Running on: %c" +
			(typeof window === "undefined" ? "SERVER" : "CLIENT"),
		"color: #3b82f6; font-weight: bold",
		"color: #ef4444; font-weight: bold; font-size: 14px",
	)

	const pokemon = await fetchPokemon("pikachu")

	return {
		pokemon,
		loadedOn: typeof window === "undefined" ? "server" : "client",
		timestamp: new Date().toISOString(),
	}
}

// Client Loader - ONLY runs in the browser
// This demonstrates the "mixed mode" - some data from server, some from client
export async function clientLoader() {
	console.log(
		"%c💻 CLIENT LOADER - Running on: CLIENT (always!)",
		"color: #10b981; font-weight: bold; font-size: 14px",
	)

	const pokemon = await fetchPokemon("charizard")

	// You can also access browser-only APIs here
	const browserInfo = {
		userAgent: navigator.userAgent,
		language: navigator.language,
		online: navigator.onLine,
		cookiesEnabled: navigator.cookieEnabled,
	}

	return {
		pokemon,
		browserInfo,
		loadedOn: "client",
		timestamp: new Date().toISOString(),
	}
}

// Tell React Router to use clientLoader instead of loader for client-side navigations
clientLoader.hydrate = true

export default function Demo() {
	const data = useLoaderData<typeof clientLoader>()

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
						🔬 SSR vs Client Loading Demo
					</h1>
					<p className="text-gray-600">
						Understanding React Router 7's loading strategies
					</p>
				</div>

				{/* Content */}
				<div className="grid md:grid-cols-2 gap-6 mb-8">
					{/* Loaded Data */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							📦 Loaded Data
						</h2>

						<div className="mb-6">
							<img
								src={
									data.pokemon.sprites.other?.["official-artwork"]
										?.front_default ||
									data.pokemon.sprites.front_default ||
									undefined
								}
								alt={data.pokemon.name}
								className="w-48 mx-auto"
							/>
							<h3 className="text-center text-xl font-bold capitalize mt-4">
								{data.pokemon.name}
							</h3>
							<p className="text-center text-gray-600">ID: {data.pokemon.id}</p>
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">Loaded on:</span>
								<span className="font-bold text-gray-900 capitalize">
									{data.loadedOn}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Timestamp:</span>
								<span className="font-mono text-xs text-gray-900">
									{new Date(data.timestamp).toLocaleTimeString()}
								</span>
							</div>
						</div>

						{"browserInfo" in data && (
							<div className="mt-6 p-4 bg-green-50 rounded-lg">
								<h4 className="font-bold text-green-900 mb-2">
									🌐 Browser Info (Client-only)
								</h4>
								<div className="space-y-1 text-xs text-green-800">
									<div>
										<strong>Language:</strong> {data.browserInfo.language}
									</div>
									<div>
										<strong>Online:</strong>{" "}
										{data.browserInfo.online ? "Yes" : "No"}
									</div>
									<div>
										<strong>Cookies:</strong>{" "}
										{data.browserInfo.cookiesEnabled ? "Enabled" : "Disabled"}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Instructions */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							🎯 How to Test
						</h2>

						<div className="space-y-4 text-sm text-gray-700">
							<div>
								<h3 className="font-bold text-gray-900 mb-2">
									1. Initial Page Load (SSR)
								</h3>
								<p>
									Refresh this page. Check your <strong>server console</strong>{" "}
									(terminal where you ran{" "}
									<code className="bg-gray-100 px-1 rounded">pnpm dev</code>).
									You'll see the loader runs on the SERVER first.
								</p>
							</div>

							<div>
								<h3 className="font-bold text-gray-900 mb-2">
									2. Client-Side Navigation
								</h3>
								<p>
									Navigate away from this page (click "Back to Pokédex") and
									then come back. Check your <strong>browser console</strong>.
									This time,{" "}
									<code className="bg-gray-100 px-1 rounded">clientLoader</code>{" "}
									runs in the browser!
								</p>
							</div>

							<div>
								<h3 className="font-bold text-gray-900 mb-2">
									3. Observe the Difference
								</h3>
								<p>
									Notice that the clientLoader has access to browser APIs
									(navigator, window, etc.) that aren't available on the server.
								</p>
							</div>

							<div className="p-4 bg-blue-50 rounded-lg">
								<h4 className="font-bold text-blue-900 mb-2">💡 Pro Tip</h4>
								<p className="text-blue-800">
									Set{" "}
									<code className="bg-blue-100 px-1 rounded">
										clientLoader.hydrate = true
									</code>{" "}
									to tell React Router to use the clientLoader for client-side
									navigations instead of the regular loader!
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Explanation Boxes */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* SSR Loader */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h3 className="font-bold text-blue-900 mb-2">
							🖥️ SSR Loader (loader)
						</h3>
						<ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
							<li>Runs on the SERVER during initial page load</li>
							<li>Data is available immediately (no loading state)</li>
							<li>Great for SEO and performance</li>
							<li>No access to browser APIs (window, navigator, etc.)</li>
							<li>Can access databases, file systems, environment variables</li>
						</ul>
					</div>

					{/* Client Loader */}
					<div className="bg-green-50 border border-green-200 rounded-lg p-4">
						<h3 className="font-bold text-green-900 mb-2">
							💻 Client Loader (clientLoader)
						</h3>
						<ul className="text-green-800 text-sm space-y-1 list-disc list-inside">
							<li>ONLY runs in the browser</li>
							<li>Full access to browser APIs</li>
							<li>
								Great for client-only features (localStorage, geolocation)
							</li>
							<li>Can fetch from client-side APIs</li>
							<li>Useful for progressive enhancement</li>
						</ul>
					</div>
				</div>

				{/* Mixed Mode Explanation */}
				<div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
					<h3 className="font-bold text-purple-900 mb-2">
						🎨 Mixed Mode (The Best of Both Worlds)
					</h3>
					<p className="text-purple-800 text-sm">
						React Router 7 allows you to mix SSR loaders and client loaders in
						the same app! Most routes can use SSR loaders for fast initial loads
						and SEO, while specific routes that need browser APIs can use
						clientLoaders. This is what we mean by "mixed mode" - you get to
						choose per-route! 🚀
					</p>
				</div>
			</div>
		</div>
	)
}
