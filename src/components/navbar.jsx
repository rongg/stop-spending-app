import React from "react";
import '../styles/navbar.css';
import PiggyBank from "./common/piggy_bank";
import {NavLink} from 'react-router-dom';
import Icon from "./common/Icon";

const NavBar = ({user}) => {

    function closeNavbar() {
        const navCollapse = document.querySelector('.navbar-collapse.collapse.show');
        if(navCollapse) {
            document.querySelector('.navbar-toggler').click();
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-default">
            <div className='container nav-content'>
                <a className="navbar-brand" href="/">
                    <PiggyBank height={32} width={40}
                               icon={null}/>
                    <span>Stop Spending</span>
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {user && (
                        <React.Fragment>
                            <ul className="navbar-nav mr-auto pages">
                                <li className="nav-item">
                                    <NavLink to="/" exact className="nav-link tall-img" onClick={closeNavbar}>
                                        <Icon path={'app_icons/glyph/home.svg'}/>
                                        <span className={'d-lg-none'}>Summary</span></NavLink>
                                </li>
                                <li className="nav-item">
                                    {/*<a className="nav-link" href="/habits">Habits</a>*/}
                                    <NavLink to="/habits" className="nav-link" onClick={closeNavbar}><Icon
                                        path={'app_icons/glyph/habits.svg'}/><span
                                        className={'d-lg-none'}>Habits</span></NavLink>
                                </li>
                            </ul>
                            <ul className="navbar-nav nav-actions">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/account" onClick={closeNavbar}><Icon
                                        path={'app_icons/glyph/settings.svg'}/><span>{user.name}</span></NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/logout" onClick={closeNavbar}><Icon
                                        path={'app_icons/glyph/logout.svg'}/><span>Logout</span></NavLink>
                                </li>
                            </ul>
                        </React.Fragment>
                    )}
                    {!user && (
                        <React.Fragment>
                    <span className="mr-auto">
                    </span>
                            <ul className="navbar-nav nav-actions">
                                <li className="nav-item">
                                    <a className="nav-link" href="/Login">Login</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/Register">Register</a>
                                </li>
                            </ul>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
