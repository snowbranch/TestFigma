# Luban 类型系统

## 概述

Luban 类型系统是配置框架的核心组件，提供了丰富的数据类型支持，确保配置数据的类型安全和跨语言兼容性。类型系统支持基础类型、复合类型、自定义类型和泛型，能够自动生成对应目标语言的类型定义。

类型定义通过 XML 文件描述，支持类型验证、约束检查和代码生成，是构建类型安全配置系统的基础。

## 基础类型

### 数值类型

```xml
<\!-- 整数类型 -->
<var name="health" type="int" comment="生命值"/>
<var name="bigNumber" type="long" comment="大整数"/>
<var name="smallNumber" type="short" comment="小整数"/>
<var name="tinyNumber" type="byte" comment="字节数值"/>

<\!-- 浮点类型 -->
<var name="speed" type="float" comment="移动速度"/>
<var name="precision" type="double" comment="高精度数值"/>
```

生成的 TypeScript 类型：
```typescript
interface Config {
    readonly health: number;        // int -> number
    readonly bigNumber: number;     // long -> number
    readonly smallNumber: number;   // short -> number  
    readonly tinyNumber: number;    // byte -> number
    readonly speed: number;         // float -> number
    readonly precision: number;     // double -> number
}
```

### 字符串和布尔类型

```xml
<\!-- 字符串类型 -->
<var name="name" type="string" comment="名称"/>
<var name="description" type="text" comment="详细描述"/>

<\!-- 布尔类型 -->
<var name="isActive" type="bool" comment="是否激活"/>
<var name="enabled" type="boolean" comment="是否启用"/>
```

生成的 TypeScript 类型：
```typescript
interface Config {
    readonly name: string;
    readonly description: string;
    readonly isActive: boolean;     // bool -> boolean
    readonly enabled: boolean;      // boolean -> boolean
}
```

## 复合类型

### 数组和列表

```xml
<\!-- 数组类型 -->
<var name="tags" type="list,string" comment="标签列表"/>
<var name="numbers" type="array,int" comment="数字数组"/>
<var name="items" type="list,item.ItemConfig" comment="物品配置列表"/>

<\!-- 多维数组 -->
<var name="matrix" type="list,list,float" comment="二维矩阵"/>
<var name="grid" type="array,array,int" comment="网格数据"/>
```

生成的 TypeScript 类型：
```typescript
interface Config {
    readonly tags: ReadonlyArray<string>;
    readonly numbers: ReadonlyArray<number>;
    readonly items: ReadonlyArray<ItemConfig>;
    readonly matrix: ReadonlyArray<ReadonlyArray<number>>;
    readonly grid: ReadonlyArray<ReadonlyArray<number>>;
}
```

### 映射和字典

```xml
<\!-- 键值对映射 -->
<var name="attributes" type="map,string,int" comment="属性映射"/>
<var name="localization" type="map,string,string" comment="本地化文本"/>
<var name="configs" type="map,string,item.ItemConfig" comment="配置映射"/>

<\!-- 复杂键类型 -->
<var name="complexMap" type="map,int,list,string" comment="复杂映射"/>
```

生成的 TypeScript 类型：
```typescript
interface Config {
    readonly attributes: ReadonlyMap<string, number>;
    readonly localization: ReadonlyMap<string, string>;
    readonly configs: ReadonlyMap<string, ItemConfig>;
    readonly complexMap: ReadonlyMap<number, ReadonlyArray<string>>;
}
```

### 集合类型

```xml
<\!-- 唯一值集合 -->
<var name="uniqueIds" type="set,string" comment="唯一ID集合"/>
<var name="itemTypes" type="set,item.ItemType" comment="物品类型集合"/>
```

生成的 TypeScript 类型：
```typescript
interface Config {
    readonly uniqueIds: ReadonlySet<string>;
    readonly itemTypes: ReadonlySet<ItemType>;
}
```

## 枚举类型

### 基础枚举

```xml
<\!-- 枚举定义 -->
<enum name="ItemType" comment="物品类型">
    <var name="Weapon" value="1" comment="武器"/>
    <var name="Armor" value="2" comment="防具"/>
    <var name="Consumable" value="3" comment="消耗品"/>
    <var name="Material" value="4" comment="材料"/>
    <var name="Quest" value="5" comment="任务物品"/>
</enum>

<\!-- 字符串枚举 -->
<enum name="Rarity" comment="稀有度">
    <var name="Common" value="common" comment="普通"/>
    <var name="Rare" value="rare" comment="稀有"/>
    <var name="Epic" value="epic" comment="史诗"/>
    <var name="Legendary" value="legendary" comment="传说"/>
</enum>
```

生成的 TypeScript 类型：
```typescript
// 数值枚举
export enum ItemType {
    Weapon = 1,
    Armor = 2,
    Consumable = 3,
    Material = 4,
    Quest = 5,
}

// 字符串枚举
export enum Rarity {
    Common = "common",
    Rare = "rare", 
    Epic = "epic",
    Legendary = "legendary",
}

// 使用枚举
interface ItemConfig {
    readonly itemType: ItemType;
    readonly rarity: Rarity;
}
```

### 标志枚举

```xml
<\!-- 标志位枚举 -->
<enum name="Permission" flags="true" comment="权限标志">
    <var name="Read" value="1" comment="读取"/>
    <var name="Write" value="2" comment="写入"/>
    <var name="Execute" value="4" comment="执行"/>
    <var name="Admin" value="8" comment="管理"/>
</enum>
```

生成的 TypeScript 类型：
```typescript
export enum Permission {
    Read = 1,
    Write = 2,
    Execute = 4,
    Admin = 8,
    
    // 组合权限
    ReadWrite = Read  < /dev/null |  Write,
    FullAccess = Read | Write | Execute | Admin,
}

// 位操作辅助函数
export namespace Permission {
    export function hasFlag(value: Permission, flag: Permission): boolean {
        return (value & flag) === flag;
    }
    
    export function addFlag(value: Permission, flag: Permission): Permission {
        return value | flag;
    }
    
    export function removeFlag(value: Permission, flag: Permission): Permission {
        return value & ~flag;
    }
}
```

## 自定义类型

### Bean 类型引用

```xml
<\!-- 引用其他 Bean -->
<var name="weapon" type="weapon.WeaponConfig" comment="武器配置"/>
<var name="stats" type="player.PlayerStats" comment="玩家属性"/>
<var name="rewards" type="list,reward.RewardItem" comment="奖励列表"/>
```

生成的 TypeScript 类型：
```typescript
interface Config {
    readonly weapon: WeaponConfig;
    readonly stats: PlayerStats;
    readonly rewards: ReadonlyArray<RewardItem>;
}
```

### 泛型类型

```xml
<\!-- 泛型 Bean 定义 -->
<bean name="Result" generic="T" comment="通用结果类型">
    <var name="success" type="bool" comment="是否成功"/>
    <var name="data" type="T" comment="数据"/>
    <var name="message" type="string" comment="消息"/>
</bean>

<\!-- 使用泛型 -->
<var name="itemResult" type="Result,item.ItemConfig" comment="物品查询结果"/>
<var name="playerResult" type="Result,player.PlayerData" comment="玩家数据结果"/>
```

生成的 TypeScript 类型：
```typescript
interface Result<T> {
    readonly success: boolean;
    readonly data: T;
    readonly message: string;
}

interface Config {
    readonly itemResult: Result<ItemConfig>;
    readonly playerResult: Result<PlayerData>;
}
```

## 可选类型和联合类型

### 可选字段

```xml
<\!-- 可选字段 -->
<var name="description" type="string?" comment="可选描述"/>
<var name="icon" type="string?" comment="可选图标"/>
<var name="metadata" type="map,string,string?" comment="可选元数据"/>
```

生成的 TypeScript 类型：
```typescript
interface Config {
    readonly description?: string;
    readonly icon?: string;
    readonly metadata?: ReadonlyMap<string, string>;
}
```

### 联合类型

```xml
<\!-- 联合类型定义 -->
<union name="ConfigValue" comment="配置值联合类型">
    <var name="StringValue" type="string"/>
    <var name="NumberValue" type="int"/>
    <var name="BoolValue" type="bool"/>
    <var name="ListValue" type="list,string"/>
</union>

<\!-- 使用联合类型 -->
<var name="setting" type="ConfigValue" comment="配置设置"/>
```

生成的 TypeScript 类型：
```typescript
type ConfigValue = 
    | { type: "StringValue"; value: string }
    | { type: "NumberValue"; value: number }
    | { type: "BoolValue"; value: boolean }
    | { type: "ListValue"; value: ReadonlyArray<string> };

interface Config {
    readonly setting: ConfigValue;
}

// 类型守卫函数
export function isStringValue(value: ConfigValue): value is Extract<ConfigValue, { type: "StringValue" }> {
    return value.type === "StringValue";
}

export function isNumberValue(value: ConfigValue): value is Extract<ConfigValue, { type: "NumberValue" }> {
    return value.type === "NumberValue";
}
```

## 类型约束和验证

### 数值约束

```xml
<\!-- 数值范围约束 -->
<var name="health" type="int" min="1" max="9999" comment="生命值(1-9999)"/>
<var name="percentage" type="float" min="0.0" max="1.0" comment="百分比(0-1)"/>
<var name="level" type="int" min="1" max="100" default="1" comment="等级"/>
```

### 字符串约束

```xml
<\!-- 字符串长度和格式约束 -->
<var name="name" type="string" maxLength="50" pattern="^[a-zA-Z0-9_]+$" comment="名称"/>
<var name="email" type="string" pattern="^[\w\.-]+@[\w\.-]+\.\w+$" comment="邮箱"/>
<var name="id" type="string" minLength="3" maxLength="20" comment="ID"/>
```

### 集合约束

```xml
<\!-- 集合大小约束 -->
<var name="tags" type="list,string" maxSize="10" comment="标签列表(最多10个)"/>
<var name="attributes" type="map,string,int" minSize="1" comment="属性映射(至少1个)"/>
```

生成的 TypeScript 类型和验证：
```typescript
interface Config {
    readonly health: number;        // 运行时验证: 1 <= health <= 9999
    readonly percentage: number;    // 运行时验证: 0.0 <= percentage <= 1.0
    readonly level: number;         // 默认值: 1, 验证: 1 <= level <= 100
    readonly name: string;          // 验证: 长度 <= 50, 匹配正则
    readonly email: string;         // 验证: 邮箱格式
    readonly tags: ReadonlyArray<string>; // 验证: 长度 <= 10
}

// 验证函数
export function validateConfig(config: Config): boolean {
    return (
        config.health >= 1 && config.health <= 9999 &&
        config.percentage >= 0.0 && config.percentage <= 1.0 &&
        config.level >= 1 && config.level <= 100 &&
        config.name.length <= 50 &&
        /^[a-zA-Z0-9_]+$/.test(config.name) &&
        /^[\w\.-]+@[\w\.-]+\.\w+$/.test(config.email) &&
        config.tags.length <= 10
    );
}
```

## 类型继承和多态

### Bean 继承

```xml
<\!-- 基础 Bean -->
<bean name="BaseEntity" comment="基础实体">
    <var name="id" type="string" comment="唯一ID"/>
    <var name="name" type="string" comment="名称"/>
    <var name="createTime" type="long" comment="创建时间"/>
</bean>

<\!-- 继承 Bean -->
<bean name="ItemEntity" parent="BaseEntity" comment="物品实体">
    <var name="itemType" type="item.ItemType" comment="物品类型"/>
    <var name="rarity" type="item.Rarity" comment="稀有度"/>
</bean>

<bean name="PlayerEntity" parent="BaseEntity" comment="玩家实体">
    <var name="level" type="int" comment="等级"/>
    <var name="experience" type="long" comment="经验值"/>
</bean>
```

生成的 TypeScript 类型：
```typescript
interface BaseEntity {
    readonly id: string;
    readonly name: string;
    readonly createTime: number;
}

interface ItemEntity extends BaseEntity {
    readonly itemType: ItemType;
    readonly rarity: Rarity;
}

interface PlayerEntity extends BaseEntity {
    readonly level: number;
    readonly experience: number;
}

// 类型守卫
export function isItemEntity(entity: BaseEntity): entity is ItemEntity {
    return 'itemType' in entity && 'rarity' in entity;
}

export function isPlayerEntity(entity: BaseEntity): entity is PlayerEntity {
    return 'level' in entity && 'experience' in entity;
}
```

### 抽象类型

```xml
<\!-- 抽象 Bean -->
<bean name="Configurable" abstract="true" comment="可配置接口">
    <var name="configId" type="string" comment="配置ID"/>
    <var name="version" type="int" comment="版本号"/>
</bean>

<\!-- 实现抽象 Bean -->
<bean name="WeaponConfig" extends="Configurable" comment="武器配置">
    <var name="damage" type="int" comment="攻击力"/>
    <var name="attackSpeed" type="float" comment="攻击速度"/>
</bean>
```

生成的 TypeScript 类型：
```typescript
// 抽象接口
interface Configurable {
    readonly configId: string;
    readonly version: number;
}

// 具体实现
interface WeaponConfig extends Configurable {
    readonly damage: number;
    readonly attackSpeed: number;
}
```

## 类型系统最佳实践

### 1. 类型命名规范

```xml
<\!-- ✅ 清晰的类型命名 -->
<enum name="ItemType" comment="物品类型"/>
<bean name="PlayerConfig" comment="玩家配置"/>
<bean name="WeaponStats" comment="武器属性"/>

<\!-- ❌ 模糊的类型命名 -->
<enum name="Type1" comment=""/>
<bean name="Data" comment=""/>
<bean name="Config" comment=""/>
```

### 2. 类型组织结构

```xml
<\!-- ✅ 按模块组织类型 -->
<\!-- item.xml -->
<module name="item">
    <enum name="ItemType"/>
    <enum name="Rarity"/>
    <bean name="ItemConfig"/>
    <bean name="ItemStats"/>
</module>

<\!-- player.xml -->
<module name="player">
    <enum name="PlayerClass"/>
    <bean name="PlayerConfig"/>
    <bean name="PlayerStats"/>
</module>
```

### 3. 类型复用

```xml
<\!-- ✅ 定义可复用的通用类型 -->
<bean name="Vector3" comment="三维向量">
    <var name="x" type="float" comment="X坐标"/>
    <var name="y" type="float" comment="Y坐标"/>
    <var name="z" type="float" comment="Z坐标"/>
</bean>

<bean name="Transform" comment="变换信息">
    <var name="position" type="Vector3" comment="位置"/>
    <var name="rotation" type="Vector3" comment="旋转"/>
    <var name="scale" type="Vector3" comment="缩放"/>
</bean>

<\!-- 在多个地方使用 -->
<bean name="SpawnPoint" comment="出生点">
    <var name="transform" type="Transform" comment="变换"/>
    <var name="isActive" type="bool" comment="是否激活"/>
</bean>

<bean name="EnemyConfig" comment="敌人配置">
    <var name="spawnTransform" type="Transform" comment="出生变换"/>
    <var name="patrolTransforms" type="list,Transform" comment="巡逻点"/>
</bean>
```

### 4. 版本兼容性

```xml
<\!-- 使用版本标记管理类型演进 -->
<bean name="ItemConfigV1" version="1.0" comment="物品配置 v1.0">
    <var name="id" type="string" comment="物品ID"/>
    <var name="name" type="string" comment="名称"/>
    <var name="value" type="int" comment="价值"/>
</bean>

<bean name="ItemConfigV2" version="2.0" extends="ItemConfigV1" comment="物品配置 v2.0">
    <var name="rarity" type="Rarity" comment="稀有度"/>
    <var name="tags" type="list,string" comment="标签"/>
</bean>

<\!-- 兼容性别名 -->
<alias name="ItemConfig" target="ItemConfigV2" comment="当前版本物品配置"/>
```

## 性能优化

### 1. 类型大小优化

```xml
<\!-- ✅ 使用合适的数值类型 -->
<var name="health" type="short" comment="生命值(0-32767)"/>
<var name="level" type="byte" comment="等级(1-255)"/>
<var name="experience" type="long" comment="经验值"/>

<\!-- ❌ 过度使用大类型 -->
<var name="health" type="long" comment="生命值"/>
<var name="level" type="long" comment="等级"/>
```

### 2. 内存布局优化

```xml
<\!-- ✅ 按字段大小排序 -->
<bean name="OptimizedBean" comment="优化的Bean">
    <\!-- 大字段在前 -->
    <var name="description" type="string" comment="描述"/>
    <var name="items" type="list,string" comment="列表"/>
    
    <\!-- 中等字段 -->
    <var name="value" type="int" comment="数值"/>
    <var name="count" type="int" comment="数量"/>
    
    <\!-- 小字段在后 -->
    <var name="type" type="byte" comment="类型"/>
    <var name="enabled" type="bool" comment="启用"/>
</bean>
```

### 3. 懒加载类型

```xml
<\!-- 大数据类型标记为懒加载 -->
<bean name="DetailedInfo" lazy="true" comment="详细信息">
    <var name="fullDescription" type="text" comment="完整描述"/>
    <var name="detailedStats" type="map,string,float" comment="详细统计"/>
    <var name="history" type="list,string" comment="历史记录"/>
</bean>
```

## 调试和工具

### 1. 类型检查

```bash
# 验证类型定义
pnpm run config:validate-types

# 检查类型兼容性
pnpm run config:check-compatibility

# 生成类型文档
pnpm run config:generate-docs
```

### 2. 类型转换工具

```bash
# 从旧版本迁移类型
pnpm run config:migrate-types --from=1.0 --to=2.0

# 生成类型转换器
pnpm run config:generate-converters
```

## 注意事项

1. **类型安全**: 充分利用类型系统进行编译时检查
2. **性能考虑**: 选择合适的类型大小，避免内存浪费
3. **兼容性**: 类型变更时考虑向后兼容性
4. **可读性**: 使用清晰的类型命名和文档
5. **模块化**: 按功能模块组织类型定义

## 相关文档

- [Luban Bean](062_luban_bean.md) - Bean 数据结构定义
- [Luban Table](063_luban-table.md) - 数据表定义
- [Luban 数据](065_luban-data.md) - 数据文件管理
- [配置管理系统](060_config.md) - 系统配置管理
