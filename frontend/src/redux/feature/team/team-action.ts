"use client"

import { RootState } from "@/redux/store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { FetchTeamsResponse, Team } from "./team-type"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const createTeam = createAsyncThunk<
    Team,
    { name: string; description: string },
    { state: RootState }
>(
    "team/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/team`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return data.data
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const fetchTeams = createAsyncThunk<
    FetchTeamsResponse,
    { offset?: number, limit?: number },
    { state: RootState }
>(
    "team/fetch",
    async (
        { limit = 10, offset = 0 }: { limit?: number; offset?: number },
        { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/team?offset=${offset}?limit=${limit}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                teams: data.data,
                total: data.totalDocuments,
            }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const deleteTeam = createAsyncThunk<
    any,
    { uuid: string },
    { state: RootState }
>(
    "team/delete",
    async (
        { uuid },
        { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/team/${uuid}`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                message: data.message,
            }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)