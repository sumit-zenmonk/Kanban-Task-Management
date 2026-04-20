"use client";

import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField,
    Box,
    Avatar,
    Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { createTask, updateTask } from "@/redux/feature/task/task-action";
import { MenuItem } from "@mui/material";
import { useParams } from "next/navigation";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import { TaskStatusEnum } from "@/enums/task.enum";
import { fetchProjectById } from "@/redux/feature/project/project-action";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface TaskFormData {
    name: string;
    description: string;
    status?: string;
    assigned_to_uuid?: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    project_uuid: string;
    task?: any;
}

export default function TaskModal({ open, onClose, project_uuid, task }: Props) {
    const params = useParams()
    const team_uuid = params?.uuid
    const dispatch = useAppDispatch();
    const { members, loading } = useAppSelector((state: RootState) => state.memberReducer)

    const filteredMembers = members.filter((m) => m.team_uuid === team_uuid)

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<TaskFormData>();

    useEffect(() => {
        if (task) {
            reset({
                name: task?.name || "",
                description: task?.description || "",
                status: task?.status || "todo",
                assigned_to_uuid: task?.assigned_to_uuid || "",
            });
        } else {
            reset({ name: "", description: "" });
        }
    }, [task, reset]);

    const onSubmit = async (data: TaskFormData) => {
        try {
            const payload: any = {
                name: data.name,
                description: data.description,
                ...(data.status && { status: data.status }),
                ...(data.assigned_to_uuid && {
                    assigned_to_uuid: data.assigned_to_uuid,
                }),
            };

            if (task) {
                payload.uuid = task.uuid;
                await dispatch(updateTask(payload)).unwrap();
            } else {
                payload.project_uuid = project_uuid;
                await dispatch(createTask(payload)).unwrap();
            }
            dispatch(fetchProjectById({ uuid: project_uuid as string }));

            onClose();
            reset();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {task ? "Edit Task" : "Create Task"}
            </DialogTitle>

            <DialogContent>
                <TextField
                    label="Task Name"
                    fullWidth
                    margin="normal"
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    rules={{
                        validate: (value) => {
                            const text = value.replace(/<(.|\n)*?>/g, "").trim();
                            return text.length > 0 || "Description is required";
                        }
                    }}
                    render={({ field }) => (
                        <Box>
                            <ReactQuill
                                theme="snow"
                                value={field.value || ""}
                                onChange={field.onChange}
                            />

                            {errors.description && (
                                <Typography color="error" variant="caption">
                                    {errors.description?.message}
                                </Typography>
                            )}
                        </Box>
                    )}
                />

                <TextField
                    label="Status"
                    select
                    fullWidth
                    margin="normal"
                    value={watch('status') || TaskStatusEnum.TODO}
                    {...register("status")}
                >
                    <MenuItem value={TaskStatusEnum.TODO}>Todo</MenuItem>
                    <MenuItem value={TaskStatusEnum.DOING}>Doing</MenuItem>
                    <MenuItem value={TaskStatusEnum.STANDBY}>Standby</MenuItem>
                    <MenuItem value={TaskStatusEnum.DONE}>Done</MenuItem>
                </TextField>

                <TextField
                    label="Assigned User"
                    select
                    fullWidth
                    margin="normal"
                    defaultValue=""
                    {...register("assigned_to_uuid")}
                >
                    {filteredMembers.map((m) => (
                        <MenuItem key={m.uuid} value={m.member_uuid}>
                            <Box >
                                <Avatar
                                    src={m.member.image || "/user.svg"}
                                    alt={m.member.name}
                                />
                                <Box>
                                    <Typography variant="body2">
                                        {m.member.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {m.member.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit(onSubmit)} variant="outlined">
                    {task ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}