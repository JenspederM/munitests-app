export const ConfirmModal = ({
  text,
  onConfirm,
  setModalRef,
  modalRef,
}: {
  text?: string;
  onConfirm: (answer: boolean) => void;
  setModalRef: (ref: HTMLInputElement) => void;
  modalRef?: HTMLInputElement;
}) => {
  return (
    <>
      <input
        type="checkbox"
        ref={setModalRef}
        id="confirm-delete"
        className="modal-toggle"
      />
      <label htmlFor="confirm-delete" className="modal cursor-pointer">
        <label className="modal-box relative text-center space-y-6" htmlFor="">
          <h3 className="text-lg font-bold">
            {text || "Are you sure you want to delete this item?"}
          </h3>
          <div className="flex w-full justify-around">
            <button
              className="btn btn-error btn-sm w-2/5"
              onClick={() => {
                onConfirm(true);
                modalRef?.click();
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-primary btn-sm w-2/5"
              onClick={() => {
                onConfirm(false);
                modalRef?.click();
              }}
            >
              No
            </button>
          </div>
        </label>
      </label>
    </>
  );
};
