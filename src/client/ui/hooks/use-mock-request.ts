import { useEffect } from "@rbxts/react";

// 模拟API响应数据
const mockResponses = {
    "shop/get-items": {
        code: 0,
        data: [
            { id: "1", name: "钢剑", price: 100, imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
            { id: "2", name: "钢盾", price: 200, imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
            { id: "3", name: "生命药水", price: 50, imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
            { id: "4", name: "长弓", price: 150, imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
            { id: "5", name: "皮甲", price: 300, imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
        ]
    },
    "shop/purchase": {
        code: 0,
        data: { success: true, message: "购买成功", newBalance: 900 }
    },
    "player/get-currency": {
        code: 0,
        data: { coins: 1000, gems: 50, diamonds: 25 }
    },
    "player/get-inventory": {
        code: 0,
        data: [
            { id: "inv1", name: "旧剑", quantity: 1, imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
            { id: "inv2", name: "破盾", quantity: 2, imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
            { id: "inv3", name: "小药水", quantity: 5, imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
        ]
    },
    "exchange/get-items": {
        code: 0,
        data: [
            { id: "diamond", name: "钻石", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
            { id: "gold", name: "金币", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
            { id: "emerald", name: "绿宝石", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png" },
        ]
    },
    "exchange/redeem-code": {
        code: 0,
        data: { success: true, message: "兑换码使用成功", rewards: ["钻石x10", "金币x100"] }
    },
    "battle/get-status": {
        code: 0,
        data: { 
            playerHealth: 100, 
            playerMana: 50, 
            enemyHealth: 80, 
            battleState: "active" 
        }
    }
};

// 模拟错误响应
const mockErrors = {
    "shop/purchase-fail": {
        code: 1001,
        message: "余额不足"
    },
    "exchange/invalid-code": {
        code: 1002,
        message: "兑换码无效或已过期"
    },
    "player/unauthorized": {
        code: 1003,
        message: "用户未授权"
    }
};

// 模拟网络延迟
const simulateNetworkDelay = (min: number = 100, max: number = 500): Promise<void> => {
    const delay = math.random() * (max - min) + min;
    return new Promise(resolve => task.wait(delay / 1000));
};

// 模拟API请求处理器
const mockApiHandler = async (endpoint: string, options?: any): Promise<any> => {
    // 模拟网络延迟
    await simulateNetworkDelay();
    
    // 检查是否有对应的mock响应
    if (mockResponses[endpoint as keyof typeof mockResponses]) {
        const response = mockResponses[endpoint as keyof typeof mockResponses];
        print(`[MockAPI] ${endpoint} -> Success:`, response);
        return response;
    }
    
    // 检查是否是错误情况
    if (mockErrors[endpoint as keyof typeof mockErrors]) {
        const error = mockErrors[endpoint as keyof typeof mockErrors];
        print(`[MockAPI] ${endpoint} -> Error:`, error);
        throw error;
    }
    
    // 默认成功响应
    const defaultResponse = {
        code: 0,
        data: null,
        message: "操作成功"
    };
    
    print(`[MockAPI] ${endpoint} -> Default:`, defaultResponse);
    return defaultResponse;
};

/**
 * 模拟请求Hook
 * 在Storybook环境中拦截所有API请求并返回模拟数据
 */
export function useMockRequest() {
    useEffect(() => {
        print("[useMockRequest] 初始化模拟API处理器");
        
        // 在实际项目中，这里应该拦截你的API请求库
        // 例如：如果使用axios，可以设置interceptors
        // 如果使用fetch，可以monkey-patch fetch函数
        // 如果使用自定义的API客户端，可以替换其实现
        
        // 示例：假设有一个全局的api对象
        // const originalApi = api;
        // api = {
        //     get: mockApiHandler,
        //     post: mockApiHandler,
        //     put: mockApiHandler,
        //     delete: mockApiHandler,
        // };
        
        // 清理函数
        return () => {
            print("[useMockRequest] 清理模拟API处理器");
            // 恢复原始API
            // api = originalApi;
        };
    }, []);
    
    // 返回mock处理器，供组件直接使用
    return {
        mockApi: mockApiHandler,
        addMockResponse: (endpoint: string, response: any) => {
            (mockResponses as any)[endpoint] = response;
        },
        addMockError: (endpoint: string, error: any) => {
            (mockErrors as any)[endpoint] = error;
        }
    };
}

// 导出模拟数据，供其他地方使用
export { mockResponses, mockErrors, mockApiHandler };
