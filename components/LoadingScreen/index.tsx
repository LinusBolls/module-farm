import Head from "next/head";
import Image from "next/image";

import styles from "./floatAnimation.module.css"

export default function LoadingScreen() {
    return <>
        <Head>
            <title>Loading - Cascade</title>
        </Head>
        <div className="flex items-center justify-center w-screen h-screen bg-gray-800 text-gray-100">
            <div className="relative flex items-center justify-center w-2/12 h-1/5">
                <Image
                    className={styles.floating}
                    src="/cascade/logo.svg"
                    alt="Cascade Logo"
                    fill={true}
                />
            </div>
        </div>
    </>
}