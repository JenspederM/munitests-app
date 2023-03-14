import { ChangeEvent, PropsWithoutRef } from "react";

export function Select({
  items,
  label,
  value,
  onChange,
  placeholder,
  left,
  right,
  ...props
}: PropsWithoutRef<{
  items: string[];
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  left?: JSX.Element;
  right?: JSX.Element;
}>) {
  return (
    <div className="form-control" {...props}>
      <label className="label">
        <span className="label-text font-bold">{label}</span>
      </label>
      <div className="input-group">
        {left && <div>{left}</div>}
        <select
          value={value === "" ? placeholder : value}
          onChange={(e) => onChange(e)}
          className="select select-bordered grow"
        >
          {placeholder && <option disabled>{placeholder}</option>}
          {items.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        {right && right}
      </div>
    </div>
  );
}
