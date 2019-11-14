import React from "react";

function SimpleBar({pct, fill}) {
    if(!pct) pct = 100;
    if(!fill) fill = "#5bca6a";
    return <svg className={'simple-bar'} viewBox="0 0 500 750" x="0px" y="0px" width="100px" height="100px">
            <rect y={(100 - pct) + '%'} height={pct + '%'} width="100%" fill={fill} />
        </svg>;
}

export default SimpleBar;

