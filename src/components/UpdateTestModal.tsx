import { useEffect, useState } from "react";
import { TestType } from "../types";
import { PencilSquare } from "./icons/Pencil";
import { Modal } from "./Modal";
import { TestBody } from "./TestBody";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export function UpdateTestModal({ id, test }: { id: string; test: TestType }) {
  const [updatedTest, setUpdatedTest] = useState<TestType>({
    id: "",
    category: "",
    question: "",
    intent: "",
  });

  useEffect(() => {
    setUpdatedTest(test);
  }, [test]);

  const handleUpdate = () => {
    updateDoc(doc(db, "tests", updatedTest.id), {
      category: updatedTest.category,
      question: updatedTest.question,
      intent: updatedTest.intent,
    });

    const modal = document.getElementById(id);
    if (modal) {
      modal.click();
    }
  };

  return (
    <Modal id={id} title="Update Test">
      <TestBody test={updatedTest} onChangeTest={setUpdatedTest} />
      <button className="btn btn-success btn-block mt-4" onClick={handleUpdate}>
        <h3>Update</h3>
      </button>
    </Modal>
  );
}
