import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, ButtonStatus } from '@rodrisu/friendly-ui/build/button';
import { ButtonGroup } from '@rodrisu/friendly-ui/build/buttonGroup';
import { ArrowIcon } from '@rodrisu/friendly-ui/build/icon/arrowIcon';
import { color } from '@rodrisu/friendly-ui/build/_utils/branding';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const LeaveWarning = () => {
  const history = useHistory();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const phone = urlSearchParams.get('phone');
  const date = urlSearchParams.get('date');
  const origin = urlSearchParams.get('origin');
  const destination = urlSearchParams.get('destination');

  useEffect(() => {
    if ((phone === null) || (date === null) ||
      (origin === null) || (destination === null)) {
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
      + "598" + phone
      + "?text=%20Hola!%20Te%20escribo%20desde%20Friendly%20Travel!%20Me%20gustaría%20unirme%20a%20tu%20viaje%20"
      + "de%20la%20fecha%20"
      + date
      + "%20desde%20"
      + origin
      + "%20a%20"
      + destination
    );
  }

  const handleCancel = () => {
    window.close();
  }

  return (
    <div className="leave-warning" style={leaveWarningStyle}>
      <p>Aviso de redireccionamiento. Estás a punto de salir de Friendly-Travel.<br/><br/>¿Estás seguro?</p>
      {/* <br /> */}
      <ButtonGroup isInline>
        <Button status={ButtonStatus.SECONDARY} onClick={handleCancel}>Cancelar</Button>
        <Button status={ButtonStatus.GREEN} onClick={handleClick}>
          <WhatsAppIcon style={{"margin-left": "0px", "margin-right": "7px"}} />
          Aceptar
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LeaveWarning;
