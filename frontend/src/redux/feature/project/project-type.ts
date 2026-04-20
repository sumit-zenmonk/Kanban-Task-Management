import { TaskStatusEnum } from "@/enums/task.enum"

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
    tasks: Task[]
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Task {
    uuid: string
    name: string
    description: string
    creator_uuid: string
    project_uuid: string
    assigned_by_uuid: string
    assigned_to_uuid: string | null
    status: TaskStatusEnum
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