import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react";

export const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  left,
  right,
  ...props
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  left?: JSX.Element;
  right?: JSX.Element;
  type?: string;
  placeholder?: string;
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold">{label}</span>
      </label>
      {left || right ? (
        <label className="input-group">
          {left}
          <input
            placeholder={placeholder}
            className="input input-bordered w-full max-w-full"
            value={value}
            onChange={(e) => onChange(e)}
            {...props}
          />
          {right}
        </label>
      ) : (
        <input
          placeholder={placeholder}
          className="input input-bordered w-full max-w-full"
          value={value}
          onChange={(e) => onChange(e)}
          {...props}
        />
      )}
    </div>
  );
};

export const TextAreaInput = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold">{label}</span>
      </label>
      <textarea
        placeholder={placeholder}
        className="input input-bordered w-full max-w-full"
        value={value}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
};
