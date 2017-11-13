export let typeDefs = `
  type Repository {
    cases: Cases
    files: Files
  }
`

export let resolvers = {
  Repository: {
    cases: () => ({}),
    files: () => ({}),
  },
}
