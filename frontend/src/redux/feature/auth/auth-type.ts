export interface User {
  uid: string
  email: string | null
  name: string | null
  image: string | null
}

export interface AuthState {
  user: User | null
  token: string
  loading: boolean
  error: string | null
  status: "pending" | "succeed" | "rejected"
}