
## Api Scheme

- 组织结构: 
	- 位置: `src/types/api/`
    - 为每个模块创建一个文件夹 `src/types/api/{module}`
    - 每个模块只允许导出一个接口 `src/types/api/{module}/index.d.ts`
    - 该接口需要扩展 `ApiScheme`
    - 创建 dto 一个文件夹 `src/types/api/{module}/dto`,放置dto定义文件(.d.ts)

**示例**

```typescript
// src/types/api/shop.ts
import type { ApiScheme } from "types/network/api-core";
import type { NetworkInvokeError } from "types/network/network-errors";
import type { GetItemRequestDto } from "./dto/get-item-request-dto";
import type { GetItemResponseData } from "./dto/get-item-response-data";

export interface ShopApiScheme extends ApiScheme {
	"shop/get-items": {
		errors: {
			[NetworkInvokeError.PlayerInsufficientResources]: "金币不足";
			[NetworkInvokeError.PlayerResourceNotFound]: "没有指定道具";
		};
		requestDto: GetItemRequestDto
		responseData: GetItemResponseData
	};
}
```

其中:
- `errors`, 描述调用该接口时, 有可能产生的错误类型, 以及错误原因.
  - 字典类型
  - key为错误码
  - value为原因
- `requestDto`, 描述调用该接口请求时发送的对象.
- `responseDto`, 描述该接口请求后,如果成功,相应的对象中的data成员.
  

如果请求成功,则返回的对象为:
```json
{
	"code"=0,
	"data"= {responseData}
}
```

如果请求失败,则返回的对象为:
```json
{
	"code"={NetworkInvokeError...},
	"message"="..."
}
```
注意: message **不需要** 和 schema 定义中的 error 字符串对应.




