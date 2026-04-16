export interface UserInfo {
    uuid: string
    name: string
    email: string
    image: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface TeamInfo {
    uuid: string
    name: string
    description: string
    creator: UserInfo
}

export interface Project {
    uuid: string
    name: string
    description: string
    team_uuid: string
    creator_uuid: string
    team: TeamInfo
    creator: UserInfo
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FetchProjectsResponse {
    projects: Project[]
    total: number
}

export interface ProjectState {
    projects: Project[]
    total_projects: number
    loading: boolean
    error: string | null
    status: "pending" | "succeed" | "rejected"
}