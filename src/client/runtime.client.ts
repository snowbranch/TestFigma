import { Flamework } from "@flamework/core";

// 客户端主入口
Flamework.addPaths("src/client");
Flamework.addPaths("src/shared");
Flamework.ignite();

