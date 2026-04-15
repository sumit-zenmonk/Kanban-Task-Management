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
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface Member {
    uuid: string
    member_uuid: string
    team_uuid: string
    role: string
    member: UserInfo
    team: TeamInfo
    roleBy: UserInfo
    onboardBy: UserInfo
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FetchMembersResponse {
    members: Member[]
    total: number
}

export interface MemberState {
    members: Member[]
    total_members: number
    loading: boolean
    error: string | null
    status: "pending" | "succeed" | "rejected"
}