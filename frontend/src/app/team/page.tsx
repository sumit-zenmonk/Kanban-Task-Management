"use client";

import { useEffect, useState } from "react";
import { deleteTeam, fetchTeams } from "@/redux/feature/team/team-action";
import { RootState } from "@/redux/store";
import { Box, Button, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import styles from "./team.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import CreateTeamModal from "@/component/team-modal-form-comp/team-modal-form-comp";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from "notistack";

export default function Home() {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const { user } = useAppSelector((state: RootState) => state.authReducer);
    const { teams, total_teams, loading } = useAppSelector((state: RootState) => state.teamReducer);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchTeams({}));
    }, [dispatch]);

    const handleDelete = async (uuid: string) => {
        try {
            await dispatch(deleteTeam({ uuid })).unwrap();
        } catch (err: any) {
            console.log('Deleteion Team Error', err);
            enqueueSnackbar(err, { variant: "error" });
        }
    }

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Box>
                    <Typography variant="h5">Welcome, {user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.email}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    onClick={() => {
                        setSelectedTeam(null);
                        setOpen(true);
                    }}
                >
                    Create Team
                </Button>
            </Box>

            <Typography className={styles.total}>
                Total Teams: {total_teams}
            </Typography>

            {loading ? (
                <Box className={styles.loader}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box className={styles.teamBox}>
                    {teams.map((team) => (
                        <Card className={styles.card} key={team.uuid}>
                            <CardContent>
                                <Box className={styles.meta}>
                                    <Typography variant="h6" className={styles.name}>{team.name}</Typography>

                                    <Button
                                        sx={{ color: "white", background: "red" }}
                                        variant="contained" onClick={() => handleDelete(team.uuid)}>
                                        <DeleteIcon />
                                    </Button>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className={styles.description}
                                >
                                    {team.description}
                                </Typography>

                                <Box className={styles.meta}>
                                    <Typography variant="caption">
                                        By: {team.creator.name}
                                    </Typography>
                                    <Typography variant="caption">
                                        {new Date(team.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <Box className={styles.actionBox}>
                                    <Button
                                        variant="contained"
                                        onClick={() => router.push(`/team/${team.uuid}`)}
                                    >
                                        View Team
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={() => router.push(`/team/${team.uuid}/project`)}
                                    >
                                        View Projects
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setSelectedTeam(team);
                                            setOpen(true);
                                        }}
                                    >
                                        Edit Team
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {!loading && teams.length === 0 && (
                <Typography className={styles.empty}>
                    No teams found. Create your first team
                </Typography>
            )}

            <CreateTeamModal
                open={open}
                onClose={() => setOpen(false)}
                team={selectedTeam}
            />
        </Box >
    );
}