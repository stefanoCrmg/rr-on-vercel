// Redirect to stats tab by default

import { redirect } from "react-router"
import type { Route } from "./+types/modular.$name._index"

export async function loader({ params }: Route.LoaderArgs) {
	// Redirect to the stats tab by default
	return redirect(`/modular/${params.name}/stats`)
}
