import LoadingScreen from "@/components/LoadingScreen";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "react-query";

export default function Page() {

    const { data: selfInfo, isLoading: isLoadingSelfInfo, error: selfInfoError } = useQuery(['self-info'], async () => {
        const res = await axios.get("/api/me")

        return res.data.data
    });

    const activeOrganizationId = selfInfo?.organizations?.[0]?.id

    const router = useRouter()

    const queryClient = useQueryClient()

    const { mutate } = useMutation(
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

    return (
        <>
            <Head>
                <title>Dashboard - Cascade</title>
            </Head>
            <div className="bg-gray-800" style={{ minHeight: "100vh", display: "flex" }}>

                <div className="flex flex-wrap gap-10 h-fit">

                    {flowsData.map(i => <div key={i.id} className="flex flex-col border-gray-700 border bg-gray-700" style={{
                        width: "32rem",
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
                            <img src="https://picsum.photos/200/300" 
                            style={{ minWidth: "100%", minHeight: "100%" }} />
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
                    <button className="flex flex-col border-gray-700 border" onClick={() => mutate()} style={{
                        width: "22.4rem",
                        overflow: "hidden",
                        borderRadius: "8px",
                        height: "12rem",

                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <h2 style={{ color: "white", fontWeight: "bold" }}>Create a new flow</h2>
                    </button>
                </div>
            </div>
        </>
    )
}
