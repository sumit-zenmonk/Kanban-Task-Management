"use client";

import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import styles from "./team.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { fetchUsers } from "@/redux/feature/user/user-action";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import UserListingModal from "@/component/user-listing-modal/user-listing-modal";
import MemberList from "@/component/member-listing-comp/member-listing";

export default function Home() {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { teams } = useAppSelector((state: RootState) => state.teamReducer);
    const params = useParams();
    const team_uuid = params?.uuid;

    useEffect(() => {
        dispatch(fetchUsers({}));
    }, [dispatch]);

    const selectedTeam = teams?.find((team: any) => team.uuid === team_uuid);

    if (!selectedTeam) {
        return (
            <Box className={styles.container}>
                <Typography>Team not found</Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.container}>
            <Typography className={styles.header}>
                Team Details
            </Typography>

            <Box className={styles.teamInfo}>
                <Box>
                    <Typography className={styles.teamName}>
                        {selectedTeam.name}
                    </Typography>
                    <Typography className={styles.teamDescription}>
                        {selectedTeam.description}
                    </Typography>
                </Box>
                <Box className={styles.actions}>
                    <Button variant="contained" onClick={() => setOpen(true)}>
                        + Add Member
                    </Button>
                </Box>
            </Box>


            <UserListingModal open={open} onClose={() => setOpen(false)} />

            <Typography className={styles.header}>
                Members
            </Typography>
            <Box className={styles.memberSection}>
                <MemberList />
            </Box>
        </Box>
    );
}