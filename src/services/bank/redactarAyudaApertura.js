const PROHIBIDO = /trampa|distract|anatom/i;

const REPASA = {
  probabilidad: 'Probabilidad',
  estadistica: 'Estadística',
  algebra: 'Álgebra',
  geometria: 'Geometría',
  funciones: 'Funciones',
  proporcionalidad: 'Proporcionalidad',
  aritmetica: 'Aritmética',
  trigonometria: 'Trigonometría',
  dos_textos: 'Lectura: comparar dos textos',
  textos_discontinuos: 'Lectura: tablas, avisos y gráficas',
  argumentacion: 'Lectura: argumentos',
  inferencia: 'Lectura: inferencia',
  filosofia: 'Lectura: ideas éticas',
  pragmatica: 'Lectura: intención de la frase',
  semantica: 'Lectura: significado',
  literatura: 'Lectura: recursos del relato',
  comprension_literal: 'Lectura: dato explícito',
  indagacion: 'Ciencias: indagación',
  fisica: 'Física',
  quimica: 'Química',
  biologia: 'Biología',
  geografia: 'Geografía de Colombia',
  constitucion: 'Constitución',
  historia: 'Historia de Colombia',
  pensamiento_critico: 'Sociales: fuentes y pruebas',
  interpretacion: 'Sociales: leer gráficos y mapas',
  participacion: 'Sociales: participación',
  pensamiento_social: 'Sociales: normas',
  dialogo: 'Inglés: diálogo',
  aviso: 'Inglés: avisos',
  cloze: 'Inglés: gramática',
  vocabulario: 'Inglés: vocabulario',
  lectura: 'Inglés: lectura'
};

const METODO = {
  dos_textos: 'Lee cada texto por separado y quédate con la relación que pide la pregunta.',
  textos_discontinuos: 'Saca el dato del aviso, la tabla o la gráfica. No completes con lo que no está escrito.',
  argumentacion: 'Mira qué se concluye y si el salto cubre más de lo que dicen los datos.',
  inferencia: 'Quédate con lo que se puede sostener. No agregues un hecho que la frase no dice.',
  filosofia: 'Nombra la idea ética que el caso está usando.',
  pragmatica: 'Pregúntate para qué se dice la frase en esa situación.',
  semantica: 'Elige el sentido que pide el contexto, no otro significado de la misma palabra.',
  literatura: 'Reconoce la parte del relato o el recurso, sin leerlo como un dato literal.',
  comprension_literal: 'La respuesta está dicha en la frase. No la calcules de nuevo.',
  indagacion: 'Separa pregunta, hipótesis, variable y conclusión. Cada una tiene su lugar.',
  fisica: 'Identifica la magnitud y la relación. Una cuenta distinta da otro número.',
  quimica: 'Distingue mezcla, cambio y reacción. El nombre tiene que coincidir con el caso.',
  biologia: 'Ubica la estructura o el proceso en el ser vivo del enunciado.',
  geografia: 'Sitúa el lugar o el fenómeno en el mapa de Colombia antes de marcar.',
  constitucion: 'La pregunta pide la rama, el derecho o el mecanismo. No lo cambies por otro parecido.',
  historia: 'Ata el hecho a su fecha y a su proceso. Otro hito no lo reemplaza.',
  pensamiento_critico: 'Una prueba tiene que poder verificarse. Un salto a «todos» queda corto.',
  interpretacion: 'Lee la leyenda, los ejes y la escala. La figura no dice más de lo que muestra.',
  participacion: 'El mecanismo tiene un alcance. No lo vuelvas un poder que no tiene.',
  pensamiento_social: 'Una norma se puede exigir. Una costumbre, no siempre.',
  dialogo: 'Responde con lo que los hablantes acaban de decir.',
  aviso: 'Copia la condición del aviso. Otra hora o otro lugar no está escrito.',
  cloze: 'Mira el sujeto, el tiempo y la palabra que va justo antes del hueco.',
  vocabulario: 'Elige el sentido de esa palabra en la frase, no uno cercano.',
  lectura: 'La respuesta tiene que salir de la frase, no de otra idea.'
};

const MATEMATICAS = {
  item_ap_mat_001: ['Divide las fichas del color que pide la pregunta por el total de la bolsa.', 'Había 3 verdes entre 8 fichas.', '5/8 cuenta las rojas, no las verdes.', '3/5 compara verdes con rojas y deja fuera el total.', '1/3 no sale de 3 favorables entre 8 posibles.'],
  item_ap_mat_002: ['Cuenta las caras que cumplen la condición y divídelas por 6.', 'Mayor que 4 son el 5 y el 6: 2 de 6.', '1/6 es una sola cara.', '2/3 contaría cuatro caras, no dos.', '1/2 contaría tres caras.'],
  item_ap_mat_003: ['Lista los cuatro resultados de dos monedas y cuenta los que tienen una sola cara.', 'Cara-sello y sello-cara son 2 de 4.', '1/4 es un solo orden, o las dos caras.', '1/3 no cabe en un espacio de 4 resultados.', '3/4 es al menos una cara, no exactamente una.'],
  item_ap_mat_004: ['Sin devolver, multiplica la primera roja por la segunda roja.', '4/5 por 3/4 da 3/5.', '4/5 es solo la primera bola.', '16/25 saldría si la primera se devolviera.', '3/4 es solo la segunda, ya sabiendo que la primera fue roja.'],
  item_ap_mat_005: ['Lo que no pasa es uno menos la probabilidad de que pase.', '1 menos 0,2 es 0,8.', '0,2 es la probabilidad de que sí llueva.', '0,5 no sale de 0,2.', '1,2 pasa de 1, y una probabilidad no puede.'],
  item_ap_mat_006: ['Si no pueden ocurrir a la vez, la probabilidad de uno u otro es la suma.', '0,3 más 0,4 es 0,7.', '0,12 es el producto, y eso sería que ocurran ambos.', '0,1 es la resta, no la unión.', '1 sería certeza, y aquí no la hay.'],
  item_ap_mat_007: ['Si son independientes, la probabilidad de ambos es el producto.', '0,5 por 0,2 es 0,1.', '0,7 es la suma, no la intersección.', '0,3 es la resta.', '0,02 corre la coma de más.'],
  item_ap_mat_008: ['Cada camisa puede ir con cada pantalón: multiplica.', '3 por 4 es 12.', '7 suma las prendas en vez de combinarlas.', '34 junta los dos números.', '43 los junta al revés.'],
  item_ap_mat_009: ['El valor esperado pondera cada pago por su probabilidad.', '100 por 1/2, más 0 por 1/2, es 50.', '100 es el premio, no el promedio del juego.', '25 parte otra vez el premio a la mitad.', '0 mira solo el caso en que no paga.'],
  item_ap_mat_010: ['La frecuencia relativa es las veces que salió, sobre los lanzamientos hechos.', '5 de 20 es 1/4.', '1/6 es la probabilidad teórica de un dado, no este experimento.', '5/6 invierte el conteo.', '1/5 sería 4 de 20.'],
  item_ap_mat_011: ['Resta de 1 la probabilidad de que ningún dado sea 6.', '1 menos 25/36 es 11/36.', '1/6 es un solo dado.', '1/36 es que los dos sean 6.', '25/36 es que ninguno sea 6.'],
  item_ap_mat_012: ['El grupo del que se elige son esas 6 mujeres, no todo el colegio.', '3 de 6 es 1/2.', '1/3 no es 3 de 6.', '1/6 sería una sola mujer.', '«3/6 de todo el colegio» cambia el grupo.'],
  item_ap_mat_013: ['Los premios van sobre los sectores iguales de la ruleta.', '3 de 8 sectores.', '3/5 compara premios con los que no premian.', '1/8 es un solo sector.', '5/8 son los sectores sin premio.'],
  item_ap_mat_014: ['Si el orden no importa, cuenta parejas y no filas.', 'Las parejas de 4 personas son 6.', '8 multiplica 4 por 2.', '12 es si el orden de los dos puestos importara.', '4 es solo el número de personas.'],
  item_ap_mat_015: ['El primer puesto y el segundo son distintos: el orden importa.', '5 opciones para el primero y 4 para el segundo: 20.', '10 cuenta parejas sin orden.', '25 es 5 por 5, como si el mismo pudiera ganar los dos puestos.', '5 es solo el primer puesto.'],
  item_ap_mat_016: ['Quien juega solo fútbol es el total de fútbol menos quienes juegan ambos.', '12 menos 5 es 7.', '12 incluye a quienes también juegan baloncesto.', '5 son los que juegan los dos.', '15 suma los dos deportes y vuelve a contar a los de ambos.'],
  item_ap_mat_017: ['La media suma los datos y divide por cuántos son.', '4, 6, 8 y 10 suman 28, y 28 entre 4 es 7.', '6 es uno de los datos.', '8 es otro de los datos.', '28 es la suma, todavía sin dividir.'],
  item_ap_mat_018: ['Ordena y toma el dato del centro.', 'Ordenados quedan 1, 3, 5, 7 y 9. El centro es 5.', '3 es el segundo, no el centro.', '7 es el cuarto.', '9 es el mayor.'],
  item_ap_mat_019: ['La moda es el dato que más se repite.', 'El 2 aparece tres veces.', '3 aparece una vez.', '4 aparece una vez.', '5 aparece una vez.'],
  item_ap_mat_020: ['El rango resta el menor al mayor.', '14 menos 3 es 11.', '17 suma los dos extremos.', '14 es solo el mayor.', '3 es solo el menor.'],
  item_ap_mat_021: ['Cada nota se multiplica por su peso y luego se suman.', '4,0 por 0,80 más 5,0 por 0,20 es 4,2.', '4,5 promedia las dos notas sin los pesos.', '4,8 cambia los pesos de lugar.', '9,0 suma las dos notas.'],
  item_ap_mat_022: ['Multiplica cada valor por su frecuencia, suma y divide por el total de datos.', '1·2 + 2·3 + 3·5 es 23, y 23 entre 10 es 2,3.', '2 es uno de los valores, no el promedio.', '3 es otro valor de la tabla.', '10 es cuántos datos hay.'],
  item_ap_mat_023: ['El aumento es el martes menos el lunes.', '15 menos 10 es 5.', '25 suma los dos días.', '15 es solo el martes.', '150 multiplica los dos días.'],
  item_ap_mat_024: ['Un percentil dice cuántos datos quedan en ese valor o por debajo.', 'El percentil 75 deja al 75% en 18 o menos.', 'No dice que todos tengan exactamente 18.', 'La moda sería el dato más repetido, y aquí no se da.', 'La media es otro resumen, no el percentil.'],
  item_ap_mat_025: ['El cuartil 2 de una lista ordenada es la mediana.', 'En 2, 4, 6, 8 y 10 el centro es 6.', '4 es el segundo dato.', '8 es el cuarto.', '10 es el mayor.'],
  item_ap_mat_026: ['Cuatro pruebas a 70 suman 280. Cinco a 75 deben sumar 375.', '375 menos 280 es 95.', '75 es el promedio buscado, no la quinta nota.', '80 no alcanza para subir el promedio a 75.', '70 deja el promedio donde ya estaba.'],
  item_ap_mat_027: ['El rango intercuartílico es Q3 menos Q1.', '11 menos 5 es 6.', '16 no es la distancia entre Q1 y Q3.', '5 es solo Q1.', '11 es solo Q3.'],
  item_ap_mat_028: ['Mira si, al crecer x, y también crece y si los puntos se acercan a una recta.', 'Los puntos suben de forma casi recta.', 'Decreciente sería que y baje.', 'Sin tendencia no mostraría esa subida.', 'Constante en y dejaría los puntos a la misma altura.'],
  item_ap_mat_029: ['Pasa el 6 restando y luego divide por 3.', '21 menos 6 es 15, y 15 entre 3 es 5.', '9 resta 6 de 15 y no divide.', '7 divide 21 entre 3 y olvida el 6.', '15 es 3x, no x.'],
  item_ap_mat_030: ['Si uno es el doble del otro, juntos son tres veces el menor.', '18 entre 3 es 6.', '9 parte 18 a la mitad, sin usar el doble.', '12 es el mayor, no el menor.', '18 es la suma.'],
  item_ap_mat_031: ['Dentro de 5 años la edad es el doble de la edad de hace 5 años.', 'x + 5 = 2(x − 5) da x = 15.', '10 suma los dos plazos de 5 y no plantea la ecuación.', '20 es la edad dentro de 5 años.', '5 es el plazo, no la edad de hoy.'],
  item_ap_mat_032: ['La pendiente es el cambio de y sobre el cambio de x. El intercepto es y cuando x vale 0.', 'De (0, 2) a (2, 6) se sube 4 en 2 pasos: pendiente 2, y la recta es y = 2x + 2.', 'y = 2x olvida el 2 del punto (0, 2).', 'y = x + 2 usa pendiente 1.', 'y = 4x + 2 toma el aumento de y como si x hubiera aumentado 1.'],
  item_ap_mat_033: ['Quita el 3 y luego deshaz la división.', '7 menos 3 es 4, y 4 por 2 es 8.', '5 resta 2 de 7.', '2 es el divisor, no la incógnita.', '20 multiplica 10 por 2 sin haber restado.'],
  item_ap_mat_034: ['Multiplica cada término del primer paréntesis por cada uno del segundo.', '(x − 2)(x + 3) da x² + x − 6.', 'x² − x − 6 cambia el signo del término del medio.', 'x² + 5x − 6 suma 2 y 3 en vez de restar.', 'x² − 6 pierde el término del medio.'],
  item_ap_mat_035: ['Si sumas las dos ecuaciones, la y se cancela.', '10 + 2 es 12, y 12 entre 2 es 6.', '4 es el valor de y.', '8 es 10 menos 2, no el valor de x.', '12 es 2x, no x.'],
  item_ap_mat_036: ['Suma 1 a los dos lados y luego divide por 2. La desigualdad sigue igual.', '2x > 6, así que x > 3.', 'x > 2 no termina el despeje.', 'x > 6 olvida dividir.', 'x < 3 voltea el signo sin multiplicar por un negativo.'],
  item_ap_mat_037: ['La distancia de x a 4 tiene que ser 3.', '7 está a 3 unidades de 4.', '4 está a distancia 0 del centro.', '12 multiplica 4 por 3.', '0 no está a 3 unidades de 4.'],
  item_ap_mat_038: ['En una proporción, cruza los productos.', '4x = 20, así que x = 5.', '8 multiplica 2 por 4.', '20 es el producto, no x.', '2 es el numerador de la primera fracción.'],
  item_ap_mat_039: ['Reemplaza x por 4 y respeta los signos.', '16 − 12 + 1 es 5.', '4 es el valor que se reemplazó, no el resultado.', '11 suma de más al cuadrado.', '29 deja todo con signo positivo: 16 + 12 + 1.'],
  item_ap_mat_040: ['Primero divide por 2 y después suma 3.', '10 entre 2 es 5, y 5 más 3 es 8.', '4 resta 6 de 10.', '5 es x − 3, no x.', '13 suma 10 y 3 sin dividir.'],
  item_ap_mat_041: ['En un rectángulo, la hipotenusa es la raíz de la suma de los cuadrados de los catetos.', '6² + 8² es 100, y la raíz es 10.', '14 suma los catetos.', '48 los multiplica.', '100 es el cuadrado de la hipotenusa, no la hipotenusa.'],
  item_ap_mat_042: ['El área de un triángulo es base por altura, y eso se divide entre 2.', '10 por 4 es 40, y 40 entre 2 es 20.', '40 olvida dividir entre 2.', '14 suma base y altura.', '28 no es esa cuenta.'],
  item_ap_mat_043: ['La longitud de la circunferencia es 2 por π por el radio.', '2 por π por 5 es 10π.', '25π es el área, π por radio al cuadrado.', '5π multiplica una sola vez por el radio.', '20 cm deja fuera a π.'],
  item_ap_mat_044: ['El área del círculo es π por el radio al cuadrado.', '3 al cuadrado es 9, así que el área es 9π.', '6π es la longitud, no el área.', '3π multiplica π solo por el radio.', '9 cm² deja fuera a π.'],
  item_ap_mat_045: ['Los tres ángulos internos suman 180°.', '180 menos 50 menos 60 es 70.', '110 suma los dos ángulos dados y no los resta de 180.', '90 no sale de 50 y 60.', '10 es la diferencia entre 60 y 50.'],
  item_ap_mat_046: ['La diagonal es la hipotenusa del triángulo de 12 cm y 5 cm.', '12² + 5² es 169, y la raíz es 13.', '17 suma los lados.', '60 los multiplica.', '7 resta 12 y 5, y la diagonal no es una resta.'],
  item_ap_mat_047: ['El volumen de un prisma rectangular multiplica largo, ancho y alto.', '3 por 4 por 5 es 60.', '12 es solo la cara de 3 por 4.', '47 no es el producto de las tres aristas.', '23 suma medidas en vez de multiplicarlas.'],
  item_ap_mat_048: ['El volumen del cilindro es π por radio al cuadrado por la altura.', 'π por 4 por 5 es 20π.', '10π usa el radio sin elevarlo al cuadrado.', '7π suma radio y altura.', '40 cm³ deja fuera a π.'],
  item_ap_mat_049: ['Dos ángulos suplementarios suman 180°.', '180 menos 40 es 140.', '50 sería el complemento, que suma 90.', '40 repite el ángulo dado.', '320 resta 40 de 360.'],
  item_ap_mat_050: ['La escala 1:100 multiplica el dibujo por 100 y luego pasa a metros.', '3 cm por 100 son 300 cm, o sea 3 m.', '30 cm multiplica por 10.', '300 m olvida pasar los centímetros a metros.', '103 cm suma 100 y 3.'],
  item_ap_mat_051: ['Reemplaza x por 4 en 2x − 1.', '8 menos 1 es 7.', '8 es solo 2 por 4.', '6 resta de más.', '9 suma 1 en vez de restarlo.'],
  item_ap_mat_052: ['Un número negativo al cuadrado da positivo.', '−3 por −3 es 9.', '−9 conserva el signo y no cuadra.', '6 es el doble de 3.', '−6 es el doble con signo.'],
  item_ap_mat_053: ['La pendiente es cuánto sube y cuando x aumenta 1.', 'Si y aumenta 3, la pendiente es 3.', '1 es el aumento de x, no la pendiente.', '4 suma los dos aumentos.', '1/3 los invierte.'],
  item_ap_mat_054: ['El corte con el eje y ocurre cuando x vale 0.', 'y = −2(0) + 8 da el punto (0, 8).', '(8, 0) cambia el orden de las coordenadas.', '(0, −2) usa la pendiente como si fuera el corte.', '(−2, 0) no es el corte con el eje y.'],
  item_ap_mat_055: ['La división no está definida cuando el denominador vale 0.', 'x − 2 vale 0 si x es 2, y ese valor se excluye.', 'Todos los reales incluyen el 2, donde la función no existe.', 'Solo x = 2 es justo el valor prohibido.', 'Solo los positivos agrega una restricción que la fórmula no tiene.'],
  item_ap_mat_056: ['La inversa deshace la suma de 5.', '9 menos 5 es 4.', '14 suma 5 en vez de restarlo.', '9 es el valor de salida, no el de entrada.', '5 es lo que se suma en la función, no la respuesta.'],
  item_ap_mat_057: ['En la tabla, y sube 2 cada vez que x sube 1.', 'Después de 7 viene 9.', '8 sería el doble de 4, y la tabla no va así.', '7 es el valor cuando x es 3.', '11 suma 4 al 7.'],
  item_ap_mat_058: ['Si la pendiente es negativa, y baja cuando x sube.', 'El coeficiente de x es −1, así que la función es decreciente.', 'Creciente exigiría pendiente positiva.', 'Constante no cambiaría con x.', 'Cuadrática tendría x al cuadrado, y aquí no aparece.'],
  item_ap_mat_059: ['Halla el precio de un cuaderno y multiplícalo por 7.', '8.000 entre 4 es 2.000, y 2.000 por 7 es 14.000.', '12.000 sería el precio de 6, no de 7.', '11.000 suma 3.000 al precio de 4.', '28.000 multiplica 8.000 por un factor de más.'],
  item_ap_mat_060: ['Menos personas, más días: el trabajo total se conserva.', '6 por 4 es 24 jornadas, y 24 entre 3 personas son 8 días.', '2 parte los días a la mitad, al revés de lo que pasa.', '12 multiplica 3 por 4.', '7 suma personas y días.'],
  item_ap_mat_061: ['La cantidad de arroz crece en la misma razón que las personas.', '200 entre 4 es 50 g por persona, y 50 por 10 es 500 g.', '250 suma un poco y no usa la razón.', '800 multiplica 200 por 4.', '40 divide al revés.'],
  item_ap_mat_062: ['Distancia es rapidez por tiempo.', '60 por 2,5 es 150.', '120 usa solo 2 horas.', '62,5 suma la rapidez y el tiempo.', '24 divide 60 entre 2,5.'],
  item_ap_mat_063: ['Cada centímetro del mapa son 5 km reales.', '8 por 5 es 40.', '13 suma 8 y 5.', '8 km lee los centímetros como si ya fueran kilómetros.', '1,6 divide 8 entre 5.'],
  item_ap_mat_064: ['El 15% es 15 de cada 100. De 200, es el doble.', '0,15 por 200 es 30.', '15 es el porcentaje, no el 15% de 200.', '215 suma 200 y 15.', '3 corre la coma y calcula el 1,5%.'],
  item_ap_mat_065: ['Aumentar 20% es multiplicar por 1,20.', '25.000 por 1,20 es 30.000.', '27.000 suma 2.000, no el 20%.', '45.000 suma 20.000 al precio.', '20.000 sería una rebaja, no un aumento.'],
  item_ap_mat_066: ['Disminuir 25% deja el 75%.', '80 por 0,75 es 60.', '55 resta 25, no el 25%.', '20 es el 25% que se quitó, no lo que queda.', '105 suma en vez de restar.'],
  item_ap_mat_067: ['Para sumar fracciones, usa el mismo denominador.', '3/6 más 2/6 es 5/6.', '2/5 suma numeradores y denominadores por separado.', '1/5 multiplica las fracciones.', '2/6 suma los numeradores y no convierte 1/2.'],
  item_ap_mat_068: ['«De» entre una fracción y un entero es una multiplicación.', '2/5 por 40 es 16.', '20 es la mitad de 40.', '8 es 1/5 de 40.', '10 es 1/4 de 40.'],
  item_ap_mat_069: ['10³ es 1.000. Multiplicar por 1.000 corre la coma tres puestos.', '3,5 por 1.000 es 3.500.', '35 corre la coma un solo puesto.', '350 la corre dos puestos.', '0,0035 la corre hacia el otro lado.'],
  item_ap_mat_070: ['La rapidez es distancia entre tiempo. Media hora es 0,5 h.', '30 entre 0,5 es 60.', '30 km/h usa la distancia como si ya fuera la rapidez.', '15 parte la distancia a la mitad.', '90 multiplica 30 por 3.'],
  item_ap_mat_071: ['La razón 2:3 tiene 5 partes iguales.', '100 entre 5 es 20, y la parte mayor son 3 por 20: 60.', '40 es la parte menor, la de 2.', '50 parte el dinero a la mitad.', '30 es una sola parte de más.'],
  item_ap_mat_072: ['El interés simple de un mes es el capital por la tasa.', '100.000 por 0,02 es 2.000.', '20.000 usa el 20%, no el 2%.', '102.000 es el capital más el interés, y la pregunta pide solo el interés.', '200 corre la coma y calcula el 0,2%.'],
  item_ap_mat_073: ['Cada hora tiene 60 minutos.', '2,5 por 60 es 150.', '125 no sale de 2,5 horas.', '250 multiplica por 100.', '90 es hora y media, no dos horas y media.'],
  item_ap_mat_074: ['Primero se multiplica y después se resta.', '3 por 4 es 12, y 15 menos 12 es 3.', '48 hace (15 − 3) por 4, o multiplica todo.', '12 es solo el producto, sin restarlo de 15.', '27 suma 15 y 12.'],
  item_ap_mat_075: ['El seno es el cateto opuesto sobre la hipotenusa.', 'El opuesto a θ mide 3 y la hipotenusa mide 5.', '4/5 es el coseno, el cateto adyacente.', '3/4 es la tangente.', '5/3 invierte el seno.'],
  item_ap_mat_076: ['El coseno es el cateto adyacente sobre la hipotenusa.', 'El adyacente mide 4 y la hipotenusa mide 5.', '3/5 es el seno.', '4/3 compara los catetos y deja fuera la hipotenusa.', '5/4 invierte el coseno.'],
  item_ap_mat_077: ['La tangente es el cateto opuesto sobre el adyacente.', '3 sobre 4.', '4/3 invierte los catetos.', '3/5 es el seno.', '4/5 es el coseno.'],
  item_ap_mat_078: ['La tangente del ángulo de elevación es la altura del poste sobre la distancia en el suelo.', 'Las dos miden 10 m, así que la razón es 1.', 'tan θ = 0 sería un ángulo plano.', 'tan θ = 2 duplica una de las medidas.', 'sen θ = 10 no es una razón: el seno no pasa de 1.'],
  item_ap_mat_079: ['La escalera es la hipotenusa del triángulo de 6 m y 8 m.', '6² + 8² es 100, y la raíz es 10.', '14 suma los catetos.', '48 los multiplica.', '2 resta 8 y 6, y la escalera no es una resta.'],
  item_ap_mat_080: ['Con el seno y la hipotenusa se arma un triángulo 5-12-13.', 'Si el opuesto es 5 y la hipotenusa es 13, el adyacente es 12.', '5 es el cateto opuesto, no el adyacente.', '13 es la hipotenusa.', '8 resta 5 de 13 y no usa el teorema.']
};

const GRAMATICA = {
  item_ap_ing_036: ['She pide la forma de presente simple en tercera persona.', 'Con she, el presente de go es goes.', 'go sirve para I, you, we o they, no para she.', 'going necesita un auxiliar, como is o are.', 'gone es participio, no el presente de todos los días.'],
  item_ap_ing_037: ['En una frase negativa, un incontable como milk no usa la palabra de las afirmaciones.', 'There isn’t any milk.', 'some se usa más en afirmaciones y en ofrecimientos.', 'many es para contables.', 'a few también es para contables.'],
  item_ap_ing_038: ['Than pide un comparativo.', 'De easy, el comparativo es easier.', 'easy es el adjetivo base, no la comparación.', 'easiest es el superlativo.', 'more easy no es la forma que se usa.'],
  item_ap_ing_039: ['When it started to rain sitúa una acción en progreso en el pasado.', 'They were playing.', 'plays es presente de he o she.', 'is playing es presente, no pasado.', 'play es presente simple.'],
  item_ap_ing_040: ['En esta condición de futuro, if va con presente.', 'If it rains, we will stay home.', 'rained es pasado.', 'raining necesita auxiliar.', 'rain no concuerda con it.'],
  item_ap_ing_041: ['El libro no escribe: lo escriben. Eso es pasiva.', 'was written.', 'wrote es activa y pediría una persona como sujeto.', 'writing no cierra la oración.', 'is write mezcla auxiliar y forma.'],
  item_ap_ing_042: ['Interested pide la preposición de interés, no una de lugar.', 'interested in.', 'on no es la preposición de interested.', 'at no es la preposición de interested.', 'by indica agente, no este interés.'],
  item_ap_ing_043: ['2019 es el momento en que empezó, no una duración.', 'since 2019.', 'for pediría una duración, como for six years.', 'ago va al final y con pasado, no después de has lived.', 'during a clock no es una construcción de este hueco.'],
  item_ap_ing_044: ['Una regla obliga con el verbo en base, sin to.', 'You must wear a helmet.', 'might to agrega un to que no va.', 'couldn’t to niega y además sobra el to.', 'mustn’t to también sobra el to, y además prohíbe.'],
  item_ap_ing_045: ['Apples se pueden contar. La pregunta de cantidad no usa la palabra de los incontables.', 'How many apples.', 'much es para incontables.', 'little también es para incontables.', 'any of no arma esta pregunta.'],
  item_ap_ing_046: ['Suggest, en esta construcción, va seguido de verbo en -ing.', 'suggested leaving.', 'to left no es infinitivo ni gerundio.', 'leave that no completa suggest.', 'left es pasado, no la forma que sigue a suggest.'],
  item_ap_ing_047: ['Neither of, con un nombre en plural, se conjuga en singular en esta frase.', 'Neither of the answers is correct.', 'are being always no es la forma del hueco.', 'were being the two cambia el número y agrega palabras de más.', 'be no está conjugado.'],
  item_ap_ing_048: ['Look forward to lleva to y un verbo en -ing.', 'looking forward to seeing.', 'see deja el to sin gerundio.', 'to see you that parte la construcción.', 'seeing to invierte el orden.'],
  item_ap_ing_063: ['Wish, para un arrepentimiento de ayer, va con pasado perfecto.', 'I wish I had had more time.', 'have es presente.', 'having no conjuga el deseo.', 'has es presente de he o she.'],
  item_ap_ing_068: ['Student es una persona. El relativo de persona, como sujeto, no es el de cosas ni el de lugar.', 'the student who won.', 'which se usa para cosas.', 'where se usa para lugares.', 'whom of no arma este relativo sujeto.'],
  item_ap_ing_073: ['By the time we arrived mira una acción ya terminada antes de ese momento.', 'the film had started.', 'starts es presente.', 'is starting es presente progresivo.', 'start no está en pasado.'],
  item_ap_ing_077: ['En el estilo indirecto, asked me where vuelve el verbo al pasado.', 'where I lived.', 'do live yesterday mezcla presente y yesterday.', 'living no cierra la pregunta indirecta.', 'lives now that no concuerda con I ni con el tiempo.']
};

function corta(texto, tope) {
  const limpio = String(texto || '').replace(/\s+/g, ' ').trim();
  if (limpio.length <= tope) return limpio;
  return limpio.slice(0, tope - 1).trim() + '…';
}

function escapar(texto) {
  return String(texto || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sinRespuesta(texto, correcta) {
  return String(texto || '')
    .replace(new RegExp(escapar(correcta), 'gi'), '')
    .replace(/\s+/g, ' ')
    .trim();
}

function porque(mala, correcta) {
  const m = String(mala || '').toLowerCase();
  if (/niega|no hay|no existe|imposible|ninguno|nada/.test(m)) {
    return 'niega algo que el enunciado sí deja en pie.';
  }
  if (/ambos|los dos|lo mismo|exactamente|cualquiera/.test(m)) {
    return 'junta como si fueran iguales unas ideas que el enunciado separa.';
  }
  if (/siempre|todo el|toda el|todos|toda la|completo/.test(m)) {
    return 'vuelve general un dato que solo vale para el caso que se cuenta.';
  }
  return `responde otra pregunta. Lo que se pedía es «${corta(correcta, 80)}».`;
}

function desdeLista(area, id, lista, malas) {
  const [pista, frase, r1, r2, r3] = lista;
  const razones = {};
  [r1, r2, r3].forEach((razon, i) => {
    razones[malas[i]] = razon;
  });
  return {
    pista,
    frase,
    repaso: REPASA[area] || id,
    razones
  };
}

export function redactarAyuda(area, fila) {
  const [id, sub, , texto, correcta, d1, d2, d3] = fila;
  const malas = [d1, d2, d3];
  let ayuda;
  if (MATEMATICAS[id]) {
    ayuda = desdeLista('x', id, MATEMATICAS[id], malas);
    ayuda.repaso = REPASA[sub] || 'Matemáticas';
  } else if (GRAMATICA[id]) {
    ayuda = desdeLista('x', id, GRAMATICA[id], malas);
    ayuda.repaso = 'Inglés: gramática';
  } else {
    const metodo = METODO[sub] || 'Lee qué pide la pregunta y contrástalo con el enunciado.';
    const senal = corta(sinRespuesta(texto, correcta), 120);
    const razones = {};
    malas.forEach((mala) => {
      razones[mala] = `«${corta(mala, 90)}» ${porque(mala, correcta)}`;
    });
    ayuda = {
      pista: `${metodo} Fíjate en: ${senal}`,
      frase: `La idea que sostiene el enunciado es «${corta(correcta, 90)}».`,
      repaso: REPASA[sub] || 'esta idea',
      razones
    };
  }
  if (PROHIBIDO.test(ayuda.pista) || PROHIBIDO.test(ayuda.frase) || PROHIBIDO.test(ayuda.repaso)) {
    throw new Error('ayuda prohibida ' + id);
  }
  Object.values(ayuda.razones).forEach((razon) => {
    if (PROHIBIDO.test(razon)) throw new Error('razon prohibida ' + id);
  });
  return ayuda;
}
