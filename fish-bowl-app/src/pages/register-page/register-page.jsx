import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import { Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Grid from '@mui/material/Grid'


export default function RegisterPage() {

    let userName = '';
    let userPassword = '';
    let userPasswordConfirmation = '';
    let userEmail = '';

    const [userValid, setValidUser] = useState(false)
    const [passwordMatch, setMatchPassword] = useState(false)
    const [isuserEmailValid, setValidUserEmail] = useState(false)
    const [isSumbitted, setSubmited] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    function isEmail(email) {
        let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }


    function handleSubmit(e) {
        e.preventDefault()
        userName = e.target.userName.value
        userPassword = e.target.userPassword.value;
        userPasswordConfirmation = e.target.userPasswordConfirmation.value;
        userEmail = e.target.email.value.toLowerCase();

        if (userName.length >= 4 && userPasswordConfirmation === userPassword && isEmail(userEmail)) {
            setValidUser(false)
            setMatchPassword(false)
            setValidUserEmail(false)
            const options = {
                method: "POST",
                headers: {
                    "Content-type": "application/json", // aviso a mi servidor que le envio los datos en formato JSON
                },
                body: JSON.stringify({
                    userName: userName,
                    userPassword: userPassword,
                    userEmail: userEmail,
                }),
            };
            fetch("http://localhost:3001/auth/register", options)
                .then(r => {
                    r.json(); console.log(r)
                    if (r.status === 409) {
                        setError(true)
                        setLoading(false)
                    }
                    else {
                        setError(false)
                        setLoading(false)
                    }
                })
                .then(d => console.log(d));

            setSubmited(true)

            console.log('valid')
        }

        else if (userName.length < 4 && userPasswordConfirmation !== userPassword && !isEmail(userEmail)) {
            setValidUser(true)
            setMatchPassword(true)
            setValidUserEmail(true)
        }
        else if (userName.length < 4) {
            setValidUser(true)
            setMatchPassword(false)
            setValidUserEmail(false)
        }
        else if (userName.length >= 4 && userPasswordConfirmation !== userPassword) {
            setValidUser(false)
            setMatchPassword(true)
            setValidUserEmail(false)
        }
        else if (userName.length >= 4 && userPasswordConfirmation === userPassword && !isEmail(userEmail)) {
            setValidUser(false)
            setMatchPassword(false)
            setValidUserEmail(true)
        }

    }


    return (
        <React.Fragment>
            {isSumbitted === false ?
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }} >
                    <Typography sx={{ margin: '1em' }} variant='h5'>Please register yourself</Typography>

                    <form onSubmit={handleSubmit} >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em', alignItems: 'center' }}>
                            <Grid item xs={12}>
                                <TextField sx={{ width: '100%' }}
                                    required
                                    error={userValid}
                                    helperText={userValid !== false ? "Username must be greater than 4 characters" : ''}
                                    id="userName"
                                    name='userName'
                                    label="Username"
                                    placeholder="Username"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField sx={{ width: '100%' }}
                                    required
                                    id="userPassword"
                                    error={passwordMatch}
                                    label="Password"
                                    name="userPassword"
                                    type="password"
                                    placeholder="Password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField sx={{ width: '100%' }}
                                    required
                                    error={passwordMatch}
                                    helperText={passwordMatch !== false ? "Passwords do not match" : ''}
                                    name="userPasswordConfirmation"
                                    id="userPasswordConfirmation"
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm Password"
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField sx={{ width: '100%' }}
                                    required
                                    error={isuserEmailValid}
                                    name="email"
                                    id="userEmail"
                                    label="Email"
                                    placeholder="Email"
                                    helperText={isuserEmailValid !== false ? "Please provide a valid email" : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type='submit'>submit</Button>
                            </Grid>
                        </Box>
                    </form >
                </Box>
                :
                error !== true ?
                    isLoading === true ?
                        <Typography variant='h4'>Registering...</Typography> :
                        <Box>
                            <CheckCircleIcon sx={{ width: '3em', height: '3em', color: 'green' }}></CheckCircleIcon>
                            <Typography variant='h4'>Check your Email</Typography>
                            <a href='/register' onclick="window.location.reload(true)">go back</a>
                        </Box>
                    :
                    <React.Fragment>
                        <Typography variant='h4'>There was an error. Please try again</Typography>
                        <a href='/register' onclick="window.location.reload(true)">go back</a>
                    </React.Fragment>
            }
        </React.Fragment>
    )
}

