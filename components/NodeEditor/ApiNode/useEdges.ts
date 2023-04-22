import { createContext, useContext, useState } from "react";
import { Edge } from "reactflow";
import { v4 as uuidv4 } from 'uuid';

export interface EdgesContextValue {


}
export const EdgesContext = createContext<EdgesContextValue>(null as any)


export function useEdgesProvider() {

    const [edgeConnectionMode, setEdgeConnectionMode] = useState({ isActive: false })

    function startEdgeConnectionMode() {
        setEdgeConnectionMode({ isActive: true })
    }

    function stopEdgeConnectionMode() {
        setEdgeConnectionMode({ isActive: false })
    }

    const [edges, setEdges] = useState<Edge[]>([{
        id: 'e1-2',
        source: '1',
        target: '2',
        // label: 'this is an edge label',
    },
    {
        id: 'e1-3',
        source: '2',
        target: '3',
    },])

    function addEdge(sourceId: string, targetId: string) {
        const newEdge = {
            id: uuidv4(),
            source: sourceId,
            target: targetId,
        }
        setEdges(prev => [...prev, newEdge])
    }
    function removeEdge(idToBeRemoved: string) {

        setEdges(prev => prev.filter(i => i.id !== idToBeRemoved))
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