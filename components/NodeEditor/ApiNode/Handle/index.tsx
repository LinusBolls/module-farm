import classNames from "classnames"

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
            {hasEdge ? "-" : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 11.9994C24 12.5071 23.5846 12.9225 23.0769 12.9225H12.9231V23.0763C12.9231 23.5866 12.5102 24 12 24C11.4898 24 11.0769 23.584 11.0769 23.0763V12.9225H0.923077C0.412846 12.9225 0 12.51 0 12C0 11.4917 0.413077 11.0763 0.923077 11.0763H11.0769V0.9225C11.0769 0.412269 11.4898 0 12 0C12.5102 0 12.9231 0.4125 12.9231 0.9225V11.0763H23.0769C23.5846 11.0763 24 11.4917 24 11.9994Z" fill="white" />
            </svg>}
        </div>
    </button>
}
export default Handle