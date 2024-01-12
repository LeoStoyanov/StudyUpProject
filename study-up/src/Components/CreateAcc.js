import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import axios from 'axios'
import '../register.scss'
import logo from '../main_logo.png'

const validateInfo = () => {
    let valid = true
    let email = document.getElementById('emailInput')
    let username = document.getElementById('usernameInput')
    let password = document.getElementById('passwordInput')
    let invalidUsernameMsg = document.getElementById('invalidUsernameMsg')
    let invalidPasswordMsg = document.getElementById('invalidPasswordMsg')
    let invalidEmailMsg = document.getElementById('invalidEmailMsg')
    let illegalCharPassword = ['~', '[', ']', '{', '}', ';', ':', '\'', '"', ',', '/', '?', ' ']
    let illegalCharName = ['!', '~', '[', ']', '{', '}', ';', ':', '\'', '"', ',', '/', '?']

    if(email.value.length === 0) {
        invalidEmailMsg.innerHTML = "Field may not be empty."
        email.setAttribute("class","form-control is-invalid")
        valid = false
    }
    else {
        let validEmail = true
        if (!email.value.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            email.setAttribute("class", "form-control is-invalid")
            valid = false
            validEmail = false
        }
        if (validEmail) {
            email.setAttribute("class", "form-control is-valid")
        }
    }

    if (username.value.length === 0) {
        invalidUsernameMsg.innerHTML = "Field may not be empty."
        username.setAttribute("class","form-control is-invalid")
        valid = false
    }
    else {
        let validName = true
        for(let i = 0; i < username.value.length; i++) {
            for (let j = 0; j < illegalCharName.length; j++) {
                if (username.value[i] === illegalCharName[j]) {
                    username.setAttribute("class","form-control is-invalid")
                    invalidUsernameMsg.innerHTML = `Illegal character used: "${illegalCharName[j]}"`
                    valid = false
                    validName = false
                }
            }
        }

        if (username.value.length <= 3) {
            username.setAttribute("class","form-control is-invalid")
            invalidUsernameMsg.innerHTML = "Username must be longer than 3 characters."
            valid = false
            validName = false
        }
        else if (username.value.length >= 25) {
            username.setAttribute("class","form-control is-invalid")
            invalidUsernameMsg.innerHTML = "Username must be less than or equal 25 characters."
            valid = false
            validName = false
        }

        if (validName) {
            username.setAttribute("class", "form-control is-valid")
        }
    }

    if (password.value.length === 0) {
        password.setAttribute("class","form-control is-invalid")
        invalidPasswordMsg.innerHTML = "Field may not be empty."
        valid = false
    }
    else {
        let validPass = true
        let foundUpperCase = false
        for(let i = 0; i < password.value.length; i++) {
            for (let j = 0; j < illegalCharPassword.length; j++) {
                if (password.value[i] === illegalCharPassword[j]) {
                    password.setAttribute("class","form-control is-invalid")
                    invalidPasswordMsg.innerHTML = `Illegal character used: "${illegalCharPassword[j]}"`
                    if (illegalCharPassword[j] === " ") {
                        invalidPasswordMsg.innerHTML = "Password may not have any spaces."
                    }
                    valid = false
                    validPass = false
                }
            }
            // Due to how JavaScript handles uppercase characters, check if the character is NOT lowercase as well in order
            // to exclude non-letters.
            if (password.value[i] === password.value[i].toUpperCase() && password.value[i] !== password.value[i].toLowerCase()) {
                foundUpperCase = true
            }
        }

        if (password.value.length < 8) {
            password.setAttribute("class","form-control is-invalid")
            invalidPasswordMsg.innerHTML = "Password must be 8 characters or longer."
            valid = false
            validPass = false
        }
        else if (password.value.length > 20) {
            password.setAttribute("class","form-control is-invalid")
            invalidPasswordMsg.innerHTML = "Password must be less than or equal to 20 characters."
            valid = false
            validPass = false
        }
        else if (!foundUpperCase) {
            password.setAttribute("class","form-control is-invalid")
            invalidPasswordMsg.innerHTML = "Password must have at least one uppercase letter."
            valid = false
            validPass = false
        }

        if (validPass) {
            password.setAttribute("class", "form-control is-valid")
        }
    }
    return valid
}

const showInvalidField = () => {
    let email = document.getElementById('emailInput')
    let invalidEmailMsg = document.getElementById('invalidEmailMsg')
    
    invalidEmailMsg.innerHTML = ""
    email.setAttribute("class","form-control is-invalid")
}

const CreateAcc = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [success, setSuccess] = useState(false)

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
            const createAccInfo = {
                email:email,
                username:username,
                password:password
            }
            axios.post("http://localhost:4000/app/createaccount", createAccInfo)
            .then(res => {
                if (res.data.status === "ok") {
                    setSuccess(true)
                    setEmail("")
                    setUsername("")
                    setPassword("")
                }
                else {
                    alert('<i class="bi-exclamation-circle"></i> Email already exists.', 'danger')
                    showInvalidField()
                }
            })
            
        }
        else {
            alert('<i class="bi-exclamation-circle"></i> Failed to create an account!', 'danger')
        }
        event.stopPropagation()
    }

    return (
        <>
            {success ? (
                <section>
                    <Navigate to='/'/>
                </section>
            ) : (
                <section>
                    <div className='container' data-testid='createAccID'>
                        <div className='row'>
                            <div className='col-3'></div>
                            <div className='col-9' style={{marginTop: "20px"}}>
                                <img src={logo} alt='Study-Up Logo' width={"500px"} style={{marginRight: "270px", marginBottom: "20px"}}/>
                                <div className='col-8'>
                                    <div id="liveAlertPlaceholder"></div>
                                </div>
                                <div className="card p-3 col-8" id='register-card' style={{marginBottom: "40px"}}>
                                    <h3 id='register-header'>Create Account</h3>
                                    <form id="create-acc-form" onSubmit={onSubmit}>
                                        <div className="mb-3">
                                            <input className='form-control form-group' id='emailInput' type='text' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)}/>
                                            <div className="valid-feedback">
                                                
                                            </div>
                                            <div className="invalid-feedback" id='invalidEmailMsg'>
                                                Invalid email (e.g., john@gmail.com).
                                            </div>
                                        </div>  
                                        <div className="mb-3">
                                            <input className='form-control form-group' id='usernameInput' type='text' placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)}/>  
                                            <div className="valid-feedback">
                                                
                                            </div>
                                            <div className="invalid-feedback" id='invalidUsernameMsg'>
                                                Invalid username (e.g., John).
                                            </div>                            
                                        </div>
                                        <div className='mb-3'>
                                            <input className='form-control form-group' id='passwordInput' type='password' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}/>  
                                            <div className="valid-feedback">
                                                
                                            </div>
                                            <div className="invalid-feedback" id='invalidPasswordMsg'>
                                                Invalid password.
                                            </div>                            
                                        </div>
                                        <Link to={'/'} id='back-to-login-text'>
                                            <p>Back to login!</p>
                                        </Link>
                                        <input type='submit' className='btn' id="create-acc-button" value='Submit'/>
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

export default CreateAcc