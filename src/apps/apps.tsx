import { SlideMenu } from "primereact/slidemenu";
import { Button } from "primereact/button";
import { useRef, useState, useEffect, useContext } from "react";
import useSWR, { mutate } from "swr";
import WebdavForm from "../UI/webdavLoginForm";
import { Dialog } from "primereact/dialog";

import brainstormLogo from "../assets/brainstorm__logo.png";
import {
  Container,
  ContainerType,
  API_SERVERS,
  AppContainer,
  uniq,
  ContainerState,
  API_GATEWAY,
} from "../sessions/session";
import { useAppStore, UserCredentials } from "../context/appProvider";
import "./apps.css";

const items = [
  {
    name: "Brainstorm",
    description:
      "Brainstorm is a collaborative, open-source application dedicated to the analysis of brain recordings: MEG, EEG, fNIRS, ECoG, depth electrodes and multiunit electrophysiology.",
    status: "running",
    url: "https: //neuroimage.usc.edu/brainstorm/Introduction",
    icon: brainstormLogo,
  },
];


const Apps = () => {
  const menu = useRef<SlideMenu>(null);
  const [startingServer, setStartingServer] = useState<Container | null>();
  const [showWedavForm, setShowWedavForm] = useState(false);

  const {
    visible: [visible, setVisible],
    selected: [selected, setSelected],
    user: [user, setUser],
    containers,
  } = useAppStore();

  const createServer = (user: UserCredentials) => {
    const id = uniq("server");
    const url = `${API_SERVERS}/${id}/start/${user.uid}/${user.password}`;
    const server = fetch(url);
    server.then(() => mutate(API_SERVERS));

    return server;
  };

  useEffect(() => {
    if (user?.password && user.src === "app") {
      setShowWedavForm(false);
      createServer(user)
        .then((r) => r.json())
        .then((response) => {
          const server: Container = response.data;
          setStartingServer(server);
          setSelected(server);
          setVisible(true);
        });
    }
  }, [user]);

  const startApp = async (
    server?: Container | null,
    name: string = "brainstorm"
  ): Promise<void> => {
    if (!server) return;
    const aid = uniq("app");
    const url = `${API_GATEWAY}/remote-app/servers/${server.id}/apps/${aid}/start/${name}`;
    fetch(url).then(() => mutate(API_GATEWAY));
  };

  useEffect(() => {
    const container = containers?.find((c) => {
      return c.id === startingServer?.id && c.state === ContainerState.RUNNING;
    });
    if (container) {
      startApp(startingServer);
      setStartingServer(null);
      setSelected(container);
    }
  }, [containers, startingServer, setStartingServer, setSelected]);

  const servers =
    containers
      .filter(
        (container: Container) => container.type === ContainerType.SERVER
      )
      .map((s: Container) => ({
        ...s,
        apps: (containers as AppContainer[]).filter((a) => a.parentId === s.id),
      })) || [];

  const menuItems =
    [
      ...servers?.map((server: Container) => {
        const brainstorm = server.apps.find(
          (a) => server.id === a.parentId && a.app === "brainstorm"
        );
        return {
          label: brainstorm
            ? `View in #${server.name}`
            : `Create in #${server.name}`,
          icon: brainstorm ? "pi pi-eye" : "pi pi-clone",
          disabled: server.state !== ContainerState.RUNNING,
          command: () => {
            if (brainstorm) {
              setSelected(server);
              setVisible(true);
            } else {
              startApp(server);
              setSelected(server);
              setVisible(true);
            }
          },
        };
      }),
      {
        separator: true,
      },
      {
        label: `Create in new session`,
        icon: "pi pi-clone",
        command: () => {
          setShowWedavForm(true);
        },
      },
    ] || [];

  return (
    <div>
      <Dialog
        header="Data access"
        visible={showWedavForm}
        onHide={() => setShowWedavForm(false)}
      >
        <WebdavForm src={'app'}/>
      </Dialog>
      <main className="apps p-shadow-5">
        <section
          className="apps__header"
          title="Apps are launched inside a session"
        >
          <h2>Applications</h2>
        </section>
        <section className="apps__launchpad">
          {items.map((app) => (
            <div key={`${app.name}`}>
              <div className="apps__card">
                <img src={app.icon} alt="" />
                <div className="apps__name">{app.name}</div>
              </div>
              <div className="apps__actions">
                <SlideMenu
                  ref={menu}
                  model={menuItems}
                  popup
                  viewportHeight={220}
                  menuWidth={175}
                ></SlideMenu>
                <Button
                  type="button"
                  className="p-button-sm p-button-outlined"
                  icon="pi pi-ellipsis-v"
                  label="Actions"
                  onClick={(event) => menu?.current?.toggle(event)}
                ></Button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Apps;
