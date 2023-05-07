import { useField } from "formik";
import { Input, type InputProps } from "~/ui/Input";

export default function FormInput(
  props: Omit<InputProps, "name"> & { name: string }
) {
  const [field, meta, helper] = useField<string>(props.name);

  return (
    <div className="flex flex-col gap-2">
      <Input
        {...props}
        value={field.value}
        onChange={(e) => {
          helper.setValue(String(e.target.value));
        }}
        onBlur={field.onBlur}
      />
      {meta.error && meta.touched ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
}
