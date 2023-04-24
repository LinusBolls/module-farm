import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {

    const externalServices = [
        {
            displayName: "OpenAI",
            iconUrl: "https://static-00.iconduck.com/assets.00/openai-icon-505x512-pr6amibw.png",
            url: "https://openai.com",
            blocks: [
                {
                    iconUrl: "",
                    displayName: "GPT-3.5",
                    description: "Take the previous block as input for a GPT-3.5 prompt",
                },
                {
                    iconUrl: "",
                    displayName: "GPT-4",
                    description: "Take the previous block as input for a GPT-4 prompt",
                },
                {
                    iconUrl: "",
                    displayName: "Whisper AI",
                    description: "Takes an audio input and transcribes it into text",
                },
            ],
        },
        {
            displayName: "Slack",
            iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
            url: "https://slack.com",
            blocks: [
                {
                    iconUrl: "",
                    displayName: "Get slack messages from channel",
                    description: "This is a sample workflow block for Slack.",
                },
            ],
        },
        {
            displayName: "Discord",
            iconUrl: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
            url: "https://discord.gg",
            blocks: [],
        },
        {
            displayName: "LinkedIn",
            iconUrl: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
            url: "https://linkedin.com",
            blocks: [],
        },
        {
            displayName: "Notion",
            iconUrl: "https://img.icons8.com/ios/512/notion.png",
            url: "https://notion.so",
            blocks: [
                {
                    iconUrl: "",
                    displayName: "Add Transcript Page with Date",
                    description: "This is a sample workflow block for Slack.",
                },
                {
                    iconUrl: "",
                    displayName: "Update Action or Create Action Items Items in Kanban Board",
                    description: "This is a sample workflow block for Slack.",
                },
            ],
        }
    ]

    for (const serviceData of externalServices) {
        const service = await prisma.externalService.create({
            data: {
                displayName: serviceData.displayName,
                iconUrl: serviceData.iconUrl,
                url: serviceData.url,
            },
        })

        for (const blockData of serviceData.blocks) {
            await prisma.workflowBlock.create({
                data: {
                    serviceId: service.id,
                    iconUrl: blockData.iconUrl,
                    displayName: blockData.displayName,
                    description: blockData.description,
                },
            })
        }
    }

    await prisma.organizationPermission.create({
        data: {
            key: "CREATE_FLOWS",
            displayName: "Create Flows",
        },
    })

    await prisma.organizationPermission.create({
        data: {
            key: "UPDATE_FLOWS",
            displayName: "Edit Flows",
        },
    })

    const testUser = await prisma.user.create({
        data: {
            email: "linus.bolls@code.berlin",
            username: "test",
            password: await bcrypt.hash("test", 10),
            ownedOrganizations: {
                create: {
                    displayName: "test",
                    members: {
                        create: {
                            user: { connect: { email: "linus.bolls@code.berlin" } },
                            permissions: { connect: { key: "CREATE_FLOWS" } },
                        }
                    }
                }
            }
        },
        include: {
            ownedOrganizations: {
                include: {
                    members: true
                }
            }
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)

        await prisma.$disconnect()

        process.exit(1)
    })
