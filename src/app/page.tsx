"use client";
import React, { useState } from "react";
import Image from "next/image";

// loader
import { PulseLoader } from "react-spinners";

// img
import Frame from "@/assets/frame.png";
import Button from "@/assets/button.png";
import Contract from "@/utils/Contract";
import { notifyFailed } from "@/utils/Notify";

export default function Home() {
    const [reward, setReward] = useState<string>("x0");
    const [spinBtn, setSpinBtn] = useState<boolean>(true);

    const time = (ms: any) => new Promise((res) => setInterval(res, ms));

    function randomReward(randomValue: number) {
        if (randomValue < 0.4) {
            return "x0.2";
        } else if (randomValue < 0.7) {
            return "x0.5";
        } else if (randomValue < 0.85) {
            return "x1.0";
        } else if (randomValue < 0.95) {
            return "x2.0";
        } else if (randomValue < 0.99) {
            return "x5.0";
        } else {
            return "x10";
        }
    }

    async function spinReward() {
        let Reward;
        setSpinBtn(false);
        for (let i = 1; i <= 30; i++) {
            const rd = Math.random();
            setReward(randomReward(rd));
            Reward = randomReward(rd);
            await time(i * 10 + 30);
        }
        setSpinBtn(true);
        return Reward;
    }

    async function start() {
        const contract = new Contract();
        try {
            const send = await contract.send(Number(process.env.PRICE));
            if (send) {
                const addr = await send.from;
                let rw = await spinReward();
                if (rw) {
                    const tx = await contract.receive(
                        Number(rw.substring(1)),
                        addr,
                    );
                    return tx;
                }
            }
            return;
        } catch (error) {
            notifyFailed("Cancel transaction!");
        }
    }

    return (
        <>
            <div className="relative">
                <Image
                    src={Frame}
                    alt=""
                    priority
                    className="m-auto"
                    width={500}
                    height={500}
                />
                <p className="text-[6rem] text-[#212121] text-center absolute w-full top-1/3">
                    {reward}
                </p>
            </div>
            <div className="-translate-y-20">
                {spinBtn ? (
                    <div>
                        <Image
                            src={Button}
                            alt=""
                            className="m-auto cursor-pointer hover:scale-125 duration-300"
                            width={50}
                            height={50}
                            onClick={start}
                        />
                    </div>
                ) : (
                    <p className="text-2xl py-2 text-center">
                        <PulseLoader color="#BCD9FD" />
                    </p>
                )}
                <p className="mt-2 font-semibold text-xl text-[#BCD9FD]">
                    Use {process.env.PRICE} SepoliaETH
                </p>
            </div>
        </>
    );
}
