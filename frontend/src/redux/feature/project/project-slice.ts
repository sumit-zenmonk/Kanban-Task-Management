"use client"

import { createSlice } from "@reduxjs/toolkit"
import { ProjectState } from "./project-type"
import { createProject, deleteProject, fetchProjectById, fetchProjects, updateProject, } from "./project-action"

const initialState: ProjectState = {
    projects: [],
    total_projects: 0,
    loading: false,
    error: null,
    status: "pending",
}

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        resetProjectState: (state) => {
            state.projects = []
            state.total_projects = 0
            state.loading = false
            state.error = null
            state.status = "pending"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.projects.push(action.payload)
                state.total_projects = state.projects.length
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.projects = action.payload.projects
                state.total_projects = action.payload.total
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                const index = state.projects.findIndex((p) => p.uuid === action.payload.uuid)

                if (index !== -1) {
                    state.projects[index] = action.payload
                } else {
                    state.projects.push(action.payload)
                }
            })
            .addCase(deleteProject.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"

                const uuid = action.meta.arg.uuid
                state.projects = state.projects.filter(p => p.uuid !== uuid)
                state.total_projects = state.projects.length
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(updateProject.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                const index = state.projects.findIndex((p) => p.uuid === action.meta.arg.uuid)

                if (index !== -1) {
                    state.projects[index].name = action.meta.arg.name ?? state.projects[index].name
                    state.projects[index].description = action.meta.arg.description ?? state.projects[index].description
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
    },
})

export const { resetProjectState } = projectSlice.actions
export default projectSlice.reducer