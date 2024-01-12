import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import '../login.scss'
import logo from '../main_logo.png'

const validateInfo = () => {
    let valid = true
    let username = document.getElementById('usernameInput')
    let password = document.getElementById('passwordInput')
    let invalidUsernameMsg = document.getElementById('invalidUsernameMsg')
    let invalidPasswordMsg = document.getElementById('invalidPasswordMsg')

    if (username.value.length === 0) {
        invalidUsernameMsg.innerHTML = "Field may not be empty."
        username.setAttribute("class","form-control is-invalid")
        valid = false
    } 

    if (password.value.length === 0) {
        password.setAttribute("class","form-control is-invalid")
        invalidPasswordMsg.innerHTML = "Field may not be empty."
        valid = false
    }

    return valid
}

const showInvalidFields = () => {
    let username = document.getElementById('usernameInput')
    let password = document.getElementById('passwordInput')
    let invalidUsernameMsg = document.getElementById('invalidUsernameMsg')
    let invalidPasswordMsg = document.getElementById('invalidPasswordMsg')
    
    invalidUsernameMsg.innerHTML = ""
    invalidPasswordMsg.innerHTML = ""
    username.setAttribute("class","form-control is-invalid")
    password.setAttribute("class","form-control is-invalid")
}

const Login = () => {    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [success, setSuccess] = useState(false)
    const [resEmail, setResEmail] = useState();

    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissable fade show" role="alert">`,
            `   <div style="display: inline-block">${message}</div>`,
                '<button type="button" class="btn-close" style="float: right" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')
        document.getElementById('liveAlertPlaceholder').append(wrapper)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        document.getElementById('liveAlertPlaceholder').innerHTML = ""
        if (validateInfo()) {
            const loginInfo = {
                username:username,
                password:password
            }
            axios.post("http://localhost:4000/app/login", loginInfo)
            .then(res => {
                if (res.data.user) {
                    setSuccess(true)
                    setUsername("")
                    setPassword("")
                    setResEmail(res.data.email)
                }
                else {
                    alert('<i class="bi-exclamation-circle"></i> Incorrect login information!', 'danger')
                    showInvalidFields()
                } 
            })
            
        }
        else {
            alert('<i class="bi-exclamation-circle"></i> Failed to login!', 'danger')
        }
        event.stopPropagation()
    }
    return (
        <>
            {success ? (
                <section>
                    <Navigate to={`/dashboard/${resEmail}`}/>
                </section>
            ) : (
                <section>
                    <div className='container' id='login-container' data-testid='LoginID'>
                        <div className='row'>
                            <div className='col-3'></div>
                            <div className='col-9' style={{marginTop: "20px"}}>
                                <img src={logo} alt='Study-Up Logo' width={"500px"} style={{marginRight: "270px", marginBottom: "20px"}}/>
                                <div className='col-8'>
                                    <div id="liveAlertPlaceholder"></div>
                                </div>
                                <div className="card p-3 col-8" id='login-card' style={{marginBottom: "40px"}}>
                                    <h3 id='login-header'>Login</h3>
                                    <form id='login-form' onSubmit={(event) => onSubmit(event)}>
                                        <div className="mb-3">
                                            <input className='form-control form-group' id='usernameInput' type='text' placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)}/>  
                                            <div className="valid-feedback">
                                                
                                            </div>
                                            <div className="invalid-feedback" id='invalidUsernameMsg'></div>                            
                                        </div>
                                        <div className='mb-3'>
                                            <input className='form-control form-group' id='passwordInput' type='password' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}/>  
                                            <div className="valid-feedback">
                                                
                                            </div>
                                            <div className="invalid-feedback" id='invalidPasswordMsg'></div>                            
                                        </div>
                                        <Link to={'/createaccount'} id='create-acc-text'>
                                            <p>Create an account here!</p>
                                        </Link>
                                        <input type='submit' className='btn' id='login-button' value='Login'/>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    )

}

export default Login
