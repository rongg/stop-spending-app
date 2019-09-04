import React from "react";
import '../styles/navbar.css';

const NavBar = ({user}) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-default">
            <div className='container nav-content'>
                <a className="navbar-brand" href="/">Stop Spending</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {user && (
                        <React.Fragment>
                            <ul className="navbar-nav mr-auto">
                                {/*<li className="nav-item">*/}
                                    {/*<a className="nav-link" href="/habits">Habits</a>*/}
                                {/*</li>*/}
                                {/*<li className="nav-item">*/}
                                {/*<a className="nav-link" href="/expenses">Expenses</a>*/}
                                {/*</li>*/}
                            </ul>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="/account">{user.name}</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/logout">Logout</a>
                                </li>
                            </ul>
                        </React.Fragment>
                    )}
                    {!user && (
                        <React.Fragment>
                    <span className="mr-auto">
                    </span>
                            <ul className="navbar-nav">
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
