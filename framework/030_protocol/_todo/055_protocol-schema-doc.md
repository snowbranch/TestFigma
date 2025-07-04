本框架从`客户端`发送到`服务端`的网络请求, 遵从标准的 HTTP RESTful Protocol 接口规范。

1. HTTP 方法：不用填写
2. 路径设计：遵循如 /users/list、/users 这种资源导向的 URL 结构
3. 请求/响应格式：使用 JSON 作为数据交换格式
4. HTTP 状态码：略有区别, 0（成功）、错误码: @054_api-error-codes.md
5. 认证机制：由roblox平台在用户登录时认证
6. 标准响应结构：统一的 {code, message, data} 格式

