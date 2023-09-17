import React, { useRef, useState, useCallback, useEffect, Fragment } from "react";
// import { Button } from "./Button";
import DropDown from "./DropDown";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getToken, resetUserSession } from "./service/AuthService";
import "./Navbar.css";


import { color, font } from '@rodrisu/friendly-ui/build/_utils/branding'
import { ArrowIcon } from '@rodrisu/friendly-ui/build/icon/arrowIcon'
import { Avatar } from '@rodrisu/friendly-ui/build//avatar'
import { Drawer, DropdownButton, Menu, TopBar } from '@rodrisu/friendly-ui/build/topBar'
import { ItemAction  } from '@rodrisu/friendly-ui/build/itemAction'
import { BankIcon } from '@rodrisu/friendly-ui/build/icon/bankIcon'
import { BubbleIcon } from '@rodrisu/friendly-ui/build/icon/bubbleIcon'
import { CrewIcon } from '@rodrisu/friendly-ui/build/icon/crew'
import { CrossDiscIcon } from '@rodrisu/friendly-ui/build/icon/crossDiscIcon'
import { HomeIcon } from '@rodrisu/friendly-ui/build/icon/homeIcon'
import { QuestionIcon } from '@rodrisu/friendly-ui/build/icon/questionIcon'
import { ProfileIcon } from '@rodrisu/friendly-ui/build/icon/profileIcon'
import { Button, ButtonStatus } from '@rodrisu/friendly-ui/build/button';
import { boolean } from '@storybook/addon-knobs'

function Navbar() {

  const [buttonStatus, setButtonStatus] = useState(ButtonStatus.PRIMARY)

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [dropdown, setDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const history = useHistory();

  const handleHistory = () => {
    history.push("/login");
  };

  const logoutHandler = () => {
    resetUserSession();
    closeMobileMenu();
  };

  const logoutHandler2 = () => {
    resetUserSession();
    window.location.reload(false);
  };

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  // --------------------------

  const location = useLocation();

  const [drawerOpened, setDrawerOpened] = useState(false)
  const dropdownButton = (getToken() !== null) ? (
    <DropdownButton onClick={(): void => setDrawerOpened(!drawerOpened)}>
      <Avatar
        isBubble
        image="data:image/png;base64,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"
      />
    </DropdownButton>
  ) : (<Button
    onClick={() => {
      history.push("/login");
      // setButtonStatus(ButtonStatus.LOADING)
      // setTimeout(() => setButtonStatus(ButtonStatus.CHECKED), 2000)
      // setTimeout(() => setButtonStatus(ButtonStatus.PRIMARY), 5000)
    }}
    className="SignIn"
  >
    <div className="Text">Iniciar Sesión</div>    
  </Button>)

  const leftAction = (
    <Button isBubble status={ButtonStatus.UNSTYLED} onClick={() => { }} aria-label="back">
      <ArrowIcon iconColor={color.blue} />
    </Button>
  )

  const rightAction = (
    <>
    <Link style={{"userSelect": "none"}} to="/" className="navbar-logo" onClick={closeMobileMenu}>
    <img
              src={require("../assets/images/Friendly-Logo-new.png")}
              alt="travel logo"
              width={50}
            ></img> &nbsp;
            Friendly-Travel
          </Link>
    </>
  )

  const centerContent = (
    <div>
      <span
        style={{
          ...font.m,
          color: color.midnightGreen,
        }}
      >
        <ul className="navRouteContainer">
          <li className="navRoute" onClick={() => {history.push("/about")}}>Sobre nosotros</li>
          <li className="navRoute" onClick={() => {history.push("/viajes")}}>Listado de viajes</li>
          <li className="navRoute" onClick={() => {history.push("/faqsPage")}}>Preguntas frecuentes</li>
        </ul>

      </span>
    </div>
  )

  // --------------------------

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Fragment>
            <TopBar zIndex={50} style={{"background-color": "black"}}
              leftItem={boolean('With rightItem', true) && rightAction}
              centerItem={boolean('With centerItem', true) && centerContent}
              rightItem={dropdownButton}
            />
            <Drawer zIndex={40} open={drawerOpened} onClose={(): void => setDrawerOpened(false)}>
              <Menu>
                <ItemAction  action="Inicio" leftAddon={<HomeIcon />} href={"/"} />
                <ItemAction  action="Sobre nosotros" leftAddon={<CrewIcon />} href={"/about"} />
                <ItemAction  action="Listado de Viajes" leftAddon={<BubbleIcon />} href={"/viajes"} />
                <ItemAction  action="Preguntas Frecuentes" leftAddon={<QuestionIcon />} href={"/faqsPage"} />
                <Menu.Divider />
                <ItemAction  action="Cerrar sesión" leftAddon={<CrossDiscIcon />} href={"/"} onClick={logoutHandler2} />
              </Menu>
            </Drawer>
          </Fragment>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
