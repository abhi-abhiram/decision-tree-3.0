import React from "react";
import { api } from "~/utils/api";
import _ from "lodash";
import { useRouter } from "next/router";
import HtmlPlugin from "../HtmlPlugin";

const ExportPlugin = () => {
  const { mutateAsync: updateNodeMutation } = api.node.update.useMutation();
  const debouncedMutate = React.useCallback(
    _.debounce(async (node: { id: string; helpText: string }) => {
      await updateNodeMutation(node);
    }, 1000),
    []
  );
  const router = useRouter();

  return (
    <HtmlPlugin
      onHtmlChanged={(htmlString) => {
        void debouncedMutate({
          id: router.query.id as string,
          helpText: htmlString,
        });
      }}
    />
  );
};

export default ExportPlugin;
