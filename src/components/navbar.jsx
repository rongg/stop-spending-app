import React from "react";
import '../styles/navbar.css';
import PiggyBank from "./common/piggy_bank";

const NavBar = ({user}) => {
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
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="/habits">Habits</a>
                                </li>
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
