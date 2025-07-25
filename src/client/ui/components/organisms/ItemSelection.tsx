import React, { useState } from "@rbxts/react";

interface ItemSelectionProps {
	onIconSelect?: (iconIndex: number | undefined) => void;
	onConfirm?: (selectedIcon: number | undefined) => void;
	disabled?: boolean;
}

export function ItemSelection({ onIconSelect, onConfirm, disabled = false }: ItemSelectionProps) {
	const [selectedIcon, setSelectedIcon] = useState<number | undefined>(undefined);

	const handleIconClick = (iconIndex: number) => {
		const newSelection = iconIndex === selectedIcon ? undefined : iconIndex;
		setSelectedIcon(newSelection);
		onIconSelect?.(newSelection);
	};

	const handleConfirmClick = () => {
		onConfirm?.(selectedIcon);
	};

	return (
		<frame
			Size={new UDim2(0.3125, 0, 0.4, 0)} // 31.25% × 40% 屏幕占比
			Position={new UDim2(0.5, 0, 0.5, 0)} // 居中
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
		>
			{/* 背景向量图 */}
			<imagelabel
				Size={new UDim2(1, 0, 1, 0)}
				Position={new UDim2(0, 0, 0, 0)}
				BackgroundTransparency={1}
				Image="rbxasset://textures/Image/item-selection_Vector_Vector.png"
				ZIndex={1}
			/>

			{/* 标题区域 */}
			<frame
				Size={new UDim2(0.92, 0, 0.0972, 0)} // 552/600 × 42/432
				Position={new UDim2(0.04, 0, 0.1389, 0)} // 24/600 × 60/432
				BackgroundTransparency={1}
				ZIndex={2}
			>
				{/* 标题区域 - 在这里可以放置实际的文本内容 */}
				<textlabel
					Size={new UDim2(1, 0, 1, 0)}
					BackgroundTransparency={1}
					Text="选择物品"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextSize={18}
					Font={Enum.Font.GothamMedium}
					TextXAlignment={Enum.TextXAlignment.Center}
					TextYAlignment={Enum.TextYAlignment.Center}
				/>
			</frame>

			{/* 三图标组容器 */}
			<frame
				Size={new UDim2(0.46, 0, 0.1944, 0)} // 276/600 × 84/432
				Position={new UDim2(0.04, 0, 0.2917, 0)} // 24/600 × 126/432
				BackgroundTransparency={1}
				ZIndex={2}
			>
				{/* 第一个图标 */}
				<imagebutton
					Size={new UDim2(0.3043, 0, 1, 0)} // 84/276 × 84/84
					Position={new UDim2(0, 0, 0, 0)}
					BackgroundTransparency={1}
					Image="rbxasset://textures/Image/item-selection_Group1_Group_Vector_Vector.png"
					Active={!disabled}
					Event={{
						MouseButton1Click: () => handleIconClick(0),
					}}
				>
					{/* 图标内容 */}
					<imagelabel
						Size={new UDim2(0.857, 0, 0.714, 0)} // 72/84 × 60/84
						Position={new UDim2(0.071, 0, 0.143, 0)} // 6/84 × 12/84
						BackgroundTransparency={1}
						Image="rbxasset://textures/Image/item-selection_Group1_Group_Vector_1_Vector_1.png"
					/>
					{/* 选中状态覆盖 */}
					{selectedIcon === 0 && (
						<frame
							Size={new UDim2(1, 0, 1, 0)}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={0.7}
							ZIndex={1}
						>
							<uicorner CornerRadius={new UDim(0, 4)} />
						</frame>
					)}
				</imagebutton>

				{/* 第二个图标 */}
				<imagebutton
					Size={new UDim2(0.3043, 0, 1, 0)} // 84/276 × 84/84
					Position={new UDim2(0.348, 0, 0, 0)} // 96/276
					BackgroundTransparency={1}
					Image="rbxasset://textures/Image/item-selection_Group1_Group_1_Vector_Vector.png"
					Active={!disabled}
					Event={{
						MouseButton1Click: () => handleIconClick(1),
					}}
				>
					{/* 图标内容 */}
					<imagelabel
						Size={new UDim2(0.857, 0, 0.714, 0)} // 72/84 × 60/84
						Position={new UDim2(0.071, 0, 0.143, 0)} // 6/84 × 12/84
						BackgroundTransparency={1}
						Image="rbxasset://textures/Image/item-selection_Group1_Group_1_Vector_1_Vector_1.png"
					/>
					{/* 选中状态覆盖 */}
					{selectedIcon === 1 && (
						<frame
							Size={new UDim2(1, 0, 1, 0)}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={0.7}
							ZIndex={1}
						>
							<uicorner CornerRadius={new UDim(0, 4)} />
						</frame>
					)}
				</imagebutton>

				{/* 第三个图标 */}
				<imagebutton
					Size={new UDim2(0.3043, 0, 1, 0)} // 84/276 × 84/84
					Position={new UDim2(0.696, 0, 0, 0)} // 192/276
					BackgroundTransparency={1}
					Image="rbxasset://textures/Image/item-selection_Group1_Group_2_Vector_Vector.png"
					Active={!disabled}
					Event={{
						MouseButton1Click: () => handleIconClick(2),
					}}
				>
					{/* 图标内容 */}
					<imagelabel
						Size={new UDim2(0.857, 0, 0.714, 0)} // 72/84 × 60/84
						Position={new UDim2(0.071, 0, 0.143, 0)} // 6/84 × 12/84
						BackgroundTransparency={1}
						Image="rbxasset://textures/Image/item-selection_Group1_Group_2_Vector_1_Vector_1.png"
					/>
					{/* 选中状态覆盖 */}
					{selectedIcon === 2 && (
						<frame
							Size={new UDim2(1, 0, 1, 0)}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={0.7}
							ZIndex={1}
						>
							<uicorner CornerRadius={new UDim(0, 4)} />
						</frame>
					)}
				</imagebutton>
			</frame>

			{/* 立体按钮容器 */}
			<frame
				Size={new UDim2(0.37, 0, 0.1389, 0)} // 222/600 × 60/432
				Position={new UDim2(0.315, 0, 0.8125, 0)} // 189/600 × 351/432
				BackgroundTransparency={1}
				ZIndex={2}
			>
				{/* 按钮边框层 */}
				<imagebutton
					Size={new UDim2(1, 0, 1, 0)}
					BackgroundColor3={Color3.fromRGB(24, 19, 30)} // #18131e
					BorderColor3={Color3.fromRGB(140, 140, 140)} // #8c8c8c
					BorderSizePixel={1}
					Active={!disabled}
					Event={{
						MouseButton1Click: handleConfirmClick,
					}}
				>
					{/* 按钮渐变层 */}
					<frame
						Size={new UDim2(0.946, 0, 0.8, 0)} // 209.97/222 × 48/60
						Position={new UDim2(0.027, 0, 0.1, 0)} // 6/222 × 6/60
						BackgroundColor3={Color3.fromRGB(246, 249, 248)} // #f6f9f8
						ZIndex={1}
					>
						<uigradient
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, Color3.fromRGB(246, 249, 248)), // #f6f9f8
									new ColorSequenceKeypoint(1, Color3.fromRGB(220, 220, 220)), // #dcdcdc
								])
							}
						/>
						<uicorner CornerRadius={new UDim(0, 2)} />
					</frame>

					{/* 按钮文字 */}
					<textlabel
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
						Text="确认"
						TextColor3={disabled ? Color3.fromRGB(100, 100, 100) : Color3.fromRGB(50, 50, 50)}
						TextSize={16}
						Font={Enum.Font.GothamMedium}
						TextXAlignment={Enum.TextXAlignment.Center}
						TextYAlignment={Enum.TextYAlignment.Center}
						ZIndex={2}
					/>
				</imagebutton>
			</frame>
		</frame>
	);
}
