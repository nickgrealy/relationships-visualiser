const rawYamlString = `
# other types: load_balancer, cluster, vpc, etc

name: Example Data

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

export default rawYamlString
