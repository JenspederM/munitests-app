import React, { useEffect, useState } from "react";
import { TestCountChart } from "../components/TestCountChart";
import { MemoTable } from "../components/Table";
import { ChevronRight } from "../components/Icons";
import { functionsApi } from "../firebase";
import { FilterType, TestType } from "../types";
import { filterTests, isInString } from "../utils";
import { v4 as uuidV4 } from "uuid";
import { Filter } from "../components/Filter";
import ReusableTable from "../components/ReusableTable";

type TestResultType = {
  id: string;
  created_at: string;
  original_text: string;
  actual_intent: string;
  predicted_intent1: string;
  predicted_confidence1: number;
  predicted_intent2: string;
  predicted_confidence2: number;
  predicted_intent3: string;
  predicted_confidence3: number;
};

const formatTestResult = (
  id: string,
  created_at: string,
  question: string,
  intent: string,
  response: any
): TestResultType => {
  const intents = response.data.intents;
  const intent1 = intents[0]["intent"];
  const intent2 = intents[1]["intent"];
  const intent3 = intents[2]["intent"];
  const confidence1 = intents[0]["confidence"];
  const confidence2 = intents[1]["confidence"];
  const confidence3 = intents[2]["confidence"];

  return {
    id: id,
    created_at: created_at,
    original_text: question,
    actual_intent: intent.trim(),
    predicted_intent1: intent1.trim(),
    predicted_confidence1: confidence1 || 0,
    predicted_intent2: intent2.trim(),
    predicted_confidence2: confidence2 || 0,
    predicted_intent3: intent3.trim(),
    predicted_confidence3: confidence3 || 0,
  };
};

function RadialProgress({ value, max }: { value: number; max: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentProgress = Math.ceil((value / max) * 100);
    setProgress(currentProgress);

    return () => {
      setProgress(0);
    };
  }, [value, max]);

  return (
    <div>
      <div
        className={`radial-progress text-[12pt] text-center`}
        style={
          {
            "--value": progress, // @ts-ignore
            "--size": "2rem",
            "--thickness": "10%",
          } as React.CSSProperties
        }
      >
        {progress}
      </div>
    </div>
  );
}

function Table({
  data,
  className = "table",
  filterable = false,
  excludeHeaders = [],
}: {
  data: { [key: string]: any }[];
  className?: string;
  filterable?: boolean;
  excludeHeaders?: string[];
}) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    [key: string]: { value: string; setValue: (value: string) => void };
  }>({});

  useEffect(() => {
    if (data.length === 0) {
      return;
    }
    const headers = Object.keys(data[0]).filter(
      (header) => !excludeHeaders.includes(header)
    );

    const filters = headers.reduce((acc, header) => {
      const value = "";
      const setValue = (value: string) => {
        const newFilters = { ...filters };
        newFilters[header].value = value;
        setFilters(newFilters);
      };

      acc[header] = { value: value, setValue: setValue };
      return acc;
    }, {} as { [key: string]: { value: string; setValue: (value: string) => void } });

    setHeaders(headers);
    setFilters(filters);
  }, [data, excludeHeaders]);

  if (data.length === 0) {
    return <div>No data</div>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute w-full h-full">
        <table className={className}>
          <thead className="sticky top-0">
            <tr>
              <th hidden></th>
              {headers.map((header) => (
                <th key={header}>
                  {filterable ? (
                    <Filter
                      placeholder={header}
                      value={filters[header].value}
                      onChange={filters[header].setValue}
                    />
                  ) : (
                    header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data
              .filter((datum) => {
                return headers.every((header) => {
                  const filterValue = filters[header].value;

                  if (filterValue === "") {
                    return true;
                  }

                  return isInString(datum[header], filterValue);
                });
              })
              .map((datum, index) => {
                return (
                  <tr key={index}>
                    <td hidden></td>
                    {headers.map((header) => (
                      <td key={header}>{datum[header]}</td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Dashboard = ({ tests }: { tests: TestType[] }) => {
  const [selectedTests, setSelectedTests] = useState<TestType[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [nTests, setNTests] = useState(0);
  const [filter, setFilter] = useState<FilterType>({
    category: "",
    question: "",
    intent: "",
  });

  const filteredTests = filterTests(
    tests,
    filter.category,
    filter.question,
    filter.intent
  );

  const runTest = async () => {
    setNTests(selectedTests.length);

    const testId = uuidV4();
    const createdAt = new Date().toISOString();

    // loop through selected tests
    for (let i = 0; i < selectedTests.length; i++) {
      const { question, intent } = selectedTests[i];

      const WORKSPACE_ID = "4d8ba5de-1d43-4ca8-93e0-d9a684125270";
      const response = await functionsApi.messageAssistant({
        workspaceId: WORKSPACE_ID,
        input: {
          text: question,
        },
        alternateIntents: true,
      });

      const result = formatTestResult(
        testId,
        createdAt,
        question,
        intent,
        response
      );

      setTestResults((prev) => [...prev, result]);
      setProgress((prev) => prev + 1);
    }

    console.log(testResults);

    setSelectedTests([]);
    setProgress(0);
    setNTests(0);
  };

  return (
    <div className="flex flex-col">
      <div className="h-96 overflow-y-scroll">
        <MemoTable
          tests={filteredTests}
          onCheck={setSelectedTests}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
      <div className="px-4">
        <button
          onClick={runTest}
          disabled={selectedTests.length === 0 || nTests > 0}
          className={`relative btn btn-success btn-block space-x-2`}
        >
          {nTests > 0 && <RadialProgress value={progress} max={nTests} />}
          <div>Run Test</div>
          <ChevronRight />
        </button>
      </div>
      <div className="overflow-x-auto h-96">
        <ReusableTable />
      </div>
      <TestCountChart tests={filteredTests} />
    </div>
  );
};

export default Dashboard;
