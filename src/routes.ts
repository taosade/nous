import { Route } from 'nous'

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
	}
]

export default routes