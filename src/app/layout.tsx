import type { Metadata } from "next";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import ConnectWallet from "@/components/ConnectWallet";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
    title: "Lucky Draw",
    description: "Dapp Lucky Draw",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ConnectWallet />
                <div className="Container">
                    <nav>
                        Lucky Draw
                    </nav>
                    {children}
                    <footer>
                        <p>© 2023 Naxn1a | Dapp</p>
                    </footer>
                </div>
                <ToastContainer />
            </body>
        </html>
    );
}
