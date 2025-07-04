import { createProducer } from "@rbxts/reflex";

export interface UIState {
    showWelcome: boolean;
    playerName: string;
    notifications: Array<{
        id: string;
        message: string;
        type: "info" | "success" | "warning" | "error";
        timestamp: number;
    }>;
}

const initialState: UIState = {
    showWelcome: false,
    playerName: "",
    notifications: []
};

export const uiSlice = createProducer(initialState, {
    showWelcomeScreen: (state, playerName: string) => ({
        ...state,
        showWelcome: true,
        playerName: playerName
    }),

    hideWelcomeScreen: (state) => ({
        ...state,
        showWelcome: false
    }),

    addNotification: (state, message: string, notificationType?: "info" | "success" | "warning" | "error") => ({
        ...state,
        notifications: [
            ...state.notifications,
            {
                id: tostring(tick()),
                message,
                type: notificationType || "info",
                timestamp: tick()
            }
        ]
    }),

    removeNotification: (state, id: string) => ({
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== id)
    })
});
