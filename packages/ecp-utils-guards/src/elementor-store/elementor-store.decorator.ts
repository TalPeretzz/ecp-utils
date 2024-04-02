import { SetMetadata } from '@nestjs/common';
import { ElementorStoreType } from './elementor-store.enum';

export const STORES_KEY = 'stores';
export const ElementorStores = (...stores: ElementorStoreType[]) => SetMetadata(STORES_KEY, stores);
