import React, { useState } from "react";
import { Container } from "../sessions/sessions";
import useSWR, { mutate } from "swr";
import { getCurrentUser } from "@nextcloud/auth";

export const API_GATEWAY = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_API_PREFIX}`
export const API_SERVERS = `${API_GATEWAY}/remote-app/servers`

export interface UserCredentials {
  uid: string;
  password: string;
  isAdmin: boolean;
  displayName: string;
  src?: string
}
export interface IAppState {
  visible: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  selected: [
    Container | null,
    React.Dispatch<React.SetStateAction<Container | null>>
  ];
  user: [
    UserCredentials | null,
    React.Dispatch<React.SetStateAction<UserCredentials | null>>
  ];
  containers: [
    Container[] | null,
    React.Dispatch<React.SetStateAction<Container[] | null>>
  ];
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const AppContext = React.createContext<IAppState>({} as IAppState);

export const AppStoreProvider = ({ children }: { children: JSX.Element }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<Container | null>(null);
  const [user, setUser] = useState<UserCredentials>();

  // Fetch Nextcloud user
  React.useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Start polling containers fetch 
  const {
    data,
    error,
  } = useSWR<{ data: Container[]; error: Error }>(
    () => `${API_SERVERS}/${user?.uid}`,
    fetcher,
    { refreshInterval: 3 * 1000 }
  );

  const value: IAppState = React.useMemo(
    () => ({
      visible: [visible, setVisible],
      selected: [selected, setSelected],
      user: [user, setUser],
      containers: data?.data || [],
    }),
    [visible, setVisible, selected, setSelected, user, setUser, data]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = (): IAppState => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("Wrap AppProvider!");
  }

  return context;
};
