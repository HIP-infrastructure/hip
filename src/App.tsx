import { TabMenu } from "primereact/tabmenu";
import Spaces from "./spaces/spaces";
import "./App.css";
import { AppStoreProvider } from "./context/appProvider";

const items = [
  {
    label: "Personal",
    routerLink: "/personal",
  },
  {
    label: "Collaborative",
    disabled: true
  },
  {
    label: "Public",
    disabled: true,
  },
];

const App = (): JSX.Element => {
  return (
    <AppStoreProvider>
      <main>
        <section>
          <nav className="nav-menu" />
          <div className="spaces">
            <div>
              <div className="spaces__nav">
                <TabMenu model={items}></TabMenu>
              </div>
              <Spaces />
            </div>
          </div>
        </section>
        <footer>
          <p>HIP 2021</p>
        </footer>
      </main>
    </AppStoreProvider>
  );
};

export default App;
