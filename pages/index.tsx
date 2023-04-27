import LoadingScreen from "@/components/LoadingScreen";
import AppGrid from "@/components/layout/AppGrid";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { signOut } from "next-auth/react"

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { IKImage } from "imagekitio-react";

export default function Page() {

    const { data: selfInfo, isLoading: isLoadingSelfInfo, error: selfInfoError } = useQuery(['self-info'], async () => {
        const res = await axios.get("/api/me")

        return res.data.data
    });

    const activeOrganizationId = selfInfo?.organizations?.[0]?.id

    const router = useRouter()

    const queryClient = useQueryClient()

    const { mutate: createNewFlow } = useMutation(
        async () => {
            const res = await axios.post(`/api/organizations/${activeOrganizationId}/flows`)
            return res.data.data.id
        },
        {
            onSuccess: (newFlowId) => {
                queryClient.invalidateQueries('flowsData');
                router.push(`/organizations/${activeOrganizationId}/flows/${newFlowId}`)
            }
        }
    )

    const { data: flowsData, isLoading: isLoadingFlowsData, error: flowsDataError } = useQuery<any[]>(['flowsData', activeOrganizationId], async () => {
        const res = await axios.get(`/api/organizations/${activeOrganizationId}/flows`)
        return res.data.data
    })
    if (isLoadingSelfInfo || isLoadingFlowsData || flowsData == null || selfInfo == null) return <LoadingScreen />

    const currentOrganization = selfInfo?.organizations[0]

    return (
        <>
            <Head>
                <title>Dashboard - Cascade</title>
            </Head>
            <AppGrid
                InboxesHeader={<Link href="/" className="flex items-center w-full h-full px-8 gap-4">
                    <img className="w-6 h-6 rounded-md hover:border border-gray-500" src={selfInfo.avatarUrl ?? "https://www.seekpng.com/png/small/143-1435868_headshot-silhouette-person-placeholder.png"} />
                    <h2 style={{ fontWeight: "bold", color: "white" }}>{currentOrganization.displayName}</h2>
                </Link>}
                ChatHeader={
                    <div className="flex items-center w-full h-full px-8">
                        <h1 className="text-white font-bold">Dashboard</h1>
                    </div>
                }
                InfoHeader={<div className="flex items-center justify-end w-full h-full px-8 gap-4">
                    <img className="w-8 h-8 rounded-full hover:border border-gray-500" src={selfInfo.avatarUrl ?? "https://www.seekpng.com/png/small/143-1435868_headshot-silhouette-person-placeholder.png"} />
                </div>}
                Inboxes={<div className="flex flex-col">
                    <Link href="/settings" className="flex items-center h-12 px-4 font-bold text-white hover:bg-gray-700 gap-4">
                        <SettingsIcon fontSize="small" />
                        Settings
                    </Link>
                    <button onClick={() => signOut()} className="flex items-center h-12 px-4 font-bold text-white hover:bg-gray-700 gap-4">
                        <LogoutIcon fontSize="small" />
                        Sign out
                    </button>
                </div>}
                Chat={<div className="flex flex-col h-full px-8 py-8 overflow-y-scroll">

                    <div className="flex items-center gap-8 mb-8">
                        <h2 className="text-white text-3xl font-bold">Workflows</h2>
                        <button className="flex items-center justify-center px-8 h-8 text-gray-700 font-bold border border-gray-700 rounded-md hover:border-gray-500 hover:text-white duration-100" onClick={() => createNewFlow()}>
                            New workflow
                        </button>
                    </div>

                    <div className="gap-8 grid grid-cols-2 max-lg:grid-cols-1">

                        {flowsData.map(i => <div key={i.id} className="shrink-0 flex flex-col border-gray-700 border bg-gray-700 w-full" style={{
                            // width: "32rem",
                            overflow: "hidden",
                            borderRadius: "8px"

                        }}>
                            <Link href={`/organizations/${activeOrganizationId}/flows/${i.id}`} style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",

                                height: "14rem",
                                width: "32rem",
                            }}>
                                <IKImage
                                    path={i.thumbnail.url}
                                />
                            </Link>
                            <div className="flex">
                                <div className="flex items-center justify-center h-full w-28" style={{ minHeight: "7rem" }}>
                                    <button className="flex items-center justify-center w-12 h-12 rounded-full hover:brightness-110 duration-100" style={{ background: "#3856C5" }}>
                                        <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.507 8.98751L2.93354 0.345248C2.62548 0.115443 2.27731 0 1.9281 0C0.819783 0.00250429 0 1.11225 0 2.3585V19.643C0 20.9001 0.82782 22 1.9289 22C2.27803 22 2.62652 21.8842 2.93474 21.654L14.5082 13.0117C15.0816 12.5819 15.4312 11.8208 15.4312 11.0008C15.4312 10.1807 15.0816 9.41962 14.507 8.98751Z" fill="white" />
                                        </svg>
                                    </button>
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",

                                    padding: "0.5rem",
                                    paddingLeft: "1rem",
                                    paddingRight: "1rem",

                                    gap: "4px",
                                }}>
                                    <h2 style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>{i.displayName}</h2>
                                    {/* <p style={{ color: "#999", fontWeight: 600, fontSize: "12px" }}>{i.description}</p> */}
                                    <p style={{ color: "#999", fontWeight: 600, fontSize: "12px" }}>Runs weekly | Edited 20h ago</p>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>} />
        </>
    )
}
