"use client"

import { useAppSelector } from "@/redux/hooks.ts"
import { Box, Typography, } from "@mui/material"
import { RootState } from "@/redux/store";
import Image from "next/image";
import styles from "./home.module.css";

export default function Home() {
  const { user } = useAppSelector((state: RootState) => state.authReducer);

  return (
    <Box className={styles.container}>
      <Image src={user?.image || '/user.svg'} width={200} height={200} alt="user profile" />
      <Typography>Name - {user?.name}</Typography>
      <Typography>Email - {user?.email}</Typography>
    </Box>
  )
}