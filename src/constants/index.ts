import { pagesPath } from '@/libs/$path';

export const RINKEBY_CHAIN_ID = '0x4' as const;

export const APP_NAME = 'eth-nft-game';
export const SERVICE_LOGO = 'https://placehold.jp/200x200.png' as const;

export const PAGE_PATH_AND_NAME = [{ name: 'Top', href: pagesPath.$url().pathname }] as const;

export const EMPTY_THUMBNAIL_URL = 'https://placehold.jp/300x200.png' as const;

export const IPFS_BASE_URL = 'https://cloudflare-ipfs.com/ipfs' as const;
