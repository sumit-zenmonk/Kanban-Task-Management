"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import styles from "./team-sidebar-comp.module.css";
import { useRouter } from "next/navigation";
import { TeamState } from "@/redux/feature/team/team-type";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function TeamSidebarComp({ teams }: { teams: TeamState }) {
    const [activeTeam, setActiveTeam] = useState<string | null>(null);
    const router = useRouter();

    return (
        <Box className={styles.sidebar}>
            <Typography
                className={styles.heading}
                onClick={() => router.push(`/team`)}
            >
                Teams
            </Typography>

            {teams.teams.map((team) => (
                <Box key={team.uuid} className={styles.teamContainer}>
                    <Box
                        className={styles.team}
                    >
                        <Typography onClick={() => router.push(`/team/${team.uuid}`)}>{team.name}</Typography>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setActiveTeam(activeTeam === team.uuid ? null : team.uuid);
                            }}>
                            {activeTeam === team.uuid ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        </Button>
                    </Box>

                    {activeTeam === team.uuid && (
                        <Box className={styles.projectContainer}>
                            {(team.projects ?? [])
                                .filter((project) => project.team_uuid === team.uuid)
                                .map((project) => (
                                    <Box key={project.uuid} className={styles.project}>
                                        <Typography variant="body2">
                                            {project.name}
                                        </Typography>
                                    </Box>
                                ))}
                        </Box>
                    )}
                </Box>
            ))
            }
        </Box >
    );
}