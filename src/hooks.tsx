import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { TestType } from "./types";

export const useTests = () => {
  const [data, setData] = useState<TestType[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tests"), (snapshot) => {
      const newData: TestType[] = [];
      snapshot.docs.forEach((doc) => {
        const test = doc.data() as TestType;
        newData.push(test);
      });
      setData(newData);
    });

    return unsubscribe;
  }, []);

  return data;
};
