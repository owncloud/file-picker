import { Drive } from '@ownclouders/web-client/src/generated'

export interface Space {
  id: string
  name: string
}

export const buildSpace = (space: Drive): Space => {
  return { id: space.id, name: space.name }
}
