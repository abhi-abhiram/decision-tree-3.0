import { useField } from "formik";
import { Textinput, type TextinputProps } from "~/components/ui/Textinput";

export default function FormInput(
  props: Omit<TextinputProps, "name"> & { name: string }
) {
  const [field, meta, helper] = useField<string>(props.name);

  return (
    <Textinput
      {...props}
      value={field.value}
      onChange={(e) => {
        helper.setValue(String(e.target.value));
      }}
      onBlur={field.onBlur}
      isError={Boolean(meta.error && meta.touched)}
      error={meta.error}
      className="w-full"
    />
  );
}
