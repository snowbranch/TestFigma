# Protocol 错误代码定义

## 概述

### 0 - 请求成功

### 4xx - 客户端错误 (Client Error)
表示客户端发出的请求有错误，服务器无法或不会处理。

| 状态码 | 名称 | 描述 |
|-------|------|------|
| 400 | Bad Request | 服务器不理解请求的语法，或者请求参数无效 |
| 401 | Unauthorized | 请求需要用户身份验证（未认证） |
| 403 | Forbidden | 服务器理解请求，但拒绝执行（权限不足） |
| 404 | Not Found | 服务器找不到请求的资源 |
| 405 | Method Not Allowed | 请求方法不允许用于请求的资源 |
| 406 | Not Acceptable | 客户端请求的媒体类型服务器无法生成 |
| 409 | Conflict | 请求与服务器的当前状态冲突 |
| 410 | Gone | 请求的资源已被永久删除 |
| 422 | Unprocessable Entity | 请求格式正确，但由于语义错误而无法遵循 |

### 5xx - 服务器错误 (Server Error)
表示服务器在尝试处理请求时遇到了内部错误。

| 状态码 | 名称 | 描述 |
|-------|------|------|
| 500 | Internal Server Error | 服务器遇到了一个意外情况，阻止它完成请求 |
| 502 | Bad Gateway | 作为网关或代理的服务器从上游服务器收到无效响应 |
| 503 | Service Unavailable | 服务器目前无法处理请求，通常是由于过载或维护 |
| 504 | Gateway Timeout | 作为网关或代理的服务器在等待上游服务器响应时超时 |

## 自定义业务错误代码

自定义错误代码从600开始，按照不同业务模块进行分组：

- **600-699**: 网络和系统层面错误
- **700-799**: 玩家业务逻辑错误  
- **800-899**: 公会业务逻辑错误
- **900-999**: 自定义业务逻辑错误

### 网络和系统错误 (600-699)

| 错误代码 | 错误名称 | 描述 |
|---------|---------|------|
| 601 | UnknownError | 未知错误 |
| 602 | RequestTimeout | 请求超时 |
| 603 | RemoteFunctionNotFound | 远程函数不存在 |
| 604 | InvalidParameters | 参数无效 |
| 605 | InsufficientPermissions | 权限不足 |
| 606 | ServerInternalError | 服务器内部错误 |
| 607 | NetworkConnectionInterrupted | 网络连接中断 |
| 608 | RequestRateTooFast | 请求频率过快 |
| 609 | DataSerializationFailed | 数据序列化失败 |
| 610 | ResponseDataTooLarge | 返回数据过大 |
| 611 | ServerBusy | 服务器繁忙 |
| 612 | ClientVersionTooOld | 客户端版本过旧 |
| 613 | ServerUnderMaintenance | 服务器维护中 |
| 614 | SessionExpired | 会话已过期 |
| 615 | PlayerOffline | 玩家已离线 |

### 玩家业务逻辑错误 (700-799)

| 错误代码 | 错误名称 | 描述 |
|---------|---------|------|
| 701 | PlayerInsufficientResources | 玩家资源不足 |
| 702 | PlayerResourceNotFound | 玩家资源不存在 |
| 703 | PlayerInvalidState | 玩家状态不正确 |

### 公会业务逻辑错误 (800-899)

*待定义*


### 其他业务逻辑错误 (900-999)

*待定义*


### 自定义错误码

允许项目在 600-999以内, 定义未占用的错误码.
