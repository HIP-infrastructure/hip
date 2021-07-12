import Sessions from "../sessions/sessions";
import Apps from "../apps/apps";
import Activity from "../activity/activity";
import Files from "../files/files";
import './spaces.css'

const Spaces = () => {
  return (
    <div className="spaces__layout-wrapper">
      <div className="services__apps">
        <Apps />
      </div>
      <div className="spaces__layout-top">
        <div className="services__sessions">
          <Sessions />

        </div>
        {/* <div className="services__files">
          <Files />
        </div> */}
      </div>

      <div className="spaces__layout-bottom"></div>
      {/* <div className="services__activity">
        <Activity />
      </div> */}
    </div>
  );
};

export default Spaces;
