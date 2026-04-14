"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/hooks.ts";
import { createTeam } from "@/redux/feature/team/team-action";
import { TeamFormData, teamSchema } from "@/schemas/schema";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateTeamModal({ open, onClose }: Props) {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TeamFormData>({
        resolver: zodResolver(teamSchema),
    });

    const onSubmit = async (data: TeamFormData) => {
        await dispatch(createTeam(data));
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Team</DialogTitle>

            <DialogContent>
                <TextField
                    label="Title"
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
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}