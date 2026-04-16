"use client"

import { useEffect } from "react"
import { deleteMember, fetchMembers } from "@/redux/feature/member/member-action"
import { RootState } from "@/redux/store"
import { useParams } from "next/navigation"
import { Card, CardContent, Typography, Box, Button } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import Image from "next/image"
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from "notistack"
import { Select, MenuItem } from "@mui/material"
import { updateMember } from "@/redux/feature/member/member-action"
import { MemberRoleEnum } from "@/enums/member.role"
import styles from "./member-listing-comp.module.css"

export default function MemberList() {
    const dispatch = useAppDispatch()
    const { members, loading } = useAppSelector((state: RootState) => state.memberReducer)

    const params = useParams()
    const team_uuid = params?.uuid

    useEffect(() => {
        dispatch(fetchMembers({}))
    }, [dispatch])

    const filteredMembers = members.filter((m) => m.team_uuid === team_uuid)

    // if (loading) return <p>Loading...</p>

    const handleDeleteMember = async (uuid: string) => {
        try {
            await dispatch(deleteMember({ uuid })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
            console.log('Member Delete Error', err);
        }
    }

    const handlePromoteMember = async (data: any) => {
        try {
            await dispatch(updateMember(data)).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
            console.log('Member promote Error', err);
        }
    }

    return (
        <Box className={styles.container}>
            {filteredMembers.map((member) => (
                <Card key={member.uuid} className={styles.card}>
                    <CardContent className={styles.content}>
                        <Box className={styles.image}>
                            <Image
                                src={member.member.image || "/user.svg"}
                                width={100}
                                height={100}
                                alt="user profile"
                            />
                        </Box>
                        <Box className={styles.info}>
                            <Box className={styles.infoBox}>
                                <Typography className={styles.infoTitle}>
                                    Name:
                                </Typography>
                                <Typography className={styles.infoDefine}>
                                    {member.member.name}
                                </Typography>
                            </Box>

                            <Box className={styles.infoBox}>
                                <Typography className={styles.infoTitle}>
                                    Email:
                                </Typography>

                                <Typography className={styles.infoDefine}>
                                    {member.member.email}
                                </Typography>
                            </Box>

                            <Box className={styles.infoBox}>
                                <Typography className={styles.infoTitle}>
                                    Onboard By:
                                </Typography>
                                <Typography className={styles.infoDefine}>
                                    {member.onboardBy.email}
                                </Typography>
                            </Box>

                            <Box className={styles.infoBox}>
                                <Typography className={styles.infoTitle}>
                                    Role By:
                                </Typography>
                                <Typography className={styles.infoDefine}>
                                    {member.roleBy.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Box className={styles.actions}>
                            <Select
                                size="small"
                                value={member.role}
                                className={styles.select}
                                onChange={(e) => {
                                    handlePromoteMember({
                                        uuid: member.uuid,
                                        team_uuid: member.team_uuid,
                                        role: e.target.value as MemberRoleEnum
                                    });
                                }}
                            >
                                <MenuItem value={MemberRoleEnum.ADMIN}>Admin</MenuItem>
                                <MenuItem value={MemberRoleEnum.MEMBER}>Member</MenuItem>
                            </Select>

                            <Button
                                variant="contained"
                                sx={{ color: "white", background: "red" }}
                                onClick={() => handleDeleteMember(member.uuid)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))
            }

            {
                filteredMembers.length === 0 && (
                    <Typography>No members found</Typography>
                )
            }
        </Box >
    )
}