import { PropsWithChildren, useEffect } from "react";

export function Modal({
  children,
  id,
  title,
  btnContent,
}: PropsWithChildren<{
  id: string;
  title?: string;
  btnContent?: JSX.Element;
}>) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox instanceof HTMLInputElement) {
          checkbox.checked = false;
        }
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      <label htmlFor={id}>{btnContent}</label>

      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer">
        <div className="modal-box relative">
          <div className="flex flex-row items-center w-full justify-between border-b-2 pb-2 border-primary mb-2">
            {title && <h2 className="text-lg font-bold">{title}</h2>}
            <label className="btn btn-sm btn-circle" htmlFor={id}>
              ✕
            </label>
          </div>
          {children}
        </div>
      </label>
    </>
  );
}
