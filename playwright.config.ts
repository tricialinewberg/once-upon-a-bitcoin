import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    channel: 'msedge',
    launchOptions: {args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']},
  },
  webServer: {command:'npm run dev', url:'http://127.0.0.1:5173', reuseExistingServer:true},
})
