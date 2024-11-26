import { SERVER_URL } from "./constants"
import { Project, ServerUser } from "./types"

export async function registerUser(user: { email: string, password: string }): Promise<ServerUser> {
  const res = await fetch(`${SERVER_URL}/RegisterUser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  if (!res.ok) {
    throw new Error('Failed to register user')
  }
  return (await res.json()).data as ServerUser
}

export async function loginUser(user: { email: string, password: string }): Promise<ServerUser> {
  const res = await fetch(`${SERVER_URL}/LoginUser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  if (!res.ok) {
    throw new Error('Failed to login user')
  }
  return (await res.json()).data as ServerUser
}

export async function getProjects(searchTerm?: string): Promise<Project[]> {
  let query = "";
  if (searchTerm) {
    query = `?search=${searchTerm}`;
  }
  const res = await fetch(`${SERVER_URL}/projects${query}`)
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
  return (await res.json()).data as Project[]
}


export async function getUsers(): Promise<ServerUser[]> {
  const res = await fetch(`${SERVER_URL}/users`)
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  return res.json() as Promise<ServerUser[]>
}

export async function likeProject(user_id: number, project_id: number): Promise<void> {
  const res = await fetch(`${SERVER_URL}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, project_id })
  })
  if (!res.ok) {
    throw new Error('Failed to like project')
  }
}

export async function unlikeProject(user_id: number, project_id: number): Promise<void> {
  const res = await fetch(`${SERVER_URL}/like`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, project_id })
  })
  if (!res.ok) {
    throw new Error('Failed to unlike project')
  }
}

export async function getLikesByProject(project_id: number): Promise<ServerUser[]> {
  const res = await fetch(`${SERVER_URL}/likes/project/${project_id}`)
  return res.json() as Promise<ServerUser[]>
}

export async function getLikesByUser(user_id: number): Promise<ServerUser[]> {
  const res = await fetch(`${SERVER_URL}/likes/${user_id}`)
  return res.json() as Promise<ServerUser[]>
}

export type ProjectCreate = Omit<Project, 'id' | 'user' > & { user_id: number }

export async function createProject(project: ProjectCreate): Promise<{
  id: number
  locationDisplay: string
}> {
  const res = await fetch(`${SERVER_URL}/RegisterProject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  })
  return (await res.json()).data as { id: number, locationDisplay: string }
}

export async function getUser(userId: number) {
  const res = await fetch(`${SERVER_URL}/users/${userId}`)
  return res.json() as Promise<ServerUser>
}

export async function updateUser(userId: number, user: ServerUser) {
  const res = await fetch(`${SERVER_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  return res.json() as Promise<ServerUser>
}
  