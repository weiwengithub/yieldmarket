'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { NETWORKS, getNetworkConfig } from '@/config/networks';

// 自定义类型定义
interface EthereumError extends Error {
  code?: number;
  data?: unknown;
}

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  send: (method: string, params: unknown[]) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  balance: string | null;
  isAutoRefreshing: boolean;
}

// 持久化存储的键名
const WALLET_CONNECTION_KEY = 'wallet_connection_state';
const AUTO_CONNECT_KEY = 'auto_connect_enabled';

// 存储的连接状态接口
interface StoredConnectionState {
  shouldAutoConnect: boolean;
  lastConnectedAccount?: string;
  lastChainId?: number;
  timestamp: number;
}

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
    balance: null,
    isAutoRefreshing: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 用于余额自动刷新的定时器
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshEnabledRef = useRef(false);

  // 保存连接状态到localStorage
  const saveConnectionState = useCallback((account: string, chainId: number) => {
    try {
      const connectionState: StoredConnectionState = {
        shouldAutoConnect: true,
        lastConnectedAccount: account,
        lastChainId: chainId,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(WALLET_CONNECTION_KEY, JSON.stringify(connectionState));
      sessionStorage.setItem(AUTO_CONNECT_KEY, 'true');
    } catch (err) {
      console.error('Failed to save connection state:', err);
    }
  }, []);

  // 从localStorage读取连接状态
  const getStoredConnectionState = useCallback((): StoredConnectionState | null => {
    try {
      const stored = sessionStorage.getItem(WALLET_CONNECTION_KEY);
      const autoConnect = sessionStorage.getItem(AUTO_CONNECT_KEY);

      if (!stored || autoConnect !== 'true') return null;

      const connectionState: StoredConnectionState = JSON.parse(stored);

      // 检查存储时间，24小时后过期
      const MAX_AGE = 24 * 60 * 60 * 1000; // 24小时
      if (Date.now() - connectionState.timestamp > MAX_AGE) {
        sessionStorage.removeItem(WALLET_CONNECTION_KEY);
        sessionStorage.removeItem(AUTO_CONNECT_KEY);
        return null;
      }

      return connectionState;
    } catch (err) {
      console.error('Failed to read connection state:', err);
      return null;
    }
  }, []);

  // 清除连接状态
  const clearConnectionState = useCallback(() => {
    try {
      sessionStorage.removeItem(WALLET_CONNECTION_KEY);
      sessionStorage.removeItem(AUTO_CONNECT_KEY);
    } catch (err) {
      console.error('Failed to clear connection state:', err);
    }
  }, []);

  // 检查MetaMask是否安装
  const checkMetaMaskInstalled = useCallback(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return true;
    }
    return false;
  }, []);

  // 刷新余额
  const refreshBalance = useCallback(async () => {
    if (!state.provider || !state.account) return;

    try {
      const balance = await state.provider.getBalance(state.account);
      setState(prev => ({
        ...prev,
        balance: ethers.formatEther(balance),
      }));
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [state.provider, state.account]);

  // 启动自动余额刷新
  const startAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    refreshEnabledRef.current = true;
    refreshIntervalRef.current = setInterval(() => {
      if (refreshEnabledRef.current) {
        refreshBalance();
      }
    }, 10000); // 每10秒刷新一次

    setState(prev => ({ ...prev, isAutoRefreshing: true }));
  }, [refreshBalance]);

  // 停止自动余额刷新
  const stopAutoRefresh = useCallback(() => {
    refreshEnabledRef.current = false;
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    setState(prev => ({ ...prev, isAutoRefreshing: false }));
  }, []);

  // 添加网络到MetaMask
  const addNetwork = useCallback(async (chainId: number) => {
    const networkConfig = getNetworkConfig(chainId);
    if (!networkConfig || !window.ethereum) {
      throw new Error('Network not supported or MetaMask not available');
    }

    try {
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
        }],
      });
    } catch (err) {
      const error = err as EthereumError;
      throw new Error(`Failed to add network: ${error.message}`);
    }
  }, []);

  // 连接钱包（内部方法，支持静默连接）
  const connectWalletInternal = useCallback(async (silent: boolean = false) => {
    if (!checkMetaMaskInstalled()) {
      if (!silent) setError('请安装MetaMask钱包');
      return false;
    }

    if (!silent) setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as EthereumProvider);

      // 请求账户访问权限（只有在非静默模式下）
      if (!silent) {
        await provider.send('eth_requestAccounts', []);
      } else {
        // 静默模式下检查是否已有权限
        const accounts = await provider.listAccounts();
        if (accounts.length === 0) {
          return false; // 没有权限，不自动连接
        }
      }

      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(account);

      setState({
        isConnected: true,
        account,
        provider,
        signer,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        isAutoRefreshing: false,
      });

      // 保存连接状态
      saveConnectionState(account, Number(network.chainId));

      // 连接成功后启动自动刷新
      setTimeout(() => {
        startAutoRefresh();
      }, 1000);

      return true;
    } catch (err) {
      const error = err as EthereumError;
      if (!silent) setError(error.message || '连接钱包失败');
      return false;
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [checkMetaMaskInstalled, startAutoRefresh, saveConnectionState]);

  // 公开的连接钱包方法
  const connectWallet = useCallback(async () => {
    return await connectWalletInternal(false);
  }, [connectWalletInternal]);

  // 断开连接
  const disconnect = useCallback(() => {
    stopAutoRefresh();
    clearConnectionState();
    setState({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: null,
      isAutoRefreshing: false,
    });
    setError(null);
  }, [stopAutoRefresh, clearConnectionState]);

  // 切换网络
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!state.provider) return;

    try {
      await state.provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${chainId.toString(16)}` }
      ]);
    } catch (err) {
      const error = err as EthereumError;
      // 如果网络未添加到MetaMask，尝试添加
      if (error.code === 4902) {
        try {
          await addNetwork(chainId);
          // 添加成功后再次尝试切换
          await state.provider.send('wallet_switchEthereumChain', [
            { chainId: `0x${chainId.toString(16)}` }
          ]);
        } catch (addError) {
          const addErr = addError as EthereumError;
          setError(addErr.message || '添加网络失败');
        }
      } else {
        setError(error.message || '切换网络失败');
      }
    }
  }, [state.provider, addNetwork]);

  // 调用只读合约方法
  const callContract = useCallback(async (
    contractAddress: string,
    abi: string[],
    methodName: string,
    params: unknown[] = []
  ) => {
    if (!state.provider) {
      throw new Error('请先连接钱包');
    }

    try {
      const contract = new ethers.Contract(contractAddress, abi, state.provider);
      return await contract[methodName](...params);
    } catch (err) {
      const error = err as EthereumError;
      throw new Error(`调用合约失败: ${error.message}`);
    }
  }, [state.provider]);

  // 发送交易到合约
  const sendTransaction = useCallback(async (
    contractAddress: string,
    abi: Record<string, unknown>[],
    methodName: string,
    params: unknown[] = [],
    value?: string,
    gasLimit?: bigint,
    gasPrice?: bigint
  ) => {
    if (!state.signer) {
      throw new Error('请先连接钱包');
    }

    try {
      const contract = new ethers.Contract(contractAddress, abi, state.signer);

      // 构建交易选项
      const txOptions: Record<string, unknown> = {};
      if (value) txOptions.value = ethers.parseEther(value);
      if (gasLimit) txOptions.gasLimit = gasLimit;
      if (gasPrice) txOptions.gasPrice = gasPrice;

      const tx = await contract[methodName](...params, txOptions);
      const receipt = await tx.wait();

      // 交易完成后刷新余额
      setTimeout(() => refreshBalance(), 2000);

      return receipt;
    } catch (err) {
      const error = err as EthereumError;
      throw new Error(`发送交易失败: ${error.message}`);
    }
  }, [state.signer, refreshBalance]);

  // 监听账户和网络变化
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethereum = window.ethereum as EthereumProvider;

      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== state.account) {
          // 重新连接新账户
          connectWalletInternal(true);
        }
      };

      const handleChainChanged = () => {
        // 当网络变化时重新连接
        if (state.isConnected) {
          connectWalletInternal(true);
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [state.account, state.isConnected, connectWalletInternal, disconnect]);

  // 初始化时检查连接状态和自动连接
  useEffect(() => {
    const initializeConnection = async () => {
      if (!checkMetaMaskInstalled()) {
        setIsInitialized(true);
        return;
      }

      // 检查是否应该自动连接
      const storedState = getStoredConnectionState();

      if (storedState && storedState.shouldAutoConnect) {
        // 尝试自动连接
        const success = await connectWalletInternal(true);
        if (!success) {
          // 自动连接失败，清除存储状态
          clearConnectionState();
        }
      }

      setIsInitialized(true);
    };

    if (!isInitialized) {
      initializeConnection();
    }
  }, [isInitialized, checkMetaMaskInstalled, getStoredConnectionState, connectWalletInternal, clearConnectionState]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      stopAutoRefresh();
    };
  }, [stopAutoRefresh]);

  return {
    ...state,
    isLoading,
    error,
    isInitialized,
    connectWallet,
    disconnect,
    switchNetwork,
    addNetwork,
    callContract,
    sendTransaction,
    checkMetaMaskInstalled,
    refreshBalance,
    startAutoRefresh,
    stopAutoRefresh,
  };
};
