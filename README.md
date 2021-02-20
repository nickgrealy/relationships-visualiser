# reltationships-visualiser

View graph and hierachical objects.

## Value Proposition

- lightweight
- no/low cost
- interactable
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

## Roadmap

Yes, and...

- models
  - yaml editor
  - create/edit model from yaml editor
  - save/load model from local storage 
  - yaml allow nesting (memberOf)

- menu -> make it a table? [type] [toggleView] [toggleDraggable] [flexdirection] [colour]
  - random assign colours
- save "named" views (e.g. positions & view)
  - custom backgrounds e.g. maps, to show geographical location
  - custom icons
  - create dashboards (view fullscreen only)
- interaction
  - provision changes based on drawing(?) on diagram
  - action items via the dashboard (clear database / start/stop services / ..?)
  - "live" updates - websocket pushes live updates?
  - show runtime data e.g. SLA adhereance, down servers, links to logs (NOT a monitoring solution)
- models api
  - create a new model (json / curl)
  - add to an existing model (json / curl)
- fadeout/expire old components


- ability to add metadata to objects (e.g. env config)
- object highlighting (fade out non-connected links)

- hide links if elements aren't visible
- collapsible sections?

- create non-animated "error" line
- control styling from config (e.g. colours, links, height/width, x/y) (e.g. yaml)

- lines - link to left/right sides of boxes only (not top/bottom)
- views - create an isometric view

- untangle linked lines (HARD)

### DONE
- if no children, then make single boxes stack vertically (overridable by [flexdirection])