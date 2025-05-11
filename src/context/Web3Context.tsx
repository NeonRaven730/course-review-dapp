import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

interface Web3ContextType {
    account: string | null;
    contract: ethers.Contract | null;
    provider: ethers.providers.Web3Provider | null;
    connectWallet: () => Promise<void>;
    isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType>({
    account: null,
    contract: null,
    provider: null,
    connectWallet: async () => {},
    isConnected: false,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectWallet = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                setAccount(accounts[0]);
                setProvider(provider);
                setContract(contract);
                setIsConnected(true);
            } else {
                alert('Please install MetaMask!');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                
                if (accounts.length > 0) {
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                    
                    setAccount(accounts[0]);
                    setProvider(provider);
                    setContract(contract);
                    setIsConnected(true);
                }
            }
        };

        checkConnection();

        // Listen for account changes
        if (typeof window.ethereum !== 'undefined') {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length === 0) {
                    setAccount(null);
                    setContract(null);
                    setIsConnected(false);
                } else {
                    setAccount(accounts[0]);
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                if (typeof window.ethereum !== 'undefined') {
                    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                }
            };
        }
    }, []);

    return (
        <Web3Context.Provider value={{ account, contract, provider, connectWallet, isConnected }}>
            {children}
        </Web3Context.Provider>
    );
}; 