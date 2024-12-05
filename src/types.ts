type Component = (ctx: Context, props: Props) => string | Promise<string>

type ComponentName = string

function isComponentName(val: string): val is ComponentName {
	return /^[A-Z][a-zA-Z\d]*$/.test(val)
}

type ContentType = 'application/json' | 'text/html' | 'text/plain'

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

export { isComponentName, isMethod }
export type { Component, ComponentName, Props, Context, Route }