"use client";
import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { MdDashboard } from "react-icons/md";
import Owner from "./Owner";

export default function ConnectWallet() {
    const initialState = { accounts: [], chainId: "" };
    const [wallet, setWallet] = useState(initialState);

    const [isConnecting, setIsConnecting] = useState(false);

    const [popup, setPopup] = useState<boolean>(false);

    const onPopup = () => {
        setPopup(!popup);
    };

    useEffect(() => {
        const refreshAccounts = (accounts: any) => {
            if (accounts.length > 0) {
                updateWallet(accounts);
            } else {
                setWallet(initialState);
            }
        };

        const refreshChain = (chainId: any) => {
            setWallet((wallet) => ({ ...wallet, chainId }));
        };

        const getProvider = async () => {
            const provider = await detectEthereumProvider({ silent: true });

            if (provider) {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                refreshAccounts(accounts);
                window.ethereum.on("accountsChanged", refreshAccounts);
                window.ethereum.on("chainChanged", refreshChain);
            }
        };

        getProvider();

        return () => {
            window.ethereum?.removeListener("accountsChanged", refreshAccounts);
            window.ethereum?.removeListener("chainChanged", refreshChain);
        };
    }, []);

    const updateWallet = async (accounts: any) => {
        const chainId = await window.ethereum!.request({
            method: "eth_chainId",
        });
        setWallet({ accounts, chainId });
    };

    const handleConnect = async () => {
        setIsConnecting(true);
        await window.ethereum
            .request({
                method: "eth_requestAccounts",
            })
            .then((accounts: []) => {
                updateWallet(accounts);
            })
            .catch((err: any) => {
                console.log(err);
            });
        setIsConnecting(false);
    };

    const disableConnect = Boolean(wallet) && isConnecting;

    function shortenEthereumAddress(address: any) {
        if (address && address.startsWith("0x") && address.length === 42) {
            return address.substr(0, 4) + "..." + address.slice(-4);
        } else {
            return "Invalid Ethereum Address";
        }
    }

    return (
        <div>
            <div className="fixed right-0 m-8 text-lg font-semibold">
                {wallet.accounts.length < 1 ? (
                    <button
                        disabled={disableConnect}
                        onClick={handleConnect}
                        className="py-2 px-4 bg-[#BCD9FD] rounded-2xl"
                    >
                        Connect MetaMask
                    </button>
                ) : (
                    <div className="flex justify-center items-center gap-2 select-none">
                        {wallet.accounts[0] ===
                        process.env.OWNER?.toLowerCase() ? (
                            <button
                                onClick={onPopup}
                                className="cursor-pointer text-white text-lg flex justify-center items-center gap-2 hover:-translate-y-2 duration-300 px-4 py-2 rounded-xl"
                            >
                                <p className="text-2xl text-[#BCD9FD]">
                                    <MdDashboard />
                                </p>
                                <p>Control</p>
                                <div className="static"></div>
                            </button>
                        ) : null}
                        <p className="text-slate-900 text-lg flex justify-center items-center gap-2 hover:-translate-y-2 duration-300 px-4 py-2 bg-[#BCD9FD] rounded-xl">
                            {shortenEthereumAddress(wallet.accounts[0])}
                        </p>
                    </div>
                )}
            </div>
            {wallet.accounts[0] === process.env.OWNER?.toLowerCase() ? (
                <Owner popup={popup} setPopup={setPopup} />
            ) : (
                null
            )}
        </div>
    );
}
