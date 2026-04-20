import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { TaskPayload } from "./task-type";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const createTask = createAsyncThunk<
    { message: string },
    TaskPayload,
    { state: RootState }
>(
    "task/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    name: payload.name,
                    description: payload.description,
                    project_uuid: payload.project_uuid,
                    ...(payload.assigned_to_uuid && {
                        assigned_to_uuid: payload.assigned_to_uuid,
                    }),
                    ...(payload.status && {
                        status: payload.status,
                    }),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteTask = createAsyncThunk<
    { message: string },
    { uuid: string },
    { state: RootState }
>(
    "task/delete",
    async ({ uuid }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/task/${uuid}`, {
                method: "DELETE",
                headers: { Authorization: token },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateTask = createAsyncThunk<
    { message: string },
    TaskPayload,
    { state: RootState }
>(
    "task/update",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/task`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    uuid: payload.uuid,
                    ...(payload.name && { name: payload.name }),
                    ...(payload.description && {
                        description: payload.description,
                    }),
                    ...(payload.assigned_to_uuid && {
                        assigned_to_uuid: payload.assigned_to_uuid,
                    }),
                    ...(payload.status && {
                        status: payload.status,
                    }),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);