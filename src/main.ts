import '@std/dotenv/load'
import { Context, isMethod } from 'nous/types'
import { render } from 'nous/core'
import routes from './routes.ts'

const requestHandler = async (req: Request): Promise<Response> => {
	const url = new URL(req.url)

	// Identifying matching route

	const route = routes.find(route => route.url instanceof RegExp ?
			route.url.test(url.pathname) :
			route.url === url.pathname)

	// Route not found

	if (!route) {
		return new Response('Not Found', {
			status: 404,
			headers: new Headers({ 'content-type': 'text/plain' })
		})
	}

	// Defining context

	const ctx: Context = {
		req: {
			method: isMethod(req.method) ? req.method : 'GET',
			url: url,
			userAgent: req.headers.get('user-agent') ?? ''
		},
		res: {
			contentType: route.contentType,
			status: 200
		},
		user: null
	}

	// Serving the response

	return new Response(await render(ctx, route.component, route.props), {
		status: ctx.res.status,
		headers: new Headers({
			'content-type': ctx.res.contentType
		})
	})
}

const errorHandler = (error: unknown): Response => {
	console.error('Error thrown in request handler', error)

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
}, requestHandler)