import { z } from "zod"
import { NodeType } from "@prisma/client"

export const ZCreateNodeInput = z.object({
    name: z.string(),
    question: z.string(),
    treeId: z.string(),
    parentId: z.string().optional(),
    type: z.nativeEnum(NodeType),
})

export const ZUpdateNodeInput = z.object({
    id: z.string(),
    question: z.string().optional(),
    type: z.nativeEnum(NodeType).optional(),
    name: z.string().optional(),
    img: z.string().optional(),
})

export type UpdateNodeInput = z.infer<typeof ZUpdateNodeInput>


