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

export default function MemberList() {
    const dispatch = useAppDispatch()
    const { members, loading } = useAppSelector((state: RootState) => state.memberReducer)

    const params = useParams()
    const team_uuid = params?.uuid

    useEffect(() => {
        dispatch(fetchMembers({}))
    }, [dispatch])

    const filteredMembers = members.filter(
        (m) => m.team_uuid === team_uuid
    )

    if (loading) return <p>Loading...</p>

    const handleDeleteMember = async (uuid: string) => {
        try {
            await dispatch(deleteMember({ uuid })).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" });
            console.log('Member Delete Error', err);
        }
    }

    return (
        <Box >
            {filteredMembers.map((member) => (
                <Card key={member.uuid} sx={{ mb: 2 }}>
                    <CardContent>
                        <Image
                            src={member.member.image || "/user.svg"}
                            width={100}
                            height={100}
                            alt="user profile"
                        />
                        <Typography>Role: {member.role}</Typography>
                        <Typography>
                            Name: {member.member.name}
                        </Typography>
                        <Typography>
                            Email: {member.member.email}
                        </Typography>
                    </CardContent>
                    <Button onClick={() => handleDeleteMember(member.uuid)}><DeleteIcon /></Button>
                </Card>
            ))}

            {filteredMembers.length === 0 && (
                <Typography>No members found</Typography>
            )}
        </Box>
    )
}