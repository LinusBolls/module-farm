import ImageKit from "imagekit";

import React, { useCallback } from 'react';
import Explorer from "@/components/Explorer"
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowInstance,
    OnConnect,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';

import io from 'socket.io-client'

import 'reactflow/dist/style.css';
import { EdgesContext, useEdgesProvider } from '@/components/NodeEditor/ApiNode/useEdges';
import { useDrop } from 'react-dnd';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import AppGrid from '@/components/layout/AppGrid';
import { getSession, useSession } from 'next-auth/react';
import { Input } from '@chakra-ui/react';
import SocketParticipant from '@/realtime-service/SocketParticipant';
import LoadingScreen from '@/components/LoadingScreen';
import Head from 'next/head';
import Link from 'next/link';
import ApiNode from '@/components/NodeEditor/ApiNode';

const nodeTypes = {
    api: ApiNode,
};

const minimapStyle = {
    height: 120,
};
interface ExplorerFiles {
    services: {
        id: string
        displayName: string
        url: string
        iconUrl: string
    }[]
    blocks: {
        id: string
        serviceId: string
        iconUrl: string
        displayName: string
        description: string
    }[]
}
interface WorkflowEdge {
    id: string
    workflowId: string
    sourceNodeId: string
    targetNodeId: string
    sourceNode: {
        id: string
        workflowId: string
        blockId: string
        posX: number
        posY: number
    }
    targetNode: {
        id: string
        workflowId: string
        blockId: string
        posX: number
        posY: number
    }
}
interface WorkflowNode {
    id: string
    workflowId: string
    blockId: string
    posX: number
    posY: number
    block: {
        id: string
        servideId: string
        iconUrl: string
        displayName: string
        description: string
    }
}
interface FlowData {
    id: string
    emoji: string
    displayName: string
    description: string
    ownerId: string
    nodes: WorkflowNode[]
    edges: WorkflowEdge[]
}

const Page = () => {

    const router = useRouter()

    const { organizationId, flowId } = router.query

    const { data: flowData, isLoading: isFlowDataLoading, error: flowDataError } = useQuery<FlowData>({
        queryKey: ['flow-data', organizationId, flowId],
        queryFn: async () => {
            const res = await axios.get(`/api/organizations/${organizationId}/flows/${flowId}`)

            return res.data.data
        }
    });

    const queryClient = useQueryClient()

    const updateFlowDataMutation = useMutation(
        async (updatedFlowData: {displayName?: string, thumbnailId?: string}) => {

            const { thumbnailId, ...rest } = updatedFlowData

            const res = await axios.put(
                `/api/organizations/${organizationId}/flows/${flowId}`,
                updatedFlowData,
                { withCredentials: true },
            );

            return res.data.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['flow-data', organizationId, flowId]);
            },
        }
    );

    const { data: explorerFiles, isLoading: areExplorerFilesLoading, error: explorerFilesError } = useQuery<ExplorerFiles>('explorer-files', async () => {
        const res = await axios.get("/api/flowEditor/blocks")

        return res.data.data
    });

    const itemTypes = (explorerFiles?.services ?? []).map(i => ({
        id: i.id,
        displayName: i.displayName,
        iconUrl: i.iconUrl
    })).reduce((obj, i) => ({ ...obj, [i.id]: i }), {
        defaultfolder: {
            id: "defaultfolder",
            displayName: "default folder",
            iconUrl: null,
        },
    })

    const items = (explorerFiles?.blocks ?? []).map(i => ({
        id: i.id,
        parentId: null,
        childrenIds: [],
        type: i.serviceId,
        containerType: "FILE",
        displayName: i.displayName,
        iconUrl: "",
    })).reduce((obj, i) => ({ ...obj, [i.id]: i }), {
        "1": {
            id: "1",
            parentId: null,
            childrenIds: [],
            type: "defaultfolder",
            containerType: "FOLDER",
            displayName: "Workflows"
        },
        "4": {
            id: "4",
            parentId: null,
            childrenIds: (explorerFiles?.blocks ?? []).map(i => i.id),
            type: "defaultfolder",
            containerType: "FOLDER",
            displayName: "Components"
        },
        "2": {
            id: "2",
            parentId: null,
            childrenIds: [],
            type: "defaultfolder",
            containerType: "FOLDER",
            displayName: "Recently used"
        },
        "3": {
            id: "3",
            parentId: null,
            childrenIds: [],
            type: "defaultfolder",
            containerType: "FOLDER",
            displayName: "Your files"
        },
        // "5": {
        //     id: "5",
        //     parentId: null,
        //     childrenIds: (explorerFiles?.blocks ?? []).map(i => i.id),
        //     type: "defaultfolder",
        //     containerType: "FOLDER",
        //     displayName: "OpenAi"
        // },
    })

    const { data: selfInfo, isLoading: isLoadingSelfInfo, error: selfInfoError } = useQuery('self-info', async () => {
        const res = await axios.get("/api/me")

        return res.data.data
    });

    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)

    const onInit = (i: ReactFlowInstance) => {

        reactFlowInstance.current = i
    }

    const initialNodes = (flowData?.nodes ?? []).map(i => {

        return {
            id: i.id,
            type: "api",
            position: { x: i.posX, y: i.posY },
            data: {
                selects: {
                    'handle-0': 'smoothstep',
                    'handle-1': 'smoothstep',
                },
                taskInfo: {
                    title: i.block.displayName,
                    description: i.block.description,
                    iconUrl: i.block.iconUrl,
                },
            },
        }
    })
    const initialEdges = (flowData?.edges ?? []).map(i => {

        return {
            id: i.id,
            source: i.sourceNodeId,
            target: i.targetNodeId,
        }
    })
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect: OnConnect = useCallback((params) => {
        setEdges((eds) => addEdge(params, eds))
    }, []);

    const nodesRef = useRef<any[] | null>(null)

    useEffect(() => {
        nodesRef.current = nodes
    }, [nodes])

    useEffect(() => {
        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [isFlowDataLoading])

    // we are using a bit of a shortcut here to adjust the edge type
    // this could also be done with a custom edge for example
    const edgesWithUpdatedTypes = edges.map((edge) => {
        if (edge.sourceHandle) {
            // @ts-ignore
            const edgeType = nodes.find((node) => node.type === 'api').data.selects[edge.sourceHandle];
            edge.type = edgeType;
        }

        return edge;
    });

    const [mousePosRelativeToPane, setMousePosRelativeToPane] = useState({ x: 0, y: 0 })

    const lal = useRef(mousePosRelativeToPane)

    useEffect(() => {
        lal.current = mousePosRelativeToPane

    }, [mousePosRelativeToPane])

    const currentWorkflow = useRef<any>(null)

    useEffect(() => {
        currentWorkflow.current = flowData
    }, [flowData])

    const dings = useRef<any>(null)

    useEffect(() => {
        dings.current = explorerFiles
    }, [explorerFiles])

    useEffect(() => {
        if (reactFlowInstance.current == null) return

        const savedViewportStr = window.localStorage.getItem("cascade:flowEditor:viewport")

        if (!savedViewportStr) return

        const savedViewport = JSON.parse(savedViewportStr)

        /**
         * TODO: this sometimes doesn't work, and the viewport just
         * defaults to the center
         */
        reactFlowInstance.current.setViewport(savedViewport)

    }, [reactFlowInstance.current])

    function saveReactFlowViewport() {

        if (typeof window !== "undefined" && window.localStorage && reactFlowInstance.current != null) {

            const viewport = reactFlowInstance.current.getViewport()

            window.localStorage.setItem("cascade:flowEditor:viewport", JSON.stringify(viewport, null, 2))
        }
    }

    const [_, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item, monitor) => {

            const upperLeftCornerOfNode = lal.current

            const halfOfNodeSize = 16 * 3.5

            const centerOfNode = {
                x: upperLeftCornerOfNode.x - halfOfNodeSize,
                y: upperLeftCornerOfNode.y - halfOfNodeSize,
            }
            const id = uuidv4()

            // @ts-ignore
            const nodeType = dings.current?.blocks.filter(i => i.id === item.id)?.[0]

            const workflowId = currentWorkflow.current.id

            socket.current.emit("EDITOR_CREATE_NODE", {
                workflowId,
                id,
                type: nodeType.id,
                pos: centerOfNode,
            })

            setNodes(prev => [...prev, {
                id,
                type: 'api',
                position: centerOfNode,
                data: {
                    selects: {
                        'handle-0': 'smoothstep',
                        'handle-1': 'smoothstep',
                    },
                    taskInfo: {
                        title: nodeType.displayName,
                        description: nodeType.description,
                        iconUrl: nodeType.iconUrl,
                    },
                },
            }])
        },
        hover: (_, monitor) => {

            const pos = monitor.getClientOffset()!

            const bounds = reactFlowRef.current.getBoundingClientRect();

            const position = reactFlowInstance.current!.project({
                x: pos.x - bounds.left,
                y: pos.y - bounds.top
            });
            setMousePosRelativeToPane(position)
        }
    }))

    const reactFlowRef = useRef<any>(null)

    const screenshotRef = useRef<any>(null)

    const handleDownloadImage = async () => {

        reactFlowInstance.current!.fitView()

        const element = screenshotRef.current;

        const canvas = await html2canvas(element);

        const thumbnailFormdata = await new Promise(res => {

            canvas.toBlob((blob) => {
                const formData = new FormData();

                formData.append('file', blob!);

                res(formData)
            });
        })
        interface Thumbnail {
            id: string
            displayName: string
            fileName: string
            mimetype: "image/png",
            createdAt: string
            assetRole: "WORKFLOW_THUMBNAIL",
            uploaderId: string,
        }
        const res = await axios.post<Thumbnail>("/api/files/thumbnails", thumbnailFormdata);

        updateFlowDataMutation.mutate({ thumbnailId: res.data.id })
    };

    const currentOrganization = selfInfo?.organizations[0]

    const socket = useRef<any>(null)

    const connectToSocket = () => {

        const rawSocket = io('http://localhost:5050', { path: '/socket', withCredentials: true });

        socket.current = new SocketParticipant(rawSocket)
    }
    useEffect(connectToSocket, [])

    const edgesValue = useEdgesProvider(socket.current, currentWorkflow.current?.id)

    useEffect(() => {
        setEdges(prev => [...prev, ...edgesValue.edges])
    }, [edgesValue.edges])

    // const [isTakingWorkflowThumbnail, setIsTakingWorkflowThumbnail] = useState(false)

    // useEffect(() => {
    //     if (!isFlowDataLoading) {
    //         alert("Moin")
    //     }
    // }, [isFlowDataLoading])

    if (isLoadingSelfInfo || isFlowDataLoading || areExplorerFilesLoading || flowData == null) return <LoadingScreen />

    const pageTitle = flowData ? `${flowData.displayName} - Cascade` : "Cascade"

    return <>
        <Head>
            <title>{pageTitle}</title>
        </Head>
        <AppGrid
            InboxesHeader={<Link href="/" className="flex items-center w-full h-full px-8 gap-4">
                <img className="w-6 h-6 rounded-md hover:border border-gray-500" src={selfInfo.avatarUrl ?? "https://www.seekpng.com/png/small/143-1435868_headshot-silhouette-person-placeholder.png"} />
                <h2 style={{ fontWeight: "bold", color: "white" }}>{currentOrganization.displayName}</h2>
            </Link>}
            ChatHeader={
                <div className="flex items-center w-full h-full px-8">

                    <Input
                        className="text-white font-bold focus:outline-none"
                        style={{
                            background: "none",
                            flex: 1,
                        }}
                        placeholder="Flow name"
                        defaultValue={flowData.displayName}
                        onBlur={e => {
                            updateFlowDataMutation.mutate({ displayName: e.target.value })
                        }}
                    />
                </div>
            }
            InfoHeader={<div className="flex items-center justify-end w-full h-full px-8 gap-4">
                <img className="w-8 h-8 rounded-full hover:border border-gray-500" src={selfInfo.avatarUrl ?? "https://www.seekpng.com/png/small/143-1435868_headshot-silhouette-person-placeholder.png"} />

                <button onClick={handleDownloadImage} style={{ backgroundColor: "#3856C5" }} className="rounded h-8 px-3 flex items-center justify-center text-gray-100 hover:brightness-110 duration-100 active:scale-90">Invite</button>
            </div>}
            // @ts-ignore
            Inboxes={<Explorer items={items} itemTypes={itemTypes} topLevelItemIds={["1", "2", "3", "4"]} />}
            Chat={
                <div className="w-full h-full" ref={screenshotRef}>
                    <div ref={drop} className="w-full h-full bg-gray-900"><EdgesContext.Provider value={edgesValue}>
                        <ReactFlow
                            onMove={saveReactFlowViewport}
                            nodes={nodes}
                            edges={edgesWithUpdatedTypes}
                            onNodesChange={e => {

                                e.map(i => {

                                    if (i.type !== "position" && i.type !== "remove") return

                                    const nodeId = i.id

                                    const target = nodesRef.current!.filter(j => j.id === nodeId)[0]

                                    const pos = target?.position

                                    const workflowId = flowData.id

                                    if (i.type === "position") {
                                        socket.current.emit("EDITOR_MOVE_NODE", {
                                            workflowId,
                                            nodeId,
                                            pos,
                                        })
                                    }
                                    if (i.type === "remove") {
                                        socket.current.emit("EDITOR_DELETE_NODE", {
                                            workflowId,
                                            nodeId,
                                        })
                                    }
                                })
                                onNodesChange(e)
                            }}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={onInit}
                            fitView
                            attributionPosition="top-right"
                            nodeTypes={nodeTypes}
                            proOptions={{ hideAttribution: true }}
                            ref={reactFlowRef}
                        >
                            {/* <MiniMap style={minimapStyle} zoomable pannable /> */}
                            <Controls />
                            <Background color="#aaa" gap={16} />
                        </ReactFlow>
                    </EdgesContext.Provider>
                    </div>
                </div>}
        />
    </>
};

export default Page;