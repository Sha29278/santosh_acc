"use client";

import { createContext, useContext } from "react";

export interface AdminContextType {
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({ logout: async () => {} });
export const AdminProvider = AdminContext.Provider;
export const useAdmin = () => useContext(AdminContext);
