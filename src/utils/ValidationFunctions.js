import { toast } from "react-toastify";

// Funcion para validar el email
export const isValidEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
}

// Funcion para validar el celular
export const isValidPhoneNumber = (telefono) => {
    const regexTelefono = /^09\d{7}$/; // Expresión regular para validar el formato del teléfono
    return telefono.match(regexTelefono)
}

// Funcion para validar la cédula de identidad uruguaya
export const isValidDocument = (cedula) => {
    // Eliminar guiones y espacios en blanco
    cedula = cedula.replace(/\D/g, '');

    // Validar que la cédula tenga 8 dígitos
    if (cedula.length !== 8) {
        toast.error('La cédula de identidad uruguaya debe tener 8 dígitos', { autoClose: 3000 });
        return false;
    }

    // Calcular el dígito verificador
    const digitos = cedula.split('').map(Number);
    const verificador = digitos.pop();
    const suma =
        digitos[0] * 2 +
        digitos[1] * 9 +
        digitos[2] * 8 +
        digitos[3] * 7 +
        digitos[4] * 6 +
        digitos[5] * 3 +
        digitos[6] * 4;
    const resto = suma % 10;
    const digitoCalculado = resto === 0 ? 0 : 10 - resto;

    // Comparar el dígito verificador con el calculado
    if (verificador !== digitoCalculado) {
        toast.error('La cédula de identidad es inválida', { autoClose: 3000 });
        return false;
    }

    return true;
}

// Funcion para validar la matricula
export const checkPlate = (plate) => {
    console.log(plate)
    const formattedPlate = plate.replace(/\s+/g, ''); // Remove all spaces
    if (!/^[A-Za-z0-9 ]+$/i.test(formattedPlate)) {
        return { valid: false, message: "Ingrese una matrícula válida" };
    } else if (formattedPlate.length !== 6 && formattedPlate.length !== 7) {
        return { valid: false, message: "La matrícula debe contener 6 o 7 caracteres" };
    } else {
        return { valid: true, message: '' }
    }
}

// Funcion para validar el año del vehículo
export const checkVehicleYear = (year) => {
    if (!/^\d+$/.test(year)) {
        return { valid: false, message: "Ingrese un año válido" };
    } else {
        const yearInt = parseInt(year);
        if (yearInt < 1950 || yearInt > new Date().getFullYear() + 1) {
            return { valid: false, message: `Por favor ingrese un año entre 1950 y ${new Date().getFullYear() + 1}` }
        } else {
            return { valid: true, message: '' }
        }
    }
}

export function checkSeats(value) {
    if (/^\d+$/.test(value)) {
      const number = parseInt(value, 10);
      if (number >= 1 && number <= 4) {
        return { valid: true, message: '' };
      } else {
        return { valid: false, message: 'El número de asientos debe ser entre 1 y 4' };
      }
    } else {
      return { valid: false, message: 'Ingrese un número válido' };
    }
  }
