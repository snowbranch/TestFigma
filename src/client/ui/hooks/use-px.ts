import { Workspace } from "@rbxts/services";

export function usePx() {
    // 基于1920x1080的设计尺寸进行缩放
    const baseResolution = { x: 1920, y: 1080 };
    const camera = Workspace.CurrentCamera;
    const screenSize = camera ? camera.ViewportSize : new Vector2(1920, 1080);
    const scaleFactor = math.min(screenSize.X / baseResolution.x, screenSize.Y / baseResolution.y);
    
    return (value: number) => math.floor(value * scaleFactor);
}
