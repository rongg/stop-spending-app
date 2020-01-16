import React from 'react';
import Icon from "../common/Icon";

function ErrorPage({msg1, msg2}) {
    if(!msg1) msg1 = 'Whoops, something went wrong...';
    if(!msg2) msg2 = 'An unexpected error occurred.';
    return <div className={'row'}>
        <div className={'col-12 text-center error-message'}>
            <br/>
            <br/>
            <h3>{msg1}</h3>
            <Icon path={'app_icons/broken_piggy.svg'}/>
            <h3>{msg2}</h3>
        </div>
    </div>;
}

export default ErrorPage;