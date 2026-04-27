import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task, Tag } from "@task-app/shared";
import type { CreateTaskDto, UpdateTaskDto, CreateTagDto } from "@task-app/shared";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Task", "Tag"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], { tag?: string } | void>({
      query: (params) => ({
        url: "/tasks",
        ...(params ? { params } : {}),
      }),
      providesTags: ["Task"],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<Task, { id: string; body: UpdateTaskDto }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _err, { id }) => ["Task", { type: "Task", id }],
    }),
    getTags: builder.query<Tag[], void>({
      query: () => "/tags",
      providesTags: ["Tag"],
    }),
    createTag: builder.mutation<Tag, CreateTagDto>({
      query: (body) => ({ url: "/tags", method: "POST", body }),
      invalidatesTags: ["Tag"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetTagsQuery,
  useCreateTagMutation,
} = api;
