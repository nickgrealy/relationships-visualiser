const yaml = require('js-yaml')
const { isDef, isUndef, isNotPresent } = require('../common/utils')

const rawYamlString = `
# other types: load_balancer, cluster, vpc, etc

components:
  - type: vpc
    id: vpc1.domain.au
    name: VPC1
    children:
    - type: machine
      id: server3
      name: DigitalOcean Droplet #2
      children:
      - type: service
        name: Docker
        id: web_services_2
        children:
        - type: container
          name: Case Management #2
          id: ws.casemgmt2
          links:
            - to: bau.create_case
              direction: out
        
  # --- Web Services ---

  - type: machine
    id: server1.domain.au
    name: DigitalOcean Droplet
    memberOf:
      - vpc1.domain.au

  - type: service
    name: Docker
    id: web_services
    memberOf:
      - server1.domain.au

  - type: container
    name: Case Management
    id: ws.casemgmt
    memberOf:
      - web_services
    links:
      - to: bau.create_case
        direction: out
      - to: bau.create_case_resp
        direction: in
      - to: bau.case_completed
        direction: both
      - to: mongo.onepass.cases
        direction: out
      - to: mongo.onepass.forms
        direction: out

  - type: container
    name: Auth Module
    id: ws.accessctrl
    memberOf:
      - web_services
    links:
      - to: bau.create_case
        direction: out
      - to: mongo.onepass.users
        direction: out

  # --- MQ ---

  - type: machine
    name: AWS EC2
    id: server2.domain.au
    memberOf:
      - vpc1.domain.au

  - type: message-broker
    name: MQ Server
    id: mq1.domain.au
    memberOf:
      - server2.domain.au

  - type: queue
    name: bau.create_case
    id: bau.create_case
    memberOf:
      - mq1.domain.au

  - type: queue
    name: bau.create_case_resp
    id: bau.create_case_resp
    memberOf:
      - mq1.domain.au

  - type: queue
    name: bau.case_completed
    id: bau.case_completed
    memberOf:
      - mq1.domain.au

  # --- Database ---

  - type: machine
    name: Atlas MongoDb
    id: mongo-cluster-123.mongodb.com
    memberOf:
      - vpc1.domain.au

  - type: database
    name: onepass
    id: mongo.onepass
    memberOf:
      - mongo-cluster-123.mongodb.com

  - type: collection
    name: users
    id: mongo.onepass.users
    memberOf:
      - mongo.onepass

  - type: collection
    name: cases
    id: mongo.onepass.cases
    memberOf:
      - mongo.onepass

  - type: collection
    name: forms
    id: mongo.onepass.forms
    memberOf:
      - mongo.onepass
`

/**
 *
 * @param {*} ymlString
 */
const parseYaml = ymlString => {
  const jsonComponents = yaml.load(ymlString)

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
    if (typeof id === 'undefined') throw new Error(`Component must have an 'id' field - '${JSON.stringify(component)}'`)
    if (typeof id !== 'string') throw new Error(`'id' must be a string - '${id}'`)

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

  // pre-pre-checks...
  if (isNotPresent(jsonComponents) || !Array.isArray(jsonComponents.components)) throw new Error('Root element must be a \'components:\' of type array.')

  // start processing the components...
  jsonComponents.components.forEach(component => recursivelyProcessComponents(component))

  // post process checks...
  LINKS.forEach(({ to }) => {
    if (isUndef(UNIQUE_IDS[to])) throw new Error(`'links.to' references missing/unknown id - '${to}'`)
  })
  Object.keys(MAP_BY_MEMBER_OF).forEach(parentId => {
    if (isUndef(UNIQUE_IDS[parentId])) throw new Error(`'memberOf' id references missing/unknown id - '${parentId}'`)
  })

  const response = {
    ROOT_LEVEL_COMPONENTS,
    LINKS,
    MAP_BY_MEMBER_OF,
    MAP_TYPE_TO_COUNT,
    MAP_TYPES_TRUE,
    MAP_TYPES_FALSE,
    UNIQUE_IDS
  }

  console.debug('got here 6', response)

  return response
}

module.exports = {
  rawYamlString,
  parseYaml
}
