"use client";

import { Dialog, Card, CardContent, Typography, } from "@mui/material";
import { useAppSelector } from "@/redux/hooks.ts";
import Image from "next/image";
import { RootState } from "@/redux/store";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function UserListingModal({ open, onClose }: Props) {
    const { users } = useAppSelector((state: RootState) => state.userReducer);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            {users.map((user) => (
                <Card key={user.uuid}>
                    <CardContent>
                        <Typography variant="h6">{user.name}</Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {user.email}
                        </Typography>

                        <Image src={user?.image || 'user.svg'} width={100} height={100} alt="user profile" />
                    </CardContent>
                </Card>
            ))}
        </Dialog>
    );
}