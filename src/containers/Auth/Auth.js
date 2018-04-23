import React, { Component} from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import { updateObject } from '../../shared/utility';
import {
    auth,
    setAuthRedirectPath
} from '../../store/actions/auth';
import { checkValidity } from '../../shared/utility';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                },
                valid: false,
                touched: false,
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                },
                valid: false,
                touched: false,
            },
        },
        isSignup: true
    }

    inputChangedHandler = (event, controlName) => {

        const updatedControls = updateObject(this.state.controls, {
            [controlName]:updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
        })});
        this.setState({controls: updatedControls});   
    }

    submitHandler = (event) => {
        event.preventDefault();
        const { email, password } = this.state.controls;
        this.props.onAuth(email.value, password.value, this.state.isSignup);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => ({
            isSignup: !prevState.isSignup
        }));
    }

    componentDidMount() {
        if (!this.props.building && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }
    

    render() {
        const formElements = [];
        for (let elementName in this.state.controls) {
            formElements.push({
                id: elementName,
                config: this.state.controls[elementName]
            });
        }

        let form = formElements.map(formElement => (
            <Input 
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(e) => this.inputChangedHandler(e, formElement.id)}
            />
        ));

        if (this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <p style={{color: 'red'}}>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger"
                    >SWITCH TO {this.state.isSignup ? 'SIGNIN': 'SIGNUP'}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    building: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
});

const mapDispatchToProps = dispatch => ({
    onAuth: (email, password, isSignup) => dispatch(auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(setAuthRedirectPath('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);