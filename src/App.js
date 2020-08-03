import React, { Suspense, lazy } from 'react';
import Header from "./header/Header";
import HeaderButtons from "./header/HeaderButtons";
import Footer from "./Footer/footer";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import history from './history';
import './App.css';
import { findByDisplayValue } from '@testing-library/react';

const Home = lazy(() => import('./main_page/Main_page'));
const RegPage = lazy(() => import('./registration/reg_page'));
const Page404 = lazy(() => import('./error/page404'));
const UsersTabsMain = lazy(() => import('./user_profile/UsersTabsMain'));
const Admin = lazy(() => import('./admin/admin'));
const Results = lazy(() => import('./results/Results'));
const AboutCompany = lazy(() => import('./about_company/AboutCompany'));

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ifLoggedIn: false,
            token: '',
            userId: '',
            ifAdmin: '',
            userEmail: '',
        };
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.handleToken = this.handleToken.bind(this);
    }

    componentDidMount() {
        let sessionToken = sessionStorage.getItem('token1');
        let sessionUserId = sessionStorage.getItem('userId');
        let sessionUserEmail = sessionStorage.getItem('userEmail');
        let sessionIfAdmin;
        {if (sessionStorage.getItem('ifAdmin') === "true") {sessionIfAdmin = true } else { sessionIfAdmin = false}};
        let sessionIfLoggedIn = sessionStorage.getItem('ifLoggedIn');
        
        if (sessionToken !== null) {
            this.setState({
                token: sessionToken,
                userId: sessionUserId,
                userEmail: sessionUserEmail,
                ifAdmin: sessionIfAdmin,
                ifLoggedIn: sessionIfLoggedIn
            });
        }        
    }

    handleToken(data) {

        if (data.ifLoggedIn !== undefined) {
            this.setState({
                token: data.token,
                userId: data.id,
                userEmail: data.email,
                ifAdmin: data.admin,
                ifLoggedIn: data.ifLoggedIn
            });
            sessionStorage.removeItem('token1');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('ifAdmin');
            sessionStorage.removeItem('ifLoggedIn');
        } else {

            sessionStorage.setItem('token1', data.token);
            sessionStorage.setItem('userId', data.id);
            sessionStorage.setItem('userEmail', data.email);
            sessionStorage.setItem('ifAdmin', data.admin);
            sessionStorage.setItem('ifLoggedIn', true);
            this.setState({
                token: data.token,
                userId: data.id,
                userEmail: data.email,
                ifAdmin: data.admin,
                ifLoggedIn: true
            });
        }
    }

    logIn() {
        this.setState({
            ifShowModal: true
        });
    }

    logOut() {
        this.setState({
            ifShowModal: false
        });
    }

    render() {
        const TokenContext = React.createContext(this.handleToken);
        return (
            <div style={{ overflowX: 'hidden' }}>
                <TokenContext.Provider>
                    <Router history={history}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Header />
                            <HeaderButtons ifLoggedIn={this.state.ifLoggedIn}
                                ifAdmin={this.state.ifAdmin}
                                email={this.state.userEmail}
                                handleToken={this.handleToken} />
                            <Switch>
                                <Route exact path="/" component={() => <Home />} />
                                <Route exact path="/registration" component={() => <RegPage />} />
                                <Route exact path="/profile" render={() => <UsersTabsMain data={this.state} />} />
                                <Route exact path="/admin" render={() => <Admin data={this.state} />} />
                                <Route exact path="/routes" render={() => <Results data={this.state} />} />
                                <Route exact path="/about-our-company" render={() => <AboutCompany />} />
                                <Route default component={Page404} />
                            </Switch>
                            <Footer />
                        </Suspense>
                    </Router>
                </TokenContext.Provider>
            </div>

        );
    }
}

export default App;