import { configureStore } from "@reduxjs/toolkit";
import websocketReducer, { WebSocketState } from "./websocketSlice";
import { websocketMiddleware } from "./middleware/websocketMiddleware";

export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // {
    // // Desabilitar verificação de serializabilidade para WebSocket instance
    //   serializableCheck: {
    //     ignoredActions: [
    //       "websocket/connectSuccess",
    //       "websocket/updateWsInstance",
    //     ],
    //     ignoredPaths: ["websocket.wsInstance"],
    //   },
    // }
    getDefaultMiddleware().concat(websocketMiddleware),
});

// Tipos inferidos do store
export type RootReducer = { websocket: WebSocketState };
export type AppDispatch = typeof store.dispatch;
