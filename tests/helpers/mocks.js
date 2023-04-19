import resources from '../fixtures/resources'

export const listResources = jest.fn().mockImplementation((space, { path }) =>
  Promise.resolve({
    resource: resources[path][0],
    children: resources[path]
  })
)
