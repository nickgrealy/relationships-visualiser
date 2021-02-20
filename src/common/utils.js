
export const isUndef = o => typeof o === 'undefined'
export const isNull = o => o === null
export const isDef = o => typeof o !== 'undefined'
export const isNotPresent = o => isUndef(o) || isNull(o)
export const isPresent = o => !isNotPresent(o)

/**
 * Copies values from old map, to new map, if the key exists.
 *
 * @param {*} oldMap
 * @param {*} newMap
 */
export const copyValuesIfExists = (oldMap, newMap) => {
  Object.keys(newMap).forEach(k => {
    if (isDef(oldMap[k])) newMap[k] = oldMap[k]
  })
  return newMap
}
