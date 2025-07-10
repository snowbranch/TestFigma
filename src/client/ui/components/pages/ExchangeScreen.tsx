import React, { useState } from "@rbxts/react";

// 根据设计图正确实现的交易物品选择界面
export function ExchangeScreen() {
    const [searchText, setSearchText] = useState("");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleAddToTrade = () => {
        print("添加到交易被点击！");
        print("当前选中的物品:", selectedItems);
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        print("搜索内容:", text);
    };

    const handleItemClick = (itemId: string) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
        print("点击物品:", itemId, "当前选中:", selectedItems);
    };

    return (
        <imagelabel
            Size={new UDim2(0, 400, 0, 300)}
            Position={new UDim2(0.5, -200, 0.5, -150)}
            Image="rbxasset://textures/ui/Scroll/scroll-middle.png" // 使用 Roblox 内置纹理
            BackgroundColor3={Color3.fromRGB(52, 58, 78)} // 作为备用颜色
            BorderSizePixel={0}
            ScaleType={Enum.ScaleType.Stretch} // 图片缩放方式
            ImageTransparency={0.3} // 图片透明度，0为完全不透明，1为完全透明
        >
            <uicorner CornerRadius={new UDim(0, 12)} />
            
            {/* 标题 - "选择交易物品" */}
            <textlabel
                Text="选择交易物品"
                Size={new UDim2(1, 0, 0, 40)}
                Position={new UDim2(0, 0, 0, 15)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={18}
                Font={Enum.Font.GothamBold}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            {/* 搜索框 */}
            <frame
                Size={new UDim2(1, -40, 0, 35)}
                Position={new UDim2(0, 20, 0, 60)}
                BackgroundColor3={Color3.fromRGB(70, 76, 96)}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />
                <textbox
                    Size={new UDim2(1, -20, 1, -6)}
                    Position={new UDim2(0, 10, 0, 3)}
                    BackgroundTransparency={1}
                    Text={searchText}
                    PlaceholderText="搜索物品..."
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    PlaceholderColor3={Color3.fromRGB(150, 150, 150)}
                    TextSize={14}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    ClearTextOnFocus={false}
                    Event={{
                        FocusLost: (rbx, enterPressed) => {
                            if (enterPressed) {
                                handleSearch(rbx.Text);
                            }
                        }
                    }}
                />
                {/* 搜索图标 */}
                <textlabel
                    Text="🔍"
                    Size={new UDim2(0, 20, 0, 20)}
                    Position={new UDim2(1, -30, 0.5, -10)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(150, 150, 150)}
                    TextSize={14}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Center}
                />
            </frame>
            
            {/* 物品图标容器 */}
            <frame
                Size={new UDim2(1, -40, 0, 100)}
                Position={new UDim2(0, 20, 0, 120)}
                BackgroundTransparency={1}
            >
                <uilistlayout
                    FillDirection={Enum.FillDirection.Horizontal}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                    Padding={new UDim(0, 20)}
                />
                
                {/* 蓝色星形物品 */}
                <textbutton
                    Size={new UDim2(0, 80, 0, 80)}
                    BackgroundColor3={selectedItems.includes("star") ? Color3.fromRGB(85, 125, 200) : Color3.fromRGB(65, 105, 180)}
                    BorderSizePixel={selectedItems.includes("star") ? 3 : 0}
                    BorderColor3={Color3.fromRGB(255, 255, 255)}
                    Text=""
                    Event={{
                        MouseButton1Click: () => handleItemClick("star")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 10)} />
                    
                    {/* 星形图标内容 */}
                    <imagelabel
                        Size={new UDim2(0, 50, 0, 50)}
                        Position={new UDim2(0.5, -25, 0.5, -25)}
                        Image="rbxasset://textures/ui/TopBar/iconSort.png" // 星形物品纹理
                        BackgroundColor3={Color3.fromRGB(100, 150, 255)}
                        BorderSizePixel={0}
                        ScaleType={Enum.ScaleType.Fit}
                        ImageTransparency={0.2}
                    >
                        <uicorner CornerRadius={new UDim(0, 25)} />
                        <textlabel
                            Text="★"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={24}
                            Font={Enum.Font.GothamBold}
                            TextXAlignment={Enum.TextXAlignment.Center}
                        />
                    </imagelabel>
                </textbutton>
                
                {/* 黄色圆形物品 */}
                <textbutton
                    Size={new UDim2(0, 80, 0, 80)}
                    BackgroundColor3={selectedItems.includes("circle") ? Color3.fromRGB(238, 185, 52) : Color3.fromRGB(218, 165, 32)}
                    BorderSizePixel={selectedItems.includes("circle") ? 3 : 0}
                    BorderColor3={Color3.fromRGB(255, 255, 255)}
                    Text=""
                    Event={{
                        MouseButton1Click: () => handleItemClick("circle")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 10)} />
                    
                    {/* 圆形图标内容 */}
                    <frame
                        Size={new UDim2(0, 50, 0, 50)}
                        Position={new UDim2(0.5, -25, 0.5, -25)}
                        BackgroundColor3={Color3.fromRGB(255, 215, 0)}
                        BorderSizePixel={0}
                    >
                        <uicorner CornerRadius={new UDim(0, 25)} />
                        <textlabel
                            Text="●"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={24}
                            Font={Enum.Font.GothamBold}
                            TextXAlignment={Enum.TextXAlignment.Center}
                        />
                    </frame>
                </textbutton>
                
                {/* 蓝绿色菱形物品 */}
                <textbutton
                    Size={new UDim2(0, 80, 0, 80)}
                    BackgroundColor3={selectedItems.includes("diamond") ? Color3.fromRGB(52, 198, 190) : Color3.fromRGB(32, 178, 170)}
                    BorderSizePixel={selectedItems.includes("diamond") ? 3 : 0}
                    BorderColor3={Color3.fromRGB(255, 255, 255)}
                    Text=""
                    Event={{
                        MouseButton1Click: () => handleItemClick("diamond")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 10)} />
                    
                    {/* 菱形图标内容 */}
                    <frame
                        Size={new UDim2(0, 50, 0, 50)}
                        Position={new UDim2(0.5, -25, 0.5, -25)}
                        BackgroundColor3={Color3.fromRGB(64, 224, 208)}
                        BorderSizePixel={0}
                        Rotation={45}
                    >
                        <uicorner CornerRadius={new UDim(0, 8)} />
                        <textlabel
                            Text="♦"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={18}
                            Font={Enum.Font.GothamBold}
                            TextXAlignment={Enum.TextXAlignment.Center}
                            Rotation={-45}
                        />
                    </frame>
                </textbutton>
            </frame>
            
            {/* 添加到交易按钮 */}
            <textbutton
                Text="添加到交易"
                Size={new UDim2(0, 140, 0, 40)}
                Position={new UDim2(0.5, -70, 1, -60)}
                BackgroundColor3={Color3.fromRGB(70, 130, 180)}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={16}
                Font={Enum.Font.GothamMedium}
                Event={{
                    MouseButton1Click: handleAddToTrade
                }}
            >
                <uicorner CornerRadius={new UDim(0, 8)} />
                
                {/* 按钮发光效果 */}
                <frame
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    BackgroundTransparency={0.9}
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </frame>
            </textbutton>
            
            {/* 选中状态提示 */}
            {selectedItems.size() > 0 && (
                <textlabel
                    Text={`已选中 ${selectedItems.size()} 个物品`}
                    Size={new UDim2(0, 200, 0, 20)}
                    Position={new UDim2(0.5, -100, 1, -90)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(100, 255, 100)}
                    TextSize={12}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Center}
                />
            )}
        </imagelabel>
    );
}