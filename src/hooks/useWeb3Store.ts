import { create } from 'zustand';
import { ethers } from 'ethers';
import { NETWORKS, getNetworkConfig } from '@/config/networks';

interface Web3State {
  isConnected: boolean;
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  balance: string | null;
  isAutoRefreshing: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<boolean>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
  callContract: (
    contractAddress: string,
    abi: any[],
    methodName: string,
    params?: unknown[],
  ) => Promise<any>;
  sendTransaction: (
    contractAddress: string,
    abi: any[],
    methodName: string,
    params?: unknown[],
    value?: string
  ) => Promise<any>;
}

export const useWeb3Store = create<Web3State>((set, get) => {
  let refreshInterval: NodeJS.Timeout | null = null;

  const refreshBalance = async () => {
    const { provider, account } = get();
    if (!provider || !account) return;

    try {
      const balance = await provider.getBalance(account);
      set({ balance: ethers.formatEther(balance) });
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  };

  const startAutoRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(refreshBalance, 10000);
    set({ isAutoRefreshing: true });
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = null;
    set({ isAutoRefreshing: false });
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      set({ error: '请安装MetaMask' });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(account);

      sessionStorage.setItem("account", account);
      set({
        isConnected: true,
        provider,
        signer,
        account,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        isLoading: false,
      });

      startAutoRefresh();

      return true;
    } catch (err: any) {
      set({ error: err.message || '连接失败', isLoading: false });
      return false;
    }
  };

  const disconnect = () => {
    stopAutoRefresh();
    sessionStorage.removeItem("account");
    sessionStorage.removeItem("token");
    set({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: null,
      isAutoRefreshing: false,
      error: null,
    });
  };

  const switchNetwork = async (chainId: number) => {
    const { provider } = get();
    if (!provider) return;

    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${chainId.toString(16)}` }]);
    } catch (err: any) {
      if (err.code === 4902) {
        const networkConfig = getNetworkConfig(chainId);
        if (!networkConfig) return;

        // @ts-expect-error window.ethereum
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: networkConfig.name,
            nativeCurrency: {
              name: networkConfig.symbol,
              symbol: networkConfig.symbol,
              decimals: 18,
            },
            rpcUrls: networkConfig.rpcUrls,
            blockExplorerUrls: networkConfig.blockExplorerUrls,
          }]
        });
      } else {
        set({ error: err.message || '切换网络失败' });
      }
    }
  };

  const callContract = async (
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: unknown[] = []
  ) => {
    try {
      const { provider } = get();
      if (!provider) throw new Error('请先连接钱包');


      const contract = new ethers.Contract(contractAddress, abi, provider);
      return await contract[methodName](...params);
    } catch (e) {
      console.log(e)
    }
  };

  const sendTransaction = async (
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: unknown[] = [],
    value?: string
  ) => {
    try {
      const { signer, refreshBalance } = get();
      if (!signer) throw new Error('请先连接钱包');

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const txOptions: Record<string, any> = {};
      if (value) txOptions.value = ethers.parseEther(value);

      const tx = await contract[methodName](...params, txOptions);
      const receipt = await tx.wait();

      setTimeout(refreshBalance, 2000);
      return receipt;
    } catch (e) {
      console.log(e)
    }
  };

  // Subscribe to account & chain changes
  if (typeof window !== 'undefined' && window.ethereum) {
    // @ts-expect-error accounts type
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        await connectWallet();
      }
    });

    window.ethereum.on('chainChanged', async () => {
      await connectWallet();
    });
  }

  return {
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
    balance: null,
    isAutoRefreshing: false,
    isLoading: false,
    error: null,
    connectWallet,
    disconnect,
    switchNetwork,
    refreshBalance,
    callContract,
    sendTransaction,
  };
});
