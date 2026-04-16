"use client"

import { createSlice } from "@reduxjs/toolkit"
import { MemberState } from "./member-type"
import { createMember, deleteMember, fetchMemberById, fetchMembers, updateMember, } from "./member-action"

const initialState: MemberState = {
    members: [],
    total_members: 0,
    loading: false,
    error: null,
    status: "pending",
}

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
        resetMemberState: (state) => {
            state.members = []
            state.total_members = 0
            state.loading = false
            state.error = null
            state.status = "pending"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createMember.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(createMember.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.members.push(action.payload)
                state.total_members = state.members.length
            })
            .addCase(createMember.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchMembers.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchMembers.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.members = action.payload.members
                state.total_members = action.payload.total
            })
            .addCase(fetchMembers.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchMemberById.fulfilled, (state, action) => {
                const index = state.members.findIndex(m => m.uuid === action.payload.uuid)
                if (index !== -1) {
                    state.members[index] = action.payload
                } else {
                    state.members.push(action.payload)
                }
            })
            .addCase(deleteMember.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(deleteMember.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const uuid = action.meta.arg.uuid
                state.members = state.members.filter(m => m.uuid !== uuid)
                state.total_members--
            })
            .addCase(deleteMember.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(updateMember.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const index = state.members.findIndex(m => m.member_uuid === action.meta.arg.uuid)

                if (index !== -1) {
                    state.members[index].role = action.meta.arg.role
                }
            })
            .addCase(updateMember.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
    },
})

export const { resetMemberState } = memberSlice.actions
export default memberSlice.reducer