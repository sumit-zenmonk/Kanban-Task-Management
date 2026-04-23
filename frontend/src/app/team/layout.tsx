"use client"

import TeamSidebarComp from "@/component/team-sidebar-comp/team-sidebar-comp";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { Box } from "@mui/material";
import styles from "./layout.module.css"
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/service/socket";
import { socketTeamAdded } from "@/redux/feature/team/team-slice";
import { socketTeamRemoved } from "../../redux/feature/team/team-slice";
import HeaderComp from "@/component/header-comp/header-comp";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const team_state = useAppSelector((state: RootState) => state.teamReducer);
    const { token } = useAppSelector((state: RootState) => state.authReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (token) {
            const socket = connectSocket(token)

            socket.on("member_team_joined", (team_data) => {
                dispatch(socketTeamAdded(team_data));
            })

            socket.on("member_removed_team", (team_data) => {
                dispatch(socketTeamRemoved(team_data));
            })

            return () => {
                disconnectSocket()
            }
        }
    }, [token, dispatch])

    return (
        <Box className={styles.layout}>
            <HeaderComp />
            <Box>
                <Box className={styles.sidebar}>
                    <TeamSidebarComp teams={team_state} />
                </Box>
                <Box className={styles.children}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
