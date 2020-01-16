import React from 'react';
import './styles/App.css';
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import {Route, Redirect, Switch} from "react-router-dom";
import UserHome from "./components/pages/user_home";
import Login from "./components/pages/login";
import Logout from "./components/pages/logout";
import MyAccount from "./components/pages/my_account";
import EditAccount from "./components/pages/edit_account";
import MyHabits from "./components/pages/my_habits";
import MyHabit from "./components/pages/my_habit";
import CreateHabit from "./components/pages/create_habit";
import EditHabit from "./components/pages/edit_habit";
import DeleteHabit from "./components/pages/delete_habit";
import MyExpenses from "./components/pages/my_expenses";
import MyExpense from "./components/pages/my_expense";
import CreateExpense from "./components/pages/create_expense";
import EditExpense from "./components/pages/edit_expense";
import EditGoal from "./components/pages/edit_goal";
import DeleteGoal from "./components/pages/delete_goal";
import DeleteExpense from "./components/pages/delete_expense";
import Register from "./components/pages/create_account";
import auth from './services/auth';
import VerifyAccount from "./components/pages/verify_account";
import ResendToken from "./components/pages/resend_token";
import ResetPasswordRequest from "./components/pages/reset_password_request";
import ResetPassword from "./components/pages/reset_password";
import CreateUrge from "./components/pages/create_urge";
import CreateGoal from "./components/pages/create_goal";
import ErrorPage from "./components/pages/error_page";


class App extends React.Component {
    state = {
        user: auth.getCurrentUser()
    };

    componentDidMount() {
    }

    componentDidCatch(error, errorInfo) {
        this.setState({hasError: true});
        console.error(error, errorInfo);
    }

    render() {
        const user = this.state.user;

        if (this.state.hasError) {
            //  Fallback Error UI
            return <div className={'app'}>
                <NavBar user={user}/>
                <div className='app-content'>
                    <div className="container">
                        <ErrorPage/>
                    </div>
                </div>
            </div>;
        }

        return (
            <div className={'app'}>
                <NavBar user={user}/>
                <div className='app-content'>
                    <div className="container">
                        <Switch>
                            <Route path="/" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return<UserHome {...props} />
                            }}/>
                            <Route path="/error" render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <ErrorPage {...props} />;
                            }}/>

                            <Route path="/register" exact component={Register}/>

                            <Route path="/login" render={props => {
                                if (user) return <Redirect to="/habits"/>;
                                return <Login {...props} />
                            }}/>
                            <Route path="/logout" component={Logout}/>

                            <Route path="/account" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <MyAccount user={user} {...props} />;
                            }}/>
                            <Route path="/account/edit" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <EditAccount user={user} {...props} />;
                            }}/>

                            <Route path="/habits" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <MyHabits {...props} />;
                            }}/>
                            <Route path="/habit/new" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <CreateHabit user={user} {...props} />;
                            }}/>
                            <Route path="/habit/:id/edit" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <EditHabit user={user} {...props} />;
                            }}/>
                            <Route path="/habit/:id/delete" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <DeleteHabit user={user} {...props} />;
                            }}/>
                            <Route path="/habit/:id" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <MyHabit {...props} />;
                            }}/>
                            <Route path="/habit/:id/expense/new" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <CreateExpense user={user} {...props} />;
                            }}/>
                            <Route path="/habit/:id/urge/new" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <CreateUrge user={user} {...props} />;
                            }}/>
                            <Route path="/habit/:id/goal/new" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <CreateGoal user={user} {...props} />;
                            }}/>
                            <Route path="/habit/:habitId/expense/:id" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <MyExpense {...props} />;
                            }}/>
                            <Route path="/habit/:habitId/expense/:id/edit" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <EditExpense user={user} {...props} />;
                            }}/>
                            <Route path="/habit/:habitId/expense/:id/delete" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <DeleteExpense {...props} />;
                            }}/>

                            <Route path="/expenses" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <MyExpenses {...props} />;
                            }}/>
                            <Route path="/expense/new" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <CreateExpense user={user} {...props} />;
                            }}/>
                            <Route path="/urge/new" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <CreateUrge user={user} {...props} />;
                            }}/>
                            <Route path="/expense/:id" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <MyExpense {...props} />;
                            }}/>
                            <Route path="/expense/:id/edit" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <EditExpense user={user} {...props} />;
                            }}/>
                            <Route path="/goal/:id/edit" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <EditGoal user={user} {...props} />;
                            }}/>
                            <Route path="/goal/:id/delete" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <DeleteGoal user={user} {...props} />;
                            }}/>
                            <Route path="/goal/:new" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <CreateGoal user={user} {...props} />;
                            }}/>

                            <Route path="/account/verify/:token" exact render={props => {
                                return <VerifyAccount {...props}/>
                            }}/>

                            <Route path="/account/resend/verification" exact render={props => {
                                if (!user) return <Redirect to="/login"/>;
                                return <ResendToken user={user} {...props} />;
                            }}/>

                            <Route path="/account/reset/password" exact render={props => {
                                return <ResetPasswordRequest {...props} />;
                            }}/>
                            <Route path="/account/:id/reset/password/:token" exact render={props => {
                                return <ResetPassword {...props} />;
                            }}/>
                        </Switch>
                    </div>
                </div>
                <Footer user={user}/>
            </div>
        );
    }

}

export default App;
