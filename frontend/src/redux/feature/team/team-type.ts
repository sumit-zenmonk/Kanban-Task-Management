export interface TeamCreator {
    uuid: string
    name: string
    email: string
    image: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Team {
    uuid: string
    name: string
    description: string
    creator: TeamCreator
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FetchTeamsResponse {
    teams: Team[]
    total: number
}

export interface TeamState {
    teams: Team[]
    total_teams: number
    loading: boolean
    error: string | null
    status: "idle" | "pending" | "succeed" | "rejected"
}
