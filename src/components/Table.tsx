import { ChangeEvent, memo, useEffect, useState } from "react";
import { FilterType, TestType } from "../types";
import { PencilSquare, Trash } from "./Icons";
import { UPDATE_TEST_MODAL_ID } from "../constants";
import { UpdateTestModal } from "./UpdateTestModal";
import { ConfirmModal } from "./ConfirmDeleteModal";
import { Filter } from "./Filter";

export const TestTable = ({
  tests,
  onCheck,
  onDelete,
  filter,
  setFilter,
  editable = false,
  deletable = false,
}: {
  tests: TestType[];
  filter?: FilterType;
  setFilter?: (filter: FilterType) => void;
  onCheck?: (tests: TestType[]) => void;
  onDelete?: (test: TestType) => void;
  editable?: boolean;
  deletable?: boolean;
}) => {
  const [checked, setChecked] = useState<TestType[]>([]);
  const [deletableItem, setDeletableItem] = useState<TestType>();
  const [deleteModalRef, setDeleteModalRef] = useState<HTMLInputElement>();
  const [newTest, setNewTest] = useState<TestType>({
    id: "",
    category: "",
    question: "",
    intent: "",
  });

  if (onCheck) {
    useEffect(() => {
      onCheck(checked);
    }, [checked]);
  }

  const handleFilter = (
    key: "category" | "intent" | "question",
    value: string
  ) => {
    if (!setFilter || !filter) return;

    switch (key) {
      case "category":
        setFilter({ ...filter, category: value });
        break;
      case "intent":
        setFilter({ ...filter, intent: value });
        break;
      case "question":
        setFilter({ ...filter, question: value });
        break;
      default:
        break;
    }
  };

  const handleCheck = (
    event: ChangeEvent<HTMLInputElement>,
    item: TestType
  ) => {
    if (item.id === "all") {
      tests.forEach((item) => {
        const checkbox = document.getElementById(`${item.id}-check`);
        if (checkbox && checkbox instanceof HTMLInputElement) {
          checkbox.checked = event.target.checked;
        }
      });
      setChecked(event.target.checked ? tests : []);
      return;
    }
    if (event.target.checked) {
      setChecked([...checked, item]);
    } else {
      setChecked(checked.filter((i) => i.id !== item.id));
    }
  };

  const handleConfirmDelete = (answer: boolean) => {
    if (deletableItem && answer) {
      onDelete && onDelete(deletableItem);
      setChecked(checked.filter((i) => i.id !== deletableItem.id));
    }
    setDeletableItem(undefined);
  };

  const openConfirmDeleteModal = (item: TestType) => {
    if (deleteModalRef) {
      deleteModalRef.click();
      setDeletableItem(item);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute h-full w-full">
        <table className="table w-full table-compact">
          <thead className="sticky top-0">
            <tr>
              {editable && (
                <th className="text-center font-bold normal-case">Actions</th>
              )}
              {onCheck && (
                <th className="text-center">
                  <input
                    className="checkbox checkbox-primary checkbox-lg"
                    type="checkbox"
                    onChange={(e) => handleCheck(e, { id: "all" } as TestType)}
                  />
                </th>
              )}
              <th>
                {filter && setFilter ? (
                  <Filter
                    placeholder="Category"
                    value={filter?.category || ""}
                    onChange={(value) => handleFilter("category", value)}
                  />
                ) : (
                  <div className="font-bold normal-case">Category</div>
                )}
              </th>
              <th>
                {filter && setFilter ? (
                  <Filter
                    placeholder="Question"
                    value={filter?.question || ""}
                    onChange={(value) => handleFilter("question", value)}
                  />
                ) : (
                  <div className="font-bold normal-case">Question</div>
                )}
              </th>
              <th>
                {filter && setFilter ? (
                  <Filter
                    placeholder="Intent"
                    value={filter?.intent || ""}
                    onChange={(value) => handleFilter("intent", value)}
                  />
                ) : (
                  <div className="font-bold normal-case">Intent</div>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {tests.map((item) => (
              <tr key={item.id}>
                {editable || deletable ? (
                  <td className="flex items-center justify-center space-x-2">
                    {editable && (
                      <label
                        htmlFor={UPDATE_TEST_MODAL_ID}
                        className="btn btn-warning btn-square btn-xs"
                        onClick={() => setNewTest(item)}
                      >
                        <PencilSquare className="h-4 w-4" />
                      </label>
                    )}
                    {deletable && (
                      <button
                        className="btn btn-error btn-square btn-xs"
                        onClick={() => openConfirmDeleteModal(item)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                ) : null}
                {onCheck && (
                  <td className="text-center">
                    <input
                      id={`${item.id}-check`}
                      className="checkbox checkbox-primary"
                      type="checkbox"
                      onChange={(e) => handleCheck(e, item)}
                    />
                  </td>
                )}
                <td>{item.category}</td>
                <td>{item.question}</td>
                <td>{item.intent}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {editable && (
          <UpdateTestModal id={UPDATE_TEST_MODAL_ID} test={newTest} />
        )}
        {deletable && (
          <ConfirmModal
            text="Are you sure you want to delete this test?"
            modalRef={deleteModalRef}
            setModalRef={setDeleteModalRef}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export const MemoTable = memo(TestTable, (prevProps, nextProps) => {
  if (prevProps.tests.length !== nextProps.tests.length) {
    return false;
  }
  if (prevProps.filter !== nextProps.filter) {
    return false;
  }
  return true;
});
