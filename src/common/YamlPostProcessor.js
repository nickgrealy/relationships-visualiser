const yaml = require('js-yaml')
const { isDef, isUndef, isNotPresent, isString, isArray } = require('./utils')

/**
 * Parses and validates a Yaml string.
 *
 * @param {*} ymlString
 */
const parseYaml = ymlString => {
  const ROOT_LEVEL_COMPONENTS = []
  const LINKS = []
  const MAP_BY_MEMBER_OF = {}
  const MAP_TYPE_TO_COUNT = {}
  const MAP_TYPES_TRUE = {}
  const MAP_TYPES_FALSE = {}
  const UNIQUE_IDS = {}

  // utility function for adding to map array...
  const addParentChild = (parentId, childComponent) => {
    if (isDef(MAP_BY_MEMBER_OF[parentId])) {
      MAP_BY_MEMBER_OF[parentId].push(childComponent)
    } else {
      MAP_BY_MEMBER_OF[parentId] = [childComponent]
    }
  }

  /**
   * Recursively processes structured components - populating the above arrays and maps.
   *
   * @param {*} component - the current node to process
   * @param {*} parentIds - a list of any parent ids
   */
  const recursivelyProcessComponents = (component, parentIds = []) => {
    const { id, type, children = [], memberOf = [], links = [] } = component

    // pre-process verification checks...

    // verify id is valid...
    if (typeof id === 'undefined') throw new Error(`'id' field missing - '${JSON.stringify(component)}'`)
    if (typeof id !== 'string') throw new Error(`'id' field must be a string - '${id}'`)

    // verify parentIds are valid...
    parentIds.forEach(parentId => {
      if (typeof parentId !== 'string') throw new Error(`'parentId' id must be a string - '${parentId}'`)
    })

    // verify memberOf ids are valid...
    memberOf.forEach(parentId => {
      if (typeof parentId !== 'string') throw new Error(`'memberOf' id must be a string - '${parentId}'`)
    })

    // verify links are properly structured
    links.forEach(link => {
      const { to } = link
      if (typeof to === 'undefined') throw new Error(`'links' elements must have a 'to' field - '${JSON.stringify(link)}'`)
      if (typeof to !== 'string') throw new Error(`'links.to' id must be a string - '${to}'`)
    })

    // end verification -> start popluating arrays and maps...

    if (isUndef(component.name)) component.name = id

    const hasParent = parentIds.length > 0 || memberOf.length > 0

    if (isDef(UNIQUE_IDS[id])) throw new Error(`Ids must be unique, found duplicate id - '${id}'`)
    UNIQUE_IDS[id] = component

    // process root components...
    if (!hasParent) ROOT_LEVEL_COMPONENTS.push(component)

    // count types...
    MAP_TYPE_TO_COUNT[type] = (MAP_TYPE_TO_COUNT[type] || 0) + 1
    MAP_TYPES_TRUE[type] = true
    MAP_TYPES_FALSE[type] = false

    // process parent references...
    const parIds = [...parentIds, ...memberOf]
    parIds.forEach(parentId => addParentChild(parentId, component))

    // process links...
    links.forEach(({ to, direction }) => LINKS.push({ from: id, to, direction }))

    // process children...
    children.forEach(child => {
      if (typeof child === 'string') {
        // treat as id of an already processed component...
        const childComponent = UNIQUE_IDS[child]
        if (isUndef(childComponent)) throw new Error(`'children references missing/unknown/not yet processed id - '${child}'`)
        addParentChild(id, childComponent)
      } else {
        // treat as component definition...
        recursivelyProcessComponents(child, [id])
      }
    })
  }

  // parse yaml...
  const root = yaml.load(ymlString)

  // pre-pre-checks...
  if (isNotPresent(root)) throw new Error('Root element must not be empty - required fields => \'name\', \'components\'.')
  const { name, components } = root
  if (isUndef(name)) throw new Error(`Root \'name\' field missing - ${JSON.stringify({ root, ymlString })}`)
  if (isUndef(components)) throw new Error('Root \'components\' field missing')
  if (!isString(name)) throw new Error(`Root 'name' field must be a string - '${name}'`)
  if (!isArray(components)) throw new Error('Root \'components\' element must be an array.')

  // start processing the components...
  components.forEach(component => recursivelyProcessComponents(component))

  // post process checks...
  LINKS.forEach(({ to }) => {
    if (isUndef(UNIQUE_IDS[to])) throw new Error(`'links.to' references missing/unknown id - '${to}'`)
  })
  Object.keys(MAP_BY_MEMBER_OF).forEach(parentId => {
    if (isUndef(UNIQUE_IDS[parentId])) throw new Error(`'memberOf' id references missing/unknown id - '${parentId}'`)
  })

  const response = {
    root,
    ROOT_LEVEL_COMPONENTS,
    LINKS,
    MAP_BY_MEMBER_OF,
    MAP_TYPE_TO_COUNT,
    MAP_TYPES_TRUE,
    MAP_TYPES_FALSE,
    UNIQUE_IDS
  }

  return response
}

module.exports = {
  parseYaml
}
