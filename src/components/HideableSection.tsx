import { PropsWithChildren, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "../components/Icons";

export const HideableSection = ({
  title,
  children,
  className = "",
  visible = false,
}: PropsWithChildren<{
  title: string;
  visible?: boolean;
  className?: string;
}>) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  return (
    <>
      <div className={`divider ${className}`}>
        <button
          className="flex space-x-2 items-center"
          onClick={() => setShow(!show)}
        >
          <h2>{title}</h2>
          {show ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>
      {show && children}
    </>
  );
};
