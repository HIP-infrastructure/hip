import { InputSwitch } from "primereact/inputswitch";
import { TabMenu } from "primereact/tabmenu";
import Spaces from './spaces/spaces'
import './App.css'

const items = [
  {
    label: 'Personal',
    routerLink: '/personal',
  },
  {
    label: 'Collaborative',
    disabled: true

  },
  {
    label: 'Public',
    disabled: true
  },
];

const Index = () => {
  return (
      <main>
        <section>
          <nav className="nav-menu">
            {/* <h5>Debug mode</h5>
            <InputSwitch></InputSwitch> */}
          </nav>
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
  );
};

export default Index;
