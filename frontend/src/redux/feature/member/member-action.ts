"use client"

import { RootState } from "@/redux/store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { FetchMembersResponse, Member } from "./member-type"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const createMember = createAsyncThunk<
    Member,
    { member_uuid: string; team_uuid: string, role: string },
    { state: RootState }
>(
    "member/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""
            console.log(payload);
            const res = await fetch(`${API_URL}/member`, {
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

export const fetchMembers = createAsyncThunk<
    FetchMembersResponse,
    { offset?: number; limit?: number },
    { state: RootState }
>(
    "member/fetch",
    async (
        { limit = 10, offset = 0 },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/member?offset=${offset}&limit=${limit}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                members: data.data,
                total: data.totalDocuments,
            }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const fetchMemberById = createAsyncThunk<
    Member,
    { uuid: string },
    { state: RootState }
>(
    "member/fetchById",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/member/${uuid}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return data.data
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const deleteMember = createAsyncThunk<
    { message: string },
    { uuid: string },
    { state: RootState }
>(
    "member/delete",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/member/${uuid}`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return { message: data.message }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)