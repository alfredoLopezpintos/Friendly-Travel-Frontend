import random
import string

class Cuenta:
    def __init__(self, nombre, monto, titular, cuenta, millonario):
        self.nombre = nombre
        self.monto = monto
        self.titular = titular
        self.cuenta = cuenta
        self.millonario = millonario
    
    def titular(self, nombre: str):
        self.nombre = nombre

    def monto(self, nombre: str):
        self.nombre = nombre

    def get_titular(self):
        return self.titular
    
    def set_monto(self, nuevo_val):
        self.monto = nuevo_val

    def print_cuenta(self):
        print(self.cuenta)
    
    def es_millonario(self):
        if(self.millonario == True):
            print("Si")
        else:
            print("No")

class Password:
    def __init__(self, longitud, contrasena):
        self.longitud = longitud
        self.contrasena = contrasena
        self.mayus = sum(1 for c in contrasena if c.isupper())
        self.minus = sum(1 for c in contrasena if c.islower())
        self.enteros = sum(c.isdigit() for c in contrasena)

    def __init__(self, contrasena):
        self.longitud = 8
        self.contrasena = contrasena
        self.mayus = sum(1 for c in contrasena if c.isupper())
        self.minus = sum(1 for c in contrasena if c.islower())
        self.enteros = sum(c.isdigit() for c in contrasena)
    
    def generarPassword(self):
        if(self.longitud == 0):
            self.contrasena = "password"
        elif(self.longitud > 0):
            self.contrasena = ''.join(random.choice(string.ascii_lowercase) for i in range(self.longitud))

    def es_fuerte(self):
        if(self.mayus > 2 and self.minus > 1 and self.enteros > 5):
            print("Si")
        else:
            print("No")

cuenta1 = Cuenta(nombre = "Cuenta1", monto=0, titular="Nadie", cuenta="Nº1", millonario= False)
cuenta2 = Cuenta(nombre = "Cuenta2", monto=10, titular="Nadie2", cuenta="Nº2", millonario= False)
cuenta3 = Cuenta(nombre = "Cuenta3", monto=1000000, titular="Alguien", cuenta="Nº3", millonario= True)

contra = Password("12345678")