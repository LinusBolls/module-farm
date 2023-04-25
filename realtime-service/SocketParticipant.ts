/**
 * responsible for maintaining type-safety for our socket connection.
 */
interface Message {

    EDITOR_CREATE_NODE: {
        req: {
            workflowId: string
            id: string
            type: string
            pos: {
                x: number
                y: number
            }
        },
    },
    EDITOR_MOVE_NODE: {
        req: {
            workflowId: string
            nodeId: string
            pos: {
                x: number
                y: number
            }
        }
    },
    EDITOR_DELETE_NODE: {
        req: {
            workflowId: string
            nodeId: string
        }
    }
    EDITOR_CREATE_EDGE: {
        req: {
            workflowId: string
            id: string
            sourceNodeId: string
            targetNodeId: string
        }
    }
    EDITOR_DELETE_EDGE: {
        req: {
            workflowId: string
            id: string
        }
    }
}

export class SocketParticipant {
    socket: any

    constructor(socket: any) {
        this.socket = socket

        this.socket.on('connect', () => {
            console.log('connected')
        })
        // @ts-ignore
        this.socket.on('error', (err) => {
            console.log("error:", err)
        })
    }
    on<T extends keyof Message>(key: T, listener: (data: Message[T]["req"]) => void) {
        this.socket.on(key, listener)
    }
    emit<T extends keyof Message>(key: T, data: Message[T]["req"]) {
        this.socket.emit(key, data)
    }
}
export default SocketParticipant