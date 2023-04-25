import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useEdges } from './components/NodeEditor/ApiNode/useEdges';

import styles from "./stepNode.module.css"

function isParentOrSelf(potentialParent: HTMLElement, potentialChild: HTMLElement): boolean {

  if (potentialParent == potentialChild) return true

  let parent = potentialChild.parentElement;
  while (parent !== null) {
    if (parent === potentialParent) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}


export interface CustomNodeProps {
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
function CustomNode({ id, data }: CustomNodeProps) {

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
      {(isActive || edgeConnectionMode.isActive) && <button className={styles.mountPoint + " " + (isActive ? styles.focused : styles.unfocused)} style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "5rem",
        height: "5rem",

        position: "absolute",
        zIndex: 999,

        left: "1rem",
        bottom: "-2.25rem",

        borderRadius: 999,
      }}
        onFocus={() => {
          if (edgeConnectionMode.isActive) {

            console.log("second node selected")

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

            console.log("first node selected")
          }
        }}
        onBlur={() => edgeConnectionMode.isActive && setTimeout(stopEdgeConnectionMode, 0)}
      >
        <div
          style={{

            boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.3)",

            backgroundColor: isActive ? focusedColor : unfocusedColor,
            color: "white",

            width: "2rem",
            height: "2rem",

            borderRadius: "999px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>{sourceEdge != null ? "-" : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 11.9994C24 12.5071 23.5846 12.9225 23.0769 12.9225H12.9231V23.0763C12.9231 23.5866 12.5102 24 12 24C11.4898 24 11.0769 23.584 11.0769 23.0763V12.9225H0.923077C0.412846 12.9225 0 12.51 0 12C0 11.4917 0.413077 11.0763 0.923077 11.0763H11.0769V0.9225C11.0769 0.412269 11.4898 0 12 0C12.5102 0 12.9231 0.4125 12.9231 0.9225V11.0763H23.0769C23.5846 11.0763 24 11.4917 24 11.9994Z" fill="white" />
          </svg>}
        </div>
      </button>}
      {(isActive || edgeConnectionMode.isActive) && <button className={styles.mountPoint + " " + (isActive ? styles.focused : styles.unfocused)} style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "5rem",
        height: "5rem",

        position: "absolute",
        zIndex: 999,

        left: "1rem",
        top: "-2.25rem",

        borderRadius: 999,
      }}
        onFocus={() => {
          if (edgeConnectionMode.isActive) {

            console.log("second node selected")

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

            console.log("first node selected")
          }
        }}
        onBlur={() => edgeConnectionMode.isActive && setTimeout(stopEdgeConnectionMode, 0)}
      >
        <div
          style={{

            boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.3)",

            backgroundColor: isActive ? focusedColor : unfocusedColor,
            color: "white",

            width: "2rem",
            height: "2rem",

            borderRadius: "999px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>{targetEdge != null ? "-" : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 11.9994C24 12.5071 23.5846 12.9225 23.0769 12.9225H12.9231V23.0763C12.9231 23.5866 12.5102 24 12 24C11.4898 24 11.0769 23.584 11.0769 23.0763V12.9225H0.923077C0.412846 12.9225 0 12.51 0 12C0 11.4917 0.413077 11.0763 0.923077 11.0763H11.0769V0.9225C11.0769 0.412269 11.4898 0 12 0C12.5102 0 12.9231 0.4125 12.9231 0.9225V11.0763H23.0769C23.5846 11.0763 24 11.4917 24 11.9994Z" fill="white" />
          </svg>}
        </div>
      </button>}
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
        <Handle type="target" position={Position.Top} id={Object.keys(data.selects)[0]} style={{
          // position: "absolute",
          // top: 0,
        }} />
        <img
          style={{
            width: "62.5%"
          }}
          src={data.taskInfo.iconUrl} />
        <Handle type="source" position={Position.Bottom} id={Object.keys(data.selects)[1]} style={{
          // position: "absolute",
          // bottom: 0,
        }} />
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
        {/* {Object.keys(data.selects).map((handleId) => (
          <Select key={handleId} nodeId={id} value={data.selects[handleId]} handleId={handleId} />
        ))} */}

      </div>
    </div>
  );
}

export default memo(CustomNode);
