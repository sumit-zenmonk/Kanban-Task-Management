"use client"

import { RootState } from "@/redux/store"
import { createAsyncThunk } from "@reduxjs/toolkit"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const fetchUsers = createAsyncThunk<
    any,
    { offset?: number, limit?: number },
    { state: RootState }
>(
    "user/fetch",
    async (
        { limit = 10, offset = 0 }: { limit?: number; offset?: number },
        { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/user?offset=${offset}?limit=${limit}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                users: data.data,
                total: data.totalDocuments,
            }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)