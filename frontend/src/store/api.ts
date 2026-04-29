import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { Task, Tag, TaskStatus } from "@task-app/shared";
import type {
  CreateTaskDto,
  CreateTagDto,
  PatchTaskStatusDto,
} from "@task-app/shared";

const rawBase = fetchBaseQuery({ baseUrl: "http://localhost:3000" });

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBase(args, api, extraOptions);
  if (result.error) return result;
  if (result.data && typeof result.data === "object" && "data" in result.data) {
    return { data: (result.data as { data: unknown }).data, meta: result.meta };
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Task", "Tag"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], { tag?: string } | void>({
      query: (params) => ({
        url: "/tasks",
        ...(params ? { params } : {}),
      }),
      providesTags: [{ type: "Task", id: "LIST" }],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<Task, { id: string; body: CreateTaskDto }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}`, method: "PUT", body }),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : ["Task", { type: "Task", id }],
    }),
    patchTaskStatus: builder.mutation<Task, { id: string; status: TaskStatus }>(
      {
        query: ({ id, status }) => ({
          url: `/tasks/${id}/status`,
          method: "PATCH",
          body: { status } satisfies PatchTaskStatusDto,
        }),
        invalidatesTags: (_result, error, { id }) =>
          error ? [] : ["Task", { type: "Task", id }],
      },
    ),
    getTags: builder.query<Tag[], void>({
      query: () => "/tags",
      providesTags: ["Tag"],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
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
  usePatchTaskStatusMutation,
  useDeleteTaskMutation,
  useGetTagsQuery,
  useCreateTagMutation,
} = api;
