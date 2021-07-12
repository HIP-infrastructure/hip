import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import React, { useRef, useState } from 'react'
import { useAppStore } from '../context/appProvider'
import { ContainerState, Container, AppContainer } from './sessions'
const xpraHTML5Parameters = 'keyboard=false&sharing=yes&sound=no'

const Session = () => {
  const sessionFullscreen = useRef<HTMLIFrameElement>(null)
  const sidebarSessionFullscreen = useRef<HTMLIFrameElement>(null)

  const {
    visible: [visible, setVisible],
    selected: [selected, setSelected],
    containers,
  } = useAppStore()
  const [fullscreen, setFullscreen] = useState(false)
  const [showWedavForm, setShowWedavForm] = useState(false)
  
  const setSidebarFullscreen = () => {
    sidebarSessionFullscreen?.current?.requestFullscreen()
  }

  const serverApps = (server: Container) => {
    return (
      (containers as AppContainer[])?.filter(
        (a) => a.parentId === server?.id
      ) || null
    )
  }

  React.useEffect(() => {
    if (fullscreen) {
      // const i = servers.map((s: any) => s.id).indexOf(selected.id);
      // const current = sessionFullscreen.current;
      sessionFullscreen?.current?.requestFullscreen()
      document.addEventListener('fullscreenchange', (event) => {
        console.log(event)
        if (!document.fullscreenElement) {
          setFullscreen(false)
        }
      })
    }
  }, [fullscreen])

  return (
    <div className="session__sidebar">
      {selected?.url && visible && (
        <iframe
          ref={sidebarSessionFullscreen}
          title="Live Session"
          className="session__sidebar_iframe"
          src={`${selected.url}?${xpraHTML5Parameters}`}
          allowFullScreen
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
          <div className="session__sidebar-name">{`#${selected?.name}`}</div>
          <div className="session__sidebar_actions">
            <Button
              title="Go back to main window"
              icon="pi pi-chevron-left"
              className="p-button-sm p-button-rounded p-button-outlined p-button-secondary p-mr-2"
              onClick={(e: any) => {
                setSelected(null)
                setVisible(false)
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
                setSidebarFullscreen()
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
                  onClick={(event) => setShowWedavForm(true)}
                ></Button>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Session
