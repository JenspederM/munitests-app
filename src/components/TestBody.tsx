import { useEffect, useState } from "react";
import { useApp } from "../providers/AppProvider";
import { TestType } from "../types";
import { Select } from "../components/Select";
import { PlusSmall } from "../components/Icons";
import { TextInput } from "../components/TextInput";
import { CATEGORY_MODAL_ID, INTENT_MODAL_ID } from "../constants";

export function TestBody({
  test,
  onChangeTest,
}: {
  test: TestType;
  onChangeTest: (test: TestType) => void;
}) {
  const app = useApp();

  const [categories, setCategories] = useState<string[]>([]);
  const [intents, setIntents] = useState<string[]>([]);

  useEffect(() => {
    if (!app.tests) return;

    const categories = app.tests.reduce((acc, test) => {
      if (!acc.includes(test.category)) {
        acc.push(test.category);
      }
      return acc;
    }, [] as string[]);

    const intents = app.tests.reduce((acc, test) => {
      if (!acc.includes(test.intent)) {
        acc.push(test.intent);
      }
      return acc;
    }, [] as string[]);

    setCategories(categories);
    setIntents(intents);
  }, [app.tests]);

  return (
    <>
      <Select
        value={test.category}
        items={categories}
        label="Category"
        placeholder="Select a Category"
        onChange={(e) => onChangeTest({ ...test, category: e.target.value })}
        right={
          test.id ? undefined : (
            <label
              htmlFor={CATEGORY_MODAL_ID}
              className="btn btn-primary btn-square"
            >
              <PlusSmall />
            </label>
          )
        }
      />
      <div className="w-full">
        <TextInput
          label="Question"
          placeholder="E.g. 'How do I get to the airport?'"
          value={test.question}
          onChange={(e) => onChangeTest({ ...test, question: e.target.value })}
        />
      </div>
      <Select
        value={test.intent}
        items={intents}
        label="Intent"
        placeholder="Select an intent"
        onChange={(e) => onChangeTest({ ...test, intent: e.target.value })}
        right={
          test.id ? undefined : (
            <label
              htmlFor={INTENT_MODAL_ID}
              className="btn btn-primary btn-square"
            >
              <PlusSmall />
            </label>
          )
        }
      />
    </>
  );
}
