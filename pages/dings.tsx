import Explorer from "../components/Explorer"

export default function Page() {

    const itemTypes = {
        notion: {
          id: "notion",
          displayName: "Notion",
          iconUrl: "https://img.icons8.com/ios/512/notion.png",
        },
        slack: {
          id: "slack",
          displayName: "Slack",
          iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
        },
        openai: {
          id: "openai",
          displayName: "OpenAI",
          iconUrl: "https://static-00.iconduck.com/assets.00/openai-icon-505x512-pr6amibw.png",
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