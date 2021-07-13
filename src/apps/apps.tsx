import { SlideMenu } from 'primereact/slidemenu'
import { Button } from 'primereact/button'
import { useRef, useState, useEffect } from 'react'
import WebdavForm from '../UI/webdavLoginForm'
import { Dialog } from 'primereact/dialog'
import brainstormLogo from '../assets/brainstorm__logo.png'
import {
  Container,
  ContainerType,
  ContainerState,
  AppContainer,
  createApp,
  createSession,
} from '../gatewayClientAPI'
import { useAppStore } from '../context/appProvider'
import './apps.css'

const items = [
  {
    name: 'Brainstorm',
    description:
      'Brainstorm is a collaborative, open-source application dedicated to the analysis of brain recordings: MEG, EEG, fNIRS, ECoG, depth electrodes and multiunit electrophysiology.',
    status: 'running',
    url: 'https: //neuroimage.usc.edu/brainstorm/Introduction',
    icon: brainstormLogo,
  },
]

const Apps = (): JSX.Element  => {
  const menuRef = useRef<SlideMenu>(null)
  const [showWedavForm, setShowWedavForm] = useState(false)
  const [shouldCreateSession, setShouldCreateSession] = useState(false)
  const [sessionForNewApp, setSessionForNewApp] =
    useState<Container | null>()
  const [newSessionForApp, setNewSessionForApp] = useState<Container | null>()

  const {
    currentSession: [_, setCurrentSession],
    user: [user],
    containers: [containers],
  } = useAppStore()

  // create app in existing session
  // or create new session
  useEffect(() => {
    if (user?.password && user.src === 'app') {
      setShowWedavForm(false)

      if (sessionForNewApp) {
        createApp(sessionForNewApp, user)
        setCurrentSession(sessionForNewApp)
        setSessionForNewApp(null)
      } else if (shouldCreateSession) {
        createSession(user.uid).then((session) => {
          setNewSessionForApp(session)
          setShouldCreateSession(false)
        })
      }
    }
  }, [
    user,
    sessionForNewApp,
    shouldCreateSession,
    setShowWedavForm,
    setSessionForNewApp,
    setNewSessionForApp,
    setShouldCreateSession,
    setCurrentSession
  ])

  // create app in new session
  useEffect(() => {
    if (newSessionForApp && user?.password && user.src === 'app') {
      const container = containers?.find((c) => {
        return c.id === newSessionForApp?.id && c.state === ContainerState.RUNNING
      })

      if (container) {
        createApp(container, user)
        setCurrentSession(container)
        setNewSessionForApp(null)
      }
    }
  }, [user, containers, newSessionForApp, setCurrentSession, setNewSessionForApp])

  const sessions =
    containers
      ?.filter(
        (container: Container) => container.type === ContainerType.SERVER
      )
      .map((container: Container) => ({
        ...container,
        apps: (containers as AppContainer[]).filter((a) => a.parentId === container.id),
      })) || []

  const menuItems =
    [
      ...sessions?.map((session: Container) => {
        const brainstorm = session.apps.find(
          (app: AppContainer) =>
            session.id === app.parentId && app.app === 'brainstorm'
        )
        return {
          label: brainstorm
            ? `Open in #${session.name}`
            : `Create in #${session.name}`,
          icon: brainstorm ? 'pi pi-eye' : 'pi pi-clone',
          disabled: session.state !== ContainerState.RUNNING,
          command: () => {
            if (brainstorm) {
              setCurrentSession(session)
            } else {
              setSessionForNewApp(session)
              setShowWedavForm(true)
            }
          },
        }
      }),
      {
        separator: true,
      },
      {
        label: `Create a new session`,
        icon: 'pi pi-clone',
        command: () => {
          setShouldCreateSession(true)
          setShowWedavForm(true)
        },
      },
    ] || []

  return (
    <div>
      <Dialog
        header="Data access"
        visible={showWedavForm}
        onHide={() => setShowWedavForm(false)}
      >
        <WebdavForm src={'app'} />
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
  )
}

export default Apps
