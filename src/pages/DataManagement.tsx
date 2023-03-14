import { useEffect, useState } from "react";
import { MemoTable } from "../components/Table";
import { useApp } from "../providers/AppProvider";
import { filterTests } from "../utils";
import { FilterType, TestType } from "../types";
import { HideableSection } from "../components/HideableSection";
import { UploadCSV } from "../components/UploadCSV";
import { Upload, ArchiveArrowDown } from "../components/Icons";
import { v4 as uuidV4 } from "uuid";
import Papa from "papaparse";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const DataManagement = () => {
  const app = useApp();
  const [tests, setTests] = useState<TestType[]>([]);
  const [newTests, setNewTests] = useState<TestType[]>([]);
  const [filter, setFilter] = useState<FilterType>({
    category: "",
    question: "",
    intent: "",
  });

  useEffect(() => {
    if (app.tests) {
      setTests(app.tests);
    }
  }, [app.tests]);

  const filteredTests = filterTests(
    tests,
    filter.category,
    filter.question,
    filter.intent
  );

  const handleNewTest = (newTest: TestType) => {
    if (!newTest.id) {
      throw new Error("Test ID is required");
    }

    if (!newTest.category || !newTest.question || !newTest.intent) {
      if (!newTest.category)
        app.addNotification({
          type: "alert-error",
          message: "Category is required",
        });
      if (!newTest.question)
        app.addNotification({
          type: "alert-error",
          message: "Question is required",
        });
      if (!newTest.intent)
        app.addNotification({
          type: "alert-error",
          message: "Intent is required",
        });
      return false;
    }

    setDoc(doc(db, "tests", newTest.id), newTest);

    setNewTests([...newTests, newTest]);
    return true;
  };

  const handleNewCategory = (category: string) => {
    if (!category) {
      app.addNotification({
        type: "alert-error",
        message: "Category is required",
      });
      return false;
    }

    console.log("New category", category);
    return true;
  };

  const handleNewIntent = (intent: string) => {
    if (!intent) {
      app.addNotification({
        type: "alert-error",
        message: "Intent is required",
      });
      return false;
    }

    console.log("New intent", intent);
    return true;
  };

  const handleDeleteTest = async (test: TestType) => {
    await deleteDoc(doc(db, "tests", test.id));
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="w-full lg:flex lg:h-full lg:w-1/4">
        <Sidebar
          className="flex flex-col w-full h-full bg-primary px-8 py-4 text-primary-content"
          onNewTest={handleNewTest}
          onNewCategory={handleNewCategory}
          onNewIntent={handleNewIntent}
        />
      </div>
      <div className="w-full lg:w-3/4">
        <div className="flex grow h-96 lg:h-full overflow-auto">
          <MemoTable
            tests={filteredTests}
            onDelete={handleDeleteTest}
            filter={filter}
            setFilter={setFilter}
            editable
            deletable
          />
        </div>
      </div>
    </div>
  );
};

export default DataManagement;

function Sidebar({
  className,
  onNewTest,
  onNewCategory,
  onNewIntent,
}: {
  className?: string;
  onNewTest: (test: TestType) => boolean;
  onNewCategory: (category: string) => boolean;
  onNewIntent: (intent: string) => boolean;
}) {
  const app = useApp();
  const [tests, setTests] = useState<TestType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [intents, setIntents] = useState<string[]>([]);

  const [category, setCategory] = useState("");
  const [intent, setIntent] = useState("");
  const [question, setQuestion] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newIntent, setNewIntent] = useState("");

  useEffect(() => {
    if (app.tests) {
      setTests(app.tests);
      setCategories(
        app.tests
          .map((t) => t.category)
          .filter((c, i, arr) => arr.indexOf(c) === i)
      );
      setIntents(
        app.tests
          .map((t) => t.intent)
          .filter((c, i, arr) => arr.indexOf(c) === i)
      );
    }
  }, [app.tests]);

  const handleNewTest = () => {
    const newTest: TestType = {
      id: uuidV4(),
      category,
      intent,
      question,
    };

    if (onNewTest(newTest)) {
      setQuestion("");
    } else {
      console.log("Error adding test");
    }
  };

  const handleNewCategory = () => {
    if (onNewCategory(newCategory)) {
      setNewCategory("");
    } else {
      console.log("Error adding category");
    }
  };

  const handleNewIntent = () => {
    if (onNewIntent(newIntent)) {
      setNewIntent("");
    } else {
      console.log("Error adding intent");
    }
  };

  const downloadCSV = () => {
    var csv = Papa.unparse(tests);

    var csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var csvURL = null;
    csvURL = window.URL.createObjectURL(csvData);

    var tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "download.csv");
    tempLink.click();
  };

  return (
    <div className={className}>
      <UploadCSV
        btnContent={
          <div className="btn btn-success btn-block space-x-2">
            <Upload />
            <div className="">Upload Tests</div>
          </div>
        }
      />
      <div className="flex flex-col grow justify-center">
        <div className="divider">Add Test</div>
        <div className="form-control space-y-2">
          <select
            className="select select-bordered w-full"
            value={category === "" ? "Select Category" : category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option disabled>Select Category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="select select-bordered w-full"
            value={intent === "" ? "Select Intent" : intent}
            onChange={(e) => setIntent(e.target.value)}
          >
            <option disabled>Select Intent</option>
            {intents.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
          <input
            className="input input-bordered"
            type="text"
            placeholder="Enter new question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="btn btn-success btn-block space-x-2"
            onClick={handleNewTest}
          >
            <ArchiveArrowDown />
            <div>Save Test</div>
          </button>
        </div>
      </div>
      <HideableSection title="Add Category">
        <input
          placeholder="Enter new category here..."
          className="input input-bordered w-full"
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          className="btn btn-success btn-block mt-4 space-x-2"
          onClick={handleNewCategory}
        >
          <ArchiveArrowDown />
          <div>Save Category</div>
        </button>
      </HideableSection>
      <HideableSection title="Add Intent">
        <input
          placeholder="Enter new intent here..."
          className="input input-bordered w-full"
          type="text"
          value={newIntent}
          onChange={(e) => setNewIntent(e.target.value)}
        />
        <button
          className="btn btn-success btn-block mt-4 space-x-2"
          onClick={handleNewIntent}
        >
          <ArchiveArrowDown />
          <div>Save Intent</div>
        </button>
      </HideableSection>
    </div>
  );
}
