import React from 'react';
import './styles/App.css';
import NavBar from "./components/navbar";
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
import DeleteExpense from "./components/pages/delete_expense";
import Register from "./components/pages/create_account";
import auth from './services/auth';
import VerifyAccount from "./components/pages/verify_account";
import ResendToken from "./components/pages/resend_token";
import ResetPasswordRequest from "./components/pages/reset_password_request";
import ResetPassword from "./components/pages/reset_password";


class App extends React.Component {
    state = {
        user: auth.getCurrentUser()
    };

    componentDidMount() {
    }

    render() {
        const user = this.state.user;
        return (
            <div className={'app'}>
                <NavBar user={user}/>
                <div className="container">
                    <Switch>
                        <Route path="/" exact  render={props => {
                            if (!user) return <Redirect to="/login"/>;
                            return <UserHome {...props} />;
                        }}/>
                        <Route path="/register" exact component={Register}/>

                        <Route path="/login" render={props => {
                            if(user) return <Redirect to="/habits"/>;
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

                        <Route path="/habits" exact  render={props => {
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

                        <Route path="/expenses" exact  render={props => {
                            if (!user) return <Redirect to="/login"/>;
                            return <MyExpenses {...props} />;
                        }}/>
                        <Route path="/expense/new" exact  render={props => {
                            if (!user) return <Redirect to="/login"/>;
                            return <CreateExpense user={user} {...props} />;
                        }}/>
                        <Route path="/expense/:id" exact  render={props => {
                            if (!user) return <Redirect to="/login"/>;
                            return <MyExpense {...props} />;
                        }}/>
                        <Route path="/expense/:id/edit" exact  render={props => {
                            if (!user) return <Redirect to="/login"/>;
                            return <EditExpense user={user} {...props} />;
                        }}/>

                        <Route path="/account/verify/:token" exact render={props => {
                            return <VerifyAccount {...props}/>
                        }}/>

                        <Route path="/account/resend/verification" exact  render={props => {
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
        );
    }

}

export default App;
