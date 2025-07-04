import type { ResourceInventoryDelta, ResourceInventoryMultipleDelta } from "../resource/entities";

/**
 * 购买商品
 *
 * @uri shop/purchase-item
 */

export interface ShopRequests {
	"shop/purchase": {
		errors: {
			[400]: "参数错误";
			[701]: "玩家资源不足";
		};
		requestDto: {
			/** 商品ID */
			itemId: string;
			/** 购买数量 */
			quantity: number;
			/** 商店ID */
			shopId: string;
		};
		responseData: {
			/** 花费的资源 */
			cost: ResourceInventoryDelta[];
			/** 获得的资源 */
			purchased: ResourceInventoryDelta[];
		};
	};
	"shop/refresh": {
		errors: {
			[701]: "玩家资源不足";
		};
		requestDto: {
			/** 商店ID */
			itemId: string;
		};
	};
}
