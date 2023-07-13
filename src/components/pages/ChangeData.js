import "../Cards.css";
import Footer from "../Footer";
import { useHistory } from "react-router-dom";
import "./ChangeData.css"
import { Button } from "../Button";
import ModalRegistrarVehiculo from '../../components/ModalRegistrarVehiculo'

export function ChangeData() {

  const history = useHistory();

  const handleHistory = () => {
    history.push("/changePass");
  };

  const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  };

  return (
    <>

      <div className="cards">
        <div className="cards__container">
        <div className="boxTest">
          <h1>Opciones</h1>
          <div className="divider"></div>
          <h2>Modificar datos</h2>
          <br />
          <Button className="btns"
            buttonStyle="btn--test"
            buttonSize="btn--large"
            onClick={handleHistory}>
            Cambiar contraseña
          </Button>
          <br />
          <ModalRegistrarVehiculo  />
          <div className="divider"></div>
          <h2>Datos de usuario</h2>
        </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
