# 状态选择器（Selectors）

## 概述

状态选择器是用于从Store状态中提取特定数据的纯函数。选择器提供了类型安全、高性能的状态访问方式，是连接状态管理和业务逻辑的重要桥梁。

## 核心概念

### 什么是选择器

选择器是接收整个状态树并返回其中特定部分的函数：

```typescript
// 基础选择器模式
type Selector<TState, TResult> = (state: TState) => TResult;

// 示例：选择玩家等级
const selectPlayerLevel = (state: RootState): number => {
    return state.persistent.player.levelInfo.level;
};
```

### 选择器的优势

1. **类型安全** - 提供完整的TypeScript类型检查
2. **可复用性** - 避免重复的状态访问逻辑  
3. **可测试性** - 纯函数易于单元测试
4. **性能优化** - 支持记忆化和缓存
5. **关注分离** - 将状态结构与业务逻辑解耦

## 选择器设计模式

### 1. 基础选择器

最简单的选择器直接访问状态属性：

```typescript
// shared/store/player/selectors.ts

/** 状态约束接口 */
interface StateWithPersistent {
    persistent: {
        player: PlayerState;
    };
}

/**
 * 选择玩家ID
 * @param state 根状态
 */
export function selectPlayerId(state: StateWithPersistent): string {
    return state.persistent.player.playerId;
}

/**
 * 选择玩家显示名称
 * @param state 根状态  
 */
export function selectPlayerDisplayName(state: StateWithPersistent): string {
    return state.persistent.player.displayName;
}

/**
 * 选择玩家在线状态
 * @param state 根状态
 */
export function selectPlayerOnlineStatus(state: StateWithPersistent): boolean {
    return state.persistent.player.isOnline;
}
```

### 2. 参数化选择器

使用高阶函数创建接受参数的选择器：

```typescript
/**
 * 选择特定货币数量
 * @param currencyType 货币类型
 */
export function selectPlayerCurrency(currencyType: CurrencyType) {
    return (state: StateWithPersistent): number => {
        return state.persistent.player.currency[currencyType];
    };
}

/**
 * 选择玩家是否能支付指定费用
 * @param currencyType 货币类型
 * @param amount 数量
 */
export function selectCanAfford(currencyType: CurrencyType, amount: number) {
    return (state: StateWithPersistent): boolean => {
        return state.persistent.player.currency[currencyType] >= amount;
    };
}

/**
 * 选择玩家是否能支付多种货币费用
 * @param costs 费用映射
 */
export function selectCanAffordMultiple(costs: Partial<PlayerCurrency>) {
    return (state: StateWithPersistent): boolean => {
        const { currency } = state.persistent.player;
        for (const [currencyType, amount] of pairs(costs)) {
            if (amount && amount > 0 && currency[currencyType] < amount) {
                return false;
            }
        }
        return true;
    };
}
```

### 3. 计算选择器

基于现有状态计算派生数据：

```typescript
/**
 * 选择玩家升级进度
 * @param state 根状态
 */
export function selectPlayerLevelProgress(state: StateWithPersistent) {
    const { level, experience, experienceRequired } = state.persistent.player.levelInfo;
    return {
        level,
        experience,
        experienceRequired,
        progress: experienceRequired > 0 ? experience / experienceRequired : 0,
        isMaxLevel: experienceRequired === 0,
    };
}

/**
 * 选择玩家总战力
 * @param state 根状态
 */
export function selectPlayerTotalPower(state: StateWithPersistent): number {
    const { baseStats, combatStats } = state.persistent.player;
    
    // 计算基础战力
    const basePower = 
        baseStats.maxHealth * 0.1 +
        baseStats.attack * 1.0 +
        baseStats.defense * 0.8 +
        baseStats.moveSpeed * 0.3;
    
    // 计算战斗属性加成
    const combatBonus = 
        combatStats.critRate * 0.5 +
        combatStats.critDamage * 0.3 +
        combatStats.attackSpeed * 0.4;
    
    return math.floor(basePower + combatBonus);
}

/**
 * 选择玩家财富总值（以金币计算）
 * @param state 根状态
 */
export function selectPlayerTotalWealth(state: StateWithPersistent): number {
    const { currency } = state.persistent.player;
    
    // 假设汇率：1宝石=100金币，1水晶=1000金币
    return currency[CurrencyType.Gold] +
           currency[CurrencyType.Gem] * 100 +
           currency[CurrencyType.Crystal] * 1000;
}
```

### 4. 组合选择器

将多个选择器组合创建复杂的派生状态：

```typescript
/**
 * 选择玩家详细信息（组合多个基础选择器）
 * @param state 根状态
 */
export function selectPlayerDetail(state: StateWithPersistent) {
    return {
        id: selectPlayerId(state),
        displayName: selectPlayerDisplayName(state),
        isOnline: selectPlayerOnlineStatus(state),
        levelProgress: selectPlayerLevelProgress(state),
        totalPower: selectPlayerTotalPower(state),
        totalWealth: selectPlayerTotalWealth(state),
        currencies: {
            gold: selectPlayerCurrency(CurrencyType.Gold)(state),
            gem: selectPlayerCurrency(CurrencyType.Gem)(state),
            crystal: selectPlayerCurrency(CurrencyType.Crystal)(state),
        },
    };
}

/**
 * 选择玩家商店购买能力
 * @param state 根状态
 */
export function selectPlayerShopCapability(state: StateWithPersistent) {
    const currencies = state.persistent.player.currency;
    const level = state.persistent.player.levelInfo.level;
    
    return {
        canBuyBasicItems: currencies[CurrencyType.Gold] >= 100,
        canBuyPremiumItems: currencies[CurrencyType.Gem] >= 10,
        canBuyLegendaryItems: currencies[CurrencyType.Crystal] >= 1 && level >= 10,
        hasAnyPurchasingPower: Object.values(currencies).some(amount => amount > 0),
    };
}
```

## 高级选择器技巧

### 1. 记忆化选择器

对于计算开销大的选择器，使用记忆化避免重复计算：

```typescript
import { createSelector } from '@rbxts/reselect';

// 基础选择器
const selectPlayerBaseStats = (state: StateWithPersistent) => 
    state.persistent.player.baseStats;

const selectPlayerEquipment = (state: StateWithEquipment) => 
    state.equipment.equipped;

// 记忆化的最终属性计算
export const selectPlayerFinalStats = createSelector(
    [selectPlayerBaseStats, selectPlayerEquipment],
    (baseStats, equipment) => {
        // 复杂的属性计算逻辑
        let finalStats = { ...baseStats };
        
        equipment.forEach(item => {
            if (item.statBonus) {
                finalStats.attack += item.statBonus.attack || 0;
                finalStats.defense += item.statBonus.defense || 0;
                finalStats.maxHealth += item.statBonus.maxHealth || 0;
                // ... 其他属性计算
            }
        });
        
        return finalStats;
    }
);

// 记忆化的装备评分计算
export const selectEquipmentScore = createSelector(
    [selectPlayerEquipment],
    (equipment) => {
        return equipment.size() > 0 
            ? Array.from(equipment.values()).reduce((total, item) => total + item.score, 0)
            : 0;
    }
);
```

### 2. 条件选择器

根据状态条件动态选择数据：

```typescript
/**
 * 根据玩家等级选择可用功能
 * @param state 根状态
 */
export function selectAvailableFeatures(state: StateWithPersistent) {
    const level = state.persistent.player.levelInfo.level;
    
    return {
        canAccessShop: level >= 1,
        canAccessGuild: level >= 5,
        canAccessPvP: level >= 10,
        canAccessRankedMatch: level >= 15,
        canAccessEndgameContent: level >= 50,
        unlockedFeatures: [
            level >= 1 && 'shop',
            level >= 5 && 'guild', 
            level >= 10 && 'pvp',
            level >= 15 && 'ranked',
            level >= 50 && 'endgame',
        ].filter(Boolean) as string[],
    };
}

/**
 * 根据时间选择活动状态
 * @param state 根状态
 */
export function selectActiveEvents(state: StateWithEvents) {
    const currentTime = os.time();
    
    return state.events.list.filter(event => 
        event.startTime <= currentTime && 
        event.endTime >= currentTime &&
        event.isActive
    );
}
```

### 3. 工厂函数选择器

创建选择器的工厂函数：

```typescript
/**
 * 创建物品筛选选择器
 * @param filter 筛选条件
 */
export function createItemFilterSelector<T extends Item>(
    filter: (item: T) => boolean
) {
    return (state: StateWithInventory): T[] => {
        return Array.from(state.inventory.items.values())
            .filter(filter) as T[];
    };
}

// 使用工厂函数创建具体选择器
export const selectWeapons = createItemFilterSelector(
    (item): item is Weapon => item.type === ItemType.Weapon
);

export const selectConsumables = createItemFilterSelector(
    (item): item is Consumable => item.type === ItemType.Consumable
);

export const selectRareItems = createItemFilterSelector(
    (item) => item.rarity >= ItemRarity.Rare
);
```

## 在组件中使用选择器

### React组件中的使用

```typescript
import { useSelector } from '@rbxts/react-reflex';
import { 
    selectPlayerLevel, 
    selectPlayerCurrency,
    selectPlayerLevelProgress 
} from 'shared/store/player/selectors';

export function PlayerStatusPanel() {
    // 使用基础选择器
    const level = useSelector(selectPlayerLevel);
    const gold = useSelector(selectPlayerCurrency(CurrencyType.Gold));
    
    // 使用计算选择器
    const levelProgress = useSelector(selectPlayerLevelProgress);
    
    return (
        <frame>
            <textlabel Text={`等级: ${level}`} />
            <textlabel Text={`金币: ${gold}`} />
            <textlabel Text={`经验进度: ${math.floor(levelProgress.progress * 100)}%`} />
        </frame>
    );
}
```

### Service中的使用

```typescript
@Service()
export class ShopService {
    constructor(private store: RootStore) {}
    
    /**
     * 检查玩家是否能购买物品
     * @param playerId 玩家ID
     * @param itemId 物品ID
     */
    public canPlayerBuyItem(playerId: string, itemId: string): boolean {
        const state = this.store.getState();
        const itemConfig = selectItemConfig(itemId)(state);
        
        if (!itemConfig) return false;
        
        // 使用选择器检查购买能力
        return selectCanAffordMultiple(itemConfig.cost)(state);
    }
    
    /**
     * 获取玩家推荐商品
     * @param playerId 玩家ID
     */
    public getRecommendedItems(playerId: string): ItemConfig[] {
        const state = this.store.getState();
        const playerLevel = selectPlayerLevel(state);
        const capability = selectPlayerShopCapability(state);
        
        // 根据玩家能力筛选推荐商品
        return selectAvailableShopItems(state)
            .filter(item => 
                item.levelRequirement <= playerLevel &&
                selectCanAffordMultiple(item.cost)(state)
            );
    }
}
```

## 选择器测试

### 单元测试示例

```typescript
// __tests__/selectors.jack.ts
describe('PlayerSelectors', () => {
    const mockState: StateWithPersistent = {
        persistent: {
            player: {
                playerId: 'test-player',
                displayName: 'TestPlayer',
                isOnline: true,
                levelInfo: {
                    level: 5,
                    experience: 150,
                    experienceRequired: 300,
                    totalExperience: 650,
                },
                currency: {
                    [CurrencyType.Gold]: 1000,
                    [CurrencyType.Gem]: 50,
                    [CurrencyType.Crystal]: 5,
                },
                baseStats: {
                    maxHealth: 100,
                    attack: 25,
                    defense: 15,
                    moveSpeed: 10,
                    critRate: 0.1,
                    critDamage: 0.5,
                },
                // ... 其他必需属性
            },
        },
    };
    
    it('should select player level correctly', () => {
        const level = selectPlayerLevel(mockState);
        expect(level).toBe(5);
    });
    
    it('should calculate level progress correctly', () => {
        const progress = selectPlayerLevelProgress(mockState);
        expect(progress.progress).toBe(0.5); // 150/300
        expect(progress.isMaxLevel).toBe(false);
    });
    
    it('should check affordability correctly', () => {
        const canAffordGold = selectCanAfford(CurrencyType.Gold, 500)(mockState);
        const cannotAffordGold = selectCanAfford(CurrencyType.Gold, 2000)(mockState);
        
        expect(canAffordGold).toBe(true);
        expect(cannotAffordGold).toBe(false);
    });
    
    it('should calculate total power correctly', () => {
        const totalPower = selectPlayerTotalPower(mockState);
        expect(totalPower).toBeGreaterThan(0);
        expect(typeof totalPower).toBe('number');
    });
});
```

## 选择器最佳实践

### 1. 命名规范

```typescript
// ✅ 正确：使用select前缀
export function selectPlayerLevel(state: RootState): number { /* ... */ }
export function selectInventoryItems(state: RootState): Item[] { /* ... */ }

// ❌ 错误：不一致的命名
export function getPlayerLevel(state: RootState): number { /* ... */ }
export function playerLevel(state: RootState): number { /* ... */ }
```

### 2. 类型约束

```typescript
// ✅ 正确：使用严格的类型约束
interface StateWithPersistent {
    persistent: {
        player: PlayerState;
    };
}

export function selectPlayerLevel(state: StateWithPersistent): number {
    return state.persistent.player.levelInfo.level;
}

// ❌ 错误：使用any类型
export function selectPlayerLevel(state: any): number {
    return state.persistent.player.levelInfo.level;
}
```

### 3. 性能优化

```typescript
// ✅ 正确：对复杂计算使用记忆化
export const selectExpensiveCalculation = createSelector(
    [selectBaseData1, selectBaseData2],
    (data1, data2) => {
        // 复杂计算逻辑
        return heavyCalculation(data1, data2);
    }
);

// ✅ 正确：避免在选择器中创建新对象
export function selectPlayerCurrencies(state: StateWithPersistent) {
    return state.persistent.player.currency; // 直接返回引用
}

// ❌ 错误：每次都创建新对象
export function selectPlayerCurrencies(state: StateWithPersistent) {
    return { ...state.persistent.player.currency }; // 避免不必要的拷贝
}
```

### 4. 错误处理

```typescript
// ✅ 正确：处理可能的undefined情况
export function selectPlayerLevel(state: StateWithPersistent): number {
    return state.persistent?.player?.levelInfo?.level ?? 1;
}

// ✅ 正确：使用类型守卫
export function selectPlayerLevelSafe(state: RootState): number | undefined {
    if (hasPlayerData(state)) {
        return state.persistent.player.levelInfo.level;
    }
    return undefined;
}
```

## 常见问题

### Q: 何时使用记忆化选择器？

A: 当选择器需要进行复杂计算或处理大量数据时：
- 计算开销大的派生数据
- 需要遍历大型集合的操作
- 频繁调用的复杂选择器

### Q: 如何避免选择器循环依赖？

A: 
- 保持选择器的独立性
- 避免选择器之间的相互引用
- 将共同依赖提取为基础选择器

### Q: 参数化选择器的性能考虑？

A: 参数化选择器每次调用都会创建新函数，考虑：
- 对于频繁使用的参数组合，创建专门的选择器
- 使用记忆化缓存参数化选择器的结果
- 避免在render函数中直接调用参数化选择器

## 相关资源

- [状态管理系统概览](./070_state.md)
- [状态切片设计](./073_slice.md)
- [Store核心架构](./071_store.md)
- [类型系统详解](./072_type.md)

---

**选择器是状态管理的重要组成部分，良好的选择器设计能够提供类型安全、高性能的状态访问，并促进代码的可维护性和可测试性。**