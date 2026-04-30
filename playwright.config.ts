import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5174",
    actionTimeout: 15_000,
    screenshot: "only-on-failure",
    video: "on-first-retry",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "bun --cwd backend start",
      url: "http://localhost:4000/health",
      reuseExistingServer: false,
      timeout: 30_000,
      env: {
        PORT: "4000",
        NODE_ENV: "test",
        CORS_ORIGIN: "http://localhost:5174",
      },
    },
    {
      command: "bun --cwd frontend dev --port 5174",
      url: "http://localhost:5174",
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        VITE_API_URL: "http://localhost:4000",
      },
    },
  ],
});
