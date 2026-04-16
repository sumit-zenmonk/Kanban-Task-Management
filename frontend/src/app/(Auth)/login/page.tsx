"use client"

import styles from "./login.module.css"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { googleLogin } from "@/redux/feature/auth/auth-action"
import { useRouter } from "next/navigation"

import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
    Divider
} from "@mui/material"
import { enqueueSnackbar } from "notistack"
import Image from "next/image"

export default function LoginForm() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const handleGoogleLogin = async () => {
        try {
            await dispatch(googleLogin()).unwrap()
            router.replace("/")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box className={styles.container}>
            <Card className={styles.formWrapper} elevation={3}>
                <Typography variant="h5" className={styles.title}>
                    Sign In
                </Typography>

                <Button
                    variant="contained"
                    className={styles.providerLoginBox}
                    onClick={handleGoogleLogin}
                >
                    {/* <GoogleIcon /> */}
                    <Image
                        src={'/google.png'}
                        alt="google icon"
                        width={25}
                        height={25}
                    />
                    <Typography>
                        Login with Google
                    </Typography>
                </Button>
            </Card>
            <Image src={"/login-logo-page.svg"} alt="login side page missing" width={500} height={500} />
        </Box>
    )
}