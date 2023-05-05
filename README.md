
# Integrantes
#### 202040507 - Carlos Andrés Borja
#### 202041790 - Deisy Catalina Melo
#### 201941427 - Marcelo Alejandro García
#

#### Compilación


1. Ejecutar el archivo `build-docker.sh` y posteriormente `run-docker.sh`


2. El archivo `run.sh` o `run-docker.sh` reciben como parámetro la salida del archivo de nivel a probar.

   Así:
   
   `sudo sh run-docker.sh nivel2.txt` 
   
   ó
   
   `sudo sh run.sh nivel2.txt` 

   No olvide estar como administrador o sudo
   
   Los archivos `.txt` de los niveles deben estar en el mismo directorio de `game_sokoban`

3. Los movimientos válidos son:
    - U: (up)    Arriba
    - D: (down)  Abajo
    - L: (left)  Izquierda
    - R: (right) Derecha

4. Recuerde que las salidas en su orden están dadas por:
    - Búsqueda por profundidad
    - Búsqueda por amplitud
    - Profundidad iterativa



#### Ejecución
```sh
$ sh build-docker.sh
$ sh run-docker.sh nivel2.txt

ó

$ sh run.sh nivel1.txt

Como SUDO

$ sudo sh build-docker.sh
$ sudo sh run-docker.sh nivel2.txt

```
