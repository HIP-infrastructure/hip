import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { confirmPopup } from 'primereact/confirmpopup'
import { Sidebar } from 'primereact/sidebar'
import { mutate } from 'swr'
import React, { useEffect, useState } from 'react'
import { useAppStore, UserCredentials } from '../context/appProvider'
import './sessions.css'
import WebdavForm from '../UI/webdavLoginForm'
import { Dialog } from 'primereact/dialog'
import Session from './session'

export interface Container {
  id: string
  name: string
  user: string
  url: string
  state: ContainerState
  error: Error | null
  type: ContainerType
  parentId?: string
}

export type AppContainer = Container & ContainerOptions

export interface ContainerOptions {
  app: string
}

export enum ContainerState {
  UNINITIALIZED = 'uninitialized',
  CREATED = 'created',
  LOADING = 'loading',
  RUNNING = 'running',
  STOPPING = 'stopping',
  EXITED = 'exited',
  DESTROYED = 'destroyed',
}

export enum ContainerType {
  SERVER = 'server',
  APP = 'app',
}

export interface Error {
  code: string
  message: string
}

export const API_GATEWAY = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_API_PREFIX}`
export const API_SERVERS = `${API_GATEWAY}/remote-app/servers`
export const fetcher = (url: string) => fetch(url).then((r) => r.json())
export const uniq = (type: string = 'server') => {
  const uniqid = `${type === 'server' ? 'session' : 'app'}-${Date.now()
    .toString()
    .slice(-3)}`

  return uniqid
}

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
  const [showWedavForm, setShowWedavForm] = useState(false)

  useEffect(() => {
    if (user?.password && user.src === 'session') {
      setShowWedavForm(false)
      if (selected) createApp(selected, user)
    }
  }, [user, selected])

  useEffect(() => {
    if (visible) {
      document.body.classList.add('body-fixed')
    } else {
      document.body.classList.remove('body-fixed')
    }
  }, [visible])

  const createApp = async (
    server: Container,
    user: UserCredentials,
    name: string = 'brainstorm'
  ): Promise<void> => {
    const aid = uniq('app')
    const url = `${API_SERVERS}/${server.id}/apps/${aid}/start/${name}/${user.uid}/${user.password}`
    fetch(url).then(() => mutate(`${API_SERVERS}/${user?.uid}`))
  }

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
      <Dialog
        header="Data access"
        visible={showWedavForm}
        onHide={() => setShowWedavForm(false)}
      >
        <WebdavForm src={'session'} />
      </Dialog>
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
