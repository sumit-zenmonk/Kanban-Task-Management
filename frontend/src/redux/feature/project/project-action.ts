"use client"

import { RootState } from "@/redux/store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { FetchProjectsResponse, Project } from "./project-type"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const createProject = createAsyncThunk<
    Project,
    { team_uuid: string; name: string; description: string },
    { state: RootState }
>(
    "project/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/project`, {
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

export const fetchProjects = createAsyncThunk<
    FetchProjectsResponse,
    { offset?: number; limit?: number; team_uuid: string },
    { state: RootState }
>(
    "project/fetch",
    async ({ offset = 0, limit = 10, team_uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(
                `${API_URL}/project?offset=${offset}&limit=${limit}&team_uuid=${team_uuid}`,
                {
                    method: "GET",
                    headers: { Authorization: token },
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return {
                projects: data.data,
                total: data.totalDocuments,
            }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const fetchProjectById = createAsyncThunk<
    Project,
    { uuid: string },
    { state: RootState }
>(
    "project/fetchById",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/project/${uuid}`, {
                method: "GET",
                headers: { Authorization: token },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return data.data
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const deleteProject = createAsyncThunk<
    { message: string },
    { uuid: string },
    { state: RootState }
>(
    "project/delete",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/project/${uuid}`, {
                method: "DELETE",
                headers: { Authorization: token },
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return { message: data.message }
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)

export const updateProject = createAsyncThunk<
    { message: string },
    { uuid: string; name?: string; description?: string },
    { state: RootState }
>(
    "project/update",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || ""

            const res = await fetch(`${API_URL}/project`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            return data.message
        } catch (err: any) {
            return rejectWithValue(err.message)
        }
    }
)