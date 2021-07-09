import React from "react";
import { Container } from "../sessions/session";

export const ServerContext = React.createContext<IServer>({} as IServer);
export interface WebdavCredentials {
  login: string;
  password: string;
}
export interface IServer {
  visible: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  selected: [
    Container | null,
    React.Dispatch<React.SetStateAction<Container | null>>
  ];
  webdav: [
    WebdavCredentials | undefined,
    React.Dispatch<React.SetStateAction<WebdavCredentials | undefined>>
  ];
}

export const AppProvider = ({ children }: { children: JSX.Element }) => {
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState<Container | null>(null);
  const [webdav, setWebdav] = React.useState<WebdavCredentials>();

  const server: IServer = {
    visible: [visible, setVisible],
    selected: [selected, setSelected],
    webdav: [webdav, setWebdav],
  };

  return (
    <ServerContext.Provider value={server}>{children}</ServerContext.Provider>
  );
};
