// 战斗服务端逻辑
import { Service, OnStart } from "@flamework/core";

@Service()
export class BattleService implements OnStart {
    onStart(): void {
        print("BattleService 战斗服务端已启动");
        // ECS架构的战斗系统服务端逻辑
    }
}
