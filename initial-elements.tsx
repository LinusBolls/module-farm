export const nodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 0 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
      taskInfo: {
        title: "GPT-4",
        description: "Analyze the current Kanban Board and make suggestions on what to discuss in the meeting",
      },
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: {
      selects: {
        'handle-2': 'smoothstep',
        'handle-3': 'smoothstep',
      },
      taskInfo: {
        title: "Whisper AI",
        description: "Transcribe recording",
      },
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 100, y: 400 },
    data: {
      selects: {
        'handle-4': 'smoothstep',
        'handle-5': 'smoothstep',
      },
      taskInfo: {
        title: "Notion",
        description: "Add Transcript to Notion Page with Date",
      },
    },
  },
]

export const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    // label: 'this is an edge label',
  },
  {
    id: 'e1-3',
    source: '2',
    target: '3',
  },
];
