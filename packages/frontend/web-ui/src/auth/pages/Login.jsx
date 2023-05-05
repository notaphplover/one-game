import { useContext } from "react";

import { useForm } from "../../cornie/hooks/useForm";
import '../../scss/layout/FormCustomHook.css';
import { httpClient } from "../../http/services/HttpService";

export const Login = () => {

    const {formState, onInputChange, onResetForm} = useForm({
        username: '',
        email: '',
        password: ''
    });

    async function login() {
        const requestBody = {
            email: formState.email,
            password: formState.password,
        };

        const response = await httpClient.createAuth({}, requestBody);

        console.log(requestBody);
        console.log(response);

        // TODO: store credentials
    }

    return (
        <>
            <h1> Entry to Cornie's Game </h1>
            <hr />
            <div className="mt-4 mb-3 row">
                <label htmlFor="usernameLabel" className="col-sm-2 col-form-label text-start">Username</label>
                <div className="col-sm-10">
                    <input 
                        type="text" 
                        className="form-control"
                        placeholder="Username"
                        name="username"
                        value={formState.username}
                        onChange={onInputChange}
                    /> 
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="emailLabel" className="col-sm-2 col-form-label text-start">Email</label>
                <div className="col-sm-10">
                    <input 
                        type="email" 
                        className="form-control"
                        placeholder="name@example.com"
                        name="email"
                        value={formState.email}
                        onChange={onInputChange}
                    />
                </div>
            </div>
            <div className="mb-5 row">
                <label htmlFor="passwordLabel" className="col-sm-2 col-form-label text-start">Password</label>
                <div className="col-sm-10">
                    <input 
                        type="password" 
                        className="col-sm-10 form-control"
                        placeholder="********"
                        name="password"
                        value={formState.password}
                        onChange={onInputChange}
                    />
                </div>        
            </div>
            <div className="row justify-content-evenly">
                <button onClick={login} className="btn btn-first-cornie mt-2 col-4">Login</button>
                <button onClick={onResetForm} className="btn btn-second-cornie mt-2 col-4">Delete</button>
            </div>
        </>
    )
}