import { z } from "zod"

export const memberSchema = z.object({
    member_uuid: z.string().min(1, "User is required"),
    role: z.string().min(1, "Role is required"),
})

export type MemberFormValues = z.infer<typeof memberSchema>