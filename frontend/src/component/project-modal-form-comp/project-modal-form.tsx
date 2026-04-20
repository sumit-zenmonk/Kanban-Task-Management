"use client";

import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { createProject, updateProject } from "@/redux/feature/project/project-action";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "@/redux/hooks.ts";
import { ProjectFormData, projectSchema } from "@/schemas/project.schema";
import { fetchTeams } from "@/redux/feature/team/team-action";

interface Props {
    open: boolean;
    onClose: () => void;
    team_uuid: string;
    project?: any;
}

export default function ProjectModal({ open, onClose, team_uuid, project }: Props) {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
    });

    useEffect(() => {
        if (project) {
            reset(project);
        } else {
            reset({ name: "", description: "" });
        }
    }, [project, reset]);

    const onSubmit = async (data: ProjectFormData) => {
        try {
            if (project) {
                await dispatch(updateProject({ ...data, uuid: project.uuid })).unwrap();
            } else {
                await dispatch(createProject({ ...data, team_uuid })).unwrap();
            }
            await dispatch(fetchTeams({})).unwrap();

            onClose();
            reset();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {project ? "Edit Project" : "Create Project"}
            </DialogTitle>

            <DialogContent>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={onClose} color="secondary"     >Cancel</Button>
                <Button onClick={handleSubmit(onSubmit)} variant="outlined">
                    {project ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}