import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(3, "Name is required"),
    description: z.string().min(3, "Description is required"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;