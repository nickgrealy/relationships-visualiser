
const internalGetStorage = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage
  } else {
    return {}
  }
}

export const save = (name, yamlString) => internalGetStorage().setItem(name, yamlString)

export const load = (name) => internalGetStorage().getItem(name)

/**
 * @returns {Array<String>} - a list of keys
 */
export const list = () => Object.keys(internalGetStorage())
