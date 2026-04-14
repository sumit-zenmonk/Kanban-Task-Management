"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Button, Menu, MenuItem } from "@mui/material"
import { logoutUser } from "@/redux/feature/auth/auth-action"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import styles from "./header-comp.module.css"
import { useState } from "react"

export default function HeaderComp() {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const { user } = useSelector(
        (state: RootState) => state.authReducer
    )

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleLogOut = async () => {
        await dispatch(logoutUser()).unwrap()
        localStorage.clear()
        router.replace("/login")
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    return (
        <header className={styles.header}>
            <Box className={styles.leftContainer}>
                <p>Kanban Manager</p>
            </Box>

            <Box className={styles.rightContainer}>

                {user ? (
                    <>
                        <Button
                            onClick={() => {
                                router.push("/")
                                handleMenuClose()
                            }}
                        >
                            Home
                        </Button>

                        <Button
                            onClick={() => {
                                router.push("/team")
                                handleMenuClose()
                            }}
                        >
                            Team
                        </Button>

                        <Button
                            sx={{ color: "red" }}
                            onClick={async () => {
                                await handleLogOut()
                                handleMenuClose()
                            }}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => {
                            router.push("/login")
                            handleMenuClose()
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </header >
    )
}