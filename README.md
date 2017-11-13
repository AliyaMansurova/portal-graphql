# portal-graphql

Standalone graphql server for portal-ui to consume.

### Goals:

- decouple `/graphql` endpoint from gdcapi
- use elasticsearch server as primary source for mappings
- quicker initialization
- language that's more familiar for front-end devs
- provide offline development support
  - use cached mappings when elasticsearch is down
  - return dummy data based on schema
- ability to share code front <> back
- better ecosystem support
- fully understand the architectural and design decisions of the existing graphql implementation
- simplify graphql schema whereever possible 
