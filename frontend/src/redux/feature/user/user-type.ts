export interface User {
    uuid: string
    name: string
    email: string
    image: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface UserState {
    users: User[]
    total_users: number
    loading: boolean
    error: string | null
    status: "idle" | "pending" | "succeed" | "rejected"
}
