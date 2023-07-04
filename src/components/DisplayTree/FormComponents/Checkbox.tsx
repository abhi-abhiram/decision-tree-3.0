import { useField } from "formik";

export default function FormCheckbox(
  props: Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "name"
  > & { name: string }
) {
  const [field, , helper] = useField<boolean>(props.name);

  return (
    <input
      type="checkbox"
      name="isForeignKey"
      id="isForeignKey"
      className="h-5 w-5 rounded border-gray-300 bg-transparent text-black hover:border-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-1 focus-visible:ring-black "
      checked={field.value}
      onChange={(e) => {
        helper.setValue(e.target.checked);
      }}
    />
  );
}
