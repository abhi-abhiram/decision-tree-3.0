import { z } from "zod"

export const ZCreateOptionInput = z.object({
    label: z.string(),
    value: z.string(),
    nodeId: z.string(),
    nextNodeId: z.string().nullish(),
})

export const ZUpdateOptionInput = z.object({
    id: z.string(),
    label: z.string().optional(),
    value: z.string().optional(),
    nextNodeId: z.string().nullish(),
    type: z.enum(["node", "bridgeNode"]),
})

