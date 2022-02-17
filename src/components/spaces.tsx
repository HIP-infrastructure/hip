import * as React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTE_PREFIX, SPACES_NAV } from '../constants';

const Spaces = () => {
    const navigate = useNavigate();
    const [selectedSpace, setSelectedSpace] = React.useState(0)

    const handleSelectSpace = (selectedSpace: number) => {
        setSelectedSpace(selectedSpace)
        navigate(`${ROUTE_PREFIX}/${SPACES_NAV[selectedSpace].route}/sessions`)
    }

    return <>
        {/* <Tabs
            value={selectedSpace}
            onChange={(_, value) => handleSelectSpace(value)}
            sx={{ flex: 1, mb: 4 }}
        >
            {SPACES_NAV.map(n =>
                <Tab label={n.label} key={n.route} />)
            }
        </Tabs > */}
        <Outlet />
    </>
}

Spaces.displayName = 'Spaces'
export default Spaces
