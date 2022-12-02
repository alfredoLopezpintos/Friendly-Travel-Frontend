import '../Cards.css';
import Footer2 from '../Footer2';
import CardItem from '../CardItem';

export default function NotFound() {
return (
    <>
    <div className='cards'>
      <div className='cards__container'>
        <div className='cards__wrapper'>
        <ul className='cards__items'>
            <CardItem
              src={require("../../assets/images/404.jpg")}     
              text='Pagina no encontrada! Has intentado acceder a una dirección que no existe, intentalo de nuevo.'
              label='Woops!'       
            />
            </ul>
            </div>
            </div>
            </div>
            <Footer2 />
    </>

)
}