import { SlideMenu } from 'primereact/slidemenu'
import { Button } from 'primereact/button'
import { useRef, useState, useEffect, useContext } from 'react'
import useSWR, { mutate } from 'swr'
import WebdavForm from '../UI/webdavLoginForm'
import { Dialog } from 'primereact/dialog'
import brainstormLogo from '../assets/brainstorm__logo.png'
import {
  Container,
  ContainerType,
  ContainerState,
  API_SESSIONS,
  AppContainer,
} from '../gatewayClientAPI'
import { useAppStore, UserCredentials } from '../context/appProvider'
import './apps.css'
import { uniq } from '../utils'

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

const Apps = () => {
  const menuRef = useRef<SlideMenu>(null)
  const [startingServer, setStartingServer] = useState<Container | null>()
  const [showWedavForm, setShowWedavForm] = useState(false)

  const {
    currentSession: [currentSession, setCurrentSession],
    user: [user, setUser],
    containers: [containers, error],
  } = useAppStore()

  useEffect(() => {
    if (user?.password && user.src === 'app') {
      setShowWedavForm(false)
      if (currentSession !== null) createApp(currentSession, user)
    }
  }, [user, currentSession])

  // useEffect(() => {
  //   if (user?.password) {
  //     // create app in exisiting session
  //     if (startingServer) {
  //       createApp(startingServer, user)
  //       setCurrentSession(startingServer)
  //       setStartingServer(null)
  //     } else {
  //       createServer()
  //         .then((r) => r.json())
  //         .then((response) => {
  //           const session: Container = response.data
  //           setCurrentSession(session)
  //         })
  //     }
  //   }
  // }, [user, setCurrentSession, startingServer, setStartingServer])

  // const createApp = async (
  //   session: Container,
  //   user: UserCredentials,
  //   name: string = 'brainstorm'
  // ): Promise<void> => {
  //   const aid = uniq('app')
  //   const url = `${API_SESSIONS}/${session.id}/apps/${aid}/start/${name}/${user.uid}/${user.password}`
  //   fetch(url).then(() => mutate(`${API_SESSIONS}/${user?.uid}`))
  // }

  const sessions =
    containers
      ?.filter(
        (container: Container) => container.type === ContainerType.SERVER
      )
      .map((s: Container) => ({
        ...s,
        apps: (containers as AppContainer[]).filter((a) => a.parentId === s.id),
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
              setStartingServer(session)
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
