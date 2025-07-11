import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { ItemSelection } from "./ItemSelection";

export = (target: GuiObject) => {
    const root = createRoot(target);
    
    const element = (
        <ItemSelection
            onIconSelect={(iconIndex) => {
                print(`选择了图标: ${iconIndex}`);
            }}
            onConfirm={(selectedIcon) => {
                print(`确认选择的图标: ${selectedIcon}`);
            }}
        />
    );
    
    root.render(element);
    
    return () => {
        try {
            root.unmount();
        } catch (err) {
            warn("Story cleanup error:", err);
        }
    };
};
