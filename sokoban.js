

/**
 * Clase Board que representa un tablero.
 */
class Board {
    /**
     * Constructor de la clase Board.
     * @param {string} s1 - Estado actual del tablero representado como una cadena de caracteres.
     * @param {string} s2 - Solución objetivo del tablero representada como una cadena de caracteres.
     * @param {number} px - Posición horizontal (x) del espacio vacío en el tablero.
     * @param {number} py - Posición vertical (y) del espacio vacío en el tablero.
     * @param {number} level - Nivel actual del tablero en el juego.
     */
    constructor(s1, s2, px, py, level) {
        this.cur = s1;   // Estado actual del tablero
        this.sol = s2;   // Solución objetivo del tablero
        this.x = px;     // Posición x del espacio vacío
        this.y = py;     // Posición y del espacio vacío
        this.level = level; // Nivel actual del tablero
    }
}

/**
 * Clase que representa un objeto que contiene información y métodos
 * relacionados con el tablero y los jugadores en un juego.
 */
class Sokoban {

    /**
    * Constructor para inicializar un objeto GameBoard.
    *
    * @param {string[]} ruta - Un arreglo de cadenas de caracteres que representa
    *                          el estado inicial del tablero.
    */
    constructor(ruta) {
        // Tablero objetivo (destino)
        this.destBoard = "";
        // Tablero actual
        this.currBoard = "";
        this.player = false;
        // Coordenada X del jugador.
        this.playerX = 0;
        // Coordenada Y del jugador.
        this.playerY = 0;
        // Número de columnas del tablero.
        this.nCols = 0;
        // Contador de amplitud.
        this.amplitudeCount = 0;
        // Contador de profundidad.
        this.depthCount = 0;
        // Indica si se muestran impresiones en consola
        this.prints = false;

        // Variables locales para calcular el número de columnas
        // y construir el tablero destino y actual.
        let nCols = 0;
        let destBoard = "";
        let currBoard = "";

        // Variable para almacenar una línea del tablero.
        let line;
        // Variable para almacenar el tablero completo.
        let board = "";

        // Bucle que recorre cada línea en el arreglo 'ruta'.
        for (let i = 0; i < ruta.length; i++) {
            line = ruta[i];

            // Verificar si la línea tiene una longitud mayor a 0
            if (line.length > 0) {

                // Si la línea incluye una coma, indica una posición
                if (line.includes(",")) {

                    // Si el jugador no ha sido definido, inicializarlo
                    if (!this.player) {
                        this.player = true;
                        destBoard = "" + board;

                        // Obtener las coordenadas del jugador (x, y)
                        let position = line.split(",");
                        this.playerX = parseInt(position[1]);
                        this.playerY = parseInt(position[0]);

                        // Calcular la posición en el tablero y establecer el caracter del jugador (@)
                        let pos = this.playerY * nCols + this.playerX;
                        let sceneChar = board.split("");
                        sceneChar[pos] = "@";
                        board = sceneChar.join("");
                    } else {
                        // Si el jugador ya está definido, procesar la posición de la "B"
                        let position = line.split(",");
                        let x = parseInt(position[1]);
                        let y = parseInt(position[0]);

                        // Calcular la posición en el tablero y establecer el caracter "B"
                        let pos = y * nCols + x;
                        let sceneChar = board.split("");
                        sceneChar[pos] = "B";
                        board = sceneChar.join("");
                    }
                } else {
                    // Si la línea no incluye una coma, agregarla al tablero
                    board += line;
                }
                // Establecer el número de columnas si aún no está definido
                if (nCols === 0) {
                    nCols = line.length;
                }
            }
        }

        // Guardar el número de columnas y el tablero de destino
        this.nCols = nCols;
        this.destBoard = destBoard;

        // Iterar a través de los caracteres del tablero
        for (let c = 0; c < board.length; c++) {
            let ch = board.charAt(c);

            // Reemplazar el caracter "X" por "0" y agregarlo al tablero actual
            let newCharCurr = ch !== "X" ? ch : "0";
            currBoard += newCharCurr;
        }

        // Guardar el tablero actual
        this.currBoard = currBoard;
    }

    /**
    * Mueve al jugador en el tablero según las coordenadas dadas.
    *
    * @param {number} x - La posición actual del jugador en el eje X.
    * @param {number} y - La posición actual del jugador en el eje Y.
    * @param {number} dx - La cantidad de espacios a mover en el eje X. Puede ser negativo.
    * @param {number} dy - La cantidad de espacios a mover en el eje Y. Puede ser negativo.
    * @param {string} trialBoard - La representación del tablero actual como una cadena de caracteres.
    * @returns {string|null} Retorna el tablero actualizado como una cadena de caracteres si el movimiento es válido, de lo contrario retorna null.
    */
    move(x, y, dx, dy, trialBoard) {

        // Calcula la nueva posición del jugador en el tablero
        const newPlayerPos = (y + dy) * this.nCols + x + dx;

        // Si la posición a la que se mueve el jugador no está vacía, retorna null
        if (trialBoard.charAt(newPlayerPos) !== '0') {
            return null;
        }

        // Crea un array de caracteres a partir del tablero actual
        const trial = trialBoard.split('');

        // Mueve al jugador en el tablero
        trial[y * this.nCols + x] = '0';
        trial[newPlayerPos] = '@';

        // Retorna el tablero actualizado como string
        return trial.join('');
    }

    push(x, y, dx, dy, trialBoard) {
        const newBoxPos = (y + 2 * dy) * this.nCols + x + 2 * dx;

        // Si la posición a la que se mueve la caja no está vacía, retorna null
        if (trialBoard.charAt(newBoxPos) !== '0') {
            return null;
        }

        // Crea un array de caracteres a partir del tablero actual
        const trial = trialBoard.split('');

        // Mueve al jugador y la caja en el tablero
        trial[y * this.nCols + x] = '0';
        trial[(y + dy) * this.nCols + x + dx] = '@';
        trial[newBoxPos] = 'B';

        // Retorna el tablero actualizado como string
        return trial.join('');
    }

    /**
     * Función que verifica si el tablero de prueba (trialBoard) está resuelto comparándolo con
     * el tablero de destino (destBoard) almacenado en la instancia de la clase.
     *
     * @param {string} trialBoard - El tablero de prueba representado como una cadena de caracteres.
     * @returns {boolean} - Retorna 'true' si el tablero de prueba está resuelto, 'false' en caso contrario.
     */
    isSolved(trialBoard) {

        // Iterar a través de todos los caracteres del tablero de prueba (trialBoard)
        for (let i = 0; i < trialBoard.length; i++) {
            // Comprobar si el carácter en la posición i de destBoard es 'X'
            // y si el carácter en la posición i de trialBoard es 'B'.
            // Si no coinciden, retornar 'false'.
            if ((this.destBoard.charAt(i) === 'X') !== (trialBoard.charAt(i) === 'B')) {
                return false;
            }
        }

        // Si todos los caracteres coinciden, retornar 'true'
        return true;
    }

    /**
     * La función 'solve' se utiliza para resolver un problema específico, como
     * encontrar un camino en un laberinto o visitar todos los nodos de un grafo.
     * Utiliza una lista de direcciones posibles y sus correspondientes etiquetas
     * para explorar el espacio de soluciones y generar el resultado.
     */
    solve() {

        // 'dirs' es un array que contiene las posibles direcciones a explorar
        // en el siguiente formato: [cambio en eje X, cambio en eje Y]
        const dirs = [
            [0, -1],    // Arriba
            [0, 1],    // Abajo
            [-1, 0],  // Izquierda
            [1, 0]   // Derecha
        ];

        // 'dirLabels' es un array que contiene las etiquetas asociadas a las
        // direcciones en 'dirs'. Estas etiquetas pueden ser utilizadas para
        // representar el movimiento en un formato más legible.
        const dirLabels = [
            ['U', 'U'],    // Arriba
            ['D', 'D'],   // Abajo
            ['L', 'L'],  // Izquierda
            ['R', 'R']  // Derecha
        ];

        // Llama a la función 'solveSinglePrint' con las direcciones y etiquetas
        // definidas anteriormente para resolver el problema y generar el resultado.
        this.solveSinglePrint(dirs, dirLabels);
    }

    /**
     * Imprime en la consola los resultados de aplicar tres algoritmos de búsqueda
     * (profundidad, amplitud y profundidad iterativa) a un conjunto de direcciones
     * y etiquetas de direcciones.
     *
     * @param {Array} dirs - Lista de direcciones a procesar.
     * @param {Array} dirLabels - Lista de etiquetas de direcciones correspondientes a las direcciones en 'dirs'.
     */
    solveSinglePrint(dirs, dirLabels) {

        console.log(this.algDepth(dirs, dirLabels).path.join(''));
        console.log(this.algAmplitude(dirs, dirLabels).path.join(''));
        console.log(this.algIterativeDepth(dirs, dirLabels, 64).path.join(''));

        // Formato especial #2
        // console.log("profundidad:".padEnd(20), this.algDepth(dirs, dirLabels).path.join(''));
        // console.log("amplitud:".padEnd(20), this.algAmplitude(dirs, dirLabels).path.join(''));
        // console.log("prof .iterativa:".padEnd(20), this.algIterativeDepth(dirs, dirLabels, 64).path.join(''));

    }


    /**
     * Representa una implementación del algoritmo de búsqueda en profundidad (Depth-First Search, DFS)
     * El objetivo es encontrar el camino más corto. El código contiene dos funciones principales:
     * dfs() y algDepth()
     * (profundidad, amplitud y profundidad iterativa) a un conjunto de direcciones
     * y etiquetas de direcciones.
     *
     * @param {Object} boardObj - Objeto que contiene el tablero actual, las coordenadas (x, y) del jugador, y el nivel actual de profundidad.
     * @param {Set} visited - Conjunto de tableros visitados.
     * @param {Array} dirs - Array de direcciones posibles en las que el jugador puede moverse
     * @param {Array} dirLabels - Array de etiquetas correspondientes a las direcciones.
     * @param {Array} path - Array que almacena el camino actual hacia la solución
     */
    dfs(boardObj, visited, dirs, dirLabels, path) {
        const { cur, x, y, level } = boardObj;

        // Verifica si el tablero actual ya ha sido visitado. Si es así, retorna null.
        if (visited.has(cur)) {
            return null;
        }

        // Verifica si se ha alcanzado la profundidad máxima.
        if (level > 64) {
            return null;
        }
        
        // Marca el tablero actual como visitado.
        visited.add(cur);

        // Comprueba si el tablero actual está resuelto.
        if (this.isSolved(cur)) {
            // return level;

            // Retorna un objeto que contiene la profundidad y el camino actual
            return { depth: level, path };
        }

        // Itera sobre las posibles direcciones en las que el jugador puede moverse
        for (let i = 0; i < 4; i++) {
            const dx = dirs[i][0];
            const dy = dirs[i][1];

            // Calcula las nuevas coordenadas del jugador y de la caja (si hay una).
            const newX = x + dx;
            const newY = y + dy;
            const newBoxX = x + 2 * dx;
            const newBoxY = y + 2 * dy;

            const isBox = cur.charAt(newY * this.nCols + newX) === 'B';

            // Si hay una caja en la nueva posición y no hay otra caja detrás de ella:
            if (isBox && cur.charAt(newBoxY * this.nCols + newBoxX) !== 'B') {

                // Intenta mover la caja y el jugador en la dirección actual.
                const trialBoard = this.push(x, y, dx, dy, cur);

                // Si el movimiento es válido, realiza una llamada recursiva a dfs() con el nuevo
                // tablero y el camino actualizado.
                if (trialBoard) {
                    const newPath = path.slice(); // Crea una copia del camino actual
                    newPath.push(dirLabels[i][1]); // Añade el movimiento actual al camino
                    const result = this.dfs(new Board(trialBoard, this.sol, newX, newY, level + 1), visited, dirs, dirLabels, newPath);

                    // Si se encuentra una solución, retorna el resultado.
                    if (result !== null) {
                        return result;
                    }
                }
            }
            // Si no hay una caja en la nueva posición:
            else if (!isBox) {

                // Intenta mover solo al jugador en la dirección actual.
                const trialBoard = this.move(x, y, dx, dy, cur);

                // Si el movimiento es válido, realiza una llamada recursiva a dfs()
                // con el nuevo tablero y el camino actualizado.
                if (trialBoard) {
                    const newPath = path.slice(); // Crea una copia del camino actual
                    newPath.push(dirLabels[i][0]); // Añade el movimiento actual al camino
                    const result = this.dfs(new Board(trialBoard, this.sol, newX, newY, level + 1), visited, dirs, dirLabels, newPath);

                    // Si se encuentra una solución, retorna el resultado.
                    if (result !== null) {
                        return result;
                    }
                }
            }
        }

        // Si no se encuentra ninguna solución, retorna null.
        return null;
    }

    /**
     * Es la función principal que inicia el algoritmo DFS
     *
     * @param {Array} dirs - Array de direcciones posibles en las que el jugador puede moverse.
     * @param {Array} dirLabels - Array de etiquetas correspondientes a las direcciones.
     */
    algDepth(dirs, dirLabels) {

        // Crea un objeto de tablero inicial a partir del tablero actual, el tablero objetivo,
        // las coordenadas del jugador y el nivel inicial de profundidad.
        const initialBoard = new Board(this.currBoard, this.destBoard, this.playerX, this.playerY, 0);

        // Inicializa un conjunto de tableros visitados y un array vacío para almacenar el camino.
        const visited = new Set();
        const path = [];

        // Llama a la función dfs() con el tablero inicial, el conjunto de tableros visitados,
        // las direcciones, las etiquetas de dirección y el camino vacío.
        return this.dfs(initialBoard, visited, dirs, dirLabels, path);
    }

    /**
     * La función algAmplitude utiliza el algoritmo de búsqueda en amplitud para resolver el juego
     * a partir del estado actual del tablero, hasta llegar al tablero objetivo.
     *
     * @param {Array<Array<number>>} dirs - Matriz que contiene las direcciones posibles de movimiento (arriba, abajo, izquierda, derecha).
     * @param {Array<Array<string>>} dirLabels - Etiquetas correspondientes a cada dirección de movimiento.
     * @returns {Object|null} - Objeto que contiene la profundidad y el camino para resolver el juego, o null si no se encuentra solución.
     */
    algAmplitude(dirs, dirLabels) {

        // La función comienza creando una instancia de Board llamada initialBoard utilizando
        // el estado actual del tablero (this.currBoard), el tablero objetivo (this.destBoard),
        // la posición del jugador en X (this.playerX) y en Y (this.playerY), y el nivel inicial 0.
        const initialBoard = new Board(this.currBoard, this.destBoard, this.playerX, this.playerY, 0);

        // Se crea un conjunto visited para almacenar los estados del
        // tablero visitado y una cola queue para manejar los nodos a explorar.
        const visited = new Set();
        const queue = [{ boardObj: initialBoard, path: [] }];


        // Se inicia un bucle while que continúa mientras haya elementos en la cola.
        while (queue.length > 0) {

            // Dentro del bucle, se extrae el primer elemento de la cola (queue.shift())
            // y se obtiene el objeto boardObj y el path
            const { boardObj, path } = queue.shift();
            const { cur, x, y, level } = boardObj;

            // Luego, se verifica si el estado actual del tablero (cur) ya ha sido visitado.
            // Si es así, se pasa al siguiente elemento de la cola.
            if (visited.has(cur)) {
                continue;
            }

            // Se marca el estado actual del tablero como visitado,
            visited.add(cur);

            // Si el tablero está resuelto (this.isSolved(cur)),
            // se devuelve un objeto con la profundidad (depth) y el camino (path) para resolver el juego.
            if (this.isSolved(cur)) {
                return { depth: level, path };
            }

            // El bucle for itera sobre las direcciones de movimiento y
            // calcula las nuevas coordenadas para el jugador y la caja.
            for (let i = 0; i < 4; i++) {
                const dx = dirs[i][0];
                const dy = dirs[i][1];

                const newX = x + dx;
                const newY = y + dy;
                const newBoxX = x + 2 * dx;
                const newBoxY = y + 2 * dy;

                const isBox = cur.charAt(newY * this.nCols + newX) === 'B';

                // Si hay una caja en la nueva posición y no hay otra caja detrás de ella, se intenta mover la caja.
                if (isBox && cur.charAt(newBoxY * this.nCols + newBoxX) !== 'B') {
                    const trialBoard = this.push(x, y, dx, dy, cur);

                    // Si el movimiento es exitoso, se crea una copia del camino actual,
                    // se añade el movimiento de la caja al camino
                    // y se añade el nuevo estado del tablero a la cola.
                    if (trialBoard) {
                        const newPath = path.slice(); // Crea una copia del camino actual
                        newPath.push(dirLabels[i][1]); // Añade el movimiento actual al camino
                        queue.push({ boardObj: new Board(trialBoard, this.sol, newX, newY, level + 1), path: newPath });
                    }
                }

                // Si no hay una caja en la nueva posición, se intenta mover al jugador.
                else if (!isBox) {
                    const trialBoard = this.move(x, y, dx, dy, cur);

                    // Si el movimiento es exitoso, se crea una copia del camino actual,
                    // se añade el movimiento del jugador al camino
                    // y se añade el nuevo estado del tablero a la cola.
                    if (trialBoard) {
                        const newPath = path.slice(); // Crea una copia del camino actual
                        newPath.push(dirLabels[i][0]); // Añade el movimiento actual al camino
                        queue.push({ boardObj: new Board(trialBoard, this.sol, newX, newY, level + 1), path: newPath });
                    }
                }
            }
        }

        // Si la función no encuentra una solución, devuelve null.
        return null;
    }


    /**
     * Implementa el algoritmo de búsqueda en profundidad limitada (Depth-Limited Search, DLS)
     * para resolver el tablero. El objetivo del juego es empujar las cajas hacia las
     * posiciones objetivo. La función dls toma los siguientes argumentos:
     *
     * @param {Object} boardObj - Objeto que contiene el tablero actual, las coordenadas (x, y) del jugador, y el nivel actual de profundidad.
     * @param {Set} visited - Conjunto de tableros visitados.
     * @param {Array} dirs - Array de direcciones posibles en las que el jugador puede moverse
     * @param {Array} dirLabels - Array de etiquetas correspondientes a las direcciones.
     * @param {Array} path - Array que almacena el camino actual hacia la solución
     * @param {Int} limit - Entero que indica el límite de profundidad que controla cuántos niveles se explorarán en la búsqueda.
     * @returns {Object|null} - Objeto que contiene la profundidad y el camino para resolver el juego, o null si no se encuentra solución.
     */
    dls(boardObj, visited, dirs, dirLabels, path, limit) {
        const { cur, x, y, level } = boardObj;

        // Verifica si el estado actual del tablero ya ha sido visitado o si el nivel actual de búsqueda excede el límite.
        // En caso afirmativo, retorna null.
        if (visited.has(cur) || level > limit) {
            return null;
        }

        // Marca el estado actual del tablero como visitado.
        visited.add(cur);

        // Verifica si el estado actual del tablero es una solución
        // (es decir, todas las cajas están en las posiciones objetivo).
        // Si es así, retorna un objeto con la profundidad actual y el camino tomado hasta ahora.
        if (this.isSolved(cur)) {
            return { depth: level, path };
        }

        // tera sobre las posibles direcciones de movimiento y, para cada dirección:
        for (let i = 0; i < 4; i++) {
            const dx = dirs[i][0];
            const dy = dirs[i][1];

            // Calcula las nuevas posiciones del jugador y la caja (si hay una caja en la dirección de movimiento).
            const newX = x + dx;
            const newY = y + dy;
            const newBoxX = x + 2 * dx;
            const newBoxY = y + 2 * dy;

            const isBox = cur.charAt(newY * this.nCols + newX) === 'B';

            // Verifica si el movimiento resultante es válido (es decir, el jugador no está empujando una caja hacia otra caja).
            if (isBox && cur.charAt(newBoxY * this.nCols + newBoxX) !== 'B') {
                const trialBoard = this.push(x, y, dx, dy, cur);

                // Si el movimiento es válido, crea un nuevo estado del tablero con el movimiento aplicado
                // y realiza una llamada recursiva a la función dls con este nuevo estado y el nivel de búsqueda incrementado en 1.
                if (trialBoard) {
                    const newPath = path.slice(); // Crea una copia del camino actual
                    newPath.push(dirLabels[i][1]); // Añade el movimiento actual al camino
                    const result = this.dls(new Board(trialBoard, this.sol, newX, newY, level + 1), visited, dirs, dirLabels, newPath, limit);

                    // Si la llamada recursiva retorna un resultado diferente de null, retorna ese resultado.
                    if (result !== null) {
                        return result;
                    }
                }
            } else if (!isBox) {
                const trialBoard = this.move(x, y, dx, dy, cur);
                if (trialBoard) {
                    const newPath = path.slice(); // Crea una copia del camino actual
                    newPath.push(dirLabels[i][0]); // Añade el movimiento actual al camino
                    const result = this.dls(new Board(trialBoard, this.sol, newX, newY, level + 1), visited, dirs, dirLabels, newPath, limit);
                    if (result !== null) {
                        return result;
                    }
                }
            }
        }

        // Si no se encuentra una solución en ninguna de las direcciones de movimiento, retorna null.
        return null;
    }


    algIterativeDepth(dirs, dirLabels, maxLevel) {
        //siguiendo las instrucciones del docente, iniciamos con un límite de profundidad de 10 niveles, aumentando 1 nivel por iteración

        // Inicializa un bucle for que comienza en el límite de profundidad de 10 niveles y se incrementa en 1 en cada iteración,
        // hasta alcanzar el maxLevel proporcionado como entrada.
        for (let limit = 10; limit <= maxLevel; limit++) {

            // Crea una instancia de un objeto Board llamado initialBoard, utilizando el estado actual del tablero (this.currBoard),
            // el tablero objetivo (this.destBoard), y las coordenadas del jugador (this.playerX, this.playerY).
            // El último parámetro '0' indica que la profundidad inicial del tablero es 0.
            const initialBoard = new Board(this.currBoard, this.destBoard, this.playerX, this.playerY, 0);

            // Inicializa un conjunto visited que almacenará los tableros visitados durante la búsqueda.
            const visited = new Set();

            // Inicializa un array path que almacenará el camino seguido durante la búsqueda.
            const path = [];

            // Llama a la función dls (búsqueda en profundidad limitada) con los siguientes parámetros:
            // initialBoard: el tablero inicial.
            // visited: el conjunto de tableros visitados.
            // dirs: el array de direcciones.
            // dirLabels: el array de etiquetas de direcciones.
            //path: el array de camino.
            // limit: el límite de profundidad actual en esta iteración.
            const result = this.dls(initialBoard, visited, dirs, dirLabels, path, limit);

            // Si la función dls devuelve un resultado distinto de null, se devuelve ese resultado, que representa el camino encontrado.
            if (result !== null) {
                return result;
            }
        }

        // Si se alcanza el final del bucle sin encontrar un camino, la función devuelve null,
        // lo que indica que no se encontró un camino en la búsqueda en profundidad iterativa hasta el nivel maxLevel.
        return null;
    }

}

// Importar el módulo de sistema de archivos (fs) de Node.js:
const fs = require('fs');

// Procesar los argumentos de la línea de comandos
const args = process.argv.slice(2); // obtiene los argumentos de la línea de comandos

// Verificar si se proporcionó el argumento del nombre de archivo de entrada y salir del programa si no se proporcionó
if (args.length < 1) {
    console.error('Se debe ingresar el nombre del archivo de entrada');
    process.exit(1);
}

// Asignar el primer argumento como el nombre del archivo de entrada
const inputFile = args[0];

// Leer el archivo de entrada con la codificación 'utf8' y manejar posibles errores en la lectura
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        process.exit(1);
    }

    // Procesar el contenido del archivo de entrada:
    const input = data.trim().split('\n');

    // Crear una instancia de la clase Sokoban con los datos del archivo de entrada
    const sokoban = new Sokoban(input);

    // Resolver el nivel de Sokoban usando el método solve() de la instancia creada
    sokoban.solve();
});
