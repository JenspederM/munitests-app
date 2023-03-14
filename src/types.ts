import { ReactElement } from "react";

export type TestType = {
  id: string;
  category: string;
  question: string;
  intent: string;
};

export type RawTestType = {
  text?: string;
  intent?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  type:
    | "alert-success"
    | "alert-error"
    | "alert-info"
    | "alert-warning"
    | undefined;
  message: string;
  timeout?: number;
};

export type ClassNameType = {
  className?: string;
};

export type RouteType = {
  title: string;
  path: string;
  element?: ReactElement;
};

export type NavbarMenu = {
  items: RouteType[];
  className?: string;
};

export type FilterType = {
  category: string;
  intent: string;
  question: string;
};
