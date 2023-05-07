import Datepicker from "react-tailwindcss-datepicker";
import { type DateType } from "react-tailwindcss-datepicker/dist/types";
import { useField } from "formik";
import React from "react";

export default function Date({ name, ...props }: { name: string }) {
  const [field, meta, helpers] = useField<DateType>(name);

  return (
    <div className="flex flex-col gap-2">
      <Datepicker
        useRange={false}
        asSingle={true}
        {...props}
        value={{
          startDate: field.value,
          endDate: field.value,
        }}
        onChange={(value) => {
          if (value?.startDate) helpers.setValue(value.startDate);
        }}
        inputName="date"
        inputClassName="border border-gray-200 rounded-lg text-sm w-full p-2 shadow-sm"
      />
      {meta.error && meta.touched ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
}
