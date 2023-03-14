import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import Papa from "papaparse";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { db } from "../firebase";
import { Modal } from "./Modal";
import { RawTestType, TestType } from "../types";
import { Upload } from "./Icons";

const uploadTests = async (tests: TestType[]) => {
  if (!tests.length) {
    console.log("No tests to upload");
    return;
  }
  console.log("Uploading tests...");

  const batch = writeBatch(db);

  for (const test of tests) {
    const questionExists = query(
      collection(db, "tests"),
      where("category", "==", test.category),
      where("question", "==", test.question),
      where("intent", "==", test.intent)
    );

    const intentExists = query(
      collection(db, "intents"),
      where("name", "==", test.intent)
    );

    const existingQuestions = await getDocs(questionExists);
    const existingIntents = await getDocs(intentExists);

    if (!existingQuestions.empty) {
      console.debug("Document already exists. Skipping...", test);
      continue;
    }

    if (existingIntents.empty) {
      console.info("Intent does not exist. Creating...", test);
      const newIntent = {
        id: uuidV4(),
        name: test.intent.trim(),
        description: "",
      };
      await setDoc(doc(db, "intents", newIntent.id), newIntent);
    }

    const docRef = doc(db, "tests", test.id);
    batch.set(docRef, test);
  }

  await batch.commit();
};

export function UploadCSV({ btnContent }: { btnContent?: JSX.Element }) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!files) {
      return;
    }
    const btn = document.getElementById("upload-csv-submit-btn");
    const closeModalBtn = document.getElementById("upload-test-modal");
    if (btn) {
      btn.setAttribute("disabled", "disabled");
      btn.classList.add("loading");
    }

    files.forEach((file, index) => {
      const fileName = file.name.split(".");
      const category = fileName.slice(0, fileName.length - 1).join(".");

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: Papa.ParseResult<RawTestType>) => {
          if (!results.data) return;

          const tests: TestType[] = [];

          results.data.forEach((item) => {
            if (!item.text || !item.intent) {
              return;
            }
            tests.push({
              id: uuidV4(),
              category: category.trim(),
              question: item.text.trim(),
              intent: item.intent.trim(),
            } as TestType);
          });

          console.log(`Finished loading ${file.name}`, tests);
          await uploadTests(tests);

          if (index === files.length - 1) {
            if (btn) {
              btn.removeAttribute("disabled");
              btn.classList.remove("loading");
            }
            if (closeModalBtn) {
              closeModalBtn.click();
            }
          }
        },
      });
    });

    setFiles([]);
  };

  return (
    <Modal
      id="upload-test-modal"
      title="Upload tests from CSV"
      btnContent={
        btnContent ? (
          btnContent
        ) : (
          <div className="flex items-center space-x-2">
            <Upload />
            <div>Upload CSV</div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full"
          multiple
          onChange={handleFileChange}
        />

        <div className="text-md font-bold">Files to upload</div>
        <div className="overflow-auto h-24">
          {files &&
            files.map((file) => <div key={file.name}>- {file.name}</div>)}
        </div>
        <div className="flex flex-col w-full items-center"></div>
        <button
          id="upload-csv-submit-btn"
          className="btn btn-primary btn-block"
          onClick={handleSubmit}
        >
          Upload
        </button>
      </div>
    </Modal>
  );
}
