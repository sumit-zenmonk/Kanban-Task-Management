"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/hooks.ts";
import { createTeam, updateTeam } from "@/redux/feature/team/team-action";
import { TeamFormData, teamSchema } from "@/schemas/team-create";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";

interface Props {
    open: boolean;
    onClose: () => void;
    team?: {
        uuid: string;
        name: string;
        description: string;
    } | null;
}

export default function CreateTeamModalComp({ open, onClose, team }: Props) {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TeamFormData>({
        resolver: zodResolver(teamSchema),
    });

    useEffect(() => {
        if (team) {
            reset({
                name: team.name,
                description: team.description,
            });
        } else {
            reset({
                name: "",
                description: "",
            });
        }
    }, [team, reset]);

    const onSubmit = async (data: TeamFormData) => {
        try {
            if (team) {
                await dispatch(updateTeam({ uuid: team.uuid, ...data }));
            } else {
                await dispatch(createTeam(data));
            }
            reset();
            onClose();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
            console.log(`${team ? "Edit Team" : "Create Team"} Error`, err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {team ? "Edit Team" : "Create Team"}
            </DialogTitle>

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
                    {team ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}