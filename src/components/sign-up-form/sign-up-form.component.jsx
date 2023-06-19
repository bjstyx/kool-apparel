import { useState, useContext } from "react";

import FormInput from "../form-input/form-input.components";

import { createAuthUserWithEmailandPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";

import './sign-up-form.styles.scss';

import Button from "../../components/button/button.component";

import { UserContext } from "../../contexts/user.context";

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;

    const { setCurrentUser } = useContext(UserContext);



    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Step 1: confirm password matches confirmPassword
        if(password !== confirmPassword) {
            alert("passwords do not match");
            return;
        }
        // Step 2: is user authenticated from email and password
        try{
            const { user } = await createAuthUserWithEmailandPassword(
                email, 
                password
            );

        setCurrentUser(user);
            
        await createUserDocumentFromAuth(user, { displayName });
        resetFormFields();


        } catch(error) {
            if(error.code === 'auth/email-already-in-use') {
                alert('Cannot create user, email already in use');
            } else {
            console.log('user creation encountered an error', error);
            }
        }// Step 3: create a user document from what the 'createAuthUserWithEmailandPassword
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({...formFields, [name]: value});
    };

    return (
        <div className='sign-up-container'>
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput 
                    label="Display Name"
                    type='text' 
                    required 
                    onChange={handleChange} 
                    name="displayName" 
                    autocomplete='username'
                    value={displayName} 
                />

             
                <FormInput  
                    label="Email"
                    type='email' 
                    required 
                    onChange={handleChange} 
                    name="email" 
                    autocomplete='username' 
                    value={email} 
                />

                
                <FormInput 
                    label="Password" 
                    type='password' 
                    required 
                    onChange={handleChange} 
                    name="password" 
                    autocomplete='current-password'
                    value={password} 
                />

                
                <FormInput 
                    label="Confirm Password" 
                    type='password' 
                    required 
                    onChange={handleChange} 
                    name="confirmPassword" 
                    autocomplete='current-password'
                    value={confirmPassword} 
                />

                <Button type='submit'>Sign Up</Button>
            </form>
        </div>
    );
};

export default SignUpForm;