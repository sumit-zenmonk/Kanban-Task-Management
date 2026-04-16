"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import styles from "./team-sidebar-comp.module.css";
import { useRouter } from "next/navigation";

type Team = {
    uuid: string;
    name: string;
};

const dummyProjects = ["Project A", "Project B", "Project C"];

export default function TeamSidebarComp({ teams }: { teams: Team[] }) {
    const [activeTeam, setActiveTeam] = useState<string | null>(null);
    const router = useRouter();

    return (
        <Box className={styles.sidebar}>
            <Typography className={styles.heading}>Teams</Typography>

            {teams.map((team) => (
                <Box key={team.uuid} className={styles.teamContainer}>
                    <Box
                        className={styles.team}
                        onClick={() => {
                            setActiveTeam(activeTeam === team.uuid ? null : team.uuid)
                            router.push(`/team/${team.uuid}`);
                        }
                        }
                    >
                        <Typography>{team.name}</Typography>
                    </Box>

                    {activeTeam === team.uuid && (
                        <Box className={styles.projectContainer}>
                            {dummyProjects.map((project, index) => (
                                <Box key={index} className={styles.project}>
                                    <Typography variant="body2">{project}</Typography>
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