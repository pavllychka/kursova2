export type UserCreate = {
  email: string
  password: string
  role: "user" | "project_creator"
  location: {
    x: number
    y: number
  }
  name: string
}

export type APIResponse<T> = {
  data: T
  message: string
}

export type ServerUser = {
  id: number
  name: string
  email: string
  location: {
    x: number
    y: number
  }
  role: "user" | "project_creator";
  locationDisplay?: string;
  position?: string;
  skills?: string;
  instagramLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  yearsOfExperience?: number;
  phoneNumber?: string;
}


export type Project = {
  id: number
  title: string
  description: string
  user: Omit<ServerUser, "location">
  location: {
    x: number
    y: number
  },
  locationDisplay?: string
}

export type ProjectWithLikes = Project & {
  likes?: ServerUser[]
}

