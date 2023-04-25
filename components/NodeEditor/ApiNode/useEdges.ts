import SocketParticipant from "@/realtime-service/SocketParticipant";
import { createContext, useContext, useState } from "react";
import { Edge } from "reactflow";
import { v4 as uuidv4 } from 'uuid';

export interface EdgesContextValue {

    edges: Edge[],
    addEdge: (value: any) => void,
    removeEdge: (idToBeRemoved: string) => void,

    edgeConnectionMode: EdgeConnectionMode,
    startEdgeConnectionMode: (value: { selectedSourceId: string, selectedTargetId: null } | { selectedSourceId: null, selectedTargetId: string }) => void,
    stopEdgeConnectionMode: () => void,

}
export const EdgesContext = createContext<EdgesContextValue>(null as any)


interface InactiveEdgeConnectionMode {
    isActive: false
}
interface ActiveEdgeConnectionMode {
    isActive: true

    selectedTargetId: string | null
    selectedSourceId: string | null
}

type EdgeConnectionMode = InactiveEdgeConnectionMode | ActiveEdgeConnectionMode

export function useEdgesProvider(socket: any, workflowId: string) {

    const [edgeConnectionMode, setEdgeConnectionMode] = useState<EdgeConnectionMode>({ isActive: false })

    function startEdgeConnectionMode(value: { selectedSourceId: string, selectedTargetId: null } | { selectedSourceId: null, selectedTargetId: string }) {
        setEdgeConnectionMode({ ...value, isActive: true })
    }

    function stopEdgeConnectionMode() {
        setEdgeConnectionMode({ isActive: false })
    }

    const [edges, setEdges] = useState<Edge[]>([
        //     {
        //     id: 'e1-2',
        //     source: '1',
        //     target: '2',
        //     // label: 'this is an edge label',
        // },
        // {
        //     id: 'e1-3',
        //     source: '2',
        //     target: '3',
        // },
    ])

    function addEdge(value: any) {

        const id = uuidv4()

        if (!edgeConnectionMode.isActive) return

        const sache = {...edgeConnectionMode, ...value}

        const newEdge = {
            id,
            source: sache.selectedSourceId!,
            target: sache.selectedTargetId!,
        }
        setEdges(prev => [...prev, newEdge])

        socket.emit("EDITOR_CREATE_EDGE", {
            workflowId,
            id,
            sourceNodeId: sache.selectedSourceId!,
            targetNodeId: sache.selectedTargetId!,
        })
    }
    function removeEdge(idToBeRemoved: string) {

        setEdges(prev => prev.filter(i => i.id !== idToBeRemoved))

        socket.emit("EDITOR_DELETE_EDGE", {
            workflowId,
            id: idToBeRemoved,
        })
    }

    return {
        edges,
        addEdge,
        removeEdge,

        edgeConnectionMode,
        startEdgeConnectionMode,
        stopEdgeConnectionMode,
    }
}
export function useEdges() {

    const value = useContext(EdgesContext)

    return value
}