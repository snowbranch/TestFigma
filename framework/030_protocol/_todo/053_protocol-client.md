# Protocol 客户端实现

Protocol 客户端是客户端网络层的核心组件，基于 Protocol Schema 提供类型安全的 Protocol 调用能力。


## 核心设计原则

1. **Schema 驱动**: 严格遵循 Protocol Schema 定义的接口契约
2. **类型安全**: 端到端 TypeScript 类型检查
3. **Mock 友好**: 内置 Mock 系统，支持开发调试
4. **异步优先**: 基于 Promise 的现代异步编程

## 标准客户端实现

```typescript
import { ApiResponse } from "types/network/api-core";
import { NetworkInvokeError } from "types/network/network-errors";

export class ApiClient {
    private readonly mockedRoutes = new Map<string, MockHandler>();
    
    constructor(private readonly player: Player) {}
    
    public async sendRequest<TResponse = unknown>(uri: string, dto?: unknown): Promise<ApiResponse<TResponse>> {
        try {
            const mockedResponse = await this.handleMockedRequest(uri, dto);
            if (mockedResponse) return mockedResponse as ApiResponse<TResponse>;
            
            const result = await remotes.api.request(uri, dto);
            return result as ApiResponse<TResponse>;
        } catch (error) {
            return { code: NetworkInvokeError.ServerInternalError, message: `网络错误: ${tostring(error)}` };
        }
    }
    
    public mockRequest<TResponse = unknown>(uri: string, handler: MockHandler<TResponse>): void {
        this.mockedRoutes.set(uri, handler as MockHandler);
    }
    
    private async handleMockedRequest(uri: string, dto?: unknown): Promise<ApiResponse<unknown> | undefined> {
        const mockHandler = this.mockedRoutes.get(uri);
        if (!mockHandler) return undefined;
        
        const mockResult = await mockHandler(dto);
        return typeof mockResult === "object" && "code" in mockResult
            ? mockResult : { code: 0, data: mockResult };
    }
}

type MockHandler<TResponse = unknown> = (dto?: unknown) => Promise<ApiResponse<TResponse> | TResponse> | ApiResponse<TResponse> | TResponse;
```

## 业务 Protocol 封装

- 组织结构: 
	- 位置: `src/client/api/`
    - 每个模块只允许导出一个接口 `src/client/api/{module}.ts`
    - index.ts 整合导出


```typescript
export const api = {
    shop: {
        purchase: (dto: PurchaseItemRequestDto) => apiClient.sendRequest<PurchaseItemResponseData>("shop/purchase", dto),
        getItems: (dto?: GetShopItemsRequestDto) => apiClient.sendRequest<GetShopItemsResponseData>("shop/get-items", dto)
    },
    player: {
        getName: () => apiClient.sendRequest<GetPlayerNameResponseData>("player/get-name"),
        getData: () => apiClient.sendRequest<GetPlayerDataResponseData>("player/get-data")
    }
};

export const apiClient = new ApiClient(Players.LocalPlayer);
```

## Mock 系统集成

```typescript
export function setupDevelopmentMocks(): void {
    if (!RunService.IsStudio()) return;
    
    apiClient.mockRequest("shop/purchase", (dto: PurchaseItemRequestDto) => ({
        code: 0,
        data: { result: { success: true, message: "购买成功" } }
    }));
    
    apiClient.mockRequest("shop/get-items", () => ({
        code: 0,
        data: { items: [
            { id: "sword_001", name: "钢剑", price: 100 },
            { id: "potion_001", name: "治疗药水", price: 50 }
        ]}
    }));
    
    apiClient.mockRequest("player/get-data", () => ({
        code: 0,
        data: { level: 10, experience: 1500, health: 100, maxHealth: 100 }
    }));
}
```

## 最佳实践

**✅ 推荐**: 基于 Protocol Schema 创建类型安全封装，使用 DTO 类型，提供 Mock 数据
**❌ 避免**: 直接调用底层接口，忽略 Schema 约束，生产环境启用 Mock

## 相关文档

- @051-api-schema.md - Protocol Schema 定义规范
- @052-api-gateway.md - Protocol 网关实现