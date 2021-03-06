import React from "react"
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LangToggleButton from "./switches/language-switch.jsx";
import ThemeToggleButton from "./switches/theme-switch.jsx";
import { styled } from '@mui/material/styles';
import { useState, useEffect } from "react";
import { Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next"


export default function MyHeader() {

    const [t] = useTranslation("global")

    const HeaderStack = styled(Stack)({
        '@media (min-width:760px)': {
            flexDirection: 'row',
            gap: '2em',
        },
        margin:'0em 2em 0em 0em'

    })
    const Logo = styled(Typography)(({ theme }) => ({
        color: theme.common.special,
        textDecoration: 'none',
        fontFamily: 'BrainFish',
        padding:0,
    }))


    const [width, setWidth] = useState(window.innerWidth)


    const updateWidth = () => {
        setWidth(window.innerWidth);
    }



    useEffect(() => {
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <AppBar position="static" color='primary'>
                {/* ICON Fishbowl */}
                <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    {width <= 768 ?
                        <React.Fragment>
                            <IconButton
                                id="basic-button"
                                aria-controls="basic-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                variant='outlined'
                            >
                                <MenuIcon sx={{ fontSize: '1.5em' }}></MenuIcon>
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose} component={Link} to='/' sx={{ columnGap: '0.5em' }}><Icon width="25" height="25" icon="bx:bx-home" sx={{ margin: '0em 0.5em' }} />Home</MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to='/becomeafish' sx={{ columnGap: '0.5em' }}><Icon width="25" height="25" icon="octicon:comment-discussion-16" /> {t("header.becomeAfish")}</MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to='/register' sx={{ columnGap: '0.5em' }}><Icon width="25" height="25" icon="bi:person-plus" />{t("header.signUp")}</MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to='/login' sx={{ columnGap: '0.5em' }}><LoginIcon />{t("header.login")}</MenuItem>

                            </Menu>
                        </React.Fragment>

                        : <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack sx={{ margin: '0em 4em 0em 0em' }}  direction='row'>
                                <Logo variant='h2' component={Link} to='/'>Fishbowl</Logo>
                            </Stack>
                            <HeaderStack direction='row'>
                                <Typography color='secondary.light' variant='h5' component={Link} style={{ textDecoration: 'none' }} to='/becomeafish'>{t("header.becomeAfish")}
                                </Typography>
                                <Typography color='secondary.light' variant='h5' component={Link} style={{ textDecoration: 'none' }} to='/register'>{t("header.signUp")}
                                </Typography>
                                <Typography color='secondary.light' variant='h5' component={Link} style={{ textDecoration: 'none' }} to='/login'>{t("header.login")}
                                </Typography>
                            </HeaderStack>
                        </Stack>}

                    <Stack direction='row' sx={{ gap: '1em', alignItems: 'center' }}>
                        <LangToggleButton ></LangToggleButton>
                        <ThemeToggleButton></ThemeToggleButton>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>

    )
}