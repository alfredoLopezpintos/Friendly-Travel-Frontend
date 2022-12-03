import React, { useState } from "react";
import FAQ from "../FAQ";
import Footer2 from "../Footer2";
import "../Faqs.css";

function FaqsPage() {
  const [faqs, setfaqs] = useState([
    {
      question: "¿Qué es Friendly Travel?",
      answer:
        "Es una red de personas que comparten viajes en auto entre ciudades, haciendo una división equitativa de costos entre todos los viajeros o una contribución convenida. Friendly Travel no es un sistema de transporte de pasajeros ni público ni privado. Es un proyecto de gestión colectiva.",
      open: false,
    },
    {
      question: "¿Es seguro utilizar Friendly Travel?",
      answer: "COMPLETAR.",
      open: false,
    },
    {
      question: "¿Qué necesito para utilizar Friendly Travel?",
      answer: "COMPLETAR.",
      open: false,
    },
    {
      question: "¿Qué tipos de viaje puedo hacer con Friendly Travel?",
      answer:
        "En Friendly Travel podés crear o encontrar viajes a corta, media y larga distancia, desde cualquier punto del territorio nacional. Los viajes los crean los mismos usuarios según su destino y disponibilidad horario. En base a esa propuesta de viaje, otros usuarios pueden solicitarle al conductor acompañarlo en trayecto.",
      open: false,
    },
    {
      question: "¿Tienen costo los viajes en Friendly Travel?",
      answer:
        "Al ser una red de personas que comparten viajes, sólo permite contribuciones monetarias para combustible utilizado y peajes o división equitativa de gastos entre todos los partícipes. No existe una tarifa fija ni un valor de pasaje. La contribución no puede superar el valor de una división equitativa de gastos de combustible y peajes ya que de ser así podría ser considerado como un transporte ilegal de pasajeros. Carpoolear es una red colaborativa, no un servicio.",
      open: false,
    },
    {
      question: "¿Cómo se calcula la contribución para un viaje?",
      answer:
        "La contribución monetaria máxima aceptada en Friendly Travel es la de combustible utilizado + peajes dividido la cantidad de personas que viajan en el auto. La misma se debe definir antes del viaje, antes o durante la coordinaciòn previa. En caso de que una persona pida un valor monetario que deje en evidencia que supera la máxima aceptada, será advertido por los administradores y suspendido de la plataforma hasta aceptar las reglas.",
      open: false,
    },
    {
      question: "¿Cómo coordino un viaje? Para Conductores",
      answer:
        "Cuando cargues el viaje te recomendamos que detallar lo mejor posible la información sobre para evitar consultas repetitivas de parte de los interesados en tu viaje.  Ahí podrás informar cuál es la contribución por el viaje y el monto, cuál es el máximo de pasajeros que llevarás en tu auto, dónde comienza y finaliza el mismo. Es importante que te comuniques con tus pasajeros vía mensaje para terminar de coordinar detalles y las condiciones del viaje.",
      open: false,
    },
    {
      question: "¿Cómo coordino un viaje? Para Pasajeros",
      answer:
        "Una vez que encontraste un viaje que te sirve, enviá un mensaje al conductor para aclarar los términos del mismo y coordinar los detalles. Una vez que está todo coordinado y el conductor te confirma para compartir el viaje ¡ya sólo hay que esperar hasta el día del viaje!",
      open: false,
    },
    {
      question: "¿Cómo nace Friendly Travel? ¿Quiénes lo hacen?",
      answer:
        "Friendly Travel nace como un proyecyo académico de estudiantes de UTEC, los cuales padecen la problemática de trasladarse hacia el centro educativo desde sus respectivas locaciones y con un problema de escaza movilidad evidente. La idea es que cuando tengamos que viajar en auto porque no hay colectivo o no nos conviene por algún motivo, siempre busquemos de llenar el auto para hacer un mejor aprovechamiento de los recursos fósiles y contaminación asociada al viaje. Más allá de la motivación ambiental, también Friendly Travel nos parece muy importante porque ayuda a generar vínculos entre las personas, quienes muchas veces no se hubieran encontrado de otra forma.",
      open: false,
    },
  ]);

  const toggleFAQ = (index) => {
    setfaqs(
      faqs.map((faq, i) => {
        if (i === index) {
          faq.open = !faq.open;
        } else {
          faq.open = false;
        }

        return faq;
      })
    );
  };

  return (
    <>
      <div className="App">
        <header>
          <h1>Preguntas Frecuentes</h1>
        </header>
        <div className="faqs">
          {faqs.map((faq, i) => (
            <FAQ faq={faq} index={i} toggleFAQ={toggleFAQ} key={i} />
          ))}
        </div>
      </div>
      <Footer2 />
    </>
  );
}

export default FaqsPage;
