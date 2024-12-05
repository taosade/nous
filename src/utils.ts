export const strMinifyHTML = (input: string): string => {

	// Remove multiple spaces
	let output = input.replace(/\s{2,}/g, ' ')

	// Remove spaces between tags
	output = output.replace(/>\s+</g, '><')

	// Remove leading and trailing spaces
	return output.trim()
}