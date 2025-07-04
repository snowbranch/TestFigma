import { Flamework } from "@flamework/core";

// 服务端主入口
Flamework.addPaths("src/server");
Flamework.addPaths("src/shared");
Flamework.ignite();

