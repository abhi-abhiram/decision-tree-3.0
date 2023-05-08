import Editor from "~/components/Editor";

export default function Help() {
  return (
    <div className="flex min-h-screen flex-col p-10">
      <div className="flex flex-1 flex-col rounded-md border border-gray-200 ">
        <Editor />
      </div>
    </div>
  );
}
