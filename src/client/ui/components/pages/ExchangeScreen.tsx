import React, { useState } from "@rbxts/react";
import { ItemExchangePanel } from "../organisms";

export function ExchangeScreen() {
    const [panelVisible, setPanelVisible] = useState(true);

    const handleExchange = () => {
        print("执行道具兑换！");
        // 这里应该调用实际的兑换逻辑
        setPanelVisible(false);
    };

    const handleClose = () => {
        setPanelVisible(false);
    };

    return (
        <ItemExchangePanel
            visible={panelVisible}
            onExchange={handleExchange}
            onClose={handleClose}
        />
    );
}
