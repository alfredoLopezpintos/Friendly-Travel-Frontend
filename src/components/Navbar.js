import React, { useRef, useState, useCallback, useEffect, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getToken, resetUserSession } from "./service/AuthService";
import "./Navbar.css";
import { color, font } from '@rodrisu/friendly-ui/build/_utils/branding'
import { ArrowIcon } from '@rodrisu/friendly-ui/build/icon/arrowIcon'
import { Avatar } from '@rodrisu/friendly-ui/build//avatar'
import { Drawer, DropdownButton, Menu, TopBar } from '@rodrisu/friendly-ui/build/topBar'
import { ItemAction } from '@rodrisu/friendly-ui/build/itemAction'
import { CrossDiscIcon } from '@rodrisu/friendly-ui/build/icon/crossDiscIcon'
import { InfoIcon } from '@rodrisu/friendly-ui/build/icon/infoIcon'
import { CalendarIcon } from '@rodrisu/friendly-ui/build/icon/calendarIcon'
import { HomeIcon } from '@rodrisu/friendly-ui/build/icon/homeIcon'
import { CrewIcon } from '@rodrisu/friendly-ui/build/icon/crew'
import { BubbleIcon } from '@rodrisu/friendly-ui/build/icon/bubbleIcon'
import { QuestionIcon } from '@rodrisu/friendly-ui/build/icon/questionIcon'
import { AloneInTheBackIcon } from '@rodrisu/friendly-ui/build/icon/aloneInTheBackIcon'
import { ProfileIcon } from '@rodrisu/friendly-ui/build/icon/profileIcon'
import { CarIcon } from '@rodrisu/friendly-ui/build/icon/carIcon'
import { Button, ButtonStatus } from '@rodrisu/friendly-ui/build/button';

function Navbar() {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const closeMobileMenu = () => setClick(false);
  const history = useHistory();

  const logoutHandler = () => {
    resetUserSession();
    closeMobileMenu();
  };

  const logoutHandler2 = () => {
    resetUserSession();
    window.location.reload(false);
  };

  // --------------------------

  const [drawerOpened, setDrawerOpened] = useState(false)
  const dropdownButton = (getToken() !== null) ? (
    <DropdownButton onClick={(): void => setDrawerOpened(!drawerOpened)}>
      <Avatar
        isBubble
        image={require("../assets/images/user.png")}
      />
    </DropdownButton>
  ) : (<Button
    onClick={() => {
      history.push("/login");
    }}
    // className="SignIn"
  >
    <div className="Text">Iniciar Sesión</div>
  </Button>)

  const leftAction = (
    <Button isBubble status={ButtonStatus.PRIMARY} onClick={() => { }} aria-label="back">
      <ArrowIcon iconColor={color.blue} />
    </Button>
  )

  const rightAction = (
    <>
      <Link style={{ "userSelect": "none" }} to="/" className="navbar-logo" onClick={() => {
          // closeMobileMenu
          setDrawerOpened(false)
        }}>
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
          "lineHeight": "normal"
        }}
      >
        <ul className="navRouteContainer">
          <li className="navRoute" onClick={() => { 
            history.push("/about")
            setDrawerOpened(false)
          }}>Sobre nosotros</li>
          <li className="navRoute" onClick={() => { history.push("/viajes")
            setDrawerOpened(false)
          }}>Listado de viajes</li>
          <li className="navRoute" onClick={() => { history.push("/faqsPage")
            setDrawerOpened(false)
          }}>Preguntas frecuentes</li>
        </ul>

      </span>
    </div>
  )

  const mobileMenu = (
    <>
      <DropdownButton onClick={(): void => setDrawerOpened(!drawerOpened)}>
        <Avatar
          isBubble
          image={require("../assets/images/user.png")}
        />
      </DropdownButton>
      <Drawer zIndex={40} open={drawerOpened} onClose={(): void => setDrawerOpened(false)}>
        <Menu>
          <ItemAction action="Inicio" leftAddon={<HomeIcon />} onClick={() => {
            history.push("/")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Sobre nosotros" leftAddon={<CrewIcon />} onClick={() => {
            history.push("/about")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Listado de Viajes" leftAddon={<BubbleIcon />} onClick={() => {
            history.push("/viajes")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Preguntas Frecuentes" leftAddon={<QuestionIcon />} onClick={() => {
            history.push("/faqsPage")
            setDrawerOpened(false)
          }} />
          <Menu.Divider />
          <ItemAction action="Iniciar sesión" leftAddon={<ProfileIcon />} onClick={() => {
            history.push("/login")
            setDrawerOpened(false)
          }} />
        </Menu>
      </Drawer>
    </>
  )

  const mobileMenuExtended = (
    <>
      <DropdownButton onClick={(): void => setDrawerOpened(!drawerOpened)}>
        <Avatar
          isBubble
          image={require("../assets/images/user.png")}
        />
      </DropdownButton>
      <Drawer zIndex={40} open={drawerOpened} onClose={(): void => setDrawerOpened(false)}>
        <Menu>
          <ItemAction action="Crear viaje" leftAddon={<AloneInTheBackIcon />} onClick={() => {
            history.push("/map")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Mis viajes" leftAddon={<CarIcon />} onClick={() => {
            history.push("/misViajes")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Historial de viajes" leftAddon={<CalendarIcon />} onClick={() => {
            history.push("/travelHistory")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Opciones" leftAddon={<InfoIcon />} onClick={() => {
            history.push("/changeData")
            setDrawerOpened(false)
          }} />
          <Menu.Divider />
          <ItemAction action="Inicio" leftAddon={<HomeIcon />} onClick={() => {
            history.push("/")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Sobre nosotros" leftAddon={<CrewIcon />} onClick={() => {
            history.push("/about")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Listado de viajes" leftAddon={<BubbleIcon />} onClick={() => {
            history.push("/viajes")
            setDrawerOpened(false)
          }} />
          <ItemAction action="Preguntas frecuentes" leftAddon={<QuestionIcon />} onClick={() => {
            history.push("/faqsPage")
            setDrawerOpened(false)
          }} />
          <Menu.Divider />
          <ItemAction action="Cerrar sesión" leftAddon={<CrossDiscIcon />} onClick={logoutHandler2} />
        </Menu>
      </Drawer> </>
  )

  // --------------------------

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Fragment>
            <TopBar zIndex={50} style={{ "background-color": "black" }}
              leftItem={rightAction}
              centerItem={(windowSize.current[0] < 1000) ? true : centerContent}
              rightItem={((windowSize.current[0] < 1000) ? ((getToken() !== null) ? mobileMenuExtended : mobileMenu) : dropdownButton)}
            />
            <Drawer zIndex={40} open={drawerOpened} onClose={(): void => setDrawerOpened(false)}>
              <Menu>
                <ItemAction action="Crear viaje" leftAddon={<AloneInTheBackIcon />} onClick={() => {
                  history.push("/map")
                  setDrawerOpened(false)
                }} />
                <ItemAction action="Mis viajes" leftAddon={<CarIcon />} onClick={() => {
                  history.push("/misViajes")
                  setDrawerOpened(false)
                }} />
                <ItemAction action="Historial de viajes" leftAddon={<CalendarIcon />} onClick={() => {
                  history.push("/travelHistory")
                  setDrawerOpened(false)
                }} />
                <ItemAction action="Opciones" leftAddon={<InfoIcon />} onClick={() => {
                  history.push("/changeData")
                  setDrawerOpened(false)
                }} />
                <Menu.Divider />
                <ItemAction action="Cerrar sesión" leftAddon={<CrossDiscIcon />} onClick={logoutHandler2} />
              </Menu>
            </Drawer>
          </Fragment>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
