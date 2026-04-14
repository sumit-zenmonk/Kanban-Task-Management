"use client";

import { useEffect, useState } from "react";
import { deleteTeam, fetchTeams } from "@/redux/feature/team/team-action";
import { RootState } from "@/redux/store";
import { Box, Button, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import styles from "./team.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import CreateTeamModal from "@/component/team-modal-form/team-modal-form";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';

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
        } catch (err) {
            console.log('Deleteion Team Error', err);
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
                    + Create Team
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
                <Box>
                    {teams.map((team) => (
                        <Card className={styles.card} key={team.uuid}>
                            <CardContent>
                                <Box className={styles.meta}>
                                    <Typography variant="h6">{team.name}</Typography>

                                    <Button onClick={() => handleDelete(team.uuid)}>
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

                                <Button onClick={() => router.push(`/team/${team.uuid}`)}>
                                    View Team
                                </Button>

                                <Button
                                    onClick={() => {
                                        setSelectedTeam(team);
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