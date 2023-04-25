import React, { useState } from "react";
import { Box, VStack, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDrag } from "react-dnd";
import { useQuery } from "react-query";
import axios from "axios";
import CustomNode from "@/CustomNode";

type ContainerType = "FOLDER" | "FILE"

interface Item {
    id: string
    parentId: Item["id"] | null
    childrenIds: Item["id"][]

    type: ItemType["id"]
    containerType: ContainerType

    displayName: string
}
interface ItemType {
    id: string

    displayName: string
    iconUrl: string | null
}
interface ExplorerProps {
    items: Record<string, Item>
    itemTypes: Record<string, ItemType>

    topLevelItemIds: Item["id"][]
}

const ExplorerItem: React.FC<{
    item: Item;
    itemTypes: Record<string, ItemType>;
    items: Record<string, Item>;
    depth: number;
}> = ({ item, itemTypes, items, depth }) => {
    const itemType = itemTypes[item.type];
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        if (item.containerType === "FOLDER") {
            setIsExpanded(!isExpanded);
        }
    };

    const [{ isDragging }, dragRef, preview] = useDrag(() => ({
        type: 'item',
        item: { id: item.id, name: item.displayName },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: (monitor) => item.containerType === "FILE",
    }));

    return (
        <>
            {/* {preview(<div className="bg-gray-100 h-28 w-28 rounded-lg bg-gray-100 scale-50"
            // style={{transform: "translateX(-50%)"}} 
            ></div>)} */}
            <VStack
                align="start"
                spacing={0}
                ref={dragRef}
                style={{
                    width: "100%",
                    opacity: isDragging ? 0.5 : 1,
                    // , paddingLeft: "4px", boxSizing:"border-box"
                }}>
                <HStack
                    onClick={handleClick}
                    style={{
                        // backgroundColor: "#222",
                        boxSizing: "border-box",
                        height: "32px",
                        color: "white",
                        gap: 0,
                        margin: 0,
                        width: "100%",
                        paddingLeft: 0, // item.containerType === "FOLDER" ? (depth * 4) + "px" : (depth * 4) + 8 + "px"
                        paddingRight: "16px",
                    }}
                    className={`hover:bg-gray-700 cursor-pointer`}
                // css={css cursor: pointer; padding-left: ${depth * 16}px; &:hover {background - color: #ececec; } }
                >
                    {Array.from({ length: depth }).map((_, idx) => {

                        return <div key={idx} className="w-2 h-full border-gray-700 border-r shrink-0" />
                    })}
                    {item.containerType === "FOLDER" && (
                        <IconButton
                            aria-label="Toggle folder"
                            icon={
                                isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />
                            }
                            variant="ghost"
                            size="xs"
                            onClick={handleClick}
                            style={{
                                background: "none",
                                marginLeft: "4px",
                            }}
                        />
                    )}
                    {/* {itemType.iconUrl && <Icon boxSize="1em" src={itemType.iconUrl} />} */}
                    {itemType.iconUrl && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "1.5rem", height: "1.5rem", flexShrink: 0, overflow: "hidden", marginLeft: "4px", }}>
                        <img style={{
                            height: "1rem",
                        }} src={itemType.iconUrl} /></div>}
                    <Text style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}>{item.displayName}</Text>
                </HStack>
                {/* <VStack align="start" spacing={0} className="w-full pl-1 ">
                    <VStack align="start" spacing={0} className="w-full border-gray-700 border-l-2"> */}
                {
                    isExpanded &&
                    item.childrenIds.map((childId) => (
                        <ExplorerItem
                            key={childId}
                            item={items[childId]}
                            itemTypes={itemTypes}
                            items={items}
                            depth={depth + 1}
                        />
                    ))
                }
                {/* </VStack>
                </VStack> */}
            </VStack >
        </>
    );
};

const Explorer: React.FC<ExplorerProps> = ({
    items,
    itemTypes,
    topLevelItemIds,
}) => {
    return (
        <Box className="w-full h-full ">

            {topLevelItemIds.map(id => {

                return <ExplorerItem
                    key={id}
                    item={items[id]}
                    itemTypes={itemTypes}
                    items={items}
                    depth={0}
                />
            })}
        </Box>
    );
};

export default Explorer;