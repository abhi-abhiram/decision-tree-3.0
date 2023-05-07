import { useField } from "formik";
import React from "react";
import Select, { type Option } from "~/ui/Select";

export default function FormSelect({
  options,
  name,
}: {
  options: Option<string>[];
  name: string;
}) {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <div className="flex flex-col gap-2">
      <Select
        options={options}
        selected={field.value}
        setSelected={(value) => helpers.setValue(value)}
        buttonProps={{
          onBlur: field.onBlur,
        }}
      />
      {meta.error && meta.touched ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
}
