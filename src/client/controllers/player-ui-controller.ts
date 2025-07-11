import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { ItemSelection } from "../ui/components";

@Controller()
export class PlayerUIController implements OnStart {
    private readonly localPlayer = Players.LocalPlayer;
    private uiRoot?: ReturnType<typeof createRoot>;

    onStart(): void {
        print("PlayerUIController 已初始化");
        
        // 等待角色生成
        if (this.localPlayer.Character) {
            this.onCharacterSpawned(this.localPlayer.Character);
        }

        this.localPlayer.CharacterAdded.Connect((character) => {
            this.onCharacterSpawned(character);
        });
    }

    private onCharacterSpawned(character: Model): void {
        print(`🎮 欢迎 ${this.localPlayer.Name}，客户端已准备就绪！`);
        
        // 初始化UI
        this.initializeUI();
    }

    private initializeUI(): void {
        const playerGui = this.localPlayer.WaitForChild("PlayerGui") as PlayerGui;
        
        // 创建React根节点
        this.uiRoot = createRoot(playerGui);
        
        // 渲染物品选择界面
        this.uiRoot.render(React.createElement(ItemSelection));
        
        print("UI 已初始化并渲染");
    }
}
