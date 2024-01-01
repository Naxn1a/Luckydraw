import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

export async function getProvider() {
    const provider = await detectEthereumProvider({ silent: true });
    if (provider) {
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        return signer
    }
}