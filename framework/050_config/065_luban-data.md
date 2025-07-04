# Luban 数据文件管理

## 概述

数据文件是 Luban 配置系统的数据载体，存储实际的游戏配置内容。数据文件支持多种格式（JSON、Excel、CSV等），通过统一的数据管理流程，确保配置数据的一致性、可维护性和版本控制。

数据文件存储在 `configs/datas/` 目录下，按功能模块组织，与 Bean 定义和 Table 配置相对应。

## 数据文件格式

### JSON 格式

JSON 是主要的数据存储格式，具有良好的可读性和版本控制支持：

```json
// configs/datas/item/weapon_assault_rifle.json
{
    "itemId": "weapon_assault_rifle",
    "name": "突击步枪",
    "description": "标准军用突击步枪，射程适中，伤害稳定",
    "itemType": "Equipment",
    "rarity": "Uncommon",
    "iconPath": "rbxasset://textures/weapons/assault_rifle.png",
    "modelPath": "rbxasset://models/weapons/assault_rifle.rbxm",
    "maxStackSize": 1,
    "baseValue": 1500,
    "tradeable": true,
    "destroyable": true,
    "unique": false,
    "tags": ["weapon", "ranged", "military"],
    "itemLevel": 5,
    "requirements": [
        {
            "type": "level",
            "value": "5",
            "description": "需要等级5"
        }
    ],
    "attributes": {
        "damage": 45,
        "attackSpeed": 2.5,
        "range": 100,
        "critChance": 0.05,
        "critMultiplier": 2.0
    }
}
```

### Excel 格式

适合批量编辑和非技术人员维护：

```excel
// configs/datas/player_level/player_levels.xlsx

 < /dev/null |  level | expRequired | healthBonus | damageBonus | skillPoints |
|-------|-------------|-------------|-------------|-------------|
| 1     | 0           | 100         | 1.0         | 0           |
| 2     | 100         | 110         | 1.05        | 1           |
| 3     | 250         | 120         | 1.10        | 2           |
| 4     | 450         | 130         | 1.15        | 3           |
| 5     | 700         | 140         | 1.20        | 4           |
```

### CSV 格式

适合大量数据的批量导入：

```csv
// configs/datas/material/materials.csv
materialId,name,description,type,rarity,baseValue,maxStack
mat_scrap_metal,废铁,基础合成材料,Material,Common,10,999
mat_energy_core,能量核心,高级合成材料,Material,Rare,100,99
mat_crystal_shard,水晶碎片,稀有合成材料,Material,Epic,500,50
mat_ancient_core,远古核心,传说级合成材料,Material,Legendary,2000,10
```

## 目录组织结构

### 按功能模块组织

```markdown
configs/datas/
├── achievement/              # 成就数据
│   ├── ach_first_kill.json
│   ├── ach_level_10.json
│   └── ach_material_collector.json
├── enemy/                    # 敌人数据
│   ├── enemy_zombie_basic.json
│   ├── enemy_zombie_fast.json
│   └── enemy_mutant_boss.json
├── equipment/                # 装备数据
│   ├── weapon_combat_knife.json
│   ├── armor_kevlar_vest.json
│   └── accessory_power_ring.json
├── item/                     # 物品数据
│   ├── item_health_potion_small.json
│   ├── item_energy_potion.json
│   └── item_teleport_scroll.json
├── material/                 # 材料数据
│   ├── mat_scrap_metal.json
│   ├── mat_energy_core.json
│   └── mat_crystal_shard.json
├── player_level/             # 玩家等级数据
│   ├── 1.json
│   ├── 2.json
│   └── 10.json
├── shop/                     # 商店数据
│   ├── main_shop.json
│   └── black_market.json
├── shop_category/            # 商店分类数据
│   ├── weapons.json
│   ├── materials.json
│   └── special.json
└── shop_items/               # 商店物品数据
    ├── shop_weapon_short_knife.json
    ├── shop_mat_scrap_metal.json
    └── shop_bundle_starter.json
```

### 按数据类型组织

```markdown
configs/datas/
├── static/                   # 静态配置数据
│   ├── game_settings.json
│   ├── ui_config.json
│   └── balance_config.json
├── entities/                 # 实体配置数据
│   ├── players/
│   ├── enemies/
│   └── npcs/
├── items/                    # 物品系统数据
│   ├── weapons/
│   ├── armor/
│   ├── consumables/
│   └── materials/
├── economy/                  # 经济系统数据
│   ├── shops/
│   ├── currencies/
│   └── pricing/
└── content/                  # 内容数据
    ├── levels/
    ├── quests/
    └── achievements/
```

## 数据文件规范

### 1. 命名规范

```bash
# ✅ 规范的文件命名
weapon_assault_rifle.json      # 武器类型_具体名称
armor_kevlar_vest.json         # 防具类型_具体名称
item_health_potion_small.json  # 物品类型_具体名称_变体
enemy_zombie_basic.json        # 敌人类型_具体名称_变体

# ❌ 不规范的命名
AssaultRifle.json             # 使用了PascalCase
weapon1.json                  # 使用了数字编号
health potion.json            # 包含空格
weapon-rifle.json             # 使用了连字符
```

### 2. 数据结构规范

```json
// ✅ 标准的数据结构
{
    // 必需字段在前
    "itemId": "weapon_assault_rifle",
    "name": "突击步枪",
    "description": "标准军用突击步枪",
    
    // 枚举类型使用字符串
    "itemType": "Equipment",
    "rarity": "Uncommon",
    
    // 数值类型明确
    "baseValue": 1500,
    "maxStackSize": 1,
    "itemLevel": 5,
    
    // 布尔类型明确
    "tradeable": true,
    "destroyable": true,
    "unique": false,
    
    // 数组和对象结构清晰
    "tags": ["weapon", "ranged", "military"],
    "requirements": [
        {
            "type": "level",
            "value": "5",
            "description": "需要等级5"
        }
    ],
    
    // 复杂对象合理组织
    "attributes": {
        "damage": 45,
        "attackSpeed": 2.5,
        "range": 100
    }
}
```

### 3. 数据验证规范

```json
// ✅ 包含数据验证的示例
{
    "itemId": "weapon_assault_rifle",  // 必须唯一
    "name": "突击步枪",                // 非空字符串，最大50字符
    "baseValue": 1500,                // 正整数，范围1-999999
    "maxStackSize": 1,                // 正整数，范围1-9999
    "itemLevel": 5,                   // 正整数，范围1-100
    "tags": ["weapon", "ranged"],     // 数组长度不超过10
    
    // 引用完整性检查
    "requiredItemId": "mat_scrap_metal", // 必须在ItemConfigTable中存在
    
    // 条件依赖检查
    "specialEffect": {
        "type": "damage_boost",
        "value": 1.2,
        "condition": "health < 50%"    // 条件表达式验证
    }
}
```

## 数据文件管理流程

### 1. 数据创建流程

```bash
# 1. 确定数据类型和存储位置
mkdir -p configs/datas/weapon

# 2. 创建数据文件
cat > configs/datas/weapon/plasma_rifle.json << 'EOF'
{
    "weaponId": "weapon_plasma_rifle",
    "name": "等离子步枪",
    "description": "高科技能量武器，能发射等离子弹",
    "weaponType": "Ranged",
    "tier": "Epic",
    "baseStats": {
        "baseDamage": 75,
        "attackSpeed": 1.8,
        "range": 120,
        "critChance": 0.08,
        "critMultiplier": 2.5
    },
    "specialEffects": [
        {
            "effectId": "energy_burn",
            "description": "造成持续能量伤害",
            "value": 10,
            "isHidden": false
        }
    ],
    "baseValue": 5000,
    "unlockLevel": 25
}
