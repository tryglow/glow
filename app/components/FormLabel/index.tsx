interface Props {
  label: string;
  htmlFor: string;
}

export function FormLabel({label, htmlFor}: Props) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {label}
    </label>
  );
}
