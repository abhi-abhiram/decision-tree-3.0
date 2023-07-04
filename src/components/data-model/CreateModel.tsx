import Model from "~/ui/Modal";
import { PlusIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Button } from "../ui/Button";
import { Textinput } from "../ui/Textinput";
import { api } from "~/utils/api";

export default function CreateModel() {
  const [isShowing, setIsShowing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const trpcUtils = api.useContext();
  const { mutate, isLoading } = api.model.create.useMutation({
    onSuccess() {
      void trpcUtils.model.models.invalidate().then(() => {
        setIsShowing(false);
        setName("");
      });
    },
  });
  const [name, setName] = React.useState("");

  return (
    <React.Fragment>
      <button
        className="rounded-md p-2 text-neutral-500 hover:bg-gray-100 hover:text-inherit"
        onClick={() => setIsShowing(true)}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
      <Model
        isOpen={isShowing}
        setIsOpen={() => setIsShowing(!isShowing)}
        title="Create Model"
      >
        <div className="mt-2 flex flex-col gap-2">
          <Textinput
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => mutate({ name })} isloading={isLoading}>
              Create
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsShowing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Model>
    </React.Fragment>
  );
}
