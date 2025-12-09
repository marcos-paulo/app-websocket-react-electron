```json
{
  "PROD": "----------------------------------------------------------------------",
  "start:prod:with:front:server:backend": "npm run start:prod:with:front:server --workspace=@app/backend",
  "start:prod:with:front:server:electron": "wait-on tcp:8080 && npm run start:prod:with:front:server --workspace=@app/electron",
  "start:prod:with:front:server": "concurrently --names \"BACKEND,ELECTRON\" --prefix-colors \"green,magenta\" --kill-others \"npm:start:prod:with:front:server:backend\" \"npm:start:prod:with:front:server:electron\"",
  "build:start:prod:with:front:server": "npm run build:all && npm run start:prod:with:front:server",
  "START:PROD": "----------------------------------------------------------------------",
  "start:prod:backend": "npm run start:prod --workspace=@app/backend",
  "start:prod:electron": "npm run start:prod --workspace=@app/electron",
  "start:prod": "concurrently --names \"BACKEND,ELECTRON\" --prefix-colors \"green,magenta\" --kill-others \"npm:start:prod:backend\" \"npm:start:prod:electron\"",
  "build:start:prod": "npm run build:all && npm run start:prod"
}
```
