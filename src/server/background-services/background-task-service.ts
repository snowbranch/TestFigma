// 后台服务示例
import { Service, OnStart } from "@flamework/core";

@Service()
export class BackgroundTaskService implements OnStart {
    onStart(): void {
        print("BackgroundTaskService 已启动");
        // 这里可以添加定时任务、数据同步等后台服务
    }
}
