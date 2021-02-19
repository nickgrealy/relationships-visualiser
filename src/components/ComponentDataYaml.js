const yaml = require('js-yaml')

const ymlData = `
# other types: load_balancer, cluster, vpc, etc

components:
  - type: vpc
    id: vpc1.domain.au
    name: VPC1

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
      - name: bau.create_case
        direction: out
      - name: bau.create_case_resp
        direction: in
      - name: bau.case_completed
        direction: both
      - name: mongo.onepass.cases
        direction: out
      - name: mongo.onepass.forms
        direction: out

  - type: container
    name: Auth Module
    id: ws.accessctrl
    memberOf:
      - web_services
    links:
      - name: bau.create_case
        direction: out
      - name: mongo.onepass.users
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

  # - type: group
  #   name: MQ Case Services
  #   id: mq_case_services

  # - type: group
  #   name: Web Case Services
  #   id: web_case_services

  - type: queue
    name: bau.create_case
    id: bau.create_case
    memberOf:
      - mq1.domain.au
      - mq_case_services

  - type: queue
    name: bau.create_case_resp
    id: bau.create_case_resp
    memberOf:
      - mq1.domain.au
      - mq_case_services

  - type: queue
    name: bau.case_completed
    id: bau.case_completed
    memberOf:
      - mq1.domain.au
      - mq_case_services

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

const content = yaml.load(ymlData)

/**
 * All components that have no parents.
 */
const ROOT_LEVEL_COMPONENTS = content.components.filter(({ memberOf = [] }) => memberOf.length === 0)

/**
 * Map of parent.id to array of children.
 */
const MAP_BY_MEMBER_OF = content.components.reduce((prev, curr) => {
  const { memberOf = [] } = curr
  memberOf.forEach(parent => { prev[parent] ? prev[parent].push(curr) : prev[parent] = [curr] })
  return prev
}, {})

/**
 * Unique list of component types.
 */
const MAP_TYPE_TO_COUNT = content.components.reduce((prev, curr) => {
  prev[curr.type] = (prev[curr.type] || 0) + 1
  return prev
}, {})

/**
 * Array of objects, representing 'links' between objects.
 * @example
 * [{ from:'id1', to:'id2', direction:'in'}]
 */
const LINKS = content.components.reduce((prev, curr) => {
  const { links = [] } = curr
  links.forEach(({ name, direction }) => {
    prev.push({ from: curr.id, to: name, direction })
  })
  return prev
}, [])

const MAP_TYPES_TRUE = Object.fromEntries(Object.keys(MAP_TYPE_TO_COUNT).map(k => [k, true]))
const MAP_TYPES_FALSE = Object.fromEntries(Object.keys(MAP_TYPE_TO_COUNT).map(k => [k, false]))

module.exports = {
  content,
  ROOT_LEVEL_COMPONENTS,
  LINKS,
  MAP_BY_MEMBER_OF,
  MAP_TYPE_TO_COUNT,
  MAP_TYPES_TRUE,
  MAP_TYPES_FALSE
}
