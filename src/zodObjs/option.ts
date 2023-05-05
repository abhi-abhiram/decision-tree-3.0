import { z } from "zod"

export const ZCreateOptionInput = z.object({
    label: z.string(),
    value: z.string(),
    logicId: z.string().optional(),
    nodeId: z.string(),
    nextNodeId: z.string(),
})

export const ZUpdateOptionInput = z.object({
    id: z.string(),
    label: z.string().optional(),
    value: z.string().optional(),
    logicId: z.string().optional(),
    nextNodeId: z.string().optional(),
})

