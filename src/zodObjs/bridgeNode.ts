import { z } from "zod";

export const ZCreateBridgeNodeInput = z.object({
    name: z.string(),
    parentId: z.string(),
    fromTreeId: z.string(),
    toTreeId: z.string(),
});

export const ZUpdateBridgeNodeInput = ZCreateBridgeNodeInput.partial().extend({
    id: z.string(),
});