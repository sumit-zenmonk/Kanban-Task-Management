"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { persistor } from "@/redux/store"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const googleLogin = createAsyncThunk(
    "auth/google",
    async (_, { rejectWithValue }) => {
        try {
            const provider = new GoogleAuthProvider()
            const res = await signInWithPopup(auth, provider)
            const idToken = await res.user.getIdToken()
            const response = await fetch(`${API_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ idToken })
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.message)

            return result
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await persistor.purge();
            return null
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)
