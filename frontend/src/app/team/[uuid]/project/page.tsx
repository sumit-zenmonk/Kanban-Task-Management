"use client";

import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./project.module.css";
import { useParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { fetchProjects, deleteProject, } from "@/redux/feature/project/project-action";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import ProjectModal from "@/component/project-modal-form-comp/project-modal-form";
import { fetchTeams } from "@/redux/feature/team/team-action";

export default function ProjectPage() {
    const { uuid } = useParams();
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const { projects, total_projects, loading } = useAppSelector((state: RootState) => state.projectReducer);

    useEffect(() => {
        if (uuid) {
            dispatch(fetchProjects({ team_uuid: uuid as string }));
        }
    }, [uuid, dispatch]);

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteProject({ uuid: id })).unwrap();
            await dispatch(fetchTeams({})).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h5">Projects</Typography>

                <Button
                    variant="contained"
                    onClick={() => {
                        setSelectedProject(null);
                        setOpen(true);
                    }}
                >
                    Create Project
                </Button>
            </Box>

            <Typography className={styles.total}>
                Total Projects: {total_projects}
            </Typography>

            {loading ? (
                <Box className={styles.loader}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {projects.map((project) => (
                        <Card key={project.uuid} className={styles.card}>
                            <CardContent>
                                <Box className={styles.meta}>
                                    <Typography className={styles.name}>
                                        {project.name}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        sx={{ color: "white", background: "red" }}
                                        onClick={() => handleDelete(project.uuid)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </Box>

                                <Typography className={styles.description}>
                                    {project.description}
                                </Typography>

                                <Box className={styles.meta}>
                                    <Typography variant="caption">
                                        By: {project.creator.name}
                                    </Typography>

                                    <Typography variant="caption">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setOpen(true);
                                    }}
                                >
                                    Edit
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {!loading && projects.length === 0 && (
                <Typography className={styles.empty}>
                    No projects found
                </Typography>
            )}

            <ProjectModal
                open={open}
                onClose={() => setOpen(false)}
                team_uuid={uuid as string}
                project={selectedProject}
            />
        </Box>
    );
}