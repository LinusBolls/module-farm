import classNames from "classnames"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from '@mui/icons-material/Remove';

import styles from "./handle.module.css"

export interface HandleProps {
    pos: "top" | "bottom"
    isActive: boolean
    hasEdge: boolean
    onClick: () => void
    onBlur: () => void
}
function Handle({
    pos,
    isActive,
    hasEdge,
    onClick,
    onBlur,
}: HandleProps) {

    return <button
        className={classNames(styles.handle, isActive ? styles.focused : styles.unfocused, styles[pos])}
        onFocus={onClick}
        onBlur={onBlur}
    >
        <div
            className={classNames(styles.core, isActive ? styles.focused : styles.unfocused)}
        >
            {hasEdge ? <RemoveIcon/> : <AddIcon/>}
        </div>
    </button>
}
export default Handle