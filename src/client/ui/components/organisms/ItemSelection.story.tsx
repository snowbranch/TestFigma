import React from "@rbxts/react";
import { ItemSelection } from "./ItemSelection";

export = () => {
    return (
        <screengui ResetOnSpawn={false}>
            <ItemSelection
                onIconSelect={(iconIndex) => {
                    print(`选择了图标: ${iconIndex}`);
                }}
                onConfirm={(selectedIcon) => {
                    print(`确认选择的图标: ${selectedIcon}`);
                }}
            />
        </screengui>
    );
};
