// API网关示例
import { Service } from "@flamework/core";

@Service()
export class PlayerGateway {
    public validatePlayerAction(player: Player, action: string): boolean {
        // 验证玩家操作的合法性
        print(`验证玩家 ${player.Name} 的操作: ${action}`);
        return true;
    }
}
