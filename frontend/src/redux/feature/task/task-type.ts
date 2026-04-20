export interface TaskPayload {
    uuid?: string;
    name?: string;
    description?: string;
    project_uuid?: string;
    assigned_to_uuid?: string;
    status?: string;
}