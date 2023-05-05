/** app/api/uploadthing/core.ts */
import { createFilething, type FileRouter } from "uploadthing/server";
const f = createFilething();


export const ourFileRouter = {
    imageUploader: f
        .fileTypes(["image", "video"])
        .maxSize("1GB")
        .onUploadComplete(({ metadata }) => {
            console.log("Upload complete for userId:", metadata);
        }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;