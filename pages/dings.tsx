import Explorer from "../components/Explorer"

export default function Page() {

    const itemTypes = {
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
        defaultfolder: {
            id: "defaultfolder",
            displayName: "default folder",
            iconUrl: null,
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
            childrenIds: [],
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
      };


    return <Explorer items={items} itemTypes={itemTypes} topLevelItemIds={["1", "2", "3"]}/>
}