# Protocol 网关实现

Protocol 网关是服务端网络架构的核心组件，基于 Flamework 框架构建，严格遵循 Protocol Schema 定义。

- 组织结构: 
	- 位置: `src/server/gateways/`
    - 每个模块只允许导出一个接口 `src/server/gateways/{module}.ts`
    - index.ts 整合导出


## 核心设计原则

1. **Schema 驱动**: 所有网关必须实现对应的 Protocol Schema 接口
2. **类型安全**: 端到端 TypeScript 类型保障
3. **装饰器驱动**: 零配置自动注册和路由
4. **依赖注入**: 基于 Flamework 的 IoC 容器

## 标准网关实现

**重要**: 使用编译时类型检查, 确保类型安全. 
>经过多轮测试,只有这一种方式能否在ts下编译成功. 其他的,如实现接口方式,均失败了.

```typescript
import { Service } from "@flamework/core";
import { Gateway } from "server/network/api-core/api-registry";
import { ShopApiSchema } from "types/api/shop";
import { PurchaseItemRequestDto } from "types/api/shop/dto/purchase-item-request-dto";
import { PurchaseItemResponseData } from "types/api/shop/dto/purchase-item-response-data";
import { ApiResponse } from "types/network/api-core";
import { ApiGateway, BaseGateway } from "server/network/api-core/api-gateway";
import { NetworkInvokeError } from "types/network/network-errors";

// 编译时类型检查，但不破坏运行时类型安全.
const _: ApiGateway<ShopApiSchema> = undefined as unknown as ShopGateway;

@Gateway()
@Service()
export class ShopGateway {
    constructor(
        private readonly shopService: ShopService,
        private readonly playerService: PlayerService,
        
    ) {
    }
    
    "shop/purchase"(player: Player, dto: PurchaseItemRequestDto): ApiResponse<PurchaseItemResponseData> {
        try {
            const playerEntity = this.playerService.getPlayerEntity(player);
            if (!playerEntity) {
                return { code: NetworkInvokeError.PlayerResourceNotFound, message: "玩家实体不存在" };
            }
            
            const result = this.shopService.purchaseItem(player, dto.itemId, dto.quantity || 1);
            return result.success 
                ? { code: 0, data: { result } }
                : { code: NetworkInvokeError.PlayerInsufficientResources, message: result.message };
        } catch (error) {
            return { code: NetworkInvokeError.ServerInternalError, message: "服务器内部错误" };
        }
    }
}
```

## Protocol Schema 集成

网关必须实现对应的 Protocol Schema 接口：

```typescript
// types/api/shop/index.d.ts
export interface ShopApiSchema extends ApiSchema {
    "shop/purchase": {
        errors: {
            [NetworkInvokeError.PlayerInsufficientResources]: "货币不足";
            [NetworkInvokeError.PlayerResourceNotFound]: "商品不存在";
        };
        requestDto: PurchaseItemRequestDto;
        responseData: PurchaseItemResponseData;
    };
}
```

## 响应格式标准

- **成功响应**: `{ "code": 0, "data": {responseData} }`
- **错误响应**: `{ "code": {NetworkInvokeError}, "message": "错误描述" }`

## URI 设计规范

- **✅ 推荐**: `shop/get-items`, `shop/purchase`, `player/get-profile`
- **❌ 避免**: `getShopItems`, `shop_purchase_item`, `shop/buyItem`

## 最佳实践

**✅ 推荐**: 实现 Protocol Schema 接口，使用 DTO 类型，返回标准错误码
**❌ 避免**: 不使用 Schema 约束，使用 any 类型，自定义错误格式

## 开发工作流

1. 先定义 Protocol Schema 类型
2. 创建 DTO 数据结构  
3. 实现网关类
4. 编写测试验证

## 相关文档

- @051-api-schema.md - Protocol Schema 定义规范