# 进化机制

## lint 收集与改善

- `lint问题优化建议文档`: **{缓存目录}/lint-issues.md**
- 当解决 lint 问题后, 应当将问题与解决方案存入 `lint问题优化建议文档`, **仅增加,不要删除文档内容**, 以等待时机优化相关方案.
- 本文档只存贮已解决问题

例子：

-------

## ts/no-explicit-any

**不允许任何any出现**

```typescript
constructor: () => ({}) as any,
```

## no-inline-comments

**注释位置错误**

```typescript
BackgroundColor3: new Color3(0.914, 0.914, 0.914), // #E9E9E9
```

-------

## 编译错误与改善

- `编译错误优化建议文档`: **{缓存目录}/compile-issues.md**
- 当解决编译错误后, 应当将问题与解决方案存入 `编译错误优化建议文档`, **仅增加,不要删除文档内容**, 以等待时机优化相关方案.
- 本文档只存贮已解决问题
