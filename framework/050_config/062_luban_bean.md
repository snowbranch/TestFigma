# Luban Bean 数据结构定义

## 概述

Bean 是 Luban 配置系统中的核心概念，用于定义结构化数据类型。Bean 类似于 TypeScript 的 interface 或其他语言的结构体，提供了类型安全、跨语言和可扩展的数据定义能力。

Bean 定义通过 XML 文件描述，存储在 `configs/defines/` 目录下，可以自动生成目标语言的类型文件（如 TypeScript、C#、Java 等）。

## Bean 语法

### 基本语法

```xml
<bean name="BeanName" comment="Bean描述">
    <var name="fieldName" type="fieldType" comment="字段描述"/>
    <!-- 更多字段... -->
</bean>
```

### 字段属性

| 属性 | 必需 | 描述 |
|------|------|------|
| `name` | ✅ | 字段名称，必须符合变量命名规范 |
| `type` | ✅ | 字段类型，支持基础类型和复合类型 |
| `comment` | ❌ | 字段注释，用于文档生成 |

## 支持的数据类型

### 基础类型

```xml
<!-- 数值类型 -->
<var name="intValue" type="int" comment="整数"/>
<var name="floatValue" type="float" comment="浮点数"/>
<var name="doubleValue" type="double" comment="双精度浮点数"/>

<!-- 字符串类型 -->
<var name="stringValue" type="string" comment="字符串"/>

<!-- 布尔类型 -->
<var name="boolValue" type="bool" comment="布尔值"/>
```

### 集合类型

```xml
<!-- 数组/列表 -->
<var name="stringList" type="list,string" comment="字符串列表"/>
<var name="intArray" type="array,int" comment="整数数组"/>

<!-- 映射/字典 -->
<var name="stringMap" type="map,string,int" comment="字符串到整数的映射"/>
```

### 枚举类型

```xml
<!-- 引用已定义的枚举 -->
<var name="itemType" type="ItemType" comment="物品类型"/>
<var name="rarity" type="ItemRarity" comment="稀有度"/>
```

### Bean 引用

```xml
<!-- 引用其他Bean -->
<var name="stats" type="WeaponStats" comment="武器属性"/>
<var name="effects" type="list,WeaponEffect" comment="特殊效果列表"/>
```

## 实际案例

### 物品配置 Bean

```xml
<!-- configs/defines/item.xml -->
<bean name="ItemConfig" comment="物品基础配置">
    <var name="itemId" type="string" comment="物品ID"/>
    <var name="name" type="string" comment="物品名称"/>
    <var name="description" type="string" comment="物品描述"/>
    <var name="itemType" type="ItemType" comment="物品类型"/>
    <var name="rarity" type="ItemRarity" comment="物品稀有度"/>
    <var name="iconPath" type="string" comment="图标路径"/>
    <var name="maxStackSize" type="int" comment="最大堆叠数量"/>
    <var name="baseValue" type="int" comment="基础价值"/>
    <var name="tradeable" type="bool" comment="是否可交易"/>
    <var name="tags" type="list,string" comment="标签列表"/>
    <var name="requirements" type="list,ItemRequirement" comment="使用需求"/>
</bean>
```

### 武器配置 Bean

```xml
<!-- configs/defines/weapon.xml -->
<bean name="WeaponConfig" comment="武器配置">
    <var name="weaponId" type="string" comment="武器ID"/>
    <var name="name" type="string" comment="武器名称"/>
    <var name="description" type="string" comment="武器描述"/>
    <var name="tier" type="WeaponTier" comment="武器层级"/>
    <var name="weaponType" type="WeaponType" comment="武器类型"/>
    <var name="tags" type="list,WeaponTag" comment="武器标签列表"/>
    <var name="baseStats" type="WeaponStats" comment="基础属性"/>
    <var name="specialEffects" type="list,WeaponEffect" comment="特殊效果列表"/>
    <var name="baseValue" type="int" comment="基础价值"/>
    <var name="unlockLevel" type="int" comment="解锁等级"/>
</bean>
```

### 嵌套 Bean 结构

```xml
<!-- 武器属性 Bean -->
<bean name="WeaponStats" comment="武器基础属性">
    <var name="baseDamage" type="int" comment="基础攻击力"/>
    <var name="attackSpeed" type="float" comment="攻击速度"/>
    <var name="range" type="int" comment="射程"/>
    <var name="critChance" type="float" comment="暴击率(%)"/>
    <var name="critMultiplier" type="float" comment="暴击伤害倍率"/>
    <var name="projectileCount" type="int" comment="投射物数量"/>
</bean>

<!-- 武器效果 Bean -->
<bean name="WeaponEffect" comment="武器特殊效果">
    <var name="effectId" type="string" comment="效果ID"/>
    <var name="description" type="string" comment="效果描述"/>
    <var name="value" type="float" comment="效果数值"/>
    <var name="isHidden" type="bool" comment="是否隐藏属性"/>
</bean>
```

## 生成的 TypeScript 代码

Bean 定义会自动生成对应的 TypeScript 类型：

```typescript
// 生成的类型文件 src/types/luban/item/itemConfig.ts
export interface ItemConfig {
    readonly itemId: string;
    readonly name: string;
    readonly description: string;
    readonly itemType: ItemType;
    readonly rarity: ItemRarity; 
    readonly iconPath: string;
    readonly maxStackSize: number;
    readonly baseValue: number;
    readonly tradeable: boolean;
    readonly tags: ReadonlyArray<string>;
    readonly requirements: ReadonlyArray<ItemRequirement>;
}

// 武器配置类型
export interface WeaponConfig {
    readonly weaponId: string;
    readonly name: string;
    readonly description: string;
    readonly tier: WeaponTier;
    readonly weaponType: WeaponType;
    readonly tags: ReadonlyArray<WeaponTag>;
    readonly baseStats: WeaponStats;
    readonly specialEffects: ReadonlyArray<WeaponEffect>;
    readonly baseValue: number;
    readonly unlockLevel: number;
}
```

## Bean 设计原则

### 1. 单一职责原则

每个 Bean 应该只负责一个明确的数据领域：

```xml
<!-- ✅ 职责明确的Bean -->
<bean name="PlayerStats" comment="玩家属性">
    <var name="health" type="int" comment="生命值"/>
    <var name="mana" type="int" comment="法力值"/>
    <var name="speed" type="float" comment="移动速度"/>
</bean>

<bean name="PlayerProfile" comment="玩家档案">
    <var name="playerId" type="string" comment="玩家ID"/>
    <var name="displayName" type="string" comment="显示名称"/>
    <var name="createTime" type="long" comment="创建时间"/>
</bean>

<!-- ❌ 职责混乱的Bean -->
<bean name="PlayerEverything" comment="玩家所有数据">
    <var name="health" type="int" comment="生命值"/>
    <var name="displayName" type="string" comment="显示名称"/>
    <var name="inventory" type="list,string" comment="背包物品"/>
    <var name="achievementIds" type="list,string" comment="成就列表"/>
</bean>
```

### 2. 开放封闭原则

Bean 设计应该对扩展开放，对修改封闭：

```xml
<!-- ✅ 易于扩展的设计 -->
<bean name="BaseItemConfig" comment="物品基础配置">
    <var name="itemId" type="string" comment="物品ID"/>
    <var name="name" type="string" comment="物品名称"/>
    <var name="type" type="ItemType" comment="物品类型"/>
    <var name="attributes" type="map,string,float" comment="扩展属性"/>
    <var name="metadata" type="string" comment="元数据JSON"/>
</bean>

<!-- 扩展特化Bean -->
<bean name="WeaponConfig" comment="武器配置" parent="BaseItemConfig">
    <var name="weaponType" type="WeaponType" comment="武器类型"/>
    <var name="baseDamage" type="int" comment="基础伤害"/>
</bean>
```

### 3. 命名约定

建立一致的命名标准以提高可读性：

```xml
<!-- ✅ 规范的命名 -->
<bean name="PlayerBaseConfig" comment="玩家基础配置">
    <var name="playerId" type="string" comment="玩家ID"/>
    <var name="maxHealth" type="int" comment="最大生命值"/>
    <var name="baseSpeed" type="float" comment="基础速度"/>
    <var name="isVip" type="bool" comment="是否VIP用户"/>
    <var name="createdAt" type="long" comment="创建时间戳"/>
</bean>

<!-- ❌ 不规范的命名 -->
<bean name="player_config" comment="">
    <var name="ID" type="string" comment=""/>
    <var name="hp_max" type="int" comment=""/>
    <var name="spd" type="float" comment=""/>
    <var name="vip" type="bool" comment=""/>
    <var name="time" type="long" comment=""/>
</bean>
```

## Bean 设计最佳实践

### 数据组织

1. **逻辑分组**: 相关字段放在一起
2. **层次结构**: 使用嵌套 Bean 管理复杂数据
3. **类型安全**: 优先使用枚举而非字符串

```xml
<!-- ✅ 良好的数据组织 -->
<bean name="EnemyConfig" comment="敌人配置">
    <!-- 基本信息 -->
    <var name="enemyId" type="string" comment="敌人ID"/>
    <var name="name" type="string" comment="敌人名称"/>
    <var name="description" type="string" comment="敌人描述"/>
    
    <!-- 属性配置 -->
    <var name="baseStats" type="EnemyStats" comment="基础属性"/>
    <var name="behavior" type="EnemyBehavior" comment="AI行为"/>
    
    <!-- 掉落配置 -->
    <var name="drops" type="list,DropItem" comment="掉落物品"/>
    <var name="rewards" type="list,RewardItem" comment="击败奖励"/>
</bean>
```

### 扩展性设计

1. **预留字段**: 为未来扩展预留空间
2. **版本兼容**: 考虑配置升级路径
3. **可选字段**: 合理设计默认值

```xml
<bean name="ShopItemConfig" comment="商店物品配置">
    <var name="itemId" type="string" comment="物品ID"/>
    <var name="price" type="int" comment="价格"/>
    <var name="currency" type="CurrencyType" comment="货币类型"/>
    
    <!-- 扩展字段 -->
    <var name="discountRate" type="float" comment="折扣率（0-1），0表示无折扣"/>
    <var name="availableTime" type="string" comment="可购买时间段，空字符串表示无限制"/>
    <var name="maxPurchases" type="int" comment="最大购买次数，-1表示无限制"/>
</bean>
```

## 验证和调试

### 配置验证

在 Bean 定义中可以添加验证规则：

```xml
<bean name="PlayerLevelConfig" comment="玩家等级配置">
    <var name="level" type="int" comment="等级（1-100）"/>
    <var name="expRequired" type="int" comment="升级所需经验"/>
    <var name="healthBonus" type="int" comment="生命值加成"/>
    <var name="damageBonus" type="float" comment="伤害加成（百分比）"/>
</bean>
```

### 常见错误

1. **类型不匹配**: 确保数据类型与 Bean 定义一致
2. **循环依赖**: 避免 Bean 之间的循环引用
3. **命名冲突**: 确保 Bean 和字段名称唯一

## 相关工具

### 生成命令

```bash
# 生成 TypeScript 类型定义
pnpm run config:codebuild

# 生成并监听变化
pnpm run config:watch
```

### 模板自定义

Bean 的 TypeScript 代码生成由 `configs/luban_templates/roblox-ts-json/bean.sbn` 模板控制，可以根据需要自定义生成格式。

## 相关文档

- [Luban Table](063_luban-table.md) - 数据表定义
- [Luban 类型](064_luban-type.md) - 类型系统详解
- [Luban 数据](065_luban-data.md) - 数据文件管理

## 注意事项

1. **类型一致性**: Bean 定义必须与实际数据文件保持一致
2. **性能考虑**: 避免过度嵌套的复杂结构
3. **向后兼容**: 修改 Bean 定义时考虑现有数据的兼容性
4. **文档维护**: 及时更新 Bean 注释，保持文档的准确性