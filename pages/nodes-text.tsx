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

import { nodes as initialNodes, edges as initialEdges } from '../initial-elements';
import CustomNode from '../CustomNode';

import 'reactflow/dist/style.css';

const nodeTypes = {
    custom: CustomNode,
};

const minimapStyle = {
    height: 120,
};

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const OverviewFlow = () => {
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




    const itemTypes = {
        defaultfolder: {
            id: "defaultfolder",
            displayName: "default folder",
            iconUrl: null,
        },
        notion: {
            id: "notion",
            displayName: "Notion",
            iconUrl: "https://cdn.example.com/icons/notion.svg",
        },
        slack: {
            id: "slack",
            displayName: "Slack",
            iconUrl: "https://cdn.example.com/icons/slack.svg",
        },
        openai: {
            id: "openai",
            displayName: "OpenAI",
            iconUrl: "https://cdn.example.com/icons/openai.svg",
        },
        whisper: {
            id: "whisper",
            displayName: "Whisper ai",
            iconUrl: "https://cdn.example.com/icons/openai.svg",
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

    return (
        <div className="bg-gray-900" style={{ height: "100vh", display: "flex" }}>

            <Explorer items={items} itemTypes={itemTypes} topLevelItemIds={["1", "2", "3", "4"]} />
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
            >
                <MiniMap style={minimapStyle} zoomable pannable />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
};

export default OverviewFlow;





