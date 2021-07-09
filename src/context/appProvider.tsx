import React from "react";
import { Container } from "../sessions/session";

export const ServerContext = React.createContext<IServer>({} as IServer);
export interface UserCredentials {
  uid: string;
  password: string;
  isAdmin: boolean;
}
export interface IServer {
  visible: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  selected: [
    Container | null,
    React.Dispatch<React.SetStateAction<Container | null>>
  ];
  user: [
    UserCredentials | undefined,
    React.Dispatch<React.SetStateAction<UserCredentials | undefined>>
  ];
}

export const AppProvider = ({ children }: { children: JSX.Element }) => {
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState<Container | null>(null);
  const [user, setUser] = React.useState<UserCredentials>();

  const server: IServer = {
    visible: [visible, setVisible],
    selected: [selected, setSelected],
    user: [user, setUser],
  };

  return (
    <ServerContext.Provider value={server}>{children}</ServerContext.Provider>
  );
};
