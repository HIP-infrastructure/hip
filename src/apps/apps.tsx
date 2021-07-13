import { SlideMenu } from "primereact/slidemenu";
import { Button } from "primereact/button";
import { useRef, useState, useEffect, useContext } from "react";
import useSWR, { mutate } from "swr";
import WebdavForm from "../UI/webdavLoginForm";
import { Dialog } from "primereact/dialog";
import brainstormLogo from "../assets/brainstorm__logo.png";
import { Container, ContainerType, ContainerState } from '../gatewayClientAPI'
import { useAppStore, UserCredentials, API_SERVERS } from "../context/appProvider";
import "./apps.css";
import { uniq } from '../utils'


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
  const menuRef = useRef<SlideMenu>(null);
  const [startingServer, setStartingServer] = useState<Container | null>();
  const [showWedavForm, setShowWedavForm] = useState(false);

  const {
    visible: [visible, setVisible],
    selected: [selected, setSelected],
    user: [user, setUser],
    containers,
  } = useAppStore();

  const createServer = () => {
    const id = uniq("server");
    const url = `${API_SERVERS}/${id}/start/${user?.uid}`;
    const server = fetch(url);
    server.then(() => mutate(API_SERVERS));

    return server;
  };

  useEffect(() => {
    if (user?.password && user.src === "app") {
      setShowWedavForm(false);
      if (selected) {
        createApp(selected, user)
        setVisible(true);
      } else {
        createServer()
        .then((r) => r.json())
        .then((response) => {
          const server: Container = response.data;
          setStartingServer(server);
          setSelected(server);
          setVisible(true);
        });
      }

    }
  }, [user]);

  useEffect(() => {
    const container = containers?.find((c) => {
      return c.id === startingServer?.id && c.state === ContainerState.RUNNING;
    });
    if (container && user) {
      createApp(startingServer, user);
      setStartingServer(null);
      setSelected(container);
    }
  }, [user, containers, startingServer, setStartingServer, setSelected]);


  const createApp = async (
    server: Container,
    user: UserCredentials,
    name: string = "brainstorm"
  ): Promise<void> => {
    const aid = uniq("app");
    const url = `${API_SERVERS}/${server.id}/apps/${aid}/start/${name}/${user.uid}/${user.password}`;
    fetch(url).then(() => mutate(`${API_SERVERS}/${user?.uid}`));
  };


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
            ? `Open in #${server.name}`
            : `Create in #${server.name}`,
          icon: brainstorm ? "pi pi-eye" : "pi pi-clone",
          disabled: server.state !== ContainerState.RUNNING,
          command: () => {
            if (brainstorm) {
              setSelected(server);
              setVisible(true);
            } else {
              setSelected(server);
              setShowWedavForm(true);
            }
          },
        };
      }),
      {
        separator: true,
      },
      {
        label: `Create a new session`,
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
                  ref={menuRef}
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
                  onClick={(event) => menuRef?.current?.toggle(event)}
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
