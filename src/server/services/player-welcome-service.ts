import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

@Service()
export class PlayerWelcomeService implements OnStart {
    onStart(): void {
        print("PlayerWelcomeService 已启动");
        
        // 监听玩家加入事件
        Players.PlayerAdded.Connect((player) => {
            this.onPlayerJoined(player);
        });

        // 监听玩家离开事件
        Players.PlayerRemoving.Connect((player) => {
            this.onPlayerLeft(player);
        });
    }

    private onPlayerJoined(player: Player): void {
        print(`🎉 欢迎 ${player.Name} 加入游戏！`);
    }

    private onPlayerLeft(player: Player): void {
        print(`👋 ${player.Name} 离开了游戏`);
    }
}
