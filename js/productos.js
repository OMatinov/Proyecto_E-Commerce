// productos.js - Arreglo central de productos
// Autor: Matías

const productos = [
  // ============================================================
  // 1. ABRIGOS (Mujer)
  // ============================================================
  {
    id: 'abrigo1',
    nombre: 'Abrigo Classic Camel',
    precio: 18990,
    categoria: 'abrigos',
    genero: 'mujer',
    imagen: 'img/abrigo1.png',
    imagenes: ['img/abrigo1.png'],
    descripcion: 'Abrigo largo color camel de corte recto y solapas clásicas, ideal para looks urbanos elegantes y para usar sobre vestidos o jeans.'
  },
  {
    id: 'abrigo2',
    nombre: 'Blazer Coat City Café',
    precio: 16990,
    categoria: 'abrigos',
    genero: 'mujer',
    imagen: 'img/abrigo2.png',
    imagenes: ['img/abrigo2.png', 'img/abrigo2-1.png', 'img/abrigo2-2.png', 'img/abrigo2-3.png'],
    descripcion: 'Abrigo tipo blazer en tono café, de silueta relajada y botones frontales, perfecto para la oficina o para elevar un outfit casual.'
  },
  {
    id: 'abrigo3',
    nombre: 'Cardigan Urbano Arena',
    precio: 14990,
    categoria: 'abrigos',
    genero: 'mujer',
    imagen: 'img/abrigo3.png',
    imagenes: ['img/abrigo3.png', 'img/abrigo3-1.png', 'img/abrigo3-2.png', 'img/abrigo3-3.png'],
    descripcion: 'Cárdigan corto en tono arena con bolsillos frontales, tejido suave y liviano para usar en capas durante la transición de temporada.'
  },

  // ============================================================
  // 2. ACCESORIOS (Mujer)
  // ============================================================
  {
    id: 'accesorio1',
    nombre: 'Pinza Azul Pastel',
    precio: 2990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio1.png',
    imagenes: ['img/accesorio1.png'],
    descripcion: 'Pinza para el pelo en tono azul pastel, ideal para recogidos rápidos y para sumar un toque de color suave al look.'
  },
  {
    id: 'accesorio2',
    nombre: 'Pinza Black Matte',
    precio: 2990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio2.png',
    imagenes: ['img/accesorio2.png'],
    descripcion: 'Pinza negra para el pelo, de acabado mate y agarre firme, perfecta para peinados diarios.'
  },
  {
    id: 'accesorio3',
    nombre: 'Pinza Carey Clásica',
    precio: 2990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio3.png',
    imagenes: ['img/accesorio3.png'],
    descripcion: 'Pinza en acabado carey, resistente y cómoda, pensada para recogidos elegantes y casuales.'
  },
  {
    id: 'accesorio4',
    nombre: 'Collar Charm Multicolor',
    precio: 8990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio4.png',
    imagenes: ['img/accesorio4.png'],
    descripcion: 'Collar dorado de varias capas con charms y piedras de colores, ideal para hacer protagonista cualquier outfit básico.'
  },
  {
    id: 'accesorio5',
    nombre: 'Collar Medallas Astro',
    precio: 6990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio5.png',
    imagenes: ['img/accesorio5.png'],
    descripcion: 'Collar doble con cordón estampado y medallas doradas tipo sol y luna, perfecto para looks boho urbanos.'
  },
  {
    id: 'accesorio6',
    nombre: 'Bolso Macramé Arena',
    precio: 12990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio6.png',
    imagenes: ['img/accesorio6.png'],
    descripcion: 'Bolso tejido tipo macramé en tono arena, liviano y amplio, ideal para verano y fines de semana casuales.'
  },
  {
    id: 'accesorio7',
    nombre: 'Bolso Cuerda Black Gold',
    precio: 13990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio7.png',
    imagenes: ['img/accesorio7.png'],
    descripcion: 'Bolso de cuerda negro con finas líneas doradas, perfecto para la playa o para un look relajado con brillo discreto.'
  },
  {
    id: 'accesorio8',
    nombre: 'Bandolera Minimal Black',
    precio: 11990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio8.png',
    imagenes: ['img/accesorio8.png'],
    descripcion: 'Carterita bandolera negra de diseño minimal, ideal para salir ligera llevando solo lo esencial.'
  },
  {
    id: 'accesorio9',
    nombre: 'Tote Básico Black',
    precio: 15990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio9.png',
    imagenes: ['img/accesorio9.png'],
    descripcion: 'Bolso tote negro grande y estructurado, perfecto para el día a día, trabajo o universidad.'
  },
  {
    id: 'accesorio10',
    nombre: 'Tote Urban Caramel',
    precio: 16990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio10.png',
    imagenes: ['img/accesorio10.png'],
    descripcion: 'Tote en color caramelo, amplio y versátil, combina bien con jeans, vestidos y looks de oficina.'
  },
  {
    id: 'accesorio11',
    nombre: 'Mochila Urban Waterproof',
    precio: 18990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio11.png',
    imagenes: ['img/accesorio11.png', 'img/accesorio11-1.png'],
    descripcion: 'Mochila negra de acabado waterproof con bolsillos frontales, ideal para ciudad y días lluviosos.'
  },
  {
    id: 'accesorio12',
    nombre: 'Cinturón Western Black',
    precio: 9990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio12.png',
    imagenes: ['img/accesorio12.png'],
    descripcion: 'Cinturón negro con hebilla estilo western grabada, suma un toque boho-rockero a vestidos y jeans.'
  },
  {
    id: 'accesorio13',
    nombre: 'Cinturón Aro Silver',
    precio: 8990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio13.png',
    imagenes: ['img/accesorio13.png'],
    descripcion: 'Cinturón negro con hebilla circular plateada, perfecto para marcar la cintura en outfits urbanos.'
  },
  {
    id: 'accesorio14',
    nombre: 'Gorra Dancing Queen',
    precio: 13990,
    categoria: 'accesorios',
    genero: 'mujer',
    imagen: 'img/accesorio14.png',
    imagenes: ['img/accesorio14.png'],
    descripcion: 'Gorra gris desgastada con bordado "DANCING QUEEN", ideal para looks relajados con actitud.'
  },

  // ============================================================
  // 3. CALZADO (Mujer)
  // ============================================================
  {
    id: 'calzado1',
    nombre: 'Zapatillas Classic White',
    precio: 34990,
    categoria: 'calzado',
    genero: 'mujer',
    imagen: 'img/calzado1.png',
    imagenes: ['img/calzado1.png', 'img/calzado1-1.png', 'img/calzado1-2.png'],
    descripcion: 'Zapatillas blancas de plataforma baja y diseño limpio, perfectas para combinar con jeans, vestidos o faldas urbanas.'
  },
  {
    id: 'calzado2',
    nombre: 'Zapatillas Old School Black',
    precio: 32990,
    categoria: 'calzado',
    genero: 'mujer',
    imagen: 'img/calzado2.png',
    imagenes: ['img/calzado2.png', 'img/calzado2-1.png', 'img/calzado2-2.png', 'img/calzado2-3.png'],
    descripcion: 'Zapatillas negras tipo skate con detalles blancos y suela blanca, un clásico urbano para el uso diario.'
  },
  {
    id: 'calzado3',
    nombre: 'Zapatillas Retro Stripe',
    precio: 33990,
    categoria: 'calzado',
    genero: 'mujer',
    imagen: 'img/calzado3.png',
    imagenes: ['img/calzado3.png', 'img/calzado3-1.png', 'img/calzado3-2.png', 'img/calzado3-3.png'],
    descripcion: 'Zapatillas negras con tres franjas blancas y suela color miel, ideales para looks sporty con un aire retro.'
  },
  {
    id: 'calzado4',
    nombre: 'Botas Chunky Black',
    precio: 39990,
    categoria: 'calzado',
    genero: 'mujer',
    imagen: 'img/calzado4.png',
    imagenes: ['img/calzado4.png', 'img/calzado4-1.png', 'img/calzado4-2.png'],
    descripcion: 'Botas negras de caña alta con suela chunky, perfectas para outfits de invierno con actitud, desde vestidos hasta shorts.'
  },
  {
    id: 'calzado5',
    nombre: 'Oxford Chunky Black',
    precio: 36990,
    categoria: 'calzado',
    genero: 'mujer',
    imagen: 'img/calzado5.png',
    imagenes: ['img/calzado5.png', 'img/calzado5-1.png'],
    descripcion: 'Zapatos tipo oxford negros con suela gruesa y costuras contrastantes, ideales para dar un giro alternativo a looks formales o casuales.'
  },

  // ============================================================
  // 4. CHAQUETAS (Mujer)
  // ============================================================
  {
    id: 'chaqueta1',
    nombre: 'Chaqueta Acolchada Grafito',
    precio: 26990,
    categoria: 'chaquetas',
    genero: 'mujer',
    imagen: 'img/chaqueta1.png',
    imagenes: ['img/chaqueta1.png'],
    descripcion: 'Chaqueta corta acolchada en gris grafito con cuello alto y ajuste en la basta, ideal para días fríos con estilo urbano.'
  },
  {
    id: 'chaqueta2',
    nombre: 'Chaqueta Biker Black',
    precio: 31990,
    categoria: 'chaquetas',
    genero: 'mujer',
    imagen: 'img/chaqueta2.png',
    imagenes: ['img/chaqueta2.png', 'img/chaqueta2-1.png'],
    descripcion: 'Chaqueta negra tipo biker con cierre frontal y cuello alzado, perfecta para dar actitud a jeans y vestidos.'
  },
  {
    id: 'chaqueta3',
    nombre: 'Chaqueta Oversize Olive',
    precio: 25990,
    categoria: 'chaquetas',
    genero: 'mujer',
    imagen: 'img/chaqueta3.png',
    imagenes: ['img/chaqueta3.png', 'img/chaqueta3-1.png', 'img/chaqueta3-2.png'],
    descripcion: 'Chaqueta oversize en tono verde oliva con caída suelta, pensada para looks relajados en capas.'
  },
  {
    id: 'chaqueta4',
    nombre: 'Chaqueta Oversize Borgoña',
    precio: 25990,
    categoria: 'chaquetas',
    genero: 'mujer',
    imagen: 'img/chaqueta4.png',
    imagenes: ['img/chaqueta4.png', 'img/chaqueta4-1.png', 'img/chaqueta4-2.png'],
    descripcion: 'Chaqueta oversize en color borgoña, de textura suave y volumen en la basta, ideal para destacar en outfits neutros.'
  },
  {
    id: 'chaqueta5',
    nombre: 'Chaleco Puffer Black',
    precio: 21990,
    categoria: 'chaquetas',
    genero: 'mujer',
    imagen: 'img/chaqueta5.png',
    imagenes: ['img/chaqueta5.png', 'img/chaqueta5-1.png'],
    descripcion: 'Chaleco puffer negro con cuello alto y cierre frontal, perfecto para sumar abrigo sin perder movilidad.'
  },
  {
    id: 'chaqueta6',
    nombre: 'Chaqueta Biker Black II',
    precio: 31990,
    categoria: 'chaquetas',
    genero: 'mujer',
    imagen: 'img/chaqueta6.png',
    imagenes: ['img/chaqueta6.png', 'img/chaqueta6-1.png'],
    descripcion: 'Chaqueta tipo biker negra de efecto cuero con solapas y cierres metálicos, un básico clave para looks nocturnos y urbanos.'
  },

  // ============================================================
  // 5. CONJUNTOS (Mujer)
  // ============================================================
  {
    id: 'conjunto1',
    nombre: 'Set Chochet Cream',
    precio: 26990,
    categoria: 'conjuntos',
    genero: 'mujer',
    imagen: 'img/conjunto1.png',
    imagenes: ['img/conjunto1.png'],
    descripcion: 'Conjunto de top y falda corta en tejido crochet color crema, ideal para looks veraniegos femeninos y ligeros.'
  },
  {
    id: 'conjunto2',
    nombre: 'Set Chochet Black',
    precio: 26990,
    categoria: 'conjuntos',
    genero: 'mujer',
    imagen: 'img/conjunto2.png',
    imagenes: ['img/conjunto2.png'],
    descripcion: 'Conjunto de top y falda corta en crochet negro, perfecto para una versión nocturna del look veraniego clásico.'
  },
  {
    id: 'conjunto3',
    nombre: 'Set Beach Layer',
    precio: 31990,
    categoria: 'conjuntos',
    genero: 'mujer',
    imagen: 'img/conjunto3.png',
    imagenes: ['img/conjunto3.png'],
    descripcion: 'Conjunto tejido de pantalón ancho y chaleco largo abierto en tono crudo, perfecto para usar sobre traje de baño o outfits playeros.'
  },
  {
    id: 'conjunto4',
    nombre: 'Set Knit Wide Leg',
    precio: 28990,
    categoria: 'conjuntos',
    genero: 'mujer',
    imagen: 'img/conjunto4.png',
    imagenes: ['img/conjunto4.png'],
    descripcion: 'Conjunto de top sin mangas y pantalón ancho de punto calado en color crudo, ideal para looks relajados pero pulidos.'
  },

  // ============================================================
  // 6. FALDAS (Mujer)
  // ============================================================
  {
    id: 'falda1',
    nombre: 'Mini Falda Denim Indigo',
    precio: 11990,
    categoria: 'faldas',
    genero: 'mujer',
    imagen: 'img/falda1.png',
    imagenes: ['img/falda1.png', 'img/falda1-1.png'],
    descripcion: 'Mini falda de mezclilla en tono índigo con botón decorativo, un básico urbano para combinar con poleras y sweaters.'
  },
  {
    id: 'falda2',
    nombre: 'Falda Knit Black',
    precio: 9990,
    categoria: 'faldas',
    genero: 'mujer',
    imagen: 'img/falda2.png',
    imagenes: ['img/falda2.png', 'img/falda2-1.png'],
    descripcion: 'Falda de punto negra, corte recto y textura acanalada, ideal para looks cómodos pero pulidos.'
  },
  {
    id: 'falda3',
    nombre: 'Mini Falda Animal Print',
    precio: 12990,
    categoria: 'faldas',
    genero: 'mujer',
    imagen: 'img/falda3.png',
    imagenes: ['img/falda3.png', 'img/falda3-1.png'],
    descripcion: 'Mini falda con estampado animal print, perfecta para outfits nocturnos o para dar protagonismo a un look básico.'
  },
  {
    id: 'falda4',
    nombre: 'Falda Midi Tiered Gris',
    precio: 14990,
    categoria: 'faldas',
    genero: 'mujer',
    imagen: 'img/falda4.png',
    imagenes: ['img/falda4.png', 'img/falda4-1.png'],
    descripcion: 'Falda midi gris de capas con pretina elástica, fluida y cómoda para uso diario.'
  },
  {
    id: 'falda5',
    nombre: 'Mini Falda Wrap Black',
    precio: 10990,
    categoria: 'faldas',
    genero: 'mujer',
    imagen: 'img/falda5.png',
    imagenes: ['img/falda5.png', 'img/falda5-1.png'],
    descripcion: 'Mini falda negra tipo pareo con amarra lateral, ideal para combinar con tops ajustados o camisas oversize.'
  },
  {
    id: 'falda6',
    nombre: 'Falda Wrap Olive Midi',
    precio: 12990,
    categoria: 'faldas',
    genero: 'mujer',
    imagen: 'img/falda6.png',
    imagenes: ['img/falda6.png', 'img/falda6-1.png'],
    descripcion: 'Falda midi cruzada en tono verde oliva con lazo lateral, perfecta para looks frescos y versátiles.'
  },
  {
    id: 'falda7',
    nombre: 'Mini Falda Denim Plisada',
    precio: 11990,
    categoria: 'faldas',
    genero: 'mujer',
    imagen: 'img/falda7.png',
    imagenes: ['img/falda7.png', 'img/falda7-1.png'],
    descripcion: 'Mini falda denim azul con pliegues, estilo colegial urbano para usar con zapatillas o botas.'
  },
  {
    id: 'falda8',
    nombre: 'Falda Crochet Cream',
    precio: 9990,
    categoria: 'faldas',
    genero: 'mujer',
    imagen: 'img/falda8.png',
    imagenes: ['img/falda8.png', 'img/falda8-1.png'],
    descripcion: 'Falda corta de crochet color crema con vuelo en el ruedo, ideal para conjuntos veraniegos o playeros.'
  },

  // ============================================================
  // 7. PANTALONES (Mujer)
  // ============================================================
  {
    id: 'pantalon1',
    nombre: 'Pantalón Knit Cream',
    precio: 16990,
    categoria: 'pantalones',
    genero: 'mujer',
    imagen: 'img/pantalon1.png',
    imagenes: ['img/pantalon1.png', 'img/pantalon1-1.png'],
    descripcion: 'Pantalón tejido color crema de punto calado, pierna ancha y pretina elasticada con amarra, ideal para looks relajados o playeros.'
  },
  {
    id: 'pantalon2',
    nombre: 'Jeans Wide Choco',
    precio: 19990,
    categoria: 'pantalones',
    genero: 'mujer',
    imagen: 'img/pantalon2.png',
    imagenes: ['img/pantalon2.png', 'img/pantalon2-1.png', 'img/pantalon2-2.png', 'img/pantalon2-3.png'],
    descripcion: 'Jeans ancho en color café chocolate con bolsillos delanteros decorativos, perfecto para outfits urbanos en tonos tierra.'
  },
  {
    id: 'pantalon3',
    nombre: 'Jeans Wide Black',
    precio: 21990,
    categoria: 'pantalones',
    genero: 'mujer',
    imagen: 'img/pantalon3.png',
    imagenes: ['img/pantalon3.png', 'img/pantalon3-1.png', 'img/pantalon3-2.png', 'img/pantalon3-3.png'],
    descripcion: 'Jeans negros de tiro medio y pierna ancha, un básico versátil para combinar con poleras, blusas o chaquetas.'
  },
  {
    id: 'pantalon4',
    nombre: 'Jeans Sailor Indigo',
    precio: 23990,
    categoria: 'pantalones',
    genero: 'mujer',
    imagen: 'img/pantalon4.png',
    imagenes: ['img/pantalon4.png', 'img/pantalon4-1.png', 'img/pantalon4-2.png', 'img/pantalon4-3.png'],
    descripcion: 'Jeans azul índigo de pierna recta ancha con bolsillos frontales tipo sailor, ideales para un look retro pero moderno.'
  },
  {
    id: 'pantalon5',
    nombre: 'Jeans Wide Azul Medio',
    precio: 21990,
    categoria: 'pantalones',
    genero: 'mujer',
    imagen: 'img/pantalon5.png',
    imagenes: ['img/pantalon5.png', 'img/pantalon5-1.png'],
    descripcion: 'Jeans azul medio de tiro medio y pierna ancha, pensados para el uso diario con zapatillas o botines.'
  },

  // ============================================================
  // 8. POLERAS (Mujer)
  // ============================================================
  {
    id: 'polera1',
    nombre: 'Top Rib Azul',
    precio: 5990,
    categoria: 'poleras',
    genero: 'mujer',
    imagen: 'img/polera1.png',
    imagenes: ['img/polera1.png', 'img/polera1-1.png'],
    descripcion: 'Top corto acanalado en tono azul marino, de cuello redondo y corte ajustado, ideal para usar con jeans o faldas tiro alto.'
  },
  {
    id: 'polera2',
    nombre: 'Top Rib Verde',
    precio: 5990,
    categoria: 'poleras',
    genero: 'mujer',
    imagen: 'img/polera2.png',
    imagenes: ['img/polera2.png', 'img/polera2-1.png'],
    descripcion: 'Top sin mangas acanalado en verde suave, perfecto para looks frescos de diario o capas bajo chaquetas.'
  },
  {
    id: 'polera3',
    nombre: 'Top Rib Grafito',
    precio: 5990,
    categoria: 'poleras',
    genero: 'mujer',
    imagen: 'img/polera3.png',
    imagenes: ['img/polera3.png', 'img/polera3-1.png'],
    descripcion: 'Top acanalado gris oscuro, de fit ceñido y cuello redondo, un básico versátil para combinar con todo.'
  },
  {
    id: 'polera4',
    nombre: 'Polera Basic Off White',
    precio: 4490,
    categoria: 'poleras',
    genero: 'mujer',
    imagen: 'img/polera4.png',
    imagenes: ['img/polera4.png', 'img/polera4-1.png'],
    descripcion: 'Polera de algodón en tono off white, de manga corta y silueta recta, ideal como básico de fondo de clóset.'
  },
  {
    id: 'polera5',
    nombre: 'Top Crochet Cream',
    precio: 9990,
    categoria: 'poleras',
    genero: 'mujer',
    imagen: 'img/polera5.png',
    imagenes: ['img/polera5.png'],
    descripcion: 'Top de tirantes en crochet color crema con botones frontales, perfecto para noches de verano o para combinar con denim.'
  },
  {
    id: 'polera6',
    nombre: 'Top Crochet Black',
    precio: 9990,
    categoria: 'poleras',
    genero: 'mujer',
    imagen: 'img/polera6.png',
    imagenes: ['img/polera6.png'],
    descripcion: 'Top de tirantes en crochet negro con botones, ideal para noches de verano o para combinar con denim.'
  },
  {
    id: 'polera7',
    nombre: 'Top Halter Black',
    precio: 7490,
    categoria: 'poleras',
    genero: 'mujer',
    imagen: 'img/polera7.png',
    imagenes: ['img/polera7.png', 'img/polera7-2.png'],
    descripcion: 'Top negro tipo halter acanalado, ceñido y minimalista, perfecto para outfits urbanos con pantalones anchos o faldas.'
  },

  // ============================================================
  // 9. POLERONES (Mujer)
  // ============================================================
  {
    id: 'poleron1',
    nombre: 'Polerón NWRK Navy',
    precio: 19990,
    categoria: 'polerones',
    genero: 'mujer',
    imagen: 'img/poleron1.png',
    imagenes: ['img/poleron1.png', 'img/poleron1-1.png', 'img/poleron1-2.png'],
    descripcion: 'Polerón oversize azul marino con estampado frontal "NWRK", de estilo universitario, ideal para looks urbanos y cómodos.'
  },
  {
    id: 'poleron2',
    nombre: 'Polerón Knoxville Grey',
    precio: 18990,
    categoria: 'polerones',
    genero: 'mujer',
    imagen: 'img/poleron2.png',
    imagenes: ['img/poleron2.png', 'img/poleron2-1.png', 'img/poleron2-2.png'],
    descripcion: 'Polerón gris jaspeado con estampado frontal "Knoxville", de corte relajado y cuello redondo, ideal para el día a día.'
  },
  {
    id: 'poleron3',
    nombre: 'Polerón Hoodie Brooklyn Black',
    precio: 21990,
    categoria: 'polerones',
    genero: 'mujer',
    imagen: 'img/poleron3.png',
    imagenes: ['img/poleron3.png', 'img/poleron3-1.png'],
    descripcion: 'Polerón negro con capucha y cierre frontal, estampado "BROOKLYN New York City", perfecto para outfits relajados con jeans o joggers.'
  },
  {
    id: 'poleron4',
    nombre: 'Polerón Hoodie Angel Grey',
    precio: 20990,
    categoria: 'polerones',
    genero: 'mujer',
    imagen: 'img/poleron4.png',
    imagenes: ['img/poleron4.png', 'img/poleron4-1.png'],
    descripcion: 'Buzo gris con capucha y bolsillo canguro, liso por delante y con diseño de alas y texto en la espalda, ideal para un look básico con detalle especial.'
  },

  // ============================================================
  // 10. SHORTS (Mujer)
  // ============================================================
  {
    id: 'short1',
    nombre: 'Short Denim Black Chain',
    precio: 10990,
    categoria: 'shorts',
    genero: 'mujer',
    imagen: 'img/short1.png',
    imagenes: ['img/short1.png', 'img/short1-2.png'],
    descripcion: 'Short de mezclilla negro con cinturón cadena metálica decorativa, ideal para looks nocturnos o urbanos con actitud.'
  },
  {
    id: 'short2',
    nombre: 'Short Denim Doblado Azul',
    precio: 9990,
    categoria: 'shorts',
    genero: 'mujer',
    imagen: 'img/short2.png',
    imagenes: ['img/short2.png', 'img/short2-2.png'],
    descripcion: 'Short de mezclilla azul con ruedo doblado y tiro alto, perfecto para outfits veraniegos con poleras o tops.'
  },
  {
    id: 'short3',
    nombre: 'Short Denim Light',
    precio: 9990,
    categoria: 'shorts',
    genero: 'mujer',
    imagen: 'img/short3.png',
    imagenes: ['img/short3.png', 'img/short3-2.png'],
    descripcion: 'Short de mezclilla azul claro de tiro medio y corte recto, un básico cómodo para el día a día.'
  },
  {
    id: 'short4',
    nombre: 'Short Denim Medio',
    precio: 9990,
    categoria: 'shorts',
    genero: 'mujer',
    imagen: 'img/short4.png',
    imagenes: ['img/short4.png', 'img/short4-2.png'],
    descripcion: 'Short de mezclilla azul medio con fit relajado, ideal para looks casuales con zapatillas.'
  },
  {
    id: 'short5',
    nombre: 'Short Tailored Black',
    precio: 12990,
    categoria: 'shorts',
    genero: 'mujer',
    imagen: 'img/short5.png',
    imagenes: ['img/short5.png'],
    descripcion: 'Short negro tipo sastre de tiro alto con pinzas frontales, perfecto para looks más pulidos con camisas o blusas.'
  },
  {
    id: 'short6',
    nombre: 'Short Tailored Sand',
    precio: 12990,
    categoria: 'shorts',
    genero: 'mujer',
    imagen: 'img/short6.png',
    imagenes: ['img/short6.png'],
    descripcion: 'Short tipo sastre en tono arena con cinturón delgado, ideal para looks elegantes de verano o trabajo.'
  },

  // ============================================================
  // 11. SUÉTERS (Mujer)
  // ============================================================
  {
    id: 'sueter1',
    nombre: 'Suéter Crochet Cream',
    precio: 16990,
    categoria: 'sueters',
    genero: 'mujer',
    imagen: 'img/sueter1.png',
    imagenes: ['img/sueter1.png', 'img/sueter1-1.png', 'img/sueter1-2.png'],
    descripcion: 'Suéter tejido color crema con calado en patrón geométrico, ideal para usar sobre tops básicos y crear capas livianas.'
  },
  {
    id: 'sueter2',
    nombre: 'Chaleco Largo Beach Cream',
    precio: 18990,
    categoria: 'sueters',
    genero: 'mujer',
    imagen: 'img/sueter2.png',
    imagenes: ['img/sueter2.png'],
    descripcion: 'Chaleco largo sin mangas de punto calado color crema, perfecto para looks playeros o para usar sobre vestidos ajustados.'
  },

  // ============================================================
  // 12. VESTIDOS (Mujer)
  // ============================================================
  {
    id: 'vestido1',
    nombre: 'Vestido Bubble Black',
    precio: 21990,
    categoria: 'vestidos',
    genero: 'mujer',
    imagen: 'img/vestido1.png',
    imagenes: ['img/vestido1.png', 'img/vestido1-2.png', 'img/vestido1-3.png'],
    descripcion: 'Vestido negro sin mangas con parte superior ajustada y falda tipo bubble con volumen, ideal para salidas nocturnas.'
  },
  {
    id: 'vestido2',
    nombre: 'Vestido Dark Borgoña Split',
    precio: 24990,
    categoria: 'vestidos',
    genero: 'mujer',
    imagen: 'img/vestido2.png',
    imagenes: ['img/vestido2.png', 'img/vestido2-1.png'],
    descripcion: 'Vestido midi borgoña con tirantes finos y abertura lateral alta, perfecto para looks nocturnos con botines o sandalias.'
  },
  {
    id: 'vestido3',
    nombre: 'Vestido Skater Borgoña',
    precio: 19990,
    categoria: 'vestidos',
    genero: 'mujer',
    imagen: 'img/vestido3.png',
    imagenes: ['img/vestido3.png', 'img/vestido3-1.png', 'img/vestido3-2.png'],
    descripcion: 'Vestido corto en tono borgoña con escote cuadrado y falda skater, femenino y versátil para día o noche.'
  },
  {
    id: 'vestido4',
    nombre: 'Vestido Corduroy Button Black',
    precio: 9990,
    categoria: 'vestidos',
    genero: 'mujer',
    imagen: 'img/vestido4.png',
    imagenes: ['img/vestido4.png', 'img/vestido4-1.png', 'img/vestido4-2.png'],
    descripcion: 'Vestido corto negro de cotelé con botones frontales, perfecto para usar con poleras o suéters debajo.'
  },
  {
    id: 'vestido5',
    nombre: 'Vestido Strapless Choco',
    precio: 9990,
    categoria: 'vestidos',
    genero: 'mujer',
    imagen: 'img/vestido5.png',
    imagenes: ['img/vestido5.png', 'img/vestido5-1.png'],
    descripcion: 'Vestido midi strapless color chocolate con frunce lateral y abertura, ideal para eventos o salidas de noche.'
  },
  {
    id: 'vestido6',
    nombre: 'Vestido Midi Olive Split',
    precio: 9990,
    categoria: 'vestidos',
    genero: 'mujer',
    imagen: 'img/vestido6.png',
    imagenes: ['img/vestido6.png', 'img/vestido6-1.png'],
    descripcion: 'Vestido midi ajustado en tono verde oliva con abertura lateral, perfecto para looks urbanos con bototos.'
  },
  {
    id: 'vestido7',
    nombre: 'Vestido Mesh Ombre Grey',
    precio: 9990,
    categoria: 'vestidos',
    genero: 'mujer',
    imagen: 'img/vestido7.png',
    imagenes: ['img/vestido7.png', 'img/vestido7-1.png'],
    descripcion: 'Vestido midi de tirantes con efecto degradé en tonos grises y falda ligeramente acampanada, ideal para noches especiales.'
  },

  // ============================================================
  // 13. PRODUCTOS DE HOMBRE (Nuevos para cumplir rúbrica)
  // ============================================================
  // Abrigos Hombre
  {
    id: 'abrigo-hombre1',
    nombre: 'Parka Invernal Negra',
    precio: 32990,
    categoria: 'abrigos',
    genero: 'hombre',
    imagen: 'img/hombre/parka-negra.png',
    imagenes: ['img/hombre/parka-negra.png'],
    descripcion: 'Parka larga negra con capucha desmontable y relleno de plumas, ideal para climas fríos.'
  },
  {
    id: 'abrigo-hombre2',
    nombre: 'Trench Clásico Beige',
    precio: 28990,
    categoria: 'abrigos',
    genero: 'hombre',
    imagen: 'img/hombre/trench-beige.png',
    imagenes: ['img/hombre/trench-beige.png'],
    descripcion: 'Trench coat beige de corte clásico, con cinturón y botones dobles, perfecto para looks formales.'
  },
  // Accesorios Hombre
  {
    id: 'accesorio-hombre1',
    nombre: 'Gorra Trucker Negra',
    precio: 12990,
    categoria: 'accesorios',
    genero: 'hombre',
    imagen: 'img/hombre/gorra-trucker.png',
    imagenes: ['img/hombre/gorra-trucker.png'],
    descripcion: 'Gorra tipo trucker negra con malla trasera y ajuste clip, ideal para looks urbanos.'
  },
  {
    id: 'accesorio-hombre2',
    nombre: 'Cinturón Cuero Marrón',
    precio: 15990,
    categoria: 'accesorios',
    genero: 'hombre',
    imagen: 'img/hombre/cinturon-cuero.png',
    imagenes: ['img/hombre/cinturon-cuero.png'],
    descripcion: 'Cinturón de cuero marrón con hebilla metálica, ancho 3.5 cm, perfecto para jeans formales.'
  },
  // Calzado Hombre
  {
    id: 'calzado-hombre1',
    nombre: 'Zapatillas Urban White',
    precio: 39990,
    categoria: 'calzado',
    genero: 'hombre',
    imagen: 'img/hombre/zapatillas-urban.png',
    imagenes: ['img/hombre/zapatillas-urban.png'],
    descripcion: 'Zapatillas blancas de piel sintética con suela de goma, diseño minimalista para el día a día.'
  },
  {
    id: 'calzado-hombre2',
    nombre: 'Botín Chelsea Negro',
    precio: 45990,
    categoria: 'calzado',
    genero: 'hombre',
    imagen: 'img/hombre/botin-chelsea.png',
    imagenes: ['img/hombre/botin-chelsea.png'],
    descripcion: 'Botín Chelsea negro en cuero, con suela de goma y elásticos laterales, elegante y versátil.'
  },
  // Chaquetas Hombre
  {
    id: 'chaqueta-hombre1',
    nombre: 'Chaqueta Denim Oversize',
    precio: 25990,
    categoria: 'chaquetas',
    genero: 'hombre',
    imagen: 'img/hombre/chaqueta-denim.png',
    imagenes: ['img/hombre/chaqueta-denim.png'],
    descripcion: 'Chaqueta de mezclilla oversize en tono azul medio, con cierre metálico y bolsillos frontales.'
  },
  {
    id: 'chaqueta-hombre2',
    nombre: 'Chaqueta Cuero Negro',
    precio: 49990,
    categoria: 'chaquetas',
    genero: 'hombre',
    imagen: 'img/hombre/chaqueta-cuero.png',
    imagenes: ['img/hombre/chaqueta-cuero.png'],
    descripcion: 'Chaqueta de cuero negro con forro interior, cremallera frontal y cuello recto, estilo motoquero.'
  },
  // Conjuntos Hombre
  {
    id: 'conjunto-hombre1',
    nombre: 'Set Deportivo Negro',
    precio: 34990,
    categoria: 'conjuntos',
    genero: 'hombre',
    imagen: 'img/hombre/set-deportivo.png',
    imagenes: ['img/hombre/set-deportivo.png'],
    descripcion: 'Set deportivo compuesto por polera dry-fit y jogger con cierre, ideal para entrenar.'
  },
  // Pantalones Hombre
  {
    id: 'pantalon-hombre1',
    nombre: 'Jeans Recto Azul',
    precio: 25990,
    categoria: 'pantalones',
    genero: 'hombre',
    imagen: 'img/hombre/jeans-recto.png',
    imagenes: ['img/hombre/jeans-recto.png'],
    descripcion: 'Jeans de corte recto en azul índigo, con cinco bolsillos y cierre de botón.'
  },
  {
    id: 'pantalon-hombre2',
    nombre: 'Pantalón Chino Beige',
    precio: 21990,
    categoria: 'pantalones',
    genero: 'hombre',
    imagen: 'img/hombre/chino-beige.png',
    imagenes: ['img/hombre/chino-beige.png'],
    descripcion: 'Pantalón chino beige de tiro medio, con pliegues y bolsillos laterales, versátil para oficina o casual.'
  },
  // Poleras Hombre
  {
    id: 'polera-hombre1',
    nombre: 'Polera Básica Negra',
    precio: 7990,
    categoria: 'poleras',
    genero: 'hombre',
    imagen: 'img/hombre/polera-negra.png',
    imagenes: ['img/hombre/polera-negra.png'],
    descripcion: 'Polera de algodón negro, manga corta y cuello redondo, básico de clóset.'
  },
  {
    id: 'polera-hombre2',
    nombre: 'Polera Estampada Gris',
    precio: 9990,
    categoria: 'poleras',
    genero: 'hombre',
    imagen: 'img/hombre/polera-gris.png',
    imagenes: ['img/hombre/polera-gris.png'],
    descripcion: 'Polera gris con estampado gráfico frontal, estilo streetwear.'
  },
  // Polerones Hombre
  {
    id: 'poleron-hombre1',
    nombre: 'Polerón Hoodie Negro',
    precio: 24990,
    categoria: 'polerones',
    genero: 'hombre',
    imagen: 'img/hombre/poleron-negro.png',
    imagenes: ['img/hombre/poleron-negro.png'],
    descripcion: 'Polerón con capucha y bolsillo canguro, negro, con estampado minimalista en el pecho.'
  },
  {
    id: 'poleron-hombre2',
    nombre: 'Polerón Gris Oversize',
    precio: 22990,
    categoria: 'polerones',
    genero: 'hombre',
    imagen: 'img/hombre/poleron-gris.png',
    imagenes: ['img/hombre/poleron-gris.png'],
    descripcion: 'Polerón gris jaspeado de corte oversize, cuello redondo y puños acanalados.'
  },
  // Shorts Hombre
  {
    id: 'short-hombre1',
    nombre: 'Short Deportivo Negro',
    precio: 14990,
    categoria: 'shorts',
    genero: 'hombre',
    imagen: 'img/hombre/short-deportivo.png',
    imagenes: ['img/hombre/short-deportivo.png'],
    descripcion: 'Short deportivo negro con cierre elástico, ideal para entrenar o descansar.'
  }
];