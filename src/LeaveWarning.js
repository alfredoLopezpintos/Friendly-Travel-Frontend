import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const LeaveWarning = () => {
  const location = useLocation();
  const receivedData = location.state?.data || 
                      { };
  const history = useHistory();

  useEffect(()=>{
    if((receivedData.phone === undefined) || (receivedData.date === undefined) ||
     (receivedData.origin === undefined) || (receivedData.destination === undefined)) {
      history.push("/")
    }
  }, [])

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
    <div className="leave-warning">
      <p>Aviso de redireccionamiento. Estás a punto de salir de Friendly-Travel. ¿Estás seguro?</p>
      <button onClick={handleClick}>Acceptar</button>
      <button style={{"margin-left": "5px"}} onClick={handleCancel}>Cancelar</button>
    </div>
  );
};

export default LeaveWarning;
