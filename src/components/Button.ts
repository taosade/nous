import { Component, Context, Props } from 'nous'

const Button: Component = (_ctx: Context, props: Props) => {
	if (typeof props.label !== 'string' || !props.label.trim()) {
		throw new Error('Button component requires a label')
	}

	return `<button>${props.label.trim()}</button>`
}

export default Button