import { configureStore } from "@reduxjs/toolkit";
import websocketReducer from "./websocketSlice";
import { websocketMiddleware } from "./middleware/websocketMiddleware";

export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Desabilitar verificação de serializabilidade para WebSocket instance
      serializableCheck: {
        ignoredActions: [
          "websocket/connectSuccess",
          "websocket/updateWsInstance",
        ],
        ignoredPaths: ["websocket.wsInstance"],
      },
    }).concat(websocketMiddleware),
});

// Tipos inferidos do store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
