import routes from 'nous/routes'
import { strMinifyHTML } from 'nous/utils'

type Component = (ctx: Context, props: Props) => string | Promise<string>

type ComponentName = string

function isComponentName(val: string): val is ComponentName {
	return /^[A-Z][a-zA-Z\d]*$/.test(val)
}

type ContentType = 'text/html' | 'text/plain'

type Props = Record<string, string>

type Context = {
	readonly req: {
		readonly method: Method,
		readonly url: URL,
		readonly userAgent: string
	},
	readonly res: {
		contentType: ContentType,
		status: ResponseStatus
	},
	readonly user: null
}

type Method = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

function isMethod(val: string): val is Method {
	return ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'].includes(val)
}

type ResponseStatus =
	100 | 101 | 102 | 103 |
	200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226 |
	300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 |
	400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 |
	500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511

type Route = {
	contentType: ContentType,
	component: ComponentName,
	props: Props,
	url: string | RegExp
}

const components = new Map<ComponentName, {
	cacheable: boolean,
	renderer: (...args: unknown[]) => unknown
}>()

for (const file of Deno.readDirSync('./src/components')) {
	if (!file.isFile || !file.name.endsWith('.ts')) {
		console.warn(`Unexpected entry in components directory: '${file.name}'`)
		continue
	}

	const componentName = file.name.replace(/\.ts$/, '')

	if (!isComponentName(componentName)) {
		console.warn(`Improperly named entry in components directory: '${file.name}'`)
		continue
	}

	const module = await import(`./components/${file.name}`)

	if (typeof module.default !== 'function') {
		console.warn(`Component'${componentName}' does not export a function`)
		continue
	}

	components.set(componentName, {
		cacheable: 'cacheable' in module ? Boolean(module.cacheable) : true,
		renderer: module.default
	})
}

console.log(`Components loaded: ${components.size}`)

// Checking if all route handlers are mapped to an existing component

for (const route of routes) {
	if (!components.has(route.component)) {
		throw new Error(`Component '${route.component}' serving route '${route.url}' is not defined.`)
	}
}

console.log(`Routes loaded: ${routes.length}`)

const render = async (ctx: Context, componentName: ComponentName, props?: Props): Promise<string> => {
	const component = components.get(componentName)

	if (!component) {
		console.error(`Component '${componentName}' is not defined`, ctx)
		return ''
	}

	try {
		const rendererOutput: unknown = component.renderer(ctx, props)

		let output: string = String(rendererOutput instanceof Promise
				? await rendererOutput
				: rendererOutput)

		if (ctx.res.contentType === 'text/html') {
			output = strMinifyHTML(output)
		}

		return output
	} catch {
		console.error(`Component '${componentName}' failed to render`, ctx)
		return ''
	}
}

export type { Component, Props, Context, Route }
export { isMethod, render }