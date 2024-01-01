import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import configContract from "@/contract/Contract.json";
import { notifyLoaded, notifyLoading } from "@/utils/Notify";

class Contract {
    private address;
    private abi;

    constructor() {
        this.address = configContract.address;
        this.abi = configContract.abi;
    }

    async send(amount: number) {
        const contract = await this.connected();
        const eth = ethers.utils.parseEther(`${amount}`);
        if (contract) {
            let tx = await contract._send({ value: eth });
            const id = notifyLoading("Waiting for transaction");
            await tx.wait();
            if (!tx) {
                notifyLoaded(id, "Error transaction", false);
                return tx;
            }
            notifyLoaded(id, "The transaction was successful.", true);
            return tx;
        }
    }

    async receive(amount: number, addr: string) {
        const SECRET_KEY = process.env.SECRET_KEY;
        const provider = await detectEthereumProvider({ silent: true });
        if (provider && SECRET_KEY) {
            const ethProvider = new ethers.providers.Web3Provider(provider);
            const wallet = new ethers.Wallet(SECRET_KEY, ethProvider);
            const contract = new ethers.Contract(
                this.address,
                this.abi,
                wallet,
            );
            amount = amount * Number(process.env.PRICE);
            const eth = ethers.utils.parseEther(`${amount}`);
            const tx = await contract._receive(eth, addr);
            const id = notifyLoading("Sending transaction.");
            await tx.wait();
            if (!tx) return notifyLoaded(id, `Transaction error.`, false);
            notifyLoaded(id, `Your reward is ${amount.toFixed(2)}`, true);
        }
        return;
    }

    async balance() {
        const contract = await this.connected();
        if (contract) {
            let balance = await contract._balance();
            balance = ethers.utils.formatEther(balance)
            return `${Number(balance).toFixed(2)}`;
        }
        return "";
    }

    async withdraw(amount: number) {
        const contract = await this.connected();
        const eth = ethers.utils.parseEther(`${amount}`);
        if (contract) {
            const tx = await contract._withdraw(eth);
            const id = notifyLoading("Waiting for transaction");
            await tx.wait();
            if (!tx) {
                notifyLoaded(id, "Error transaction", false);
                return false;
            }
            notifyLoaded(id, "The transaction was successful.", true);
            return true;
        }
        return;
    }

    async connected() {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: "0xaa36a7",
                },
            ],
        });
        const provider = await detectEthereumProvider({ silent: true });
        if (provider) {
            try {
                const ethProvider = new ethers.providers.Web3Provider(provider);
                const signer = ethProvider.getSigner();
                return new ethers.Contract(this.address, this.abi, signer);
            } catch (error) {
                console.log(">> Error _contract in luckydraw.ts\n\n", error);
            }
        }
        return;
    }
}

export default Contract;
