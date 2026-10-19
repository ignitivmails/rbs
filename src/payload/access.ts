import type { Access, FieldAccess } from 'payload'

export type Role = 'owner' | 'editor' | 'orderManager'

const roleOf = (user: unknown): Role | undefined => (user as { role?: Role } | null)?.role

export const anyone: Access = () => true

export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

export const hasRole =
  (...roles: Role[]): Access =>
  ({ req: { user } }) => {
    const role = roleOf(user)
    return Boolean(role && roles.includes(role))
  }

export const ownersOnly = hasRole('owner')
export const editorsOnly = hasRole('owner', 'editor')
export const ordersTeam = hasRole('owner', 'orderManager')

/** Public visitors only see published documents; admins see drafts too. */
export const publishedOrLoggedIn: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: 'published' } }

export const ownerFieldAccess: FieldAccess = ({ req: { user } }) => roleOf(user) === 'owner'
