import { 
  ResourceInventory,
} from './entities';


/**
 * 资源主状态
 * 
 */
export interface ResourceState {
  
  /** 玩家资源库存 */
  inventories: Record<string, ResourceInventory>;
  
}

