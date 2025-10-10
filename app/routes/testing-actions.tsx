import { Form, useActionData } from "react-router"
import type { Route } from "./+types/testing-actions"

const authMiddleware: Route.MiddlewareFunction = async (
	{ request, context },
	next,
) => {
	console.log(`entering middleware with ${request.method}`)
	await next()
	console.log(`exiting middleware with ${request.method}`)
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware]

export async function action({ request }: Route.ActionArgs) {
	const body = await request.formData()
	const name = body.get("visitorsName")
	return { message: `Hello, ${name}` }
}

export default function TestingActions() {
	const data = useActionData<typeof action>()
	return (
		<Form method="post">
			<input
				type="text"
				name="visitorsName"
				className="border-2 border-gray-300 rounded-md p-2"
			/>
			{data ? data.message : "Waiting..."}
		</Form>
	)
}
