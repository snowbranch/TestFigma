# Luban Table 数据表定义

## 概述

Table 是 Luban 配置系统中的数据表定义，用于指定如何组织和存储 Bean 数据。Table 定义了数据的加载方式、索引结构、存储模式等，是连接数据结构定义（Bean）和实际数据文件的桥梁。

Table 定义存储在 `configs/tables/` 目录下的 XML 文件中，每个 Table 对应一个或多个数据表。

## Table 语法

### 基本语法

```xml
<table name="TableName" 
       input="dataPath" 
       index="keyField" 
       value="BeanType" 
       mode="storageMode"
       comment="表描述">
</table>
```

### 属性详解

 < /dev/null |  属性 | 必需 | 描述 | 示例值 |
|------|------|------|--------|
| `name` | ✅ | 表名称，生成的类名 | `ItemConfigTable` |
| `input` | ✅ | 数据文件路径，相对于 datas 目录 | `../datas/item` |
| `index` | ✅ | 主键字段名 | `itemId` |
| `value` | ✅ | Bean 类型，格式为 `module.BeanName` | `item.ItemConfig` |
| `mode` | ✅ | 存储模式：`map`, `list`, `one` | `map` |
| `comment` | ❌ | 表注释，用于文档生成 | `物品配置表` |

## 存储模式

### 1. Map 模式 (mode="map")

最常用的模式，通过主键索引数据：

```xml
<\!-- 通过 itemId 索引的物品表 -->
<table name="ItemConfigTable" 
       input="../datas/item" 
       index="itemId" 
       value="item.ItemConfig" 
       mode="map"
       comment="物品配置表">
</table>
```

生成的 TypeScript 代码：
```typescript
export interface ItemConfigTable {
    readonly [key: string]: ItemConfig;
    get(key: string): ItemConfig | undefined;
    has(key: string): boolean;
    keys(): ReadonlyArray<string>;
    values(): ReadonlyArray<ItemConfig>;
}
```

### 2. List 模式 (mode="list")

数组形式存储，按顺序访问数据：

```xml
<\!-- 波次配置列表 -->
<table name="WaveConfigList" 
       input="../datas/wave" 
       index="waveId" 
       value="battle.WaveConfig" 
       mode="list"
       comment="波次配置列表">
</table>
```

生成的 TypeScript 代码：
```typescript
export interface WaveConfigList {
    readonly length: number;
    readonly [index: number]: WaveConfig;
    find(predicate: (item: WaveConfig) => boolean): WaveConfig | undefined;
    filter(predicate: (item: WaveConfig) => boolean): ReadonlyArray<WaveConfig>;
}
```

### 3. One 模式 (mode="one")

单例模式，表中只有一个配置对象：

```xml
<\!-- 全局游戏配置 -->
<table name="GameGlobalConfig" 
       input="../datas/global" 
       index="configId" 
       value="game.GlobalConfig" 
       mode="one"
       comment="全局游戏配置">
</table>
```

生成的 TypeScript 代码：
```typescript
export interface GameGlobalConfig extends GlobalConfig {
    // 直接继承 GlobalConfig 的所有属性
}
```

## 实际案例

### 基础配置表

```xml
<\!-- configs/tables/item.xml -->
<tables>
    <\!-- 物品基础配置表 -->
    <table name="ItemConfigTable" 
           input="../datas/item" 
           index="itemId" 
           value="item.ItemConfig" 
           mode="map"
           comment="物品基础配置表">
    </table>

    <\!-- 装备配置表 -->
    <table name="EquipmentConfigTable" 
           input="../datas/equipment" 
           index="id" 
           value="item.EquipmentConfig" 
           mode="map"
           comment="装备配置表">
    </table>

    <\!-- 消耗品配置表 -->
    <table name="ConsumableConfigTable" 
           input="../datas/consumable" 
           index="id" 
           value="item.ConsumableConfig" 
           mode="map"
           comment="消耗品配置表">
    </table>
</tables>
```

### 复杂业务表

```xml
<\!-- configs/tables/shop.xml -->
<tables>
    <\!-- 商店配置表 -->
    <table name="ShopConfigTable" 
           input="../datas/shop" 
           index="shopId" 
           value="shop.ShopConfig" 
           mode="map"
           comment="商店配置表">
    </table>

    <\!-- 商店物品表 -->
    <table name="ShopItemTable" 
           input="../datas/shop_items" 
           index="itemId" 
           value="shop.ShopItem" 
           mode="map"
           comment="商店物品表">
    </table>

    <\!-- 商店分类表 -->
    <table name="ShopCategoryTable" 
           input="../datas/shop_category" 
           index="categoryId" 
           value="shop.ShopCategory" 
           mode="map"
           comment="商店分类表">
    </table>

    <\!-- 特殊优惠表 -->
    <table name="SpecialOfferTable" 
           input="../datas/special_offer" 
           index="offerId" 
           value="shop.SpecialOffer" 
           mode="list"
           comment="特殊优惠表">
    </table>
</tables>
```

### 游戏平衡表

```xml
<\!-- configs/tables/balance.xml -->
<tables>
    <\!-- 玩家等级表 -->
    <table name="PlayerLevelTable" 
           input="../datas/player_level" 
           index="level" 
           value="player.PlayerLevelConfig" 
           mode="map"
           comment="玩家等级配置表">
    </table>

    <\!-- 敌人配置表 -->
    <table name="EnemyConfigTable" 
           input="../datas/enemy" 
           index="enemyId" 
           value="enemy.EnemyConfig" 
           mode="map"
           comment="敌人配置表">
    </table>

    <\!-- 武器配置表 -->
    <table name="WeaponConfigTable" 
           input="../datas/weapon" 
           index="weaponId" 
           value="weapon.WeaponConfig" 
           mode="map"
           comment="武器配置表">
    </table>
</tables>
```

## 高级特性

### 1. 多索引支持

```xml
<\!-- 支持多种查询方式的表 -->
<table name="ItemByTypeTable" 
       input="../datas/item" 
       index="itemType,rarity" 
       value="item.ItemConfig" 
       mode="map"
       comment="按类型和稀有度索引的物品表">
</table>
```

### 2. 条件筛选

```xml
<\!-- 只加载特定条件的数据 -->
<table name="RareItemTable" 
       input="../datas/item" 
       index="itemId" 
       value="item.ItemConfig" 
       mode="map"
       filter="rarity >= 3"
       comment="稀有物品表">
</table>
```

### 3. 数据转换

```xml
<\!-- 数据加载时进行转换 -->
<table name="NormalizedPriceTable" 
       input="../datas/shop_items" 
       index="itemId" 
       value="shop.ShopItem" 
       mode="map"
       transform="normalizePrice"
       comment="标准化价格的商店物品表">
</table>
```

## 生成的 TypeScript 代码

Table 定义会自动生成对应的 TypeScript 接口和访问方法：

```typescript
// 生成的表接口 src/types/luban/item/itemConfigTable.ts
export interface ItemConfigTable {
    // Map 模式的标准接口
    readonly [key: string]: ItemConfig;
    
    // 访问方法
    get(key: string): ItemConfig | undefined;
    has(key: string): boolean;
    keys(): ReadonlyArray<string>;
    values(): ReadonlyArray<ItemConfig>;
    entries(): ReadonlyArray<[string, ItemConfig]>;
    
    // 高级查询方法（如果支持）
    findByType(itemType: ItemType): ReadonlyArray<ItemConfig>;
    findByRarity(rarity: ItemRarity): ReadonlyArray<ItemConfig>;
}

// 使用示例
const itemTable: ItemConfigTable = getAllItemConfigs();
const sword = itemTable.get("weapon_sword");
const allWeapons = itemTable.findByType(ItemType.Weapon);
```

## Table 设计原则

### 1. 合理分表

```xml
<\!-- ✅ 按业务领域分表 -->
<tables>
    <\!-- 玩家相关 -->
    <table name="PlayerConfigTable" input="../datas/player" ... />
    <table name="PlayerLevelTable" input="../datas/player_level" ... />
    
    <\!-- 物品相关 -->
    <table name="ItemConfigTable" input="../datas/item" ... />
    <table name="EquipmentTable" input="../datas/equipment" ... />
    
    <\!-- 商店相关 -->
    <table name="ShopConfigTable" input="../datas/shop" ... />
    <table name="ShopItemTable" input="../datas/shop_items" ... />
</tables>

<\!-- ❌ 单一巨大表 -->
<table name="EverythingTable" input="../datas/everything" ... />
```

### 2. 选择合适的存储模式

```xml
<\!-- ✅ 需要随机访问时使用 map -->
<table name="ItemConfigTable" mode="map" index="itemId" ... />

<\!-- ✅ 需要顺序访问时使用 list -->
<table name="TutorialStepList" mode="list" index="stepId" ... />

<\!-- ✅ 全局单例配置使用 one -->
<table name="GameSettings" mode="one" index="configId" ... />
```

### 3. 优化索引设计

```xml
<\!-- ✅ 使用业务主键作为索引 -->
<table name="ItemConfigTable" index="itemId" ... />
<table name="PlayerLevelTable" index="level" ... />

<\!-- ✅ 复合索引用于复杂查询 -->
<table name="ItemByTypeTable" index="itemType,subType" ... />

<\!-- ❌ 使用无意义的自增ID -->
<table name="ItemConfigTable" index="autoId" ... />
```

## 性能优化

### 1. 数据分片

```xml
<\!-- 大表分片加载 -->
<table name="ItemConfigTableCommon" 
       input="../datas/item" 
       index="itemId" 
       value="item.ItemConfig" 
       mode="map"
       filter="rarity <= 2"
       comment="普通物品表">
</table>

<table name="ItemConfigTableRare" 
       input="../datas/item" 
       index="itemId" 
       value="item.ItemConfig" 
       mode="map"
       filter="rarity > 2"
       comment="稀有物品表">
</table>
```

### 2. 延迟加载

```xml
<\!-- 标记为延迟加载的表 -->
<table name="DetailedDescriptionTable" 
       input="../datas/descriptions" 
       index="itemId" 
       value="text.DetailedDescription" 
       mode="map"
       lazy="true"
       comment="详细描述表（延迟加载）">
</table>
```

### 3. 内存优化

```xml
<\!-- 使用引用而非复制 -->
<table name="ItemStatsTable" 
       input="../datas/item_stats" 
       index="itemId" 
       value="stats.ItemStats" 
       mode="map"
       reference="true"
       comment="物品属性表（引用模式）">
</table>
```

## 数据验证

### 1. 约束定义

```xml
<\!-- 在表级别定义数据约束 -->
<table name="ItemConfigTable" 
       input="../datas/item" 
       index="itemId" 
       value="item.ItemConfig" 
       mode="map"
       comment="物品配置表">
    <\!-- 数据验证规则 -->
    <validate>
        <rule field="baseValue" min="0" max="999999"/>
        <rule field="maxStackSize" min="1" max="9999"/>
        <rule field="itemId" pattern="^[a-z_]+$"/>
    </validate>
</table>
```

### 2. 引用完整性

```xml
<\!-- 外键约束 -->
<table name="ShopItemTable" 
       input="../datas/shop_items" 
       index="itemId" 
       value="shop.ShopItem" 
       mode="map"
       comment="商店物品表">
    <foreignkey field="itemId" reftable="ItemConfigTable"/>
    <foreignkey field="categoryId" reftable="ShopCategoryTable"/>
</table>
```

## 最佳实践

### 1. 表命名规范

```xml
<\!-- ✅ 清晰的表命名 -->
<table name="ItemConfigTable" ... />        <\!-- 配置表 -->
<table name="PlayerStatsList" ... />        <\!-- 列表数据 -->
<table name="GameGlobalConfig" ... />       <\!-- 单例配置 -->

<\!-- ❌ 模糊的表命名 -->
<table name="Items" ... />                  <\!-- 不明确用途 -->
<table name="Data1" ... />                  <\!-- 无意义命名 -->
```

### 2. 数据路径组织

```xml
<\!-- ✅ 清晰的目录结构 -->
<table name="WeaponConfigTable" input="../datas/equipment/weapon" ... />
<table name="ArmorConfigTable" input="../datas/equipment/armor" ... />
<table name="ShopItemTable" input="../datas/shop/items" ... />

<\!-- ❌ 混乱的目录结构 -->
<table name="WeaponConfigTable" input="../datas/weapon_stuff" ... />
<table name="ArmorConfigTable" input="../datas/armor_things" ... />
```

### 3. 文档和注释

```xml
<\!-- ✅ 完整的文档 -->
<table name="ItemConfigTable" 
       input="../datas/item" 
       index="itemId" 
       value="item.ItemConfig" 
       mode="map"
       comment="物品基础配置表，包含所有游戏物品的基本属性定义">
</table>

<\!-- ❌ 缺少文档 -->
<table name="ItemConfigTable" 
       input="../datas/item" 
       index="itemId" 
       value="item.ItemConfig" 
       mode="map">
</table>
```

## 调试和验证

### 1. 表结构验证

```bash
# 验证表定义语法
pnpm run config:validate

# 生成表结构报告
pnpm run config:report
```

### 2. 数据完整性检查

```bash
# 检查数据与表定义的一致性
pnpm run config:check

# 验证外键引用
pnpm run config:validate-refs
```

### 3. 性能分析

```bash
# 分析表加载性能
pnpm run config:profile

# 生成内存使用报告
pnpm run config:memory-report
```

## 注意事项

1. **索引选择**: 选择合适的字段作为主键，确保唯一性和查询效率
2. **模式匹配**: 根据数据访问模式选择正确的存储模式
3. **数据一致性**: 确保表定义与实际数据文件结构一致
4. **性能考量**: 大表考虑分片或延迟加载策略
5. **向前兼容**: 表结构变更时考虑现有数据的兼容性

## 相关文档

- [Luban Bean](062_luban_bean.md) - Bean 数据结构定义
- [Luban 类型](064_luban-type.md) - 类型系统详解
- [Luban 数据](065_luban-data.md) - 数据文件管理
- [配置管理系统](060_config.md) - 系统配置管理
