import React, { useState } from "react";
import { Box, VStack, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDrag } from "react-dnd";

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

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'item',
        item: { id: item.id, name: item.displayName },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
        canDrag: (monitor) => item.containerType === "FILE",
      }));

    return (
        <VStack align="start" spacing={0} 
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
                    height: "32px",
                    color: "white",
                    gap: 0,
                    margin: 0,
                    width: "100%",
                    paddingLeft: item.containerType === "FOLDER" ? (depth * 4) + "px" : (depth * 4) + 8 + "px"
                }}
                className={`hover:bg-gray-700 bg-gray-800 cursor-pointer`}
            // css={css cursor: pointer; padding-left: ${depth * 16}px; &:hover {background - color: #ececec; } }
            >
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
                        }}
                    />
                )}
                {/* {itemType.iconUrl && <Icon boxSize="1em" src={itemType.iconUrl} />} */}
                {itemType.iconUrl && <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "1rem", height: "1rem", overflow: "hidden"}}><img style={{ 
                    // height: "1rem",
                     }} src={itemType.iconUrl} /></div>}
                <Text>{item.displayName}</Text>
            </HStack>
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
        </VStack >
    );
};

const Explorer: React.FC<ExplorerProps> = ({
    items,
    itemTypes,
    topLevelItemIds,
}) => {
    return (
        <Box
            className="bg-gray-800 border-r border-gray-700"
            style={{ width: "256px", height: "100%" }}>

            {topLevelItemIds.map(i => {

                return <ExplorerItem
                    item={items[i]}
                    itemTypes={itemTypes}
                    items={items}
                    depth={0}
                />
            })}
        </Box>
    );
};

export default Explorer;