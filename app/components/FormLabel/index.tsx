interface Props {
  label: string;
  htmlFor: string;
}

export function FormLabel({label, htmlFor}: Props) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium leading-6 text-stone-900"
    >
      {label}
    </label>
  );
}
