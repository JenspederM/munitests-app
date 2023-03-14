import { XMark } from "./Icons";

export function Filter({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (e: string) => void;
}) {
  return (
    <div className="form-control">
      <div className="input-group">
        <input
          className="input input-bordered input-sm input-primary w-full"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="btn btn-square btn-sm" onClick={() => onChange("")}>
          <XMark className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
