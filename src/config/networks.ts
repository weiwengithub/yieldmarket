// 网络配置
export interface NetworkConfig {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrl?: string;
  isTestnet: boolean;
}

export const NETWORKS: { [chainId: number]: NetworkConfig } = {
  // 主网
  1: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
    isTestnet: false,
  },

  // 以太坊测试网
  11155111: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    isTestnet: true,
  },

  5: {
    chainId: 5,
    name: 'Goerli Testnet',
    symbol: 'ETH',
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    isTestnet: true,
  },

  // Polygon 网络
  137: {
    chainId: 137,
    name: 'Polygon Mainnet',
    symbol: 'MATIC',
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    isTestnet: false,
  },

  80001: {
    chainId: 80001,
    name: 'Mumbai Testnet',
    symbol: 'MATIC',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    isTestnet: true,
  },

  80002: {
    chainId: 80002,
    name: 'Amoy Testnet',
    symbol: 'MATIC',
    rpcUrls: ['https://rpc-amoy.polygon.technology'],
    blockExplorerUrls: ['https://amoy.polygonscan.com'],
    isTestnet: true,
  },

  // BSC 网络
  56: {
    chainId: 56,
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
    isTestnet: false,
  },

  97: {
    chainId: 97,
    name: 'BSC Testnet',
    symbol: 'BNB',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    isTestnet: true,
  },

  // Arbitrum 网络
  42161: {
    chainId: 42161,
    name: 'Arbitrum One',
    symbol: 'ETH',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
    isTestnet: false,
  },

  421614: {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    symbol: 'ETH',
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io'],
    isTestnet: true,
  },

  // Optimism 网络
  10: {
    chainId: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    isTestnet: false,
  },

  11155420: {
    chainId: 11155420,
    name: 'Optimism Sepolia',
    symbol: 'ETH',
    rpcUrls: ['https://sepolia.optimism.io'],
    blockExplorerUrls: ['https://sepolia-optimistic.etherscan.io'],
    isTestnet: true,
  },

  // Avalanche 网络
  43114: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
    isTestnet: false,
  },

  43113: {
    chainId: 43113,
    name: 'Avalanche Fuji',
    symbol: 'AVAX',
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io'],
    isTestnet: true,
  },

  // Base 网络
  8453: {
    chainId: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    isTestnet: false,
  },

  84532: {
    chainId: 84532,
    name: 'Base Sepolia',
    symbol: 'ETH',
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    isTestnet: true,
  },
};

// 获取测试网络列表
export const getTestnets = (): NetworkConfig[] => {
  return Object.values(NETWORKS).filter(network => network.isTestnet);
};

// 获取主网列表
export const getMainnets = (): NetworkConfig[] => {
  return Object.values(NETWORKS).filter(network => !network.isTestnet);
};

// 根据链ID获取网络配置
export const getNetworkConfig = (chainId: number): NetworkConfig | undefined => {
  return NETWORKS[chainId];
};

// 检查是否为支持的网络
export const isSupportedNetwork = (chainId: number): boolean => {
  return chainId in NETWORKS;
};
