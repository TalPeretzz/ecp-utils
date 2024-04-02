export const ElementorStore = {
  WC: 'wc',
  ECP: 'ecp',
} as const;

export type ElementorStoreType = (typeof ElementorStore)[keyof typeof ElementorStore];
