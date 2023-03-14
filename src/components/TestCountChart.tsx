import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TestType } from "../types";

type CountType = {
  name: string;
  count: number;
};

export const TestCountChart = ({ tests }: { tests: TestType[] }) => {
  const [counts, setCounts] = useState<CountType[]>([]);

  useEffect(() => {
    const testCountByCategory = tests.reduce((acc, test) => {
      const index = acc.findIndex(
        (item: CountType) => item.name === test.category
      );
      if (index === -1) {
        acc.push({ name: test.category, count: 1 });
      } else {
        acc[index].count++;
      }
      return acc;
    }, [] as CountType[]);

    testCountByCategory.sort((a, b) => b.count - a.count);

    setCounts(testCountByCategory);
  }, [tests]);

  return (
    <div className="flex flex-col w-full items-center">
      {counts.length > 0 ? (
        <>
          <h2 className="text-lg font-bold">Test Count by Category</h2>
          <ResponsiveContainer width={"100%"} height={250}>
            <BarChart data={counts} width={1000} height={250}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: "100%", height: 250 }}
        >
          <div>No tests found...</div>
          <div>
            Use <span className="font-bold">Add Test</span> or{" "}
            <span className="font-bold">Upload Tests</span> to get started!
          </div>
        </div>
      )}
    </div>
  );
};
