import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import useSWR, { mutate } from "swr";
import React, { useContext, useEffect, useRef } from "react";
import {
  ServerContext,
  WebdavCredentials,
  IServer,
} from "../context/appProvider";
import "./sessions.css";
import WebdavForm from "../UI/webdavLoginForm";
import { Dialog } from "primereact/dialog";

export interface Container {
  id: string;
  name: string;
  user: string;
  url: string;
  state: ContainerState;
  error: Error | null;
  type: ContainerType;
  parentId?: string;
}

export type AppContainer = Container & ContainerOptions;

export interface ContainerOptions {
  app: string;
}

export enum ContainerState {
  UNINITIALIZED = "uninitialized",
  CREATED = "created",
  LOADING = "loading",
  RUNNING = "running",
  STOPPING = "stopping",
  EXITED = "exited",
  DESTROYED = "destroyed",
}

export enum ContainerType {
  SERVER = "server",
  APP = "app",
}

export interface Error {
  code: string;
  message: string;
}

export const API_GATEWAY = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_API_PREFIX}`;
export const API_SERVERS = `${API_GATEWAY}/remote-app/servers`;
export const fetcher = (url: string) => fetch(url).then((r) => r.json());
export const uniq = (type: string = "server") => {
  const uniqid = `${type === "server" ? "session" : "app"}-${Date.now()
    .toString()
    .slice(-3)}`;

  return uniqid;
};
const xpraHTML5Parameters = "keyboard=false&sharing=yes&sound=no";

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean;
  wrapper: (children: JSX.Element) => JSX.Element;
  children: JSX.Element;
}): JSX.Element => (condition ? wrapper(children) : children);

const Server = () => {
  const toast = useRef(null);
  const sessionFullscreen = useRef<HTMLIFrameElement>(null);
  const sidebarSessionFullscreen = useRef<HTMLIFrameElement>(null);
  const {
    visible: [visible, setVisible],
    selected: [selected, setSelected],
    webdav: [webdav],
  } = useContext<IServer>(ServerContext);
  const [fullscreen, setFullscreen] = React.useState(false);
  const { data, error } = useSWR<{ data: Container[]; error: Error }>(
    API_SERVERS,
    fetcher,
    { refreshInterval: 3 * 1000 }
  );
  const [showWedavForm, setShowWedavForm] = React.useState(false);

  const createServer = (webdav: WebdavCredentials) => {
    const id = uniq("server");
    const url = `${API_SERVERS}/${id}/start/${webdav.login}/${webdav.password}`;
    const server = fetch(url);
    server.then(() => mutate(API_SERVERS));

    return server;
  };

  useEffect(() => {
    if (webdav) {
      createServer(webdav);
      setShowWedavForm(false);
    }
  }, [webdav]);

  const createApp = async (
    server: Container,
    name: string = "brainstorm"
  ): Promise<void> => {
    const aid = uniq("app");
    const url = `${API_SERVERS}/${server.id}/apps/${aid}/start/${name}`;
    fetch(url).then(() => mutate(API_SERVERS));
  };

  const destroy = (id: string) => {
    const url = `${API_SERVERS}/${id}/destroy`;
    fetch(url).then(() => mutate(API_SERVERS));
  };

  const containers = data?.data;
  const servers = containers
    ?.filter((container) => container.type === ContainerType.SERVER)
    .map((s) => ({
      ...s,
      apps: (containers as AppContainer[]).filter((a) => a.parentId === s.id),
    }));

  const serverApps = (server: Container) => {
    return (
      (containers as AppContainer[])?.filter(
        (a) => a.parentId === server?.id
      ) || null
    );
  };

  const confirm1 = (event: any, serverId: string) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Delete this container and all its applications?",
      icon: "pi pi-exclamation-triangle",
      accept: () => destroy(serverId),
      reject: () => {},
    });
  };

  React.useEffect(() => {
    if (fullscreen) {
      // const i = servers.map((s: any) => s.id).indexOf(selected.id);
      // const current = sessionFullscreen.current;
      sessionFullscreen?.current?.requestFullscreen();
      document.addEventListener("fullscreenchange", (event) => {
        console.log(event);
        if (!document.fullscreenElement) {
          setFullscreen(false);
        }
      });
    }
  }, [fullscreen]);

  React.useEffect(() => {
    if (visible) {
      document.body.classList.add("body-fixed");
    } else {
      document.body.classList.remove("body-fixed");
    }
  }, [visible]);

  const setSidebarFullscreen = () => {
    sidebarSessionFullscreen?.current?.requestFullscreen();
  };

  const onHide = () => {
    setShowWedavForm(false);
  };

  return (
    <div>
      <Toast ref={toast} />
      <Dialog visible={showWedavForm} onHide={() => setShowWedavForm(false)}>
        <WebdavForm></WebdavForm>
      </Dialog>
      <div>
        {fullscreen && (
          <iframe
            ref={sessionFullscreen}
            title="Live Session"
            className="session__sidebar-iframe"
            src={`${selected?.url}?${xpraHTML5Parameters}`}
            allowFullScreen
          ></iframe>
        )}
      </div>
      <Sidebar
        visible={visible}
        showCloseIcon={false}
        fullScreen
        onHide={() => setVisible(false)}
      >
        <div className="session__sidebar">
          {selected?.url && visible && (
            <iframe
              ref={sidebarSessionFullscreen}
              title="Live Session"
              className="session__sidebar_iframe"
              src={`${selected.url}?${xpraHTML5Parameters}`}
            ></iframe>
          )}
          {!selected?.url && (
            <div className="session__sidebar_iframe">
              <div>
                <ProgressSpinner></ProgressSpinner>
              </div>
            </div>
          )}
          <div className="session__sidebar-info">
            <div className="session__sidebar-header">
              <div className="session__sidebar-name">{selected?.name}</div>
              <div className="session__sidebar_actions">
                <Button
                  title="Go back to main window"
                  icon="pi pi-chevron-left"
                  className="p-button-sm p-button-rounded p-button-outlined p-button-secondary p-mr-2"
                  onClick={(e: any) => {
                    setSelected(null);
                    setVisible(false);
                  }}
                ></Button>
                <Button
                  title="Fullscreen"
                  icon="pi pi-window-maximize"
                  className="p-button-sm p-button-outlined p-button-primary p-mr-2"
                  disabled={
                    selected?.state !== ContainerState.RUNNING &&
                    selected?.state !== ContainerState.EXITED
                  }
                  onClick={() => {
                    // setSelected(server);
                    setSidebarFullscreen();
                  }}
                ></Button>
              </div>
            </div>
            <div className="session__sidebar-details">
              <p>{selected?.state}</p>
              <p>{selected?.error?.message}</p>
              <div className="session__sidebar-apps">
                {selected &&
                  serverApps(selected)?.map((app) => (
                    <div key={app.id}>
                      <div className="session__sidebar-appname">{app.app}</div>
                      <div className="session__sidebar-details">
                        <p>{app.state}</p>
                      </div>
                    </div>
                  ))}
                {selected?.state === ContainerState.RUNNING &&
                  serverApps(selected)?.length === 0 && (
                    <Button
                      type="button"
                      className="p-button-sm p-button-outlined"
                      icon="pi pi-clone"
                      label="Open Brainstorm"
                      onClick={(event) => createApp(selected)}
                    ></Button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
      <main className="sessions">
        <section
          className="sessions__header"
          title="A session is a remote server instance where you can launch apps"
        >
          <h2>Sessions</h2>
          <Button
            className="p-button-sm"
            label="Create session"
            onClick={() => setShowWedavForm(true)}
          ></Button>
        </section>
        <section className="sessions__browser">
          {!servers && !error && (
            <ProgressSpinner
              strokeWidth="4"
              style={{ width: "24px", height: "24px" }}
            ></ProgressSpinner>
          )}
          {error && <p>{error.message}</p>}
          {servers?.length === 0 && <p>Please, create a session</p>}
          <div className="sessions__items">
            {servers?.map((server) => (
              <div className="session__item" key={`${server.id}`}>
                <div className="session__desktop">
                  <ConditionalWrapper
                    condition={server.state === ContainerState.RUNNING}
                    wrapper={(children) => (
                      <a
                        title="Open"
                        href={server.url}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelected(server);
                          setVisible(true);
                        }}
                      >
                        {children}
                      </a>
                    )}
                  >
                    <div className="session__desktop_overlay">
                      <div className="session__desktop-text">
                        <div className="session__name">{server.name}</div>
                        <div className="session__details">
                          <p>{server.state}</p>
                          <p>{server.error?.message}</p>
                          {server.apps.map((app) => (
                            <div key={app.id}>
                              <p className="session_details-app">
                                {app.app}: {app.state}
                              </p>
                              <p>{app.error?.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="session__desktop-loading">
                        {(server.state === ContainerState.CREATED ||
                          server.state === ContainerState.LOADING ||
                          server.state === ContainerState.STOPPING) && (
                          <ProgressSpinner
                            strokeWidth="4"
                            style={{ width: "24px", height: "24px" }}
                          ></ProgressSpinner>
                        )}
                      </div>
                    </div>
                  </ConditionalWrapper>
                  <div className="session_actions">
                    <Button
                      title="Quit"
                      icon="pi pi-times"
                      className="p-button-sm p-button-rounded p-button-outlined p-button-warning p-mr-2"
                      disabled={
                        server.state !== ContainerState.RUNNING &&
                        server.state !== ContainerState.EXITED
                      }
                      onClick={(e: any) => confirm1(e, server.id)}
                    ></Button>
                    <Button
                      title="Show"
                      icon="pi pi-eye"
                      className="p-button-sm p-button-rounded p-button-primary "
                      disabled={server.state !== ContainerState.RUNNING}
                      onClick={() => {
                        setSelected(server);
                        setVisible(true);
                      }}
                    ></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Server;
