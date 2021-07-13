import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { confirmPopup } from 'primereact/confirmpopup'
import { Sidebar } from 'primereact/sidebar'
import { mutate } from 'swr'
import React, { useEffect } from 'react'
import { useAppStore, API_SERVERS } from '../context/appProvider'
import { uniq } from '../utils'
import { Container, ContainerType, ContainerState } from '../gatewayClientAPI'
import Session from './session'
import './sessions.css'


export const fetcher = (url: string) => fetch(url).then((r) => r.json())


const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean
  wrapper: (children: JSX.Element) => JSX.Element
  children: JSX.Element
}): JSX.Element => (condition ? wrapper(children) : children)


const Sessions = () => {
  const error = {}
  const {
    visible: [visible, setVisible],
    selected: [selected, setSelected],
    user: [user],
    containers,
  } = useAppStore()

  useEffect(() => {
    if (visible) {
      document.body.classList.add('body-fixed')
    } else {
      document.body.classList.remove('body-fixed')
    }
  }, [visible])

  const createServer = () => {
    const id = uniq('server')
    const url = `${API_SERVERS}/${id}/start/${user?.uid}`
    const server = fetch(url)
    server.then(() => mutate(`${API_SERVERS}/${user?.uid}`))

    return server
  }

  const destroy = (id: string) => {
    const url = `${API_SERVERS}/${id}/destroy`
    fetch(url).then(() => mutate(`${API_SERVERS}/${user?.uid}`))
  }

  const servers = containers
    ?.filter((container: Container) => container.type === ContainerType.SERVER)
    .map((s: Container) => ({
      ...s,
      apps: (containers as AppContainer[]).filter((a) => a.parentId === s.id),
    }))

  const confirm = (event: any, serverId: string) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Permanently remove this session and all its applications?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => destroy(serverId),
      reject: () => {},
    })
  }

  return (
    <div>
      <Sidebar
        visible={visible}
        showCloseIcon={false}
        fullScreen
        onHide={() => setVisible(false)}
      >
        <Session />
      </Sidebar>
      <main className="sessions p-shadow-5">
        <section
          className="sessions__header"
          title="A session is a remote server instance where you can launch apps"
        >
          <h2>My Sessions</h2>
          <Button
            className="p-button-sm"
            label="Create session"
            onClick={() => createServer()}
          ></Button>
        </section>
        <section className="sessions__browser">
          {!servers && !error && (
            <ProgressSpinner
              strokeWidth="4"
              style={{ width: '24px', height: '24px' }}
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
                          e.preventDefault()
                          setSelected(server)
                          setVisible(true)
                        }}
                      >
                        {children}
                      </a>
                    )}
                  >
                    <div className="session__desktop_overlay">
                      <div className="session__desktop-text">
                        <div className="session__name">{`#${server?.name}`}</div>
                        <div className="session__details">
                          <p>{server.state}</p>
                          <p>{server.error?.message}</p>
                          {server.apps.map((app) => (
                            <div key={app.id} className="session_details-app">
                              <p>
                                <strong>{app.app}</strong>: {app.state}
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
                            style={{ width: '24px', height: '24px' }}
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
                      onClick={(e: any) => confirm(e, server.id)}
                    ></Button>
                    <Button
                      title="Open"
                      icon="pi pi-eye"
                      className="p-button-sm p-button-rounded p-button-primary "
                      disabled={server.state !== ContainerState.RUNNING}
                      onClick={() => {
                        setSelected(server)
                        setVisible(true)
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
  )
}

export default Sessions
