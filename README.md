# reltationships-visualiser

View relational and hierachical objects in a graph.

## Value Proposition

- lightweight
- no/low cost
- interactable
- shareable
- open formats and apis
- simple
- accessible
- automatable

## Existing solutions

- deeply integrated (e.g. java agents)
- target corporate
- high prices
- locked to vendor
- bespoke tooling
- thick clients

## Roadmap

Yes, and...

- Models
  - [x] yaml editor
  - [x] create/edit model from yaml editor
  - [x] yaml allow nesting (memberOf)
  - [x] added validation on yaml and business structure
  - [x] support "cut down" components (e.g. just 'id')
  - [ ] save/load model from local storage 

- Customisation
  - [ ] assign random colours
  - [ ] assign user chosen colours
  - [ ] custom backgrounds e.g. maps, to show geographical location
  - [ ] custom icons
  - [ ] make it a table [type] [toggleView] [toggleDraggable] [flexdirection] [fullWidth] [colour] [count]
  - [ ] store configuration (local storage?)
  
- Named Views
  - [ ] save "named" views (e.g. positions & view & zoom)
  - [ ] don't re-layout on window resize
  - [ ] create dashboards (view fullscreen only)
  - [ ] ability to zoom in/out / slide / (for big worksites)
  
- Interaction
  - [ ] provision changes based on drawing(?) on diagram
  - [ ] action items via the dashboard (clear database / start/stop services / ..?)
  - [ ] "live" updates - websocket pushes live updates?
  - [ ] create non-animated line for "errors"
  - [ ] show runtime data e.g. SLA adhereance, down servers, links to logs (NOT a monitoring solution)
  
- Models API
  - [ ] create a new model (json / curl)
  - [ ] add to an existing model (json / curl)

- Misc
  - [x] if no children, then make single boxes stack vertically (overridable by [flexdirection])
  - [ ] fadeout/expire old components
  - [ ] ability to add metadata to objects (e.g. env config)
  - [ ] object highlighting on hover/select (fade out non-connected links)
  - [ ] collapsible sections?
  - [ ] hide links if elements aren't visible
  - [ ] control styling from config (e.g. colours, links, height/width, x/y) (e.g. yaml)
  - [ ] lines - link to left/right sides of boxes only (not top/bottom)
  - [ ] views - create an isometric view
  - [ ] untangle linked lines (HARD)
  - [ ] add a 'type' to links (why? colour? show text?)
