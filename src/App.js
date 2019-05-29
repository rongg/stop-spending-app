import React from 'react';
import './App.css';
import NavBar from "./components/navbar";
import { Route } from "react-router-domc";
import Login from "./components/routes/login";

const Component = React.Component;

class App extends Component {
    render() {
        return (
            <div>
                <NavBar/>
                <div className="content">
                    <Route path="/login" component={Login} />
                    {/*<Route path="/habits" component={Habits} />*/}
                    {/*<Route path="/expenses" component={Expenses} />*/}
                </div>
            </div>
        );
    }
}

export default App;
