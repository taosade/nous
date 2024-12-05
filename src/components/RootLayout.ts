import { Component, Context, Props } from 'nous'

const RootLayout: Component = (ctx: Context, props?: Props) => `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>${props?.title || 'Untitled'}</title>
		</head>
		<body>
			${props?.content}
			<p>The method is ${ctx.req.method} and the user agent is ${ctx.req.userAgent}</p>
		</body>
	</html>`

export default RootLayout