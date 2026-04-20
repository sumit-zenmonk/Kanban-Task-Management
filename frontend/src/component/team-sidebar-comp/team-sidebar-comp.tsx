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
                            variant="outlined"
                            onClick={() => {
                                setActiveTeam(activeTeam === team.uuid ? null : team.uuid);
                            }}>
                            {activeTeam === team.uuid ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        </Button>
                    </Box>

                    {activeTeam === team.uuid && (
                        <Box className={styles.projectContainer}>
                            <Button
                                onClick={() => router.push(`/team/${team.uuid}/project`)}
                                variant="outlined">
                                Go To Projects
                            </Button>
                            <Box className={styles.projectBox}>
                                {(team.projects ?? [])
                                    .filter((project) => project.team_uuid === team.uuid)
                                    .map((project) => (
                                        <Box
                                            key={project.uuid}
                                            className={styles.project}
                                            onClick={() => router.push(`/team/${team.uuid}/project/${project.uuid}`)}
                                        >
                                            <Typography variant="body2">
                                                {project.name}
                                            </Typography>
                                        </Box>
                                    ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            ))
            }
        </Box >
    );
}