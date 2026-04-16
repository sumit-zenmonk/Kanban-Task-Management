"use client"

import { createSlice } from "@reduxjs/toolkit"
import { TeamState } from "./team-type"
import { createTeam, deleteTeam, fetchTeams, updateTeam } from "./team-action"

const initialState: TeamState = {
    teams: [],
    total_teams: 0,
    loading: false,
    error: null,
    status: "idle",
}

const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        resetTeamState: (state) => {
            state.teams = []
            state.total_teams = 0
            state.loading = false
            state.error = null
            state.status = "idle"
        },
        socketTeamAdded: (state, action) => {
            const isExists = state.teams.findIndex((team) => team.uuid == action.payload.uuid);
            if (isExists == -1) {
                state.teams.push(action.payload);
            }
        },
        socketTeamRemoved: (state, action) => {
            const restTeams = state.teams.filter((team) => team.uuid !== action.payload.uuid);
            state.teams = restTeams;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTeam.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.teams.push(action.payload)
                state.total_teams = state.teams.length
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(fetchTeams.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                state.teams = action.payload.teams
                state.total_teams = action.payload.total
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(deleteTeam.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(deleteTeam.fulfilled, (state, action) => {
                state.loading = false
                state.status = "succeed"
                const team_uuid = action.meta.arg.uuid;
                state.teams = state.teams.filter((team) => team.uuid !== team_uuid);
                state.total_teams--;
            })
            .addCase(deleteTeam.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
            .addCase(updateTeam.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })
            .addCase(updateTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";

                const { uuid, name, description } = action.meta.arg;

                const index = state.teams.findIndex(t => t.uuid === uuid);
                if (index !== -1) {
                    state.teams[index].name = name;
                    state.teams[index].description = description;
                }
            })
            .addCase(updateTeam.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })
    },
})

export const { resetTeamState, socketTeamAdded, socketTeamRemoved } = teamSlice.actions
export default teamSlice.reducer