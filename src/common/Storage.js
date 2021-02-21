
export const save = (name, yamlString) => localStorage.setItem(name, yamlString)

export const load = (name) => localStorage.getItem(name)

/**
 * @returns {Array<String>} - a list of keys
 */
export const list = () => Object.keys(localStorage)
