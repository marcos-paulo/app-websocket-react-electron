import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Hooks tipados para usar em toda a aplicação
// Uso: const dispatch = useAppDispatch();
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Uso: const status = useAppSelector((state) => state.websocket.connectionStatus);
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
