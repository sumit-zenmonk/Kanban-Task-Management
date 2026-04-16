"use client"

import TeamSidebarComp from "@/component/team-sidebar-comp/team-sidebar-comp";
import { useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { Box } from "@mui/material";
import styles from "./layout.module.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { teams } = useAppSelector((state: RootState) => state.teamReducer);

    return (
        <Box className={styles.layout}>
            <Box className={styles.sidebar}>
                <TeamSidebarComp teams={teams} />
            </Box>
            <Box className={styles.children}>
                {children}
            </Box>
        </Box>
    );
}
