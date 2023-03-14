import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../firebase";
import { CARD_WIDTHS } from "../constants";
import { Notification, TestType, User } from "../types";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind-config";
import { collection, onSnapshot } from "firebase/firestore";
import { filterTests } from "../utils";

type AppContextType = {
  user?: User;
  tests?: TestType[];
  selectedTests?: TestType[];
  tailwindConfig: any;
  addNotification: (notification: Notification) => void;
  filterTests: (
    tests: TestType[],
    category: string,
    question: string,
    intent: string
  ) => TestType[];
  selectTest: (test: TestType) => void;
};

const AppContext = createContext<AppContextType>({
  addNotification: () => {},
  tailwindConfig: resolveConfig(tailwindConfig),
  filterTests: () => [],
  selectTest: () => {},
});

const AppProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tests, setTests] = useState<TestType[]>([]);

  useEffect(() => {
    let unsubscribeUser: () => void;
    let unsubscribeTests: () => void;
    unsubscribeUser = auth.onAuthStateChanged((userAuth) => {
      if (!userAuth) {
        setUser(undefined);
        return;
      }

      const newUser: User = {
        id: userAuth.uid,
        email: userAuth.email || "",
        name: userAuth.displayName || "",
        avatar: userAuth.photoURL || "",
        createdAt: userAuth.metadata.creationTime || "",
        updatedAt: userAuth.metadata.lastSignInTime || "",
      };

      setUser(newUser);

      unsubscribeTests = onSnapshot(
        collection(db, "tests"),
        (querySnapshot) => {
          const tests: TestType[] = [];
          querySnapshot.forEach((doc) => {
            tests.push(doc.data() as TestType);
          });
          setTests(tests);
        }
      );
    });

    return () => {
      unsubscribeUser();
      unsubscribeTests && unsubscribeTests();
    };
  }, []);

  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    console.log("notifications", notifications);

    const notification = notifications[0];
    const timeout = setTimeout(() => {
      setNotifications((notifications) => notifications.slice(1));
    }, notification.timeout || 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [notifications]);

  const addNotification = (notification: Notification) => {
    setNotifications((notifications) => [...notifications, notification]);
  };

  const closeNotification = (notification: Notification) => () => {
    setNotifications((notifications) =>
      notifications.filter((n) => n !== notification)
    );
  };

  const value = {
    user,
    addNotification,
    tailwindConfig: resolveConfig(tailwindConfig),
    tests,
    filterTests,
    selectTest: () => {},
  };

  return (
    <AppContext.Provider value={value}>
      <div className="absolute inset-0 flex flex-col grow">{children}</div>
      {notifications.length > 0 && (
        <div className={`toast toast-center ${CARD_WIDTHS} max-h-44`}>
          <div className="sticky">
            <button
              className="btn btn-block btn-sm"
              onClick={() => setNotifications([])}
            >
              Clear Notifications
            </button>
          </div>
          <div className="overflow-y-scroll space-y-2">
            {[...notifications].reverse().map((notification, index) => (
              <div
                key={index}
                className={`alert ${notification.type} flex flex-row items-center`}
              >
                <div>
                  <span>{notification.message}</span>
                </div>
                <button
                  className="btn btn-sm btn-glass"
                  onClick={closeNotification(notification)}
                >
                  Close
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext<AppContextType>(AppContext);

export default AppProvider;
