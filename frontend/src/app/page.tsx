"use client"

import { useAppSelector } from "@/redux/hooks.ts"
import { Box, Typography, } from "@mui/material"
import { RootState } from "@/redux/store";
import Image from "next/image";

export default function Home() {
  const { user } = useAppSelector((state: RootState) => state.authReducer);

  return (
    <Box>
      <Image src={user?.image || 'user.svg'} width={100} height={100} alt="user profile" />
      <Typography>Name - {user?.name}</Typography>
      <Typography>Email - {user?.email}</Typography>
    </Box>
  )
}