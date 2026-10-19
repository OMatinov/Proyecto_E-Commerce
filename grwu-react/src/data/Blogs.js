const initialBlogs = [
  {
    id: 1,
    titulo: "5 tendencias que dominarán el otoño 2026/2027",
    autor: "Katerine",
    fecha: "2026-08-31",
    categoria: "Tendencias",
    resumen: "Tonos tierra, prendas oversize y capas para crear looks cómodos, urbanos y con actitud.",
    imagen: "/img/blogs/blog1.jpg", // Asegúrate de tener las imágenes en public/img/blogs/
    estado: "publicado",
    contenido: `
      <p>Cuando bajan las temperaturas, no significa que tengas que dejar de lado tu estilo. El otoño permite experimentar con prendas cómodas, tonos cálidos y combinaciones que funcionan tanto para un día de clases como para una salida.</p>
      <h2>1. Tonos tierra y terracota</h2>
      <p>Marrón chocolate, terracota, mostaza y verde oliva son tonos fáciles de combinar. Puedes usarlos en una chaqueta, pantalón o polerón y equilibrarlos con básicos negros, blancos o beige.</p>
      <h2>2. Siluetas oversize</h2>
      <p>Las prendas amplias siguen siendo una alternativa cómoda y urbana. Una chaqueta grande, un polerón ancho o un pantalón relajado pueden darle movimiento al outfit sin dejar de ser funcionales.</p>
      <h2>3. Texturas que aportan calidez</h2>
      <p>Tejidos, denim, algodón grueso y polar ayudan a crear looks más interesantes. Combinar dos o tres texturas suaves es una forma simple de darle profundidad a una tenida.</p>
      <h2>4. Calzado con presencia</h2>
      <p>Zapatillas con suela gruesa, botas urbanas o modelos clásicos pueden cambiar por completo un outfit. Elige un calzado cómodo que acompañe tus actividades diarias.</p>
      <h2>5. Capas y superposición</h2>
      <p>Una polera base, un polerón y una chaqueta forman una combinación práctica para días cambiantes. Además, puedes quitar o agregar capas según la temperatura sin perder el estilo.</p>
    `
  },
  {
    id: 2,
    titulo: "Cómo armar un look unisex en 5 pasos",
    autor: "Katerine",
    fecha: "2026-08-26",
    categoria: "Estilo",
    resumen: "Prendas clave que funcionan con distintos estilos y siluetas para crear un outfit cómodo, personal y fácil de combinar.",
    imagen: "/img/blogs/blog2.jpg",
    estado: "publicado",
    contenido: `
      <p>Un look unisex no depende de una etiqueta: se construye con prendas que se adaptan a ti. La comodidad, el calce y la forma en que combinas cada pieza son más importantes que cualquier regla externa.</p>
      <h2>1. Parte por una prenda base</h2>
      <p>Una polera lisa, un polerón neutro o una camisa amplia pueden ser el punto de partida. Elige colores que puedas usar varias veces y combinar con facilidad.</p>
      <h2>2. Juega con los volúmenes</h2>
      <p>Puedes equilibrar un polerón oversize con un pantalón recto o combinar prendas más amplias de arriba y abajo para un look relajado y urbano.</p>
      <h2>3. Elige colores fáciles de combinar</h2>
      <p>Negro, gris, blanco, beige, azul marino y verde oliva funcionan bien como base. Después puedes sumar un accesorio o una prenda de color para crear contraste.</p>
      <h2>4. Suma una capa exterior</h2>
      <p>Una chaqueta denim, bomber o cortaviento aporta estructura al outfit y también sirve para adaptarte a los cambios de temperatura.</p>
      <h2>5. Termina con accesorios que hablen de ti</h2>
      <p>Zapatillas, gorras, bolsos o cadenas pueden darle un toque personal a una tenida sencilla. No necesitas muchos elementos: basta con elegir uno que conecte con tu estilo.</p>
    `
  },
  {
    id: 3,
    titulo: "Moda sostenible: pequeños cambios, gran impacto",
    autor: "Katerine",
    fecha: "2026-08-18",
    categoria: "Sostenibilidad",
    resumen: "Pequeñas decisiones, prendas versátiles y cuidado de la ropa para construir una forma de vestir más consciente.",
    imagen: "/img/blogs/blog3.jpg",
    estado: "publicado",
    contenido: `
      <p>La sostenibilidad en la moda puede empezar con hábitos simples. Antes de comprar una prenda nueva, vale la pena pensar si podrás usarla en distintas ocasiones y cómo la combinarás con lo que ya tienes.</p>
      <h2>Elige prendas versátiles</h2>
      <p>Una prenda versátil no es aburrida: es una pieza que puedes usar de distintas maneras. Polerones neutros, jeans, chaquetas y poleras básicas suelen ofrecer muchas posibilidades.</p>
      <h2>Cuida lo que ya tienes</h2>
      <p>Lavar siguiendo las etiquetas, evitar temperaturas muy altas y guardar la ropa limpia ayuda a conservar colores, telas y formas por más tiempo.</p>
      <h2>Reutiliza y combina</h2>
      <p>Antes de pensar que necesitas algo nuevo, prueba una combinación distinta. Cambiar los accesorios, usar capas o mezclar texturas puede renovar un outfit por completo.</p>
      <h2>Compra con intención</h2>
      <p>Pregúntate si la prenda se ajusta a tu estilo, si podrás usarla varias veces y si combina con otras piezas de tu clóset. Comprar menos, pero con mayor intención, es un buen comienzo.</p>
    `
  },
  {
    id: 4,
    titulo: "¿Cómo encontrar tu estilo sin seguir todas las tendencias?",
    autor: "Katerine",
    fecha: "2026-08-14",
    categoria: "Estilo",
    resumen: "Una guía para elegir ropa que te represente, en lugar de comprar solamente lo que está de moda.",
    imagen: "/img/blogs/blog4.jpg",
    estado: "publicado",
    contenido: `
      <p>Las tendencias pueden inspirarte, pero no tienen que decidir por ti. Encontrar tu estilo consiste en reconocer qué colores, cortes y prendas te hacen sentir cómodo o cómoda.</p>
      <h2>Observa lo que ya usas</h2>
      <p>Revisa las prendas que más repites. Tal vez prefieres polerones, pantalones anchos, tonos neutros o accesorios llamativos. Ahí ya hay pistas sobre tu estilo personal.</p>
      <h2>Inspírate sin copiar</h2>
      <p>Puedes guardar referencias de outfits que te gusten y adaptarlas a tus propias prendas. La idea no es replicar un look completo, sino rescatar una combinación, color o silueta.</p>
      <h2>Prueba poco a poco</h2>
      <p>Si quieres cambiar algo, comienza con una prenda o accesorio nuevo. Así podrás ver cómo te sientes sin dejar de lado lo que ya te representa.</p>
      <h2>Prioriza cómo te sientes</h2>
      <p>Un outfit funciona cuando te permite moverte, participar en tus actividades y sentirte tú. La comodidad también es parte del estilo.</p>
    `
  },
  {
    id: 5,
    titulo: "Prendas básicas que combinan con todo",
    autor: "Katerine",
    fecha: "2026-08-12",
    categoria: "Guía de compras",
    resumen: "Poleras, jeans, polerones y chaquetas que te ayudan a crear muchos outfits con menos prendas.",
    imagen: "/img/blogs/blog5.jpg",
    estado: "publicado",
    contenido: `
      <p>Las prendas básicas son aquellas que puedes combinar una y otra vez sin que pierdan utilidad. No se trata de vestir siempre igual, sino de tener una base que facilite armar outfits para distintos momentos.</p>
      <h2>Poleras lisas</h2>
      <p>Una polera blanca, negra, gris o de tono neutro combina con jeans, pantalones cargo, shorts, chaquetas y polerones. Es una de las prendas más fáciles de adaptar a distintos estilos.</p>
      <h2>Jeans o pantalón recto</h2>
      <p>Un jeans azul, negro o gris puede funcionar con un look relajado o más estructurado. Elige un calce en el que te puedas mover con comodidad.</p>
      <h2>Polerón neutro</h2>
      <p>Un polerón liso sirve para usar solo, debajo de una chaqueta o sobre una polera. Los colores neutros permiten repetirlo de formas diferentes.</p>
      <h2>Chaqueta versátil</h2>
      <p>Una chaqueta denim, bomber o tipo cortaviento puede completar un outfit sencillo y ayudarte a crear capas cuando baja la temperatura.</p>
    `
  },
  {
    id: 6,
    titulo: "Capas con estilo: guía para vestir en días fríos",
    autor: "Katerine",
    fecha: "2026-08-10",
    categoria: "Tendencias",
    resumen: "Aprende a combinar poleras, polerones y chaquetas sin perder comodidad ni personalidad.",
    imagen: "/img/blogs/blog6.jpg",
    estado: "publicado",
    contenido: `
      <p>Los días fríos no tienen por qué significar outfits repetidos. Usar capas te permite combinar distintas prendas, jugar con las texturas y ajustar tu tenida durante el día.</p>
      <h2>Comienza con una capa base</h2>
      <p>Una polera cómoda es un buen punto de partida. Puedes elegir una lisa o con un diseño discreto que se vea debajo de las demás prendas.</p>
      <h2>Agrega una capa de abrigo</h2>
      <p>Un polerón, chaleco o camisa gruesa suma comodidad y ayuda a generar contraste de color o textura.</p>
      <h2>Termina con una chaqueta</h2>
      <p>Una chaqueta le da estructura al look y protege del frío. Denim, bomber, cortaviento o prendas acolchadas son alternativas urbanas y fáciles de combinar.</p>
      <h2>Equilibra los volúmenes</h2>
      <p>Si usas una chaqueta ancha, puedes optar por un pantalón recto. Si el pantalón es amplio, una capa superior más corta puede equilibrar la silueta.</p>
    `
  },
  {
    id: 7,
    titulo: "Accesorios que transforman un outfit básico",
    autor: "Katerine",
    fecha: "2026-08-07",
    categoria: "Estilo",
    resumen: "Gorras, bolsos, cadenas y zapatillas pueden cambiar por completo un look sencillo sin perder comodidad.",
    imagen: "/img/blogs/blog7.jpg",
    estado: "publicado",
    contenido: `
      <p>Los accesorios son una forma simple de agregar personalidad a un outfit. Una misma combinación de polera y jeans puede verse completamente diferente según las zapatillas, gorro, bolso o joyería que elijas.</p>
      <h2>Gorras y gorros</h2>
      <p>Además de ser prácticos, pueden darle un aire deportivo, relajado o urbano al look. Elige un color que combine con más de una prenda.</p>
      <h2>Bolsos funcionales</h2>
      <p>Un bolso cruzado, mochila o tote bag puede sumar estilo y ayudarte a llevar lo necesario para el día. Lo ideal es que sea cómodo y útil.</p>
      <h2>Cadenas, relojes y detalles</h2>
      <p>Un accesorio metálico o un reloj puede crear contraste en outfits simples. Usa uno o dos elementos para mantener el conjunto equilibrado.</p>
      <h2>Zapatillas como punto focal</h2>
      <p>El calzado suele ser uno de los primeros detalles que se notan. Puedes usar zapatillas neutras para un look limpio o un modelo llamativo para crear protagonismo.</p>
    `
  },
  {
    id: 8,
    titulo: "Cuida tu ropa: 6 hábitos para hacer que dure más",
    autor: "Katerine",
    fecha: "2026-08-04",
    categoria: "Sostenibilidad",
    resumen: "Pequeños hábitos de lavado, guardado y reparación que ayudan a extender la vida útil de tus prendas favoritas.",
    imagen: "/img/blogs/blog8.jpg",
    estado: "publicado",
    contenido: `
      <p>Una prenda puede acompañarte durante mucho tiempo si recibe los cuidados correctos. No necesitas tener conocimientos avanzados: pequeños hábitos hacen una diferencia real en el estado de tu ropa.</p>
      <h2>1. Lee la etiqueta</h2>
      <p>Las indicaciones de lavado ayudan a evitar que una prenda encoja, se destiña o pierda su forma. Revisa la temperatura recomendada y el tipo de secado antes de lavarla.</p>
      <h2>2. Separa por color y tipo de tela</h2>
      <p>Lavar ropa clara y oscura por separado protege los colores. También es útil separar telas delicadas de prendas pesadas como jeans o chaquetas.</p>
      <h2>3. Evita el exceso de calor</h2>
      <p>El calor intenso puede afectar fibras, estampados y elásticos. Siempre que sea posible, prefiere secar al aire y evita planchar directamente sobre diseños o estampados.</p>
      <h2>4. Guarda tus prendas limpias y secas</h2>
      <p>Guardar ropa húmeda o con manchas puede provocar malos olores y deterioro. Antes de doblar una prenda, asegúrate de que esté completamente seca.</p>
      <h2>5. Repara antes de reemplazar</h2>
      <p>Un botón suelto, una costura abierta o una basta descosida se pueden solucionar con una reparación sencilla. A veces solo necesitas hilo, aguja y algunos minutos.</p>
      <h2>6. Dale una segunda oportunidad</h2>
      <p>Si una prenda ya no te representa, puedes transformarla, regalarla, intercambiarla o donarla. Así seguirá teniendo utilidad para otra persona.</p>
    `
  },
  {
    id: 9,
    titulo: "Cómo elegir la talla correcta al comprar ropa online",
    autor: "Katerine",
    fecha: "2026-08-01",
    categoria: "Guía de compras",
    resumen: "Revisa tus medidas, compara la tabla de tallas y compra con más seguridad.",
    imagen: "/img/blogs/blog9.jpg",
    estado: "publicado",
    contenido: `
      <p>La talla puede variar entre prendas, cortes y materiales. Por eso, en una compra online no basta con elegir la letra que usas normalmente: revisar medidas y descripciones hace que la decisión sea más segura.</p>
      <h2>1. Toma tus medidas y guárdalas</h2>
      <p>Mide contorno de pecho, cintura y cadera con una cinta métrica. Puedes anotarlas en tu teléfono para tenerlas disponibles cuando las necesites.</p>
      <h2>2. Revisa la tabla de tallas</h2>
      <p>Compara tus medidas con la tabla del producto. Si estás entre dos tallas, revisa también si el calce es ajustado, regular u oversize.</p>
      <h2>3. Compara con una prenda que ya uses</h2>
      <p>Toma una polera, pantalón o chaqueta que te quede bien y mide su ancho y largo. Compararlo con la información del producto puede orientarte.</p>
      <h2>4. Considera el calce que buscas</h2>
      <p>Una prenda oversize está diseñada para quedar más amplia. Si buscas un ajuste regular, revisa la descripción antes de subir o bajar de talla.</p>
      <h2>5. Lee material y recomendaciones</h2>
      <p>Algunas telas tienen elasticidad y otras no. Conocer el material te ayuda a anticipar cómo se sentirá la prenda al usarla.</p>
    `
  }
];

// Obtener blogs (desde localStorage o el inicial)
export const getBlogs = () => {
  const stored = localStorage.getItem('grwu_blogs');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('grwu_blogs', JSON.stringify(initialBlogs));
  return initialBlogs;
};

const saveBlogs = (blogs) => {
  localStorage.setItem('grwu_blogs', JSON.stringify(blogs));
};

export const createBlog = (blog) => {
  const blogs = getBlogs();
  const newBlog = { ...blog, id: Date.now() };
  const updated = [...blogs, newBlog];
  saveBlogs(updated);
  return newBlog;
};

export const updateBlog = (id, updatedData) => {
  const blogs = getBlogs();
  const updated = blogs.map(b => b.id === id ? { ...b, ...updatedData } : b);
  saveBlogs(updated);
  return updated.find(b => b.id === id);
};

export const deleteBlog = (id) => {
  const blogs = getBlogs();
  const filtered = blogs.filter(b => b.id !== id);
  saveBlogs(filtered);
  return true;
};