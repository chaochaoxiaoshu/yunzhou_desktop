import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  const handleStartXray = (): void => window.electron.ipcRenderer.send('startXray')
  const handleEndXray = (): void => window.electron.ipcRenderer.send('endXray')

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <button className="action" onClick={handleStartXray}>
          <div>启动 Xray</div>
        </button>
        <button className="action" onClick={handleEndXray}>
          <div>停止 Xray</div>
        </button>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
