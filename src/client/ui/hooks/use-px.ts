import { useState, useEffect } from "@rbxts/react";
import { GuiService, Players } from "@rbxts/services";

// 像素转换hook - 基于1920x1080标准尺寸
export function usePx() {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const viewport = GuiService.GetGuiInset();
            const player = Players.LocalPlayer;
            const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
            const screenGui = playerGui.GetChildren().find((child) => child.IsA("ScreenGui")) as ScreenGui;
            
            if (screenGui) {
                const absoluteSize = screenGui.AbsoluteSize;
                // 基于1920x1080计算缩放比例
                const scaleX = absoluteSize.X / 1920;
                const scaleY = absoluteSize.Y / 1080;
                const finalScale = math.min(scaleX, scaleY);
                
                setScale(finalScale);
            }
        };

        updateScale();
        
        // 简化版本，不监听resize事件
        task.wait(0.1);
        updateScale();
    }, []);

    return (pixels: number) => math.floor(pixels * scale);
}
