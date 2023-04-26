/**
 * represents the white squares that can be connected to each other
 * and dragged around.
 * 
 * used as a custom node type for reactflow.
 */
import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

import { useEdges } from '@/components/NodeEditor/ApiNode/useEdges';

import ApiNodeHandle from "./Handle"
import styles from "./spawnWithPlop.module.css"

export interface ApiNodeProps {
    id: string
    data: {
        selects: {
            'handle-0': 'smoothstep'
            'handle-1': 'smoothstep'
        }
        taskInfo: {
            title: string
            description: string
            iconUrl: string
        }
    }
}
function ApiNode({ id, data }: ApiNodeProps) {

    const focusedColor = "#3856C5"
    const unfocusedColor = "#999"

    const [isActive, setIsActive] = useState(false)

    const {
        edges,
        addEdge,
        removeEdge,

        edgeConnectionMode,
        startEdgeConnectionMode,
        stopEdgeConnectionMode,
    } = useEdges()

    const targetEdge = edges.filter(i => i.target === id)[0]
    const sourceEdge = edges.filter(i => i.source === id)[0]

    return (
        <div
            tabIndex={1}
            onFocus={() => setIsActive(true)}
            onBlur={e => {
                if (!e.currentTarget.contains(e.relatedTarget)) setIsActive(false)
            }}
            className={"flex flex-row" + " " + styles["spawn-with-plop"]}
            style={{

                borderRadius: "8px",

                height: "7rem",
                width: "22rem",

                gap: "1rem",

                outline: isActive ? `4px solid ${focusedColor}` : "none",
                outlineOffset: "8px",
            }}>
            {(isActive || edgeConnectionMode.isActive) && <ApiNodeHandle
                pos="top"
                isActive={isActive}
                hasEdge={sourceEdge != null}
                onClick={() => {
                    if (edgeConnectionMode.isActive) {

                        if (edgeConnectionMode.selectedTargetId) {
                            addEdge({ selectedSourceId: id })
                        }
                        return
                    }
                    if (sourceEdge) {
                        removeEdge(sourceEdge.id)
                    }
                    else {
                        startEdgeConnectionMode({ selectedSourceId: id, selectedTargetId: null })
                    }
                }}
                onBlur={() => edgeConnectionMode.isActive && setTimeout(stopEdgeConnectionMode, 0)}
            />}
            {(isActive || edgeConnectionMode.isActive) && <ApiNodeHandle
                pos="bottom"
                isActive={isActive}
                hasEdge={targetEdge != null}
                onClick={() => {
                    if (edgeConnectionMode.isActive) {

                        if (edgeConnectionMode.selectedSourceId) {
                            addEdge({ selectedTargetId: id })
                        }
                        return
                    }
                    if (targetEdge) {
                        removeEdge(targetEdge.id)
                    }
                    else {
                        startEdgeConnectionMode({ selectedTargetId: id, selectedSourceId: null })
                    }
                }}
                onBlur={() => edgeConnectionMode.isActive && setTimeout(stopEdgeConnectionMode, 0)}
            />}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                position: "relative",

                minWidth: "7rem",
                minHeight: "7rem",
                width: "7rem",
                height: "7rem",

                borderRadius: "8px",

                backgroundColor: "white",
            }}>
                <Handle type="target" position={Position.Top} id={Object.keys(data.selects)[0]} />
                <img
                    style={{
                        width: "62.5%"
                    }}
                    src={data.taskInfo.iconUrl} />
                <Handle type="source" position={Position.Bottom} id={Object.keys(data.selects)[1]} />
            </div>
            <div className="flex flex-col justify-center">
                <h2 style={{
                    fontWeight: "bold",
                    color: isActive ? focusedColor : unfocusedColor
                }}>{data.taskInfo.title}</h2>
                <p style={{
                    fontWeight: "bold",
                    color: "white",
                }}>
                    {data.taskInfo.description}
                </p>
            </div>
        </div>
    );
}
export default memo(ApiNode);
