# Progress 系统 - Sync 模块 Luban 配置设计

## 概述

为 Progress 系统的 Sync 模块设计了完整的 Luban Bean 和 Table 定义，覆盖了跨设备数据同步、数据冲突解决、离线数据合并等核心功能。

## Bean 定义文件结构

### 1. sync-session.xml
**路径**: `configs/defines/progress/sync/sync-session.xml`

**核心功能**: 同步会话管理
- `SyncSession` - 同步会话主结构
- `SyncType` - 同步类型枚举 (FULL_SYNC, INCREMENTAL_SYNC, FORCE_SYNC, MERGE_SYNC)
- `SyncStatus` - 同步状态枚举 (PENDING, SYNCING, COMPLETED, FAILED, CANCELLED, REQUIRES_INTERVENTION)
- `DeviceInfo` - 设备信息结构
- `SyncConfig` - 同步配置参数
- `SyncError` - 同步错误信息
- `SyncStatistics` - 同步统计信息

### 2. sync-data.xml
**路径**: `configs/defines/progress/sync/sync-data.xml`

**核心功能**: 数据包与载荷管理
- `SyncDataPacket` - 同步数据包结构
- `SyncDataPayload` - 同步数据载荷
- `PlayerSyncData` - 玩家同步数据 (映射 stat_definitions)
- `CharacterSyncData` - 角色同步数据 (映射 characters.json)
- `EquipmentSyncData` - 装备同步数据
- `EconomicSyncData` - 经济数据同步 (映射 currency_player_configs.json)
- `AchievementSyncData` - 成就同步数据
- `StatisticsSyncData` - 统计数据同步
- `SettingsSyncData` - 设置数据同步

### 3. conflict-resolution.xml
**路径**: `configs/defines/progress/sync/conflict-resolution.xml`

**核心功能**: 冲突解决机制
- `ConflictResolution` - 冲突解决数据结构
- `ConflictType` - 冲突类型枚举 (VERSION_CONFLICT, TIMESTAMP_CONFLICT, VALUE_CONFLICT, STRUCTURE_CONFLICT, DEPENDENCY_CONFLICT)
- `ResolutionStrategy` - 解决策略枚举 (USE_LOCAL, USE_REMOTE, USE_LATEST_TIMESTAMP, USE_MAX_VALUE, SMART_MERGE, USER_CHOICE)
- `SyncStateManager` - 同步状态管理器
- `NetworkStatus` - 网络状态信息
- `GlobalSyncConfig` - 全局同步配置

### 4. sync-plugin.xml
**路径**: `configs/defines/progress/sync/sync-plugin.xml`

**核心功能**: 插件扩展架构
- `SyncPluginInterface` - 同步插件接口
- `SyncMetrics` - 同步指标数据
- `SyncSystemStatus` - 同步系统状态
- `SyncDataIndexes` - 数据索引配置
- `PluginType` - 插件类型枚举
- `PluginPerformance` - 插件性能统计

## Table 定义文件

### sync.xml
**路径**: `configs/tables/progress/sync.xml`

**包含的配置表**:
1. `SyncSessionTable` - 同步会话配置表
2. `SyncDataPacketTable` - 同步数据包配置表
3. `ConflictResolutionTable` - 冲突解决配置表
4. `SyncStateManagerTable` - 同步状态管理器配置表
5. `SyncPluginTable` - 同步插件配置表
6. `SyncSystemStatusTable` - 同步系统状态配置表
7. `SyncMetricsTable` - 同步指标配置表
8. `DeviceSyncStatusTable` - 设备同步状态配置表
9. `SyncHistoryTable` - 同步历史记录配置表
10. `GlobalSyncConfigTable` - 全局同步配置表
11. `SyncDataIndexesTable` - 同步数据索引配置表
12. `NetworkStatusTable` - 网络状态配置表

## 核心设计特点

### 1. 业务需求映射精准
- **跨设备数据同步**: 通过 `SyncSession` + `SyncDataPacket` 管理完整同步流程
- **数据冲突解决**: 通过 `ConflictResolution` 提供智能冲突检测和解决
- **离线数据合并**: 通过 `SyncType.MERGE_SYNC` + 合并算法处理离线数据

### 2. 配置数据映射完整
- **属性数据**: `PlayerSyncData.attributes` 直接映射 `stat_definitions.json`
- **角色数据**: `CharacterSyncData` 映射 `characters.json` 中的角色配置
- **经济数据**: `EconomicSyncData` 映射 `currency_player_configs.json`

### 3. 扩展性设计优秀
- **插件化架构**: `SyncPluginInterface` 支持自定义同步逻辑
- **数据分类**: `DataCategory` 枚举支持新数据类型扩展
- **自定义字段**: `customData` 字段提供无限扩展能力

### 4. 性能优化考虑
- **索引策略**: `SyncDataIndexes` 提供多维度数据索引
- **压缩支持**: `isCompressed` 标识和压缩阈值配置
- **批量处理**: `batchSize` 配置支持批量数据传输

### 5. 安全性保障
- **数据校验**: `checksum` 字段确保数据完整性
- **时间戳机制**: 防篡改时间戳验证
- **访问控制**: 严格的玩家数据隔离

### 6. 监控和调试
- **指标收集**: `SyncMetrics` 提供关键性能指标
- **错误统计**: `ErrorStatistics` 详细记录各类错误
- **历史追踪**: `SyncHistoryEntry` 保留完整同步历史

## 数据约束和验证

### 范围约束
- 同步进度: `progress` 限制在 0-100 范围
- 重试次数: `maxRetryCount` 限制在 0-10 范围
- 成功率: `successRate` 限制在 0.0-100.0 范围

### 引用约束
- 数据包必须关联有效的同步会话: `SyncDataPacket.sessionId`
- 冲突必须关联有效的同步会话: `ConflictResolution.sessionId`

### 业务规则约束
- 时间序列: `startedAt >= createdAt`, `completedAt >= startedAt`
- 数据包序号在同一会话内唯一
- 历史记录限制最多50条

## 命名规范遵循

### Bean 属性命名
- 使用小驼峰法: `sessionId`, `playerId`, `syncType`
- 避免下划线: `some_attribute` → `someAttribute`

### 枚举命名
- 使用大写下划线: `FULL_SYNC`, `VERSION_CONFLICT`
- 提供字符串别名: `alias="full_sync"`

### 文件组织
- 按功能模块分组: session, data, conflict-resolution, plugin
- 使用小写连字符: `sync-session.xml`, `conflict-resolution.xml`

## 逆向工程映射

### 配置数据关联
```xml
<!-- 属性数据映射标记 -->
<!-- field-ref: stat_definitions attributes mapping -->
<var name="attributes" type="map,string,AttributeValue" comment="属性数据映射"/>

<!-- 角色数据映射标记 -->
<!-- field-ref: characters.json character_levels -->
<var name="characterLevels" type="map,string,int" comment="角色等级映射"/>

<!-- 经济数据映射标记 -->
<!-- field-ref: currency_player_configs currencies mapping -->
<var name="currencies" type="map,string,CurrencyInfo" comment="货币余额映射"/>
```

### 接口映射标记
```xml
<!-- interface-ref: SyncSession -->
<bean name="SyncSession" comment="同步会话数据结构">

<!-- interface-ref: ConflictResolution -->
<bean name="ConflictResolution" comment="冲突解决数据结构">
```

---

**设计完成**: 为 Progress 系统的 Sync 模块提供了完整、精准、可扩展的 Luban 配置定义，完美映射了原始数据模型并支持未来扩展需求。