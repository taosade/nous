import { ComponentName, isComponentName } from 'nous/types'

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

console.log(`Loaded ${components.size} component${components.size === 1 ? '' : 's'}`)

export default components