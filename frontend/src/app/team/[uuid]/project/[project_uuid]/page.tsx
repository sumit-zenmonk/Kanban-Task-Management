"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, IconButton, MenuItem, Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { fetchProjectById } from "@/redux/feature/project/project-action";
import { updateTask, deleteTask } from "@/redux/feature/task/task-action";
import TaskModal from "@/component/task-modal-form-comp/task-modal-form";
import styles from "./task.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { TaskStatusEnum } from "@/enums/task.enum";
import { fetchMembers } from "@/redux/feature/member/member-action";
import { connectSocket } from "@/service/socket";
let socket: any;

const statuses = [
    TaskStatusEnum.TODO,
    TaskStatusEnum.DOING,
    TaskStatusEnum.STANDBY,
    TaskStatusEnum.DONE,
];

function TaskCard({ task, move, onDelete, onEdit }: any) {
    const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
        id: task.uuid,
        data: task,
    });
    const { members, loading } = useAppSelector((state: RootState) => state.memberReducer)
    const assigned_by = members.find((m) => m.member_uuid === task.assigned_by_uuid)
    const assigned_to = members.find((m) => m.member_uuid === task.assigned_to_uuid)

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : move
                ? `translate3d(${move.x}px, ${move.y}px, 0)`
                : undefined,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 999,
        cursor: "grab",
    };

    return (
        <Card ref={setNodeRef} className={styles.card} style={style} data-task-id={task.uuid} >
            <CardContent>
                <Box {...listeners} {...attributes} className={styles.taskCard}>
                    <Box className={styles.cardHeader}>
                        <Typography variant="subtitle1" >
                            {task.name}
                        </Typography>
                    </Box>
                    <Typography
                        variant="body2"
                        className={styles.description}
                        dangerouslySetInnerHTML={{ __html: task.description }}
                    />
                    {assigned_by &&
                        <Box key={assigned_by.uuid} className={styles.assign_box}>
                            <Typography className={styles.assign_title}>Assigned By</Typography>
                            <Box className={styles.assign_avatar_box}>
                                <Avatar
                                    src={assigned_by.member.image || "/user.svg"}
                                    alt={assigned_by.member.name}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {assigned_by.member.email}
                                </Typography>
                            </Box>
                        </Box>
                    }
                    {assigned_to &&
                        <Box key={assigned_to.uuid} className={styles.assign_box}>
                            <Typography className={styles.assign_title}>Assigned To</Typography>
                            <Box className={styles.assign_avatar_box}>
                                <Avatar
                                    src={assigned_to.member.image || "/user.svg"}
                                    alt={assigned_to.member.name}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {assigned_to.member.email}
                                </Typography>
                            </Box>
                        </Box>
                    }
                </Box>
                <Box className={styles.actions}>
                    <Button variant="outlined" size="small" onClick={() => onEdit(task)}>
                        Edit
                    </Button>
                    <IconButton size="small" onClick={() => onDelete(task.uuid)}>
                        <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}

function TaskBox({ status, liveMoves, tasks, onDelete, onEdit }: any) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    return (
        <Box
            ref={setNodeRef}
            className={`${styles.column} ${isOver ? styles.columnActive : ""}`}
        >
            <Typography className={styles.columnTitle}>
                {status.toUpperCase()}
            </Typography>

            <Box className={styles.columnCards}>
                {tasks.map((task: any) => (
                    <TaskCard
                        key={task.uuid}
                        task={task}
                        move={liveMoves[task.uuid]}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default function TaskPage() {
    const { project_uuid } = useParams();
    const dispatch = useAppDispatch();
    const { projects } = useAppSelector((state: RootState) => state.projectReducer);
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const { token } = useAppSelector((state: RootState) => state.authReducer);
    const [liveMoves, setLiveMoves] = useState<Record<string, { x: number; y: number }>>({});

    const project = projects.find((p) => p.uuid === project_uuid);

    useEffect(() => {
        if (project_uuid) {
            dispatch(fetchProjectById({ uuid: project_uuid as string }));
        }
    }, [project_uuid, dispatch]);

    useEffect(() => {
        dispatch(fetchMembers({}))
    }, [dispatch])

    useEffect(() => {
        if (token && project_uuid) {
            socket = connectSocket(token);

            socket.emit("project_connect", { project_uuid });

            socket.on("task_move", ({ task_uuid, x, y }: { task_uuid: string; x: number; y: number }) => {
                setLiveMoves((prev) => ({
                    ...prev,
                    [task_uuid]: { x, y },
                }));
            });

            socket.on("task_updated", ({ task_uuid, status }: { task_uuid: string, status: TaskStatusEnum }) => {
                setLiveMoves((prev) => {
                    const copy = { ...prev };
                    delete copy[task_uuid];
                    return copy;
                });

                dispatch(fetchProjectById({ uuid: project_uuid as string }));
            });

            return () => {
                socket.off("task_move");
                socket.disconnect();
            };
        }
    }, [token, project_uuid]);

    const handleDragEnd = async ({ active, over }: any) => {
        if (!over) return;
        const task = active.data.current;
        const newStatus = over.id;

        if (task.status !== newStatus) {
            try {
                await dispatch(updateTask({ uuid: task.uuid, status: newStatus })).unwrap();
                dispatch(fetchProjectById({ uuid: project_uuid as string }));
            } catch (err: any) {
                enqueueSnackbar(err || "Update failed", { variant: "error" });
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteTask({ uuid: id }));
            dispatch(fetchProjectById({ uuid: project_uuid as string }));
        } catch (err: any) {
            enqueueSnackbar(err || "Delete failed", { variant: "error" });
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h5">{project?.name}</Typography>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSelectedTask(null);
                        setOpen(true);
                    }}
                >
                    Create Task
                </Button>
            </Box>

            <DndContext
                onDragEnd={handleDragEnd}
                onDragMove={({ active, delta }) => {
                    socket.emit("task_move", {
                        task_uuid: active.id,
                        x: delta.x,
                        y: delta.y,
                        project_uuid,
                    });
                }}
            >
                <Box className={styles.board}>
                    {statuses.map((status) => (
                        <TaskBox
                            key={status}
                            status={status}
                            tasks={(project?.tasks || []).filter(
                                (t: any) => t.status === status
                            )}
                            liveMoves={liveMoves}
                            onDelete={handleDelete}
                            onEdit={(task: any) => {
                                setSelectedTask(task);
                                setOpen(true);
                            }}
                        />
                    ))}
                </Box>
            </DndContext>

            <TaskModal
                open={open}
                onClose={() => setOpen(false)}
                project_uuid={project_uuid as string}
                task={selectedTask}
            />
        </Box>
    );
}