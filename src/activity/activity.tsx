import { Card } from "primereact/card";
import './activity.css'

const Activity = (): JSX.Element  => (
  <main className="activity">
    <section className="activity__header">
      <h2>Activity</h2>
    </section>
    <Card>
      <section className="activity__chat"></section>
      <section className="activity__messages">
        <div id="messages">
          <ul>
            <li></li>
          </ul>
        </div>
      </section>
    </Card>
  </main>
);

export default Activity;
