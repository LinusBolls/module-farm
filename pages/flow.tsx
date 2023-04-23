import React, { useCallback } from 'react';
import Explorer from "../components/Explorer"
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import { nodes as initialNodes, edges as initialEdges } from '../initial-elements';
import CustomNode from '../CustomNode';

import 'reactflow/dist/style.css';
import { EdgesContext, useEdgesProvider } from '@/components/NodeEditor/ApiNode/useEdges';
import { useDrop } from 'react-dnd';
import { randomUUID } from 'crypto';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

const nodeTypes = {
    custom: CustomNode,
};

const minimapStyle = {
    height: 120,
};

const OverviewFlow = () => {

    const { data, isLoading, error } = useQuery(['user-me'], async () => {
        const res = await axios.get("/api/me")

        return res.data.data
    });
    

    const [fuß, setFuß] = useState<any>(null)

    const onInit = (reactFlowInstance) => {

        console.log('flow loaded:', reactFlowInstance);

        setFuß(reactFlowInstance)
    }
    const fußRef = useRef(fuß)

    useEffect(() => {
        fußRef.current = fuß
    }, [fuß])

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    // we are using a bit of a shortcut here to adjust the edge type
    // this could also be done with a custom edge for example
    const edgesWithUpdatedTypes = edges.map((edge) => {
        if (edge.sourceHandle) {
            const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
            edge.type = edgeType;
        }

        return edge;
    });

    const edgesValue = useEdgesProvider()

    const [mousePosRelativeToPane, setMousePosRelativeToPane] = useState({ x: 0, y: 0 })

    const itemTypes = {
        defaultfolder: {
            id: "defaultfolder",
            displayName: "default folder",
            iconUrl: null,
        },
        notion: {
            id: "notion",
            displayName: "Notion",
            iconUrl: "https://img.icons8.com/ios/512/notion.png",
        },
        slack: {
            id: "slack",
            displayName: "Slack",
            iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
        },
        openai: {
            id: "openai",
            displayName: "OpenAI",
            iconUrl: "https://static-00.iconduck.com/assets.00/openai-icon-505x512-pr6amibw.png",
        },
        whisper: {
            id: "whisper",
            displayName: "Whisper ai",
            iconUrl: "https://play-lh.googleusercontent.com/wfl3o3R5a7RgYB6SxDk9Gfzcot89ThVjj22yn9bcjC-ccb1-JvT9u0XujZZpFuBXULd-=w600-h300-pc0xffffff-pd",
        },
    };

    const items = {
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
            childrenIds: ["5", "6", "7", "8"],
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


        "5": {
            id: "5",
            parentId: null,
            childrenIds: [],
            type: "openai",
            containerType: "FILE",
            displayName: "GPT-4 Product Prompt"
        },
        "6": {
            id: "6",
            parentId: null,
            childrenIds: [],
            type: "whisper",
            containerType: "FILE",
            displayName: "Whisper API"
        },
        "7": {
            id: "7",
            parentId: null,
            childrenIds: [],
            type: "notion",
            containerType: "FILE",
            displayName: "Notion API"
        },
        "8": {
            id: "8",
            parentId: null,
            childrenIds: [],
            type: "slack",
            containerType: "FILE",
            displayName: "Slack API"
        },
    };
    const lal = useRef(mousePosRelativeToPane)

    useEffect(() => {
        lal.current = mousePosRelativeToPane

    }, [mousePosRelativeToPane])

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item, monitor) => {

            const upperLeftCornerOfNode = lal.current

            const halfOfNodeSize = 16 * 3.5

            const centerOfNode = {
                x: upperLeftCornerOfNode.x - halfOfNodeSize,
                y: upperLeftCornerOfNode.y - halfOfNodeSize,
            }

            setNodes(prev => [...prev, {
                id: uuidv4(),
                type: 'custom',
                position: centerOfNode,
                data: {
                    selects: {
                        'handle-0': 'smoothstep',
                        'handle-1': 'smoothstep',
                    },
                    taskInfo: {
                        title: "Whisper AI",
                        description: "Transcribe recording",
                    },
                },
            }])
        },
        hover: (_, monitor) => {

            const pos = monitor.getClientOffset()!

            const bounds = reactFlowRef.current.getBoundingClientRect();

            const position = fußRef.current.project({
                x: pos.x - bounds.left,
                y: pos.y - bounds.top
            });
            setMousePosRelativeToPane(position)
        }
    }))

    const reactFlowRef = useRef<any>(null)

    if (isLoading) return "loading..."


    return (
        <>
            <div className="bg-gray-800 border-b border-gray-700 h-20">
                <div className="border-r border-gray-700" style={{
                    width: "256px",
                    height: "100%",
                    display: "flex",
                    alignItems:"center",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                }}>{
                    
                    <h2 style={{fontWeight: "bold", color: "white"}}>{data.organizations[0].displayName}</h2>
                }</div>
            </div>

            <div className="bg-gray-900" style={{ height: "100vh", display: "flex" }}
            // onMouseMove={e => {

            //     const bounds = reactFlowRef.current.getBoundingClientRect();

            //     const position = fuß.project({
            //         x: e.clientX - bounds.left,
            //         y: e.clientY - bounds.top
            //     });

            //     setMousePosRelativeToPane(position)
            // }}
            >

                <Explorer items={items} itemTypes={itemTypes} topLevelItemIds={["1", "2", "3", "4"]} />
                <div ref={drop} style={{ width: "100%", height: "100%" }}>
                    <EdgesContext.Provider value={edgesValue}>

                        <ReactFlow
                            nodes={nodes}
                            edges={edgesWithUpdatedTypes}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={onInit}
                            fitView
                            attributionPosition="top-right"
                            nodeTypes={nodeTypes}
                            proOptions={{ hideAttribution: true }}
                            ref={reactFlowRef}
                        >
                            <MiniMap style={minimapStyle} zoomable pannable />
                            <Controls />
                            <Background color="#aaa" gap={16} />
                        </ReactFlow>

                    </EdgesContext.Provider>
                </div>
            </div>
        </>
    );
};

export default OverviewFlow;