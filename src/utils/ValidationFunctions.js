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
