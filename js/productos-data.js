// Base de datos completa de productos para catálogo, ficha de producto y admin
const PRODUCTOS = [
  // ==================== ABRIGOS ====================
  {
    id: 'abrigo1',
    nombre: 'Abrigo Classic Camel',
    categoria: 'abrigos',
    genero: 'mujer',
    precio: 18990,
    imagen: 'img/mujer/abrigo1.png',
    imagenes: ['img/mujer/abrigo1.png'],
    descripcion: 'Abrigo largo color camel de corte recto y solapas clásicas, ideal para looks urbanos elegantes y para usar sobre vestidos o jeans.'
  },
  {
    id: 'abrigo2',
    nombre: 'Blazer Coat City Café',
    categoria: 'abrigos',
    genero: 'mujer',
    precio: 16990,
    imagen: 'img/mujer/abrigo2.png',
    imagenes: ['img/mujer/abrigo2.png', 'img/mujer/abrigo2-1.png', 'img/mujer/abrigo2-2.png', 'img/mujer/abrigo2-3.png'],
    descripcion: 'Abrigo tipo blazer en tono café, de silueta relajada y botones frontales, perfecto para la oficina o para elevar un outfit casual.'
  },
  {
    id: 'abrigo3',
    nombre: 'Cardigan Urbano Arena',
    categoria: 'abrigos',
    genero: 'mujer',
    precio: 14990,
    imagen: 'img/mujer/abrigo3.png',
    imagenes: ['img/mujer/abrigo3.png', 'img/mujer/abrigo3-1.png', 'img/mujer/abrigo3-2.png', 'img/mujer/abrigo3-3.png'],
    descripcion: 'Cárdigan corto en tono arena con bolsillos frontales, tejido suave y liviano para usar en capas durante la transición de temporada.'
  },

  // ==================== ACCESORIOS ====================
  {
    id: 'accesorio1',
    nombre: 'Pinza Azul Pastel',
    categoria: 'accesorios',
    genero: 'mujer',
    precio: 2990,
    imagen: 'img/mujer/accesorio1.png',
    imagenes: ['img/mujer/accesorio1.png'],
    descripcion: 'Pinza para el pelo en tono azul pastel, ideal para recogidos rápidos y para sumar un toque de color suave al look.'
  },
  {
    id: 'accesorio2',
    nombre: 'Pinza Black Matte',
    categoria: 'accesorios',
    genero: 'mujer',
    precio: 2990,
    imagen: 'img/mujer/accesorio2.png',
    imagenes: ['img/mujer/accesorio2.png'],
    descripcion: 'Pinza negra para el pelo, de acabado mate y agarre firme, perfecta para peinados diarios.'
  },
  {
    id: 'accesorio3',
    nombre: 'Pinza Carey Clásica',
    categoria: 'accesorios',
    genero: 'mujer',
    precio: 2990,
    imagen: 'img/mujer/accesorio3.png',
    imagenes: ['img/mujer/accesorio3.png'],
    descripcion: 'Pinza en acabado carey, resistente y cómoda, pensada para recogidos elegantes y casuales.'
  },
  {
    id: 'accesorio4',
    nombre: 'Collar Charm Multicolor',
    categoria: 'accesorios',
    genero: 'mujer',
    precio: 8990,
    imagen: 'img/mujer/accesorio4.png',
    imagenes: ['img/mujer/accesorio4.png'],
    descripcion: 'Collar dorado de varias capas con charms y piedras de colores, ideal para hacer protagonista cualquier outfit básico.'
  },
  {
    id: 'accesorio5',
    nombre: 'Collar Medallas Astro',
    categoria: 'accesorios',
    genero: 'mujer',
    precio: 6990,
    imagen: 'img/mujer/accesorio5.png',
    imagenes: ['img/mujer/accesorio5.png'],
    descripcion: 'Collar doble con cordón estampado y medallas doradas tipo sol y luna, perfecto para looks boho urbanos.'
  },
  {
    id: 'accesorio6',
    nombre: 'Bolso Macramé Arena',
    categoria: 'accesorios',
    genero: 'mujer',
    precio: 12990,
    imagen: 'img/mujer/accesorio6.png',
    imagenes: ['img/mujer/accesorio6.png'],
    descripcion: 'Bolso tejido tipo macramé en tono arena, liviano y amplio, ideal para verano y fines de semana casuales.'
  },
  {
    id: 'accesorio7',
    nombre: 'Bolso Cuerda Black Gold',
    categoria: 'accesorios',
    genero: 'mujer',
    precio: 13990,
    imagen: 'img/mujer/accesorio7.png',
    imagenes: ['img/mujer/accesorio7.png'],
    descripcion: 'Bolso de cuerda negro con finas líneas doradas, perfecto para la playa o para un look relajado con brillo discreto.'
  },
  {
    id: 'accesorio8',
    nombre: 'Bandolera Minimal Black',
    categoria: 'accesorios',
    genero: 'unisex',
    precio: 11990,
    imagen: 'img/mujer/accesorio8.png',
    imagenes: ['img/mujer/accesorio8.png'],
    descripcion: 'Carterita bandolera negra de diseño minimal, ideal para salir ligera llevando solo lo esencial.'
  },
  {
    id: 'accesorio9',
    nombre: 'Tote Básico Black',
    categoria: 'accesorios',
    genero: 'unisex',
    precio: 15990,
    imagen: 'img/mujer/accesorio9.png',
    imagenes: ['img/mujer/accesorio9.png'],
    descripcion: 'Bolso tote negro grande y estructurado, perfecto para el día a día, trabajo o universidad.'
  },
  {
    id: 'accesorio10',
    nombre: 'Tote Urban Caramel',
    categoria: 'accesorios',
    genero: 'unisex',
    precio: 16990,
    imagen: 'img/mujer/accesorio10.png',
    imagenes: ['img/mujer/accesorio10.png'],
    descripcion: 'Tote en color caramelo, amplio y versátil, combina bien con jeans, vestidos y looks de oficina.'
  },
  {
    id: 'accesorio11',
    nombre: 'Mochila Urban Waterproof',
    categoria: 'accesorios',
    genero: 'unisex',
    precio: 18990,
    imagen: 'img/mujer/accesorio11.png',
    imagenes: ['img/mujer/accesorio11.png', 'img/accesorio11-1.png'],
    descripcion: 'Mochila negra de acabado waterproof con bolsillos frontales, ideal para ciudad y días lluviosos.'
  },
  {
    id: 'accesorio12',
    nombre: 'Cinturón Western Black',
    categoria: 'accesorios',
    genero: 'unisex',
    precio: 9990,
    imagen: 'img/mujer/accesorio12.png',
    imagenes: ['img/mujer/accesorio12.png'],
    descripcion: 'Cinturón negro con hebilla estilo western grabada, suma un toque boho-rockero a vestidos y jeans.'
  },
  {
    id: 'accesorio13',
    nombre: 'Cinturón Aro Silver',
    categoria: 'accesorios',
    genero: 'unisex',
    precio: 8990,
    imagen: 'img/mujer/accesorio13.png',
    imagenes: ['img/mujer/accesorio13.png'],
    descripcion: 'Cinturón negro con hebilla circular plateada, perfecto para marcar la cintura en outfits urbanos.'
  },
  {
    id: 'accesorio14',
    nombre: 'Gorra Dancing Queen',
    categoria: 'accesorios',
    genero: 'unisex',
    precio: 13990,
    imagen: 'img/mujer/accesorio14.png',
    imagenes: ['img/mujer/accesorio14.png'],
    descripcion: 'Gorra gris desgastada con bordado "DANCING QUEEN", ideal para looks relajados con actitud.'
  },

  // CALZADO 
  {
    id: 'calzado1',
    nombre: 'Zapatillas Classic White',
    categoria: 'calzado',
    genero: 'unisex',
    precio: 34990,
    imagen: 'img/mujer/calzado1.png',
    imagenes: ['img/mujer/calzado1.png', 'img/mujer/calzado1-1.png', 'img/mujer/calzado1-2.png'],
    descripcion: 'Zapatillas blancas de plataforma baja y diseño limpio, perfectas para combinar con jeans, vestidos o faldas urbanas.'
  },
  {
    id: 'calzado2',
    nombre: 'Zapatillas Old School Black',
    categoria: 'calzado',
    genero: 'unisex',
    precio: 32990,
    imagen: 'img/mujer/calzado2.png',
    imagenes: ['img/mujer/calzado2.png', 'img/mujer/calzado2-1.png', 'img/mujer/calzado2-2.png', 'img/mujer/calzado2-3.png'],
    descripcion: 'Zapatillas negras tipo skate con detalles blancos y suela blanca, un clásico urbano para el uso diario.'
  },
  {
    id: 'calzado3',
    nombre: 'Zapatillas Retro Stripe',
    categoria: 'calzado',
    genero: 'unisex',
    precio: 33990,
    imagen: 'img/mujer/calzado3.png',
    imagenes: ['img/mujer/calzado3.png', 'img/mujer/calzado3-1.png', 'img/mujer/calzado3-2.png', 'img/mujer/calzado3-3.png'],
    descripcion: 'Zapatillas negras con tres franjas blancas y suela color miel, ideales para looks sporty con un aire retro.'
  },
  {
    id: 'calzado4',
    nombre: 'Botas Chunky Black',
    categoria: 'calzado',
    genero: 'mujer',
    precio: 39990,
    imagen: 'img/mujer/calzado4.png',
    imagenes: ['img/mujer/calzado4.png', 'img/mujer/calzado4-1.png', 'img/mujer/calzado4-2.png'],
    descripcion: 'Botas negras de caña alta con suela chunky, perfectas para outfits de invierno con actitud, desde vestidos hasta shorts.'
  },
  {
    id: 'calzado5',
    nombre: 'Oxford Chunky Black',
    categoria: 'calzado',
    genero: 'unisex',
    precio: 36990,
    imagen: 'img/mujer/calzado5.png',
    imagenes: ['img/mujer/calzado5.png', 'img/mujer/calzado5-1.png'],
    descripcion: 'Zapatos tipo oxford negros con suela gruesa y costuras contrastantes, ideales para dar un giro alternativo a looks formales o casuales.'
  },

  // CHAQUETAS 
  {
    id: 'chaqueta1',
    nombre: 'Chaqueta Acolchada Grafito',
    categoria: 'chaquetas',
    genero: 'unisex',
    precio: 26990,
    imagen: 'img/mujer/chaqueta1.png',
    imagenes: ['img/mujer/chaqueta1.png'],
    descripcion: 'Chaqueta corta acolchada en gris grafito con cuello alto y ajuste en la basta, ideal para días fríos con estilo urbano.'
  },
  {
    id: 'chaqueta2',
    nombre: 'Chaqueta Biker Black',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 31990,
    imagen: 'img/mujer/chaqueta2.png',
    imagenes: ['img/mujer/chaqueta2.png', 'img/mujer/chaqueta2-1.png'],
    descripcion: 'Chaqueta negra tipo biker con cierre frontal y cuello alzado, perfecta para dar actitud a jeans y vestidos.'
  },
  {
    id: 'chaqueta3',
    nombre: 'Chaqueta Oversize Olive',
    categoria: 'chaquetas',
    genero: 'unisex',
    precio: 25990,
    imagen: 'img/mujer/chaqueta3.png',
    imagenes: ['img/mujer/chaqueta3.png', 'img/mujer/chaqueta3-1.png', 'img/mujer/chaqueta3-2.png'],
    descripcion: 'Chaqueta oversize en tono verde oliva con caída suelta, pensada para looks relajados en capas.'
  },
  {
    id: 'chaqueta4',
    nombre: 'Chaqueta Oversize Borgoña',
    categoria: 'chaquetas',
    genero: 'mujer',
    precio: 25990,
    imagen: 'img/mujer/chaqueta4.png',
    imagenes: ['img/mujer/chaqueta4.png', 'img/mujer/chaqueta4-1.png', 'img/mujer/chaqueta4-2.png'],
    descripcion: 'Chaqueta oversize en color borgoña, de textura suave y volumen en la basta, ideal para destacar en outfits neutros.'
  },
  {
    id: 'chaqueta5',
    nombre: 'Chaleco Puffer Black',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 21990,
    imagen: 'img/mujer/chaqueta5.png',
    imagenes: ['img/mujer/chaqueta5.png', 'img/mujer/chaqueta5-1.png'],
    descripcion: 'Chaleco puffer negro con cuello alto y cierre frontal, perfecto para sumar abrigo sin perder movilidad.'
  },
  {
    id: 'chaqueta6',
    nombre: 'Chaqueta Biker Black II',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 31990,
    imagen: 'img/mujer/chaqueta6.png',
    imagenes: ['img/mujer/chaqueta6.png', 'img/mujer/chaqueta6-1.png'],
    descripcion: 'Chaqueta tipo biker negra de efecto cuero con solapas y cierres metálicos, un básico clave para looks nocturnos y urbanos.'
  },

  // ==================== CONJUNTOS ====================
  {
    id: 'conjunto1',
    nombre: 'Set Chochet Cream',
    categoria: 'conjuntos',
    genero: 'mujer',
    precio: 26990,
    imagen: 'img/mujer/conjunto1.png',
    imagenes: ['img/mujer/conjunto1.png'],
    descripcion: 'Conjunto de top y falda corta en tejido crochet color crema, ideal para looks veraniegos femeninos y ligeros.'
  },
  {
    id: 'conjunto2',
    nombre: 'Set Chochet Black',
    categoria: 'conjuntos',
    genero: 'mujer',
    precio: 26990,
    imagen: 'img/mujer/conjunto2.png',
    imagenes: ['img/mujer/conjunto2.png'],
    descripcion: 'Conjunto de top y falda corta en crochet negro, perfecto para una versión nocturna del look veraniego clásico.'
  },
  {
    id: 'conjunto3',
    nombre: 'Set Beach Layer',
    categoria: 'conjuntos',
    genero: 'mujer',
    precio: 31990,
    imagen: 'img/mujer/conjunto3.png',
    imagenes: ['img/mujer/conjunto3.png'],
    descripcion: 'Conjunto tejido de pantalón ancho y chaleco largo abierto en tono crudo, perfecto para usar sobre traje de baño o outfits playeros.'
  },
  {
    id: 'conjunto4',
    nombre: 'Set Knit Wide Leg',
    categoria: 'conjuntos',
    genero: 'mujer',
    precio: 28990,
    imagen: 'img/mujer/conjunto4.png',
    imagenes: ['img/mujer/conjunto4.png'],
    descripcion: 'Conjunto de top sin mangas y pantalón ancho de punto calado en color crudo, ideal para looks relajados pero pulidos.'
  },

  //  FALDAS 
  {
    id: 'falda1',
    nombre: 'Mini Falda Denim Indigo',
    categoria: 'faldas',
    genero: 'mujer',
    precio: 11990,
    imagen: 'img/mujer/falda1.png',
    imagenes: ['img/mujer/falda1.png', 'img/mujer/falda1-1.png'],
    descripcion: 'Mini falda de mezclilla en tono índigo con botón decorativo, un básico urbano para combinar con poleras y sweaters.'
  },
  {
    id: 'falda3',
    nombre: 'Mini Falda Animal Print',
    categoria: 'faldas',
    genero: 'mujer',
    precio: 12990,
    imagen: 'img/mujer/falda3.png',
    imagenes: ['img/mujer/falda3.png', 'img/mujer/falda3-1.png'],
    descripcion: 'Mini falda con estampado animal print, perfecta para outfits nocturnos o para dar protagonismo a un look básico.'
  },
  {
    id: 'falda4',
    nombre: 'Falda Midi Tiered Gris',
    categoria: 'faldas',
    genero: 'mujer',
    precio: 14990,
    imagen: 'img/mujer/falda4.png',
    imagenes: ['img/mujer/falda4.png', 'img/mujer/falda4-1.png'],
    descripcion: 'Falda midi gris de capas con pretina elástica, fluida y cómoda para uso diario.'
  },
  {
    id: 'falda5',
    nombre: 'Mini Falda Wrap Black',
    categoria: 'faldas',
    genero: 'mujer',
    precio: 10990,
    imagen: 'img/mujer/falda5.png',
    imagenes: ['img/mujer/falda5.png', 'img/mujer/falda5-1.png'],
    descripcion: 'Mini falda negra tipo pareo con amarra lateral, ideal para combinar con tops ajustados o camisas oversize.'
  },

  // PANTALONES 
  {
    id: 'pantalon2',
    nombre: 'Jeans Wide Choco',
    categoria: 'pantalones',
    genero: 'mujer',
    precio: 19990,
    imagen: 'img/mujer/pantalon2.png',
    imagenes: ['img/mujer/pantalon2.png', 'img/mujer/pantalon2-1.png', 'img/mujer/pantalon2-2.png', 'img/mujer/pantalon2-3.png'],
    descripcion: 'Jeans ancho en color café chocolate con bolsillos delanteros decorativos, perfecto para outfits urbanos en tonos tierra.'
  },
  {
    id: 'pantalon3',
    nombre: 'Jeans Wide Black',
    categoria: 'pantalones',
    genero: 'mujer',
    precio: 21990,
    imagen: 'img/mujer/pantalon3.png',
    imagenes: ['img/mujer/pantalon3.png', 'img/mujer/pantalon3-1.png', 'img/mujer/pantalon3-2.png', 'img/mujer/pantalon3-3.png'],
    descripcion: 'Jeans negros de tiro medio y pierna ancha, un básico versátil para combinar con poleras, blusas o chaquetas.'
  },
  {
    id: 'pantalon4',
    nombre: 'Jeans Sailor Indigo',
    categoria: 'pantalones',
    genero: 'mujer',
    precio: 23990,
    imagen: 'img/mujer/pantalon4.png',
    imagenes: ['img/mujer/pantalon4.png', 'img/mujer/pantalon4-1.png', 'img/mujer/pantalon4-2.png', 'img/mujer/pantalon4-3.png'],
    descripcion: 'Jeans azul índigo de pierna recta ancha con bolsillos frontales tipo sailor, ideales para un look retro pero moderno.'
  },
  {
    id: 'pantalon5',
    nombre: 'Jeans Wide Azul Medio',
    categoria: 'pantalones',
    genero: 'mujer',
    precio: 21990,
    imagen: 'img/mujer/pantalon5.png',
    imagenes: ['img/mujer/pantalon5.png', 'img/mujer/pantalon5-1.png'],
    descripcion: 'Jeans azul medio de tiro medio y pierna ancha, pensados para el uso diario con zapatillas o botines.'
  },

  // ==================== POLERAS ====================
  {
    id: 'polera1',
    nombre: 'Top Rib Azul',
    categoria: 'poleras',
    genero: 'mujer',
    precio: 5990,
    imagen: 'img/mujer/polera1.png',
    imagenes: ['img/mujer/polera1.png', 'img/mujer/polera1-1.png'],
    descripcion: 'Top corto acanalado en tono azul marino, de cuello redondo y corte ajustado, ideal para usar con jeans o faldas tiro alto.'
  },
  {
    id: 'polera2',
    nombre: 'Top Rib Verde',
    categoria: 'poleras',
    genero: 'mujer',
    precio: 5990,
    imagen: 'img/mujer/polera2.png',
    imagenes: ['img/mujer/polera2.png', 'img/mujer/polera2-1.png'],
    descripcion: 'Top sin mangas acanalado en verde suave, perfecto para looks frescos de diario o capas bajo chaquetas.'
  },
  {
    id: 'polera3',
    nombre: 'Top Rib Grafito',
    categoria: 'poleras',
    genero: 'mujer',
    precio: 5990,
    imagen: 'img/mujer/polera3.png',
    imagenes: ['img/mujer/polera3.png', 'img/mujer/polera3-1.png'],
    descripcion: 'Top acanalado gris oscuro, de fit ceñido y cuello redondo, un básico versátil para combinar con todo.'
  },
  {
    id: 'polera4',
    nombre: 'Polera Basic Off White',
    categoria: 'poleras',
    genero: 'unisex',
    precio: 4490,
    imagen: 'img/mujer/polera4.png',
    imagenes: ['img/mujer/polera4.png', 'img/mujer/polera4-1.png'],
    descripcion: 'Polera de algodón en tono off white, de manga corta y silueta recta, ideal como básico de fondo de clóset.'
  },
  {
    id: 'polera5',
    nombre: 'Top Crochet Cream',
    categoria: 'poleras',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/polera5.png',
    imagenes: ['img/mujer/polera5.png'],
    descripcion: 'Top de tirantes en crochet color crema con botones frontales, perfecto para noches de verano o para combinar con denim.'
  },
  {
    id: 'polera6',
    nombre: 'Top Crochet Black',
    categoria: 'poleras',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/polera6.png',
    imagenes: ['img/mujer/polera6.png'],
    descripcion: 'Top de tirantes en crochet negro con botones, ideal para noches de verano o para combinar con denim.'
  },
  {
    id: 'polera7',
    nombre: 'Top Halter Black',
    categoria: 'poleras',
    genero: 'mujer',
    precio: 7490,
    imagen: 'img/mujer/polera7.png',
    imagenes: ['img/mujer/polera7.png', 'img/mujer/polera7-2.png'],
    descripcion: 'Top negro tipo halter acanalado, ceñido y minimalista, perfecto para outfits urbanos con pantalones anchos o faldas.'
  },

  // ==================== POLERONES ====================
  {
    id: 'poleron1',
    nombre: 'Polerón NWRK Navy',
    categoria: 'polerones',
    genero: 'hombre',
    precio: 19990,
    imagen: 'img/mujer/poleron1.png',
    imagenes: ['img/mujer/poleron1.png', 'img/mujer/poleron1-1.png', 'img/mujer/poleron1-2.png'],
    descripcion: 'Polerón oversize azul marino con estampado frontal "NWRK", de estilo universitario, ideal para looks urbanos y cómodos.'
  },
  {
    id: 'poleron2',
    nombre: 'Polerón Knoxville Grey',
    categoria: 'polerones',
    genero: 'hombre',
    precio: 18990,
    imagen: 'img/mujer/poleron2.png',
    imagenes: ['img/mujer/poleron2.png', 'img/mujer/poleron2-1.png', 'img/mujer/poleron2-2.png'],
    descripcion: 'Polerón gris jaspeado con estampado frontal "Knoxville", de corte relajado y cuello redondo, ideal para el día a día.'
  },
  {
    id: 'poleron3',
    nombre: 'Polerón Hoodie Brooklyn Black',
    categoria: 'polerones',
    genero: 'hombre',
    precio: 21990,
    imagen: 'img/mujer/poleron3.png',
    imagenes: ['img/mujer/poleron3.png', 'img/mujer/poleron3-1.png'],
    descripcion: 'Polerón negro con capucha y cierre frontal, estampado "BROOKLYN New York City", perfecto para outfits relajados con jeans o joggers.'
  },
  {
    id: 'poleron4',
    nombre: 'Polerón Hoodie Angel Grey',
    categoria: 'polerones',
    genero: 'unisex',
    precio: 20990,
    imagen: 'img/mujer/poleron4.png',
    imagenes: ['img/mujer/poleron4.png', 'img/mujer/poleron4-1.png'],
    descripcion: 'Buzo gris con capucha y bolsillo canguro, liso por delante y con diseño de alas y texto en la espalda, ideal para un look básico con detalle especial.'
  },

  // SHORTS 
  {
    id: 'short1',
    nombre: 'Short Denim Black Chain',
    categoria: 'shorts',
    genero: 'mujer',
    precio: 10990,
    imagen: 'img/mujer/short1.png',
    imagenes: ['img/mujer/short1.png', 'img/mujer/short1-2.png'],
    descripcion: 'Short de mezclilla negro con cinturón cadena metálica decorativa, ideal para looks nocturnos o urbanos con actitud.'
  },
  {
    id: 'short2',
    nombre: 'Short Denim Doblado Azul',
    categoria: 'shorts',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/short2.png',
    imagenes: ['img/mujer/short2.png', 'img/mujer/short2-2.png'],
    descripcion: 'Short de mezclilla azul con ruedo doblado y tiro alto, perfecto para outfits veraniegos con poleras o tops.'
  },
  {
    id: 'short3',
    nombre: 'Short Denim Light',
    categoria: 'shorts',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/short3.png',
    imagenes: ['img/mujer/short3.png', 'img/mujer/short3-2.png'],
    descripcion: 'Short de mezclilla azul claro de tiro medio y corte recto, un básico cómodo para el día a día.'
  },
  {
    id: 'short4',
    nombre: 'Short Denim Medio',
    categoria: 'shorts',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/short4.png',
    imagenes: ['img/mujer/short4.png', 'img/mujer/short4-2.png'],
    descripcion: 'Short de mezclilla azul medio con fit relajado, ideal para looks casuales con zapatillas.'
  },

  // VESTIDOS
  {
    id: 'vestido1',
    nombre: 'Vestido Bubble Black',
    categoria: 'vestidos',
    genero: 'mujer',
    precio: 21990,
    imagen: 'img/mujer/vestido1.png',
    imagenes: ['img/mujer/vestido1.png', 'img/mujer/vestido1-2.png', 'img/mujer/vestido1-3.png'],
    descripcion: 'Vestido negro sin mangas con parte superior ajustada y falda tipo bubble con volumen, ideal para salidas nocturnas.'
  },
  {
    id: 'vestido2',
    nombre: 'Vestido Dark Borgoña Split',
    categoria: 'vestidos',
    genero: 'mujer',
    precio: 24990,
    imagen: 'img/mujer/vestido2.png',
    imagenes: ['img/mujer/vestido2.png', 'img/mujer/vestido2-1.png'],
    descripcion: 'Vestido midi borgoña con tirantes finos y abertura lateral alta, perfecto para looks nocturnos con botines o sandalias.'
  },
  {
    id: 'vestido4',
    nombre: 'Vestido Corduroy Button Black',
    categoria: 'vestidos',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/vestido4.png',
    imagenes: ['img/mujer/vestido4.png', 'img/mujer/vestido4-1.png', 'img/mujer/vestido4-2.png'],
    descripcion: 'Vestido corto negro de cotelé con botones frontales, perfecto para usar con poleras o suéters debajo.'
  },
  {
    id: 'vestido5',
    nombre: 'Vestido Strapless Choco',
    categoria: 'vestidos',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/vestido5.png',
    imagenes: ['img/mujer/vestido5.png', 'img/mujer/vestido5-1.png'],
    descripcion: 'Vestido midi strapless color chocolate con frunce lateral y abertura, ideal para eventos o salidas de noche.'
  },
  {
    id: 'vestido6',
    nombre: 'Vestido Midi Olive Split',
    categoria: 'vestidos',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/vestido6.png',
    imagenes: ['img/mujer/vestido6.png', 'img/mujer/vestido6-1.png'],
    descripcion: 'Vestido midi ajustado en tono verde oliva con abertura lateral, perfecto para looks urbanos con bototos.'
  },
  {
    id: 'vestido7',
    nombre: 'Vestido Mesh Ombre Grey',
    categoria: 'vestidos',
    genero: 'mujer',
    precio: 9990,
    imagen: 'img/mujer/vestido7.png',
    imagenes: ['img/mujer/vestido7.png', 'img/mujer/vestido7-1.png'],
    descripcion: 'Vestido midi de tirantes con efecto degradé en tonos grises y falda ligeramente acampanada, ideal para noches especiales.'
  },

  // PRODUCTOS DE HOMBRES
//  ACCESORIOS 
  {
    id: 'accesorio15',
    nombre: 'Set de Anillos Góticos',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 14990,
    imagen: 'img/hombre/anillo1.jpeg',
    imagenes: ['img/hombre/anillo1.jpeg', 'img/hombre/anillo1.1.jpeg', 'img/hombre/anillo1.2.jpeg', 'img/hombre/anillo1.3.jpeg'],
    descripcion: 'Set de 6 anillos de plata con diseño gótico, incluye calaveras, cruces y estrellas.'
  },
  {
    id: 'cadena_estrellas',
    nombre: 'Cadena de Plata con Estrellas',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 12990,
    imagen: 'img/hombre/cadena1.jpeg',
    imagenes: ['img/hombre/cadena1.jpeg', 'img/hombre/cadena1.1.jpeg', 'img/hombre/cadena1.2.jpeg', 'img/hombre/cadena2.jpeg'],
    descripcion: 'Cadena de plata de tres capas con dijes de estrellas, estilo urbano y llamativo.'
  },
  {
    id: 'accesorio16',
    nombre: 'Cinturón Negro con Hebilla',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 8990,
    imagen: 'img/hombre/cinturon1.jpeg',
    imagenes: ['img/hombre/cinturon1.jpeg', 'img/hombre/cinturon1.1.jpeg'],
    descripcion: 'Cinturón de cuero negro con hebilla plateada de diseño geométrico.'
  },
  {
    id: 'accesorio17',
    nombre: 'Collar de Cruz Gótica',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 11990,
    imagen: 'img/hombre/collar1.jpeg',
    imagenes: ['img/hombre/collar1.jpeg', 'img/hombre/collar1.1.jpeg', 'img/hombre/collar1.2.jpeg'],
    descripcion: 'Collar de plata con colgante de cruz gótica detallada, estilo alternativo.'
  },
  {
    id: 'accesorio18',
    nombre: 'Gorro Beanie Estrellas',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 9990,
    imagen: 'img/hombre/gorro1.jpeg',
    imagenes: ['img/hombre/gorro1.jpeg', 'img/hombre/gorro1.2.jpeg'],
    descripcion: 'Gorro tejido negro con estampado de estrellas y letras en gris.'
  },
  {
    id: 'accesorio19',
    nombre: 'Gorra Gris Desgastada',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 12990,
    imagen: 'img/hombre/gorro2.jpeg',
    imagenes: ['img/hombre/gorro2.jpeg'],
    descripcion: 'Gorra gris de estilo desgastado con logo tenue en el frente.'
  },
  {
    id: 'accesorio20',
    nombre: 'Gorra New York',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 15990,
    imagen: 'img/hombre/gorro3.jpeg',
    imagenes: ['img/hombre/gorro3.jpeg'],
    descripcion: 'Gorra negra con logo de New York en blanco y detalles laterales.'
  },
  {
    id: 'accesorio21',
    nombre: 'Gorra Marrón',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 14990,
    imagen: 'img/hombre/gorro4.jpeg',
    imagenes: ['img/hombre/gorro4.jpeg'],
    descripcion: 'Gorra marrón con logo bordado en tonos tierra.'
  },
  {
    id: 'accesorio22',
    nombre: 'Lentes de Sol Negros',
    categoria: 'accesorios',
    genero: 'hombre',
    precio: 10990,
    imagen: 'img/hombre/lentes1.jpeg',
    imagenes: ['img/hombre/lentes1.jpeg', 'img/hombre/lentes1.1.jpeg'],
    descripcion: 'Lentes de sol rectangulares negros, estilo minimalista.'
  },

    // CONJUNTOS 
  {
    id: 'conjunto5',
    nombre: 'Set Polera y Short PAUTROS',
    categoria: 'conjuntos',
    genero: 'hombre',
    precio: 24990,
    imagen: 'img/hombre/conjunto1.jpeg',
    imagenes: ['img/hombre/conjunto1.jpeg', 'img/hombre/conjunto1.1.jpeg'],
    descripcion: 'Conjunto de polera y short negro con estampado gótico "PAUTROS".'
  },

    // CHAQUETAS 
  {
    id: 'chaqueta7',
    nombre: 'Chaqueta Chicago',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 29990,
    imagen: 'img/hombre/chaqueta1.jpeg',
    imagenes: ['img/hombre/chaqueta1.jpeg', 'img/hombre/chaqueta1.1.jpeg', 'img/hombre/chaqueta1.2.jpeg'],
    descripcion: 'Chaqueta de cuero sintético negro con estampado "Chicago" en el pecho.'
  },
  {
    id: 'chaqueta8',
    nombre: 'Chaqueta Deportiva Bordo',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 24990,
    imagen: 'img/hombre/chaqueta2.jpeg',
    imagenes: ['img/hombre/chaqueta2.jpeg', 'img/hombre/chaqueta2.1.jpeg'],
    descripcion: 'Chaqueta deportiva bordo con mangas blancas y texto "PAVT ROS".'
  },
  {
    id: 'chaqueta9',
    nombre: 'Chaqueta Negra y Verde',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 24990,
    imagen: 'img/hombre/chaqueta3.jpeg',
    imagenes: ['img/hombre/chaqueta3.jpeg', 'img/hombre/chaqueta3.1.jpeg'],
    descripcion: 'Chaqueta negra con paneles verdes y blancos, estilo urbano.'
  },
  {
    id: 'chaqueta10',
    nombre: 'Chaqueta Negra y Morada',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 24990,
    imagen: 'img/hombre/chaqueta4.jpeg',
    imagenes: ['img/hombre/chaqueta4.jpeg', 'img/hombre/chaqueta4.1.jpeg'],
    descripcion: 'Chaqueta negra con paneles morados y blancos, estilo deportivo.'
  },
  {
    id: 'chaqueta11',
    nombre: 'Chaqueta Negra y Roja',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 24990,
    imagen: 'img/hombre/chaqueta5.jpeg',
    imagenes: ['img/hombre/chaqueta5.jpeg', 'img/hombre/chaqueta5.1.jpeg'],
    descripcion: 'Chaqueta negra con paneles rojos y blancos, estilo urbano.'
  },
  {
    id: 'chaqueta12',
    nombre: 'Chaqueta Líneas Plateadas',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 27990,
    imagen: 'img/hombre/chaqueta6.jpeg',
    imagenes: ['img/hombre/chaqueta6.jpeg', 'img/hombre/chaqueta6.1.jpeg'],
    descripcion: 'Chaqueta negra con líneas plateadas y logo "P" en el pecho.'
  },
  {
    id: 'chaqueta13',
    nombre: 'Chaqueta Ángel Negro',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 29990,
    imagen: 'img/hombre/chaqueta7.jpeg',
    imagenes: ['img/hombre/chaqueta7.jpeg', 'img/hombre/chaqueta7.1.jpeg', 'img/hombre/chaqueta7.2.jpeg'],
    descripcion: 'Chaqueta negra con estampado de ángel y detalles góticos en las mangas.'
  },
  {
    id: 'chaqueta14',
    nombre: 'Chaqueta Beige con Capucha',
    categoria: 'chaquetas',
    genero: 'hombre',
    precio: 28990,
    imagen: 'img/hombre/chaqueta8.jpeg',
    imagenes: ['img/hombre/chaqueta8.jpeg'],
    descripcion: 'Chaqueta beige con capucha y múltiples bolsillos, estilo utilitario.'
  },

    //  PANTALONES 
  {
    id: 'pantalon6',
    nombre: 'Pantalón Vaquero Oscuro',
    categoria: 'pantalones',
    genero: 'hombre',
    precio: 19990,
    imagen: 'img/hombre/pantalon1.jpeg',
    imagenes: ['img/hombre/pantalon1.jpeg'],
    descripcion: 'Pantalón vaquero oscuro de corte recto, un básico para cualquier look.'
  },
  {
    id: 'pantalon7',
    nombre: 'Pantalón Vaquero Azul',
    categoria: 'pantalones',
    genero: 'hombre',
    precio: 19990,
    imagen: 'img/hombre/pantalon2.jpeg',
    imagenes: ['img/hombre/pantalon2.jpeg'],
    descripcion: 'Pantalón vaquero azul de tiro medio y pierna ancha.'
  },
  {
    id: 'pantalon8',
    nombre: 'Pantalón Vaquero Marrón',
    categoria: 'pantalones',
    genero: 'hombre',
    precio: 20990,
    imagen: 'img/hombre/pantalon3.jpeg',
    imagenes: ['img/hombre/pantalon3.jpeg'],
    descripcion: 'Pantalón vaquero marrón oscuro, ideal para outfits de tonos tierra.'
  },

    //  POLERAS 
  {
    id: 'polera8',
    nombre: 'Polera World Hero',
    categoria: 'poleras',
    genero: 'hombre',
    precio: 14990,
    imagen: 'img/hombre/polera1.jpeg',
    imagenes: ['img/hombre/polera1.jpeg', 'img/hombre/polera1.1.jpeg'],
    descripcion: 'Polera negra con estampado de la Estatua de la Libertad y texto "World Hero" en rojo y blanco.'
  },
  {
    id: 'polera9',
    nombre: 'Polera Cruz Gótica',
    categoria: 'poleras',
    genero: 'hombre',
    precio: 13990,
    imagen: 'img/hombre/polera2.jpeg',
    imagenes: ['img/hombre/polera2.jpeg', 'img/hombre/polera2.1.jpeg', 'img/hombre/polera2.2.jpeg'],
    descripcion: 'Polera manga larga blanca con mangas negras y texto gótico en los brazos.'
  },
  {
    id: 'polera10',
    nombre: 'Polera Calavera Morada',
    categoria: 'poleras',
    genero: 'hombre',
    precio: 14990,
    imagen: 'img/hombre/polera3.jpeg',
    imagenes: ['img/hombre/polera3.jpeg', 'img/hombre/polera3.1.jpeg', 'img/hombre/polera3.2.jpeg'],
    descripcion: 'Polera negra con estampado de calavera, alas y detalles en morado, estilo rockero.'
  },
  {
    id: 'polera11',
    nombre: 'Polera Los Ángeles',
    categoria: 'poleras',
    genero: 'hombre',
    precio: 14990,
    imagen: 'img/hombre/polera4.jpeg',
    imagenes: ['img/hombre/polera4.jpeg', 'img/hombre/polera4.1.jpeg'],
    descripcion: 'Polera oversize gris con estampado de la Estatua de la Libertad y tipografía "Los Ángeles".'
  },
  {
    id: 'polera12',
    nombre: 'Polera Ángel PAUTROS',
    categoria: 'poleras',
    genero: 'hombre',
    precio: 15990,
    imagen: 'img/hombre/polera5.jpeg',
    imagenes: ['img/hombre/polera5.jpeg', 'img/hombre/polera5.1.jpeg'],
    descripcion: 'Polera negra con ángel y texto "PAUTROS", un diseño llamativo y urbano.'
  },
  {
    id: 'polera13',
    nombre: 'Polera Alas Góticas',
    categoria: 'poleras',
    genero: 'hombre',
    precio: 14990,
    imagen: 'img/hombre/polera6.jpeg',
    imagenes: ['img/hombre/polera6.jpeg', 'img/hombre/polera6.1.jpeg'],
    descripcion: 'Polera negra con alas blancas y detalles góticos en el pecho.'
  },
  {
    id: 'polera14',
    nombre: 'Polera Labios con Cruces',
    categoria: 'poleras',
    genero: 'hombre',
    precio: 13990,
    imagen: 'img/hombre/polera7.jpeg',
    imagenes: ['img/hombre/polera7.jpeg', 'img/hombre/polera7.1.jpeg'],
    descripcion: 'Polera blanca con estampado de labios y cruces en tonos oscuros.'
  },

    //  POLERONES 
  {
    id: 'poleron5',
    nombre: 'Sudadera Gris Oscura',
    categoria: 'polerones',
    genero: 'hombre',
    precio: 19990,
    imagen: 'img/hombre/poleron1.jpeg',
    imagenes: ['img/hombre/poleron1.jpeg', 'img/hombre/poleron1.1.jpeg'],
    descripcion: 'Sudadera con capucha en gris oscuro, estilo básico y cómodo.'
  },
  {
    id: 'poleron6',
    nombre: 'Sudadera Gris Clara',
    categoria: 'polerones',
    genero: 'hombre',
    precio: 19990,
    imagen: 'img/hombre/poleron2.jpeg',
    imagenes: ['img/hombre/poleron2.jpeg'],
    descripcion: 'Sudadera con capucha en gris claro, un básico versátil.'
  },
  {
    id: 'poleron7',
    nombre: 'Sudadera Verde',
    categoria: 'polerones',
    genero: 'hombre',
    precio: 18990,
    imagen: 'img/hombre/poleron3.jpeg',
    imagenes: ['img/hombre/poleron3.jpeg', 'img/hombre/poleron3.1.jpeg'],
    descripcion: 'Sudadera con capucha en tono verde suave.'
  },
  {
    id: 'poleron8',
    nombre: 'Sudadera Ángel Negra',
    categoria: 'polerones',
    genero: 'hombre',
    precio: 21990,
    imagen: 'img/hombre/poleron5.jpeg',
    imagenes: ['img/hombre/poleron5.jpeg', 'img/hombre/poleron5.1.jpeg'],
    descripcion: 'Sudadera negra con estampado de ángel en el pecho y mangas decoradas.'
  },
  {
    id: 'poleron9',
    nombre: 'Sudadera Tribal Negra',
    categoria: 'polerones',
    genero: 'hombre',
    precio: 21990,
    imagen: 'img/hombre/poleron6.jpeg',
    imagenes: ['img/hombre/poleron6.jpeg', 'img/hombre/poleron6.1.jpeg'],
    descripcion: 'Sudadera negra con diseño tribal en las mangas y espalda.'
  },

    // ---------- SHORTS ----------
  {
    id: 'short5',
    nombre: 'Short de Pana Morado',
    categoria: 'shorts',
    genero: 'hombre',
    precio: 14990,
    imagen: 'img/hombre/short1.jpeg',
    imagenes: ['img/hombre/short1.jpeg', 'img/hombre/short1.1.jpeg'],
    descripcion: 'Short de pana en tono morado, estilo casual y cómodo.'
  },

    //  CALZADO 
  {
    id: 'calzado6',
    nombre: 'Zapatillas Puma Negras',
    categoria: 'calzado',
    genero: 'hombre',
    precio: 34990,
    imagen: 'img/hombre/zapatilla1.jpeg',
    imagenes: ['img/hombre/zapatilla1.jpeg'],
    descripcion: 'Zapatillas Puma negras con detalles blancos, estilo clásico.'
  },
  {
    id: 'calzado7',
    nombre: 'Zapatillas Adidas Negras',
    categoria: 'calzado',
    genero: 'hombre',
    precio: 32990,
    imagen: 'img/hombre/zapatilla2.jpeg',
    imagenes: ['img/hombre/zapatilla2.jpeg'],
    descripcion: 'Zapatillas Adidas negras con tres franjas blancas, un clásico urbano.'
  },
  {
    id: 'calzado8',
    nombre: 'Zapatillas Nike Air Force Blancas',
    categoria: 'calzado',
    genero: 'hombre',
    precio: 39990,
    imagen: 'img/hombre/zapatilla3.jpeg',
    imagenes: ['img/hombre/zapatilla3.jpeg'],
    descripcion: 'Zapatillas Nike Air Force blancas con swoosh negro, estilo atemporal.'
  },
  {
    id: 'calzado9',
    nombre: 'Zapatillas Jordan Rojas',
    categoria: 'calzado',
    genero: 'hombre',
    precio: 45990,
    imagen: 'img/hombre/zapatilla4.jpeg',
    imagenes: ['img/hombre/zapatilla4.jpeg'],
    descripcion: 'Zapatillas Jordan rojas y verdes con detalles blancos, edición especial.'
  },
  {
    id: 'calzado10',
    nombre: 'Zapatillas Nike Air Force Marrones',
    categoria: 'calzado',
    genero: 'hombre',
    precio: 39990,
    imagen: 'img/hombre/zapatilla5.jpeg',
    imagenes: ['img/hombre/zapatilla5.jpeg'],
    descripcion: 'Zapatillas Nike Air Force marrones con suela negra, estilo premium.'
  }
];