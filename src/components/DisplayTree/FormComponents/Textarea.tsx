import { useField } from "formik";
import { Textarea, type TextareaProps } from "~/ui/Textarea";

export default function FormTextarea(
  props: TextareaProps & {
    name: string;
  }
) {
  const [field, meta] = useField<string>(props.name);

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        {...props}
      />
      {meta.error && meta.touched ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
}
