@docs/index.md
@framework/index.md
@README.md


# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。


## 架构概览

这是一个使用 Flamework 框架、React UI 和 Reflex 状态管理的 roblox-ts 游戏项目（死亡地铁 - Death Subway）。

- 缓存目录: `.process/cache/`
- 任务日志： `.process/logs`

### 开发提示

- 运行单个测试：`pnpm run test -- path/to/test.test.ts`
- 监听特定配置：`pnpm run config:watch` 会监听 `configs/` 目录变化
- 调试构建问题：查看 `out/` 目录的编译输出
- TypeScript 严格模式：所有代码必须通过严格类型检查

### 编码问题

- 严格遵循 `eslint.config.js` 配置
- **重要** 遵循 roblox-ts 编程规范
- `0, NaN, and "" are falsy in TS but truth in lua`, 请在编码时对这些类型使用显式检查.
- 使用 `someArray.size()` 而非 `someArray.length`
- luau 全局模块, 除了 \_G, 其他都是只读

## 产品质量

请在每次完成任务后, 进行`自检`

## 开发记忆

- always test
- 自动执行 npm run dev:compile
- 材料收集拾取属于战斗会话边界
- service直接使用store的Producer方法，并且可以同步store.getState()获取当前状态
- 不允许使用store.dispatch
- ui界面的所有handle方法需要通过props传入，只允许在功能模块的主要screen中出现handle的定义，其他组件需要通过props传入
- 编写ui界面代码，同步生成对应的storybook，storybook中增加界面中需要的api的Mock实现，优先在storybook使用api mockrequest
- review 后需要打分