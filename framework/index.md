# Framework 目录说明

本框架为通用性roblox游戏框架, 本目录内不含针对具体游戏业务的描述.


## 目录结构

**当前目录结构**

```markdown
└── 📁framework
    ├── 📁000_intro          # **项目基础** 项目简介、快速开始与代码规范
    ├── 📁010_concept        # **核心概念** 架构概念、边界划分与数据流
    ├── 📁020_base-coding    # **基础编码** Roblox-TS、Flamework框架与代码规范
    ├── 📁030_protocol       # **协议设计** 专注于客户端和服务端之间的数据协议
    ├── 📁040_state          # **状态管理** 使用 reflex 管理状态
    ├── 📁050_config         # **配置管理** 项目配置、常量与Luban数据配置
    ├── 📁060_asset          # **资产管理** 静态资源管理
    └── 📁070_view           # **视图系统** React组件、Hook与Storybook
```

必读文档:

- @010_architecture/010_architecture.md
- @010_architecture/013-modular-architecture.md