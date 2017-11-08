export let typeDefs = `
  type Explore {
    cases: ECases
    #genes: Genes
    #ssms: Ssms
  }
`

export let resolvers = {
  Explore: {
    cases: () => ({}),
    //genes: () => ({}),
    //ssms: () => ({}),
  },
}
