import { z } from "zod";

export const teamSchema = z.object({
    name: z.string().min(3, "Title is required"),
    description: z.string().min(5, "Description is required")
});

export type TeamFormData = z.infer<typeof teamSchema>;