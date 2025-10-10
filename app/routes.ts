import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes"

export default [
	// Home route
	index("routes/home.tsx"),

	// Pokemon routes with layout
	layout("routes/pokemon.tsx", [
		route("pokemon", "routes/pokemon._index.tsx"),
		route("pokemon/:name", "routes/pokemon.$name.tsx"),
		route("testing-actions", "routes/testing-actions.tsx"),
	]),

	// Streaming demo (defer + Suspense)
	route("streaming/:name", "routes/streaming.$name.tsx"),

	// Modular routes (nested with child loaders)
	route("modular/:name", "routes/modular.$name.tsx", [
		index("routes/modular.$name._index.tsx"),
		route("stats", "routes/modular.$name.stats.tsx"),
		route("abilities", "routes/modular.$name.abilities.tsx"),
		route("evolution", "routes/modular.$name.evolution.tsx"),
	]),

	// Types route
	route("types", "routes/types.tsx"),

	// Demo route (SSR vs clientLoader)
	route("demo", "routes/demo.tsx"),
] satisfies RouteConfig
