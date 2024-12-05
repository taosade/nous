import components from 'nous/components'
import { Route } from 'nous/types'

// Route definitions

const routes: Route[] = [
	{
		contentType: 'text/html',
		component: 'RootLayout',
		props: {
			title: 'Home',
			content: '<p>Hello, world!</p>'
		},
		url: '/'
	},
	{
		contentType: 'text/html',
		component: 'Button',
		props: {
			label: 'Click me'
		},
		url: '/button'
	}
]

// Checking if all route handlers are mapped to a component

for (const route of routes) {
	if (!components.has(route.component)) {
		throw new Error(`Component '${route.component}' serving route '${route.url}' is not defined.`)
	}
}

console.log(`Loaded ${routes.length} route handler${routes.length === 1 ? '' : 's'}`)

export default routes