import '@std/dotenv/load'

const rootHandler = (req: Request): Response => {
	const url = new URL(req.url)

	console.log(`${req.method} request received for ${url.pathname}`)

	return new Response('Hello World', {
		headers: new Headers({
			'content-type': 'text/plain'
		})
	})
}

const errorHandler = (error: unknown): Response => {
	console.error(error)

	return new Response('Internal Server Error', {
		status: 500,
		headers: new Headers({ 'content-type': 'text/plain' })
	})
}

Deno.serve({
	port: parseInt(Deno.env.get('NOUS_SERVER_PORT') ?? '3000'),
	onListen: ({ port }): void => {
		console.log(`NOUS listening on port ${port}`)
	},
	onError: errorHandler
}, rootHandler)