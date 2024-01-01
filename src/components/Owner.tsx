"use client";
import React, { useEffect, useState } from "react";
import Contract from "@/utils/Contract";
import { notifySuccess, notifyFailed } from "@/utils/Notify";

export default function AdminDashboard({ popup, setPopup }: any) {
    const [deposit, setDeposit] = useState<string>("0");
    const [withdraw, setWithdraw] = useState<string>("0");
    const [balance, setBalance] = useState<string>("0");
    const [refresh, setRefresh] = useState<boolean>(false);

    const changeDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeposit(e.target.value);
    };

    const changeWithdraw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWithdraw(e.target.value);
    };

    async function getBalance() {
        const contract = new Contract();
        const balance = await contract.balance();
        setBalance(balance);
    }

    async function check(amount: number) {
        if (!amount || amount <= 0) return notifyFailed("Please try again!");
        if (window.confirm(`Are you want to deposit ${amount} ETH ?`) === false)
            return notifyFailed("Cancel transaction!");
    }

    async function handleDeposit(amount: number) {
        check(amount);
        const contract = new Contract();
        const tx = await contract.send(amount);
        if (tx) {
            setDeposit("0");
            setRefresh(!refresh);
        }
    }

    async function handleWithdraw(amount: number) {
        check(amount);
        const contract = new Contract();
        const tx = await contract.withdraw(amount);
        if (tx) {
            setWithdraw("0");
            setRefresh(!refresh);
        }
    }

    useEffect(() => {
        getBalance();
    }, [popup, refresh]);

    return (
        <div
            className={`z-10 min-h-screen w-full fixed flex justify-center items-center ${
                popup ? "-translate-y-0" : "-translate-y-full"
            } duration-500 backdrop-blur-xl`}
        >
            <div className="admin-card">
                <button
                    onClick={() => setPopup(false)}
                    className="absolute text-2xl top-0 right-0 m-6"
                >
                    X
                </button>
                <div className="text-center mb-8 text-4xl select-none">
                    {balance} ETH
                </div>
                <div className="grid grid-cols-3 mb-4">
                    <input
                        className="col-span-2 px-4 py-2 rounded-xl shadow-2xl"
                        type="number"
                        min={0}
                        value={deposit}
                        onChange={changeDeposit}
                    />
                    <div className="flex justify-center items-center">
                        <button
                            onClick={() => handleDeposit(Number(deposit))}
                            className="bg-[#BCD9FD] text-slate-900 font-semibold px-4 py-2 rounded-xl"
                        >
                            deposit
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 mb-4">
                    <input
                        className="col-span-2 px-4 py-2 rounded-xl shadow-2xl"
                        type="number"
                        min={0}
                        value={withdraw}
                        onChange={changeWithdraw}
                    />
                    <div className="flex justify-center items-center">
                        <button
                            onClick={() => handleWithdraw(Number(withdraw))}
                            className="bg-[#BCD9FD] text-slate-900 font-semibold px-4 py-2 rounded-xl"
                        >
                            withdraw
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
