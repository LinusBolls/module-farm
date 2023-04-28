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
import { PlayArrow } from "@mui/icons-material";

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

                    <div className="gap-8 grid grid-cols-3 max-xl:grid-cols-2 max-lg:grid-cols-1">

                        {flowsData.map(i => <div key={i.id} className="shrink-0 flex flex-col border-gray-700 border bg-gray-700 w-full" style={{
                            // width: "32rem",
                            overflow: "hidden",
                            borderRadius: "8px"

                        }}>
                            <Link href={`/organizations/${activeOrganizationId}/flows/${i.id}`} className="flex items-center justify-center w-full aspect-video overflow-hidden">
                                <IKImage
                                    className="w-full h-full"
                                    path="/workflow-thumbnail-644a757e5eb3a697189dcf7e_xzINvGSIs.jpg"

                                />
                            </Link>
                            <div className="flex h-16">
                                <div className="flex items-center justify-center h-full aspect-square">
                                    <button className="flex items-center justify-center w-10 aspect-square rounded-full hover:brightness-110 duration-100" style={{ background: "#3856C5" }}>
                                        <PlayArrow fontSize="medium" htmlColor="white"/>
                                    </button>
                                </div>
                                <div className="flex flex-col justify-center gap-1">
                                    <h2 className="text-white font-bold text-base text-ellipsis overflow-hidden whitespace-nowrap grow-1">{i.displayName}</h2>
                                    <p style={{ color: "#999" }} className="text-xs font-semibold text-ellipsis overflow-hidden">Edited 20h ago</p>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>} />
        </>
    )
}
