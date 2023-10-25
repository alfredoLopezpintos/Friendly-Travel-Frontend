import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, ButtonStatus } from '@rodrisu/friendly-ui/build/button';
import { ButtonGroup } from '@rodrisu/friendly-ui/build/buttonGroup';
import { ArrowIcon } from '@rodrisu/friendly-ui/build/icon/arrowIcon';
import { color } from '@rodrisu/friendly-ui/build/_utils/branding';

const LeaveWarning = () => {
  const location = useLocation();
  const receivedData = location.state?.data ||
    {};
  const history = useHistory();

  useEffect(() => {
    if ((receivedData.phone === undefined) || (receivedData.date === undefined) ||
      (receivedData.origin === undefined) || (receivedData.destination === undefined)) {
      history.push("/")
    }
  }, [])

  const leaveWarningStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    "text-align": "center",
  }

  const handleClick = () => {
    window.location.replace(
      "https://wa.me/"
      + receivedData.phone
      + "?text=%20Hola!%20Te%20escribo%20desde%20Friendly%20Travel!%20Me%20gustaría%20unirme%20a%20tu%20viaje%20"
      + "de%20la%20fecha%20"
      + receivedData.date
      + "%20desde%20"
      + receivedData.origin
      + "%20a%20"
      + receivedData.destination
    );
  }

  const handleCancel = () => {
    history.push("/")
  }

  return (
    <div className="leave-warning" style={leaveWarningStyle}>
      <p>Aviso de redireccionamiento. Estás a punto de salir de Friendly-Travel.<br/><br/>¿Estás seguro?</p>
      {/* <br /> */}
      <ButtonGroup isInline>
        <Button status={ButtonStatus.SECONDARY} onClick={handleCancel}>Cancelar</Button>
        <Button status={ButtonStatus.GREEN} onClick={handleClick}>
          <ArrowIcon right iconColor={color.white} />Acceptar
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LeaveWarning;
