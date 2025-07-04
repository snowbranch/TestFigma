import { Shop, ShopItem} from './entities';

/**
 * 商店主状态
 * 
 */
export interface ShopState {
  // ============ 商店数据 ============
  
  /** 商店实体数据 */
  shops: Record<string, Shop>;
  
  /** 商店-商品关系映射 */
  shopItems: Record<string, ShopItem[]>;
  
}
