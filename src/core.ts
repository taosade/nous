import { ComponentName, Context, Props } from 'nous/types'
import components from 'nous/components'
import { strMinifyHTML } from 'nous/utils'

export const render = async (ctx: Context, componentName: ComponentName, props?: Props): Promise<string> => {
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