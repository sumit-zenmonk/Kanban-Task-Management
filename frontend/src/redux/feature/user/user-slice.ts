"use client"

import { createSlice } from "@reduxjs/toolkit"
import { fetchUsers } from "./user-action"
import { UserState } from "./user-type"

const initialState: UserState = {
    users: [],
    total_users: 0,
    loading: false,
    error: null,
    status: "idle",
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUserState: (state) => {
            state.users = []
            state.total_users = 0
            state.loading = false
            state.error = null
            state.status = "idle"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.users = action.payload.users
                state.total_users = action.payload.total
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
    },
})

export const { resetUserState } = userSlice.actions
export default userSlice.reducer