# 数据迁移策略 (Data Migration Strategy)

## 概述

数据迁移是持久化系统中的关键组件，负责在游戏版本升级、数据结构变更或业务逻辑调整时，安全地转换现有玩家数据。本文档详细介绍了如何设计和实现一个可靠的数据迁移系统，确保玩家数据的完整性和一致性。

## 迁移场景分类

### 1. 结构性迁移 (Structural Migration)

#### 字段变更 (Field Changes)
- **字段重命名**：将 `playerExp` 重命名为 `experience`
- **字段类型变更**：将字符串 ID 改为数字 ID
- **字段拆分**：将 `fullName` 拆分为 `firstName` 和 `lastName`
- **字段合并**：将多个布尔标志合并为枚举类型

#### 嵌套结构调整 (Nested Structure Changes)
- **扁平化**：将嵌套对象拆分为平级字段
- **层次化**：将平级字段组织为嵌套结构
- **重组**：改变数据的组织方式和层次关系

### 2. 业务逻辑迁移 (Business Logic Migration)

#### 计算规则变更 (Calculation Rule Changes)
- **等级公式调整**：经验值到等级的转换规则变更
- **货币汇率变更**：不同货币之间的兑换比例调整
- **物品属性重平衡**：装备属性和稀有度的重新平衡

#### 功能模块重构 (Feature Module Refactoring)
- **技能系统重做**：技能树结构的完全重构
- **成就系统升级**：成就条件和奖励的调整
- **社交功能重构**：好友系统和公会系统的重构

### 3. 数据清理迁移 (Data Cleanup Migration)

#### 冗余数据清理 (Redundant Data Cleanup)
- **移除废弃字段**：删除不再使用的数据字段
- **重复数据去重**：合并重复的数据记录
- **无效数据清理**：移除损坏或无效的数据

#### 数据质量提升 (Data Quality Improvement)
- **数据格式统一**：统一日期、时间、数字格式
- **缺失值补全**：为缺失的必要字段提供默认值
- **约束验证**：确保数据符合新的业务规则

## 迁移架构设计

### 分层迁移架构

```
┌─────────────────────────────────────────────────────────┐
│                 迁移控制层 (Migration Controller)         │
│                   版本管理 & 执行调度                     │
├─────────────────────────────────────────────────────────┤
│                 迁移策略层 (Migration Strategy)           │
│              迁移计划 & 依赖关系管理                      │
├─────────────────────────────────────────────────────────┤
│                 迁移执行层 (Migration Executor)           │
│              数据转换 & 验证 & 回滚                       │
├─────────────────────────────────────────────────────────┤
│                 数据访问层 (Data Access Layer)            │
│                 读取 & 写入 & 备份                        │
└─────────────────────────────────────────────────────────┘
```

### 版本管理系统

```typescript
interface DataVersion {
    major: number;    // 重大变更（不兼容）
    minor: number;    // 功能添加（向后兼容）
    patch: number;    // 错误修复（向后兼容）
    build?: string;   // 构建标识符
}

interface MigrationInfo {
    id: string;                    // 迁移唯一标识
    name: string;                  // 迁移名称
    description: string;           // 迁移描述
    fromVersion: DataVersion;      // 源版本
    toVersion: DataVersion;        // 目标版本
    priority: MigrationPriority;   // 迁移优先级
    dependencies: string[];        // 依赖的其他迁移
    rollbackSupported: boolean;    // 是否支持回滚
}

enum MigrationPriority {
    LOW = "low",        // 可延迟执行
    NORMAL = "normal",  // 正常优先级
    HIGH = "high",      // 高优先级
    CRITICAL = "critical" // 必须立即执行
}
```

## 迁移实现框架

### 核心迁移接口

```typescript
interface DataMigration<TFrom = unknown, TTo = unknown> {
    readonly info: MigrationInfo;
    
    // 检查是否需要迁移
    needsMigration(data: TFrom): boolean;
    
    // 执行向前迁移
    migrate(data: TFrom): Promise<TTo>;
    
    // 执行回滚迁移
    rollback?(data: TTo): Promise<TFrom>;
    
    // 验证迁移结果
    validate(originalData: TFrom, migratedData: TTo): Promise<ValidationResult>;
}

abstract class BaseMigration<TFrom, TTo> implements DataMigration<TFrom, TTo> {
    abstract readonly info: MigrationInfo;
    
    abstract needsMigration(data: TFrom): boolean;
    abstract migrate(data: TFrom): Promise<TTo>;
    
    async validate(originalData: TFrom, migratedData: TTo): Promise<ValidationResult> {
        // 默认验证逻辑
        return { isValid: true, errors: [] };
    }
    
    protected logMigration(message: string, data?: unknown): void {
        console.log(`[Migration ${this.info.id}] ${message}`, data);
    }
    
    protected handleError(error: Error, context: string): never {
        this.logMigration(`Error in ${context}: ${error.message}`);
        throw new MigrationError(this.info.id, context, error);
    }
}
```

### 迁移执行器

```typescript
@Service()
export class MigrationExecutor {
    private readonly migrations = new Map<string, DataMigration>();
    private readonly executionHistory = new Map<string, MigrationExecution>();
    
    constructor(
        private readonly logger: Logger,
        private readonly dataService: PlayerDataService,
    ) {
        this.registerMigrations();
    }
    
    // 注册所有迁移
    private registerMigrations(): void {
        const migrations: DataMigration[] = [
            new PlayerDataV1ToV2Migration(),
            new InventorySystemV2ToV3Migration(),
            new AchievementSystemV1ToV2Migration(),
            // 更多迁移...
        ];
        
        for (const migration of migrations) {
            this.migrations.set(migration.info.id, migration);
        }
    }
    
    // 执行玩家数据迁移
    async migratePlayerData(playerId: string): Promise<MigrationResult> {
        const data = await this.dataService.getPlayerData(playerId);
        if (\!data) {
            return { success: false, error: "Player data not found" };
        }
        
        const currentVersion = this.extractVersion(data);
        const targetVersion = this.getTargetVersion();
        
        if (this.isVersionCompatible(currentVersion, targetVersion)) {
            return { success: true, message: "No migration needed" };
        }
        
        return await this.executeMigrationPlan(playerId, data, currentVersion, targetVersion);
    }
    
    // 创建并执行迁移计划
    private async executeMigrationPlan(
        playerId: string,
        data: unknown,
        fromVersion: DataVersion,
        toVersion: DataVersion
    ): Promise<MigrationResult> {
        try {
            // 创建迁移计划
            const plan = this.createMigrationPlan(fromVersion, toVersion);
            
            // 创建备份
            const backupId = await this.createBackup(playerId, data);
            
            // 执行迁移链
            let currentData = data;
            for (const migration of plan.migrations) {
                currentData = await this.executeSingleMigration(migration, currentData);
            }
            
            // 验证最终结果
            const validationResult = await this.validateMigratedData(currentData);
            if (\!validationResult.isValid) {
                await this.restoreFromBackup(playerId, backupId);
                return { 
                    success: false, 
                    error: `Validation failed: ${validationResult.errors.join(", ")}`
                };
            }
            
            // 保存迁移后的数据
            await this.dataService.savePlayerData(playerId, currentData);
            
            return {
                success: true,
                message: `Successfully migrated from ${this.versionToString(fromVersion)} to ${this.versionToString(toVersion)}`,
                migrationsExecuted: plan.migrations.length,
            };
            
        } catch (error) {
            this.logger.Error(`Migration failed for player ${playerId}: ${error}`);
            return { success: false, error: error.message };
        }
    }
}
```

### 具体迁移实现示例

#### 1. 玩家数据结构迁移

```typescript
// V1 到 V2 的玩家数据迁移
class PlayerDataV1ToV2Migration extends BaseMigration<PlayerDataV1, PlayerDataV2> {
    readonly info: MigrationInfo = {
        id: "player-data-v1-to-v2",
        name: "Player Data Structure Migration",
        description: "Migrate player data from V1 to V2 format",
        fromVersion: { major: 1, minor: 0, patch: 0 },
        toVersion: { major: 2, minor: 0, patch: 0 },
        priority: MigrationPriority.CRITICAL,
        dependencies: [],
        rollbackSupported: true,
    };
    
    needsMigration(data: PlayerDataV1): boolean {
        // 检查是否包含旧版本特有的字段
        return "playerExp" in data && \!("experience" in data);
    }
    
    async migrate(data: PlayerDataV1): Promise<PlayerDataV2> {
        this.logMigration("Starting player data migration");
        
        try {
            const migratedData: PlayerDataV2 = {
                // 保持不变的字段
                playerId: data.playerId,
                displayName: data.displayName,
                createdAt: data.createdAt,
                
                // 字段重命名和结构调整
                player: {
                    // 从 playerExp 迁移到 experience
                    levelInfo: {
                        level: this.calculateLevelFromExp(data.playerExp),
                        experience: data.playerExp,
                        experienceRequired: this.calculateExpRequired(data.playerExp),
                    },
                    
                    // 货币结构重组
                    currency: {
                        gold: data.coins || 0,  // 重命名 coins -> gold
                        gems: data.gems || 0,
                        fragments: 0,  // 新增字段，默认值
                    },
                    
                    // 统计数据结构化
                    statistics: {
                        gamesPlayed: data.gamesPlayed || 0,
                        totalPlayTime: data.playTime || 0,
                        lastLoginAt: data.lastLoginAt || data.createdAt,
                    },
                },
                
                // 新增的数据结构
                inventory: this.createDefaultInventory(),
                achievements: this.migrateAchievements(data.achievements),
                settings: this.createDefaultSettings(),
            };
            
            this.logMigration("Player data migration completed");
            return migratedData;
            
        } catch (error) {
            this.handleError(error, "migrate");
        }
    }
    
    async rollback(data: PlayerDataV2): Promise<PlayerDataV1> {
        this.logMigration("Starting player data rollback");
        
        try {
            const rolledBackData: PlayerDataV1 = {
                playerId: data.playerId,
                displayName: data.displayName,
                createdAt: data.createdAt,
                
                // 逆向转换
                playerExp: data.player.levelInfo.experience,
                coins: data.player.currency.gold,
                gems: data.player.currency.gems,
                
                gamesPlayed: data.player.statistics.gamesPlayed,
                playTime: data.player.statistics.totalPlayTime,
                lastLoginAt: data.player.statistics.lastLoginAt,
                
                // 简化成就数据
                achievements: this.rollbackAchievements(data.achievements),
            };
            
            this.logMigration("Player data rollback completed");
            return rolledBackData;
            
        } catch (error) {
            this.handleError(error, "rollback");
        }
    }
    
    async validate(originalData: PlayerDataV1, migratedData: PlayerDataV2): Promise<ValidationResult> {
        const errors: string[] = [];
        
        // 验证基础字段
        if (originalData.playerId \!== migratedData.playerId) {
            errors.push("Player ID mismatch");
        }
        
        // 验证经验值转换
        if (originalData.playerExp \!== migratedData.player.levelInfo.experience) {
            errors.push("Experience value mismatch");
        }
        
        // 验证货币转换
        if ((originalData.coins || 0) \!== migratedData.player.currency.gold) {
            errors.push("Gold amount mismatch");
        }
        
        // 验证等级计算
        const expectedLevel = this.calculateLevelFromExp(originalData.playerExp);
        if (expectedLevel \!== migratedData.player.levelInfo.level) {
            errors.push("Level calculation incorrect");
        }
        
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    
    private calculateLevelFromExp(exp: number): number {
        // 等级计算逻辑
        return Math.floor(Math.sqrt(exp / 100)) + 1;
    }
    
    private calculateExpRequired(currentExp: number): number {
        const currentLevel = this.calculateLevelFromExp(currentExp);
        return Math.pow(currentLevel, 2) * 100;
    }
}
```

#### 2. 复杂业务逻辑迁移

```typescript
// 技能系统重构迁移
class SkillSystemV1ToV2Migration extends BaseMigration<SkillDataV1, SkillDataV2> {
    readonly info: MigrationInfo = {
        id: "skill-system-v1-to-v2",
        name: "Skill System Refactor Migration",
        description: "Migrate from linear skill system to tree-based system",
        fromVersion: { major: 1, minor: 2, patch: 0 },
        toVersion: { major: 2, minor: 0, patch: 0 },
        priority: MigrationPriority.HIGH,
        dependencies: ["player-data-v1-to-v2"],
        rollbackSupported: false, // 复杂重构不支持回滚
    };
    
    needsMigration(data: SkillDataV1): boolean {
        return Array.isArray(data.skills) && \!data.skillTrees;
    }
    
    async migrate(data: SkillDataV1): Promise<SkillDataV2> {
        this.logMigration("Starting skill system migration");
        
        // 创建新的技能树结构
        const skillTrees = new Map<string, SkillTree>();
        
        // 按类别分组旧技能
        const groupedSkills = this.groupSkillsByCategory(data.skills);
        
        for (const [category, skills] of groupedSkills) {
            const skillTree = this.createSkillTree(category, skills);
            skillTrees.set(category, skillTree);
        }
        
        // 迁移技能点数
        const totalSkillPoints = data.skills.reduce((sum, skill) => sum + skill.level, 0);
        const skillPointsPerTree = Math.floor(totalSkillPoints / skillTrees.size);
        const remainingPoints = totalSkillPoints % skillTrees.size;
        
        return {
            skillTrees,
            unallocatedPoints: remainingPoints,
            totalPointsEarned: totalSkillPoints,
            lastRespecTime: 0, // 新功能，默认值
        };
    }
    
    private groupSkillsByCategory(skills: SkillV1[]): Map<string, SkillV1[]> {
        // 根据技能名称推断类别
        const categories = new Map<string, SkillV1[]>();
        
        for (const skill of skills) {
            const category = this.inferSkillCategory(skill.name);
            const categorySkills = categories.get(category) || [];
            categorySkills.push(skill);
            categories.set(category, categorySkills);
        }
        
        return categories;
    }
    
    private createSkillTree(category: string, skills: SkillV1[]): SkillTree {
        // 创建技能树的具体逻辑
        const nodes = new Map<string, SkillNode>();
        
        // 将线性技能转换为树形结构
        for (let i = 0; i < skills.length; i++) {
            const skill = skills[i];
            const node: SkillNode = {
                id: skill.id,
                name: skill.name,
                description: skill.description,
                maxLevel: skill.maxLevel,
                currentLevel: skill.level,
                prerequisites: i > 0 ? [skills[i - 1].id] : [],
                position: { x: i % 5, y: Math.floor(i / 5) },
            };
            
            nodes.set(skill.id, node);
        }
        
        return {
            category,
            nodes,
            totalPointsInvested: skills.reduce((sum, s) => sum + s.level, 0),
        };
    }
}
```

## 批量迁移策略

### 增量迁移处理

```typescript
@Service()
export class BatchMigrationService {
    private readonly batchSize = 100;
    private readonly maxConcurrency = 10;
    
    constructor(
        private readonly migrationExecutor: MigrationExecutor,
        private readonly dataService: PlayerDataService,
        private readonly logger: Logger,
    ) {}
    
    // 批量迁移所有玩家数据
    async migrateAllPlayers(): Promise<BatchMigrationResult> {
        const startTime = Date.now();
        const allPlayerIds = await this.dataService.getAllPlayerIds();
        
        this.logger.Info(`Starting batch migration for ${allPlayerIds.length} players`);
        
        const result: BatchMigrationResult = {
            totalPlayers: allPlayerIds.length,
            successful: 0,
            failed: 0,
            errors: [],
            duration: 0,
        };
        
        // 分批处理
        for (let i = 0; i < allPlayerIds.length; i += this.batchSize) {
            const batch = allPlayerIds.slice(i, i + this.batchSize);
            await this.processBatch(batch, result);
            
            // 进度报告
            const progress = Math.round(((i + batch.length) / allPlayerIds.length) * 100);
            this.logger.Info(`Migration progress: ${progress}% (${result.successful} successful, ${result.failed} failed)`);
        }
        
        result.duration = Date.now() - startTime;
        this.logger.Info(`Batch migration completed in ${result.duration}ms`);
        
        return result;
    }
    
    private async processBatch(playerIds: string[], result: BatchMigrationResult): Promise<void> {
        // 并发处理批次中的玩家
        const semaphore = new Semaphore(this.maxConcurrency);
        
        const promises = playerIds.map(async (playerId) => {
            await semaphore.acquire();
            
            try {
                const migrationResult = await this.migrationExecutor.migratePlayerData(playerId);
                
                if (migrationResult.success) {
                    result.successful++;
                } else {
                    result.failed++;
                    result.errors.push({
                        playerId,
                        error: migrationResult.error || "Unknown error",
                    });
                }
            } catch (error) {
                result.failed++;
                result.errors.push({
                    playerId,
                    error: error.message,
                });
            } finally {
                semaphore.release();
            }
        });
        
        await Promise.allSettled(promises);
    }
}
```

### 热迁移支持

```typescript
// 支持游戏运行时的热迁移
class HotMigrationService {
    private readonly migrationQueue = new Queue<MigrationTask>();
    private isProcessing = false;
    
    constructor(
        private readonly migrationExecutor: MigrationExecutor,
        private readonly logger: Logger,
    ) {
        this.startProcessing();
    }
    
    // 添加迁移任务到队列
    enqueueMigration(playerId: string, priority: MigrationPriority = MigrationPriority.NORMAL): void {
        const task: MigrationTask = {
            playerId,
            priority,
            enqueuedAt: Date.now(),
        };
        
        this.migrationQueue.enqueue(task, this.getPriorityWeight(priority));
    }
    
    private startProcessing(): void {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        // 在后台持续处理迁移队列
        task.spawn(async () => {
            while (this.isProcessing) {
                const migrationTask = this.migrationQueue.dequeue();
                
                if (migrationTask) {
                    await this.processMigrationTask(migrationTask);
                } else {
                    // 队列为空，等待一段时间
                    await this.wait(1000);
                }
            }
        });
    }
    
    private async processMigrationTask(task: MigrationTask): Promise<void> {
        try {
            this.logger.Debug(`Processing migration for player ${task.playerId}`);
            
            const result = await this.migrationExecutor.migratePlayerData(task.playerId);
            
            if (\!result.success) {
                this.logger.Warn(`Migration failed for player ${task.playerId}: ${result.error}`);
                
                // 根据优先级决定是否重试
                if (task.priority === MigrationPriority.CRITICAL) {
                    this.enqueueMigration(task.playerId, MigrationPriority.HIGH);
                }
            }
            
        } catch (error) {
            this.logger.Error(`Migration task failed for player ${task.playerId}: ${error}`);
        }
    }
}
```

## 迁移验证与测试

### 自动化验证框架

```typescript
interface MigrationTestCase<TInput, TOutput> {
    name: string;
    input: TInput;
    expectedOutput: TOutput;
    customValidation?: (input: TInput, output: TOutput) => ValidationResult;
}

class MigrationTester<TInput, TOutput> {
    constructor(private readonly migration: DataMigration<TInput, TOutput>) {}
    
    async runTestSuite(testCases: MigrationTestCase<TInput, TOutput>[]): Promise<TestResults> {
        const results: TestResults = {
            total: testCases.length,
            passed: 0,
            failed: 0,
            errors: [],
        };
        
        for (const testCase of testCases) {
            try {
                const result = await this.runSingleTest(testCase);
                if (result.passed) {
                    results.passed++;
                } else {
                    results.failed++;
                    results.errors.push({
                        testName: testCase.name,
                        error: result.error,
                    });
                }
            } catch (error) {
                results.failed++;
                results.errors.push({
                    testName: testCase.name,
                    error: error.message,
                });
            }
        }
        
        return results;
    }
    
    private async runSingleTest(testCase: MigrationTestCase<TInput, TOutput>): Promise<TestResult> {
        // 执行迁移
        const output = await this.migration.migrate(testCase.input);
        
        // 基础验证
        const validationResult = await this.migration.validate(testCase.input, output);
        if (\!validationResult.isValid) {
            return {
                passed: false,
                error: `Validation failed: ${validationResult.errors.join(", ")}`,
            };
        }
        
        // 自定义验证
        if (testCase.customValidation) {
            const customResult = testCase.customValidation(testCase.input, output);
            if (\!customResult.isValid) {
                return {
                    passed: false,
                    error: `Custom validation failed: ${customResult.errors.join(", ")}`,
                };
            }
        }
        
        // 输出比较（如果提供了期望输出）
        if (testCase.expectedOutput) {
            const comparison = this.deepCompare(output, testCase.expectedOutput);
            if (\!comparison.isEqual) {
                return {
                    passed: false,
                    error: `Output mismatch: ${comparison.differences.join(", ")}`,
                };
            }
        }
        
        return { passed: true };
    }
}
```

### 性能基准测试

```typescript
class MigrationPerformanceTester {
    async benchmarkMigration<T>(
        migration: DataMigration<T, unknown>,
        testData: T[],
        iterations = 100
    ): Promise<PerformanceBenchmark> {
        const results: number[] = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            
            for (const data of testData) {
                await migration.migrate(data);
            }
            
            const endTime = performance.now();
            results.push(endTime - startTime);
        }
        
        return {
            totalIterations: iterations,
            recordsPerIteration: testData.length,
            averageTimeMs: results.reduce((a, b) => a + b) / results.length,
            minTimeMs: Math.min(...results),
            maxTimeMs: Math.max(...results),
            throughputPerSecond: (testData.length * 1000) / (results.reduce((a, b) => a + b) / results.length),
        };
    }
}
```

## 错误处理与恢复

### 分级错误处理

```typescript
enum MigrationErrorType {
    VALIDATION_ERROR = "validation_error",
    DATA_CORRUPTION = "data_corruption",
    BUSINESS_RULE_VIOLATION = "business_rule_violation",
    SYSTEM_ERROR = "system_error",
    TIMEOUT_ERROR = "timeout_error",
}

class MigrationErrorHandler {
    private readonly errorStrategies = new Map<MigrationErrorType, ErrorStrategy>();
    
    constructor() {
        this.initializeStrategies();
    }
    
    private initializeStrategies(): void {
        this.errorStrategies.set(MigrationErrorType.VALIDATION_ERROR, new ValidationErrorStrategy());
        this.errorStrategies.set(MigrationErrorType.DATA_CORRUPTION, new DataCorruptionStrategy());
        this.errorStrategies.set(MigrationErrorType.BUSINESS_RULE_VIOLATION, new BusinessRuleViolationStrategy());
        this.errorStrategies.set(MigrationErrorType.SYSTEM_ERROR, new SystemErrorStrategy());
        this.errorStrategies.set(MigrationErrorType.TIMEOUT_ERROR, new TimeoutErrorStrategy());
    }
    
    async handleError(error: MigrationError, context: MigrationContext): Promise<ErrorHandlingResult> {
        const errorType = this.classifyError(error);
        const strategy = this.errorStrategies.get(errorType);
        
        if (\!strategy) {
            return {
                canRecover: false,
                action: ErrorAction.ABORT,
                message: `No strategy found for error type: ${errorType}`,
            };
        }
        
        return await strategy.handle(error, context);
    }
    
    private classifyError(error: MigrationError): MigrationErrorType {
        // 错误分类逻辑
        if (error.message.includes("validation")) {
            return MigrationErrorType.VALIDATION_ERROR;
        }
        if (error.message.includes("timeout")) {
            return MigrationErrorType.TIMEOUT_ERROR;
        }
        // 更多分类规则...
        
        return MigrationErrorType.SYSTEM_ERROR;
    }
}

class ValidationErrorStrategy implements ErrorStrategy {
    async handle(error: MigrationError, context: MigrationContext): Promise<ErrorHandlingResult> {
        // 尝试数据修复
        const repairAttempt = await this.attemptDataRepair(context.inputData);
        
        if (repairAttempt.success) {
            return {
                canRecover: true,
                action: ErrorAction.RETRY_WITH_REPAIRED_DATA,
                repairedData: repairAttempt.data,
                message: "Data repaired, retrying migration",
            };
        }
        
        // 修复失败，回退到默认值
        return {
            canRecover: true,
            action: ErrorAction.USE_DEFAULT_VALUES,
            message: "Using default values for invalid fields",
        };
    }
}
```

### 自动恢复机制

```typescript
class MigrationRecoveryService {
    private readonly maxRetryAttempts = 3;
    private readonly retryDelayMs = 1000;
    
    async executeWithRecovery<T>(
        migrationFn: () => Promise<T>,
        context: MigrationContext
    ): Promise<T> {
        let lastError: Error  < /dev/null |  undefined;
        
        for (let attempt = 1; attempt <= this.maxRetryAttempts; attempt++) {
            try {
                return await migrationFn();
            } catch (error) {
                lastError = error;
                
                if (attempt === this.maxRetryAttempts) {
                    // 最后一次尝试失败
                    break;
                }
                
                // 尝试错误恢复
                const recoveryResult = await this.attemptRecovery(error, context);
                
                if (\!recoveryResult.canRecover) {
                    throw error;
                }
                
                // 应用恢复策略
                await this.applyRecoveryStrategy(recoveryResult, context);
                
                // 等待后重试
                await this.wait(this.retryDelayMs * attempt);
            }
        }
        
        throw lastError || new Error("Migration failed after all retry attempts");
    }
    
    private async attemptRecovery(error: Error, context: MigrationContext): Promise<RecoveryResult> {
        // 尝试不同的恢复策略
        const strategies = [
            this.tryDataRepair,
            this.tryPartialMigration,
            this.tryFallbackMigration,
        ];
        
        for (const strategy of strategies) {
            const result = await strategy(error, context);
            if (result.canRecover) {
                return result;
            }
        }
        
        return { canRecover: false };
    }
}
```

## 监控与报告

### 迁移监控系统

```typescript
class MigrationMonitor {
    private readonly metrics = new Map<string, MigrationMetrics>();
    
    recordMigrationStart(migrationId: string): void {
        const metrics = this.getOrCreateMetrics(migrationId);
        metrics.started++;
        metrics.lastStartTime = Date.now();
    }
    
    recordMigrationComplete(migrationId: string, duration: number): void {
        const metrics = this.getOrCreateMetrics(migrationId);
        metrics.completed++;
        metrics.totalDuration += duration;
        metrics.averageDuration = metrics.totalDuration / metrics.completed;
        
        if (duration > metrics.maxDuration) {
            metrics.maxDuration = duration;
        }
        
        if (metrics.minDuration === 0 || duration < metrics.minDuration) {
            metrics.minDuration = duration;
        }
    }
    
    recordMigrationError(migrationId: string, error: Error): void {
        const metrics = this.getOrCreateMetrics(migrationId);
        metrics.failed++;
        metrics.lastError = {
            message: error.message,
            timestamp: Date.now(),
        };
    }
    
    generateReport(): MigrationReport {
        const report: MigrationReport = {
            generatedAt: Date.now(),
            totalMigrations: this.metrics.size,
            migrations: [],
        };
        
        for (const [migrationId, metrics] of this.metrics) {
            const successRate = metrics.started > 0 ? 
                (metrics.completed / metrics.started) * 100 : 0;
            
            report.migrations.push({
                id: migrationId,
                ...metrics,
                successRate,
            });
        }
        
        // 按成功率排序
        report.migrations.sort((a, b) => a.successRate - b.successRate);
        
        return report;
    }
}
```

### 实时迁移仪表板

```typescript
interface MigrationDashboard {
    currentMigrations: ActiveMigration[];
    completedToday: number;
    failedToday: number;
    averageTimeToday: number;
    systemHealth: MigrationSystemHealth;
}

class MigrationDashboardService {
    private activeMigrations = new Map<string, ActiveMigration>();
    
    async getDashboardData(): Promise<MigrationDashboard> {
        const now = Date.now();
        const todayStart = this.getTodayStart();
        
        return {
            currentMigrations: Array.from(this.activeMigrations.values()),
            completedToday: await this.getCompletedCount(todayStart, now),
            failedToday: await this.getFailedCount(todayStart, now),
            averageTimeToday: await this.getAverageTime(todayStart, now),
            systemHealth: await this.getSystemHealth(),
        };
    }
    
    private async getSystemHealth(): Promise<MigrationSystemHealth> {
        const errorRate = await this.calculateErrorRate();
        const queueLength = this.activeMigrations.size;
        const systemLoad = await this.getSystemLoad();
        
        return {
            status: this.determineHealthStatus(errorRate, queueLength, systemLoad),
            errorRate,
            queueLength,
            systemLoad,
            recommendations: this.generateRecommendations(errorRate, queueLength, systemLoad),
        };
    }
}
```

## 最佳实践

### 1. 迁移设计原则

- **向前兼容**：新版本应该能够处理旧版本的数据
- **渐进式迁移**：将大型迁移拆分为多个小步骤
- **幂等性**：重复执行迁移应该产生相同的结果
- **可验证性**：每个迁移都应该有完整的验证逻辑

### 2. 性能优化策略

- **批量处理**：避免逐条记录处理，使用批量操作
- **并行执行**：在可能的情况下并行处理多个迁移
- **增量迁移**：只迁移需要更新的数据
- **资源限制**：控制内存使用和 CPU 占用

### 3. 安全性考虑

- **备份策略**：迁移前始终创建数据备份
- **权限控制**：严格控制迁移操作的权限
- **审计日志**：记录所有迁移操作的详细日志
- **回滚计划**：为每个迁移准备回滚方案

### 4. 运维友好设计

- **监控集成**：提供丰富的监控指标和告警
- **进度跟踪**：实时显示迁移进度和状态
- **错误报告**：提供详细的错误信息和解决建议
- **文档完整**：维护完整的迁移文档和变更日志

## 故障排查指南

### 常见问题诊断

#### 1. 迁移性能问题
- **症状**：迁移执行时间过长
- **可能原因**：数据量大、复杂转换逻辑、资源竞争
- **解决方案**：优化查询、增加并行度、分批处理

#### 2. 数据一致性问题
- **症状**：迁移后数据不一致
- **可能原因**：并发修改、迁移逻辑错误、验证不充分
- **解决方案**：加强验证、使用事务、避免并发冲突

#### 3. 内存不足问题
- **症状**：迁移过程中内存溢出
- **可能原因**：数据集过大、内存泄漏、批次大小不当
- **解决方案**：减小批次、分页处理、优化内存使用

## 相关文档

- [数据提供者架构](080_data-provider.md) - 数据提供者的整体架构设计
- [持久化策略](081_persistence-strategy.md) - 数据持久化的具体实现方案
- [动态数据策略](083_dynamic-strategy.md) - 动态数据的管理和优化技术
- [错误处理框架](../090_error/090_error.md) - 统一的错误处理和恢复机制
