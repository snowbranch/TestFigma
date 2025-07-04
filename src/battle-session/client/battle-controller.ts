// 战斗客户端逻辑
import { Controller, OnStart } from "@flamework/core";

@Controller()
export class BattleController implements OnStart {
    onStart(): void {
        print("BattleController 战斗客户端已启动");
        // ECS架构的战斗系统客户端逻辑
    }
}
