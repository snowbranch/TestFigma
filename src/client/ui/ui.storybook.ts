import React from "@rbxts/react";
import { script } from "@rbxts/services";

// 游戏名称 - 在实际项目中应该从配置文件或环境变量中获取
const GAME_NAME = "TestFigma";

interface Storybook {
    name: string;
    react?: typeof React;
    storyRoots: Array<Instance  < /dev/null |  undefined>;
}

// Storybook配置
export = {
    name: GAME_NAME,
    react: React,
    storyRoots: [script.Parent],
} satisfies Storybook;
