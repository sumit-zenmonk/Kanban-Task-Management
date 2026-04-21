"use client";

import {
    Dialog,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/redux/hooks.ts";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { createMember } from "@/redux/feature/member/member-action";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MemberRoleEnum } from "@/enums/member.role";
import styles from "./user-listing.module.css";
import { enqueueSnackbar } from "notistack";
import InfiniteScroll from "react-infinite-scroll-component"
import { fetchUsers } from "@/redux/feature/user/user-action";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function UserListingModalComp({ open, onClose }: Props) {
    const { users, total_users } = useAppSelector((state: RootState) => state.userReducer);
    const { members } = useAppSelector((state: RootState) => state.memberReducer);
    const dispatch = useAppDispatch();
    const params = useParams();
    const team_uuid = params?.uuid as string;
    const [roles, setRoles] = useState<Record<string, string>>({});
    const [offset, setOffset] = useState(0)
    const limit = 10

    useEffect(() => {
        dispatch(fetchUsers({ offset: 0, limit }))
    }, [dispatch])

    const fetchMore = async () => {
        try {
            if (users.length >= total_users) return;

            const newOffset = offset + limit;
            setOffset(newOffset);

            await dispatch(fetchUsers({ offset: newOffset, limit })).unwrap()
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
            console.log(`User List Fetching Error`, err);
        }
    }

    const handleAdd = async (user_uuid: string) => {
        try {
            await dispatch(
                createMember({
                    member_uuid: user_uuid,
                    team_uuid,
                    role: roles[user_uuid] || MemberRoleEnum.MEMBER
                })
            ).unwrap();

            // onClose();
        } catch (err: any) {
            console.log(err);
            enqueueSnackbar(err, { variant: "error" });
        }
    };

    const handleRoleChange = (userId: string, value: string) => {
        setRoles((prev) => ({
            ...prev,
            [userId]: value,
        }));
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Box className={styles.dialogContent}>
                <InfiniteScroll
                    dataLength={users.length}
                    next={fetchMore}
                    hasMore={users.length < total_users}
                    loader={<h4>Loading...</h4>}
                    height={700}
                >
                    {users
                        .filter(user => !members.some(mem => mem.member_uuid === user.uuid && mem.team_uuid === team_uuid))
                        .map((user) => (
                            <Card key={user.uuid} className={styles.card}>
                                <CardContent className={styles.cardContent}>
                                    <Typography variant="h6">
                                        {user.name}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                    </Typography>

                                    <Box className={styles.imageWrapper}>
                                        <Image
                                            src={user?.image || "/user.svg"}
                                            width={100}
                                            height={100}
                                            alt="user profile"
                                            className={styles.image}
                                        />
                                    </Box>

                                    <Box className={styles.actionBox}>
                                        <FormControl className={styles.selectControl}>
                                            <Select
                                                value={roles[user.uuid] || MemberRoleEnum.MEMBER}
                                                onChange={(e) => handleRoleChange(user.uuid, e.target.value)}
                                                fullWidth
                                            >
                                                <MenuItem value={MemberRoleEnum.ADMIN}>
                                                    admin
                                                </MenuItem>
                                                <MenuItem value={MemberRoleEnum.MEMBER}>
                                                    member
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAdd(user.uuid)}
                                            className={styles.button}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                </InfiniteScroll>
            </Box>
        </Dialog>
    );
}