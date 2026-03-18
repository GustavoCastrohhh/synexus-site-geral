/**
 * clients.js
 * Inicializa o carousel de clientes com Swiper, injetando os slides via JS.
 */

(function () {
  var clients = [
    {
      name: "Cristais de Gramado",
      type: "Comércio",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_cristais_de_gramado.webp",
      bg: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/18/56/fb/showroom-com-mais-de.jpg?w=1200&h=900&s=1",
    },
    {
      name: "Dauper",
      type: "Indústria",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_dauper.webp",
      bg: "https://static.wixstatic.com/media/8f46fe_d0b3084cb3a942338bcff46521137ad5~mv2.jpg/v1/fill/w_1200,h_627,al_c,q_85,enc_auto/8f46fe_d0b3084cb3a942338bcff46521137ad5~mv2.jpg",
    },
    {
      name: "Exceed Park",
      type: "Parques",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_exceed.webp",
      bg: "https://exceedpark.com.br/wp-content/uploads/2025/02/fachada-parque-exceed-gramado.jpg",
    },
    {
      name: "Nicolly Almeida Store",
      type: "Comércio",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_nicolly_almeida_store.webp",
      bg: "",
    },
    {
      name: "Farmácia Bem Estar",
      type: "Comércio",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_farmacia_bem_estar.webp",
      bg: "",
    },
    {
      name: "Paranhana Automecanica",
      type: "Serviço",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_paranhana_automecanica.webp",
      bg: "",
    },
    {
      name: "Saná Cure Estética e Tratamentos",
      type: "Serviço",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_sana_cure.webp",
      bg: "",
    },
    {
      name: "G.V. Sports Academia",
      type: "Serviço",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_gv_sports.webp",
      bg: "",
    },
    {
      name: "Locadora Locamais",
      type: "Serviço",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_loca_mais.webp",
      bg: "",
    },
    {
      name: "Águia Branca Turismo",
      type: "Serviço",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_aguia_branca_turismo.webp",
      bg: "",
    },
    {
      name: "Águia Tour",
      type: "Serviço",
      logo: "https://d2v5dzlf3dactd.cloudfront.net/clientlogo_aguia_tour.webp",
      bg: "",
    },
    { name: "Studio Vêneto", type: "Indústria", logo: "", bg: "" },
    { name: "Fruteira Helena", type: "Comércio", logo: "", bg: "" },
    { name: "Marlon Santos Representações", type: "Serviço", logo: "", bg: "" },
    { name: "GPS Construções", type: "Serviço", logo: "", bg: "" },
    { name: "Facilita Log", type: "Serviço", logo: "", bg: "" },
    { name: "Construtora Abel Wolf", type: "Serviço", logo: "", bg: "" },
    { name: "CDG Participações", type: "Holding", logo: "", bg: "" },
    { name: "Parque das Águas", type: "Parques", logo: "", bg: "" },
  ];

  var wrapper = document.getElementById("clientesSwiperWrapper");

  clients.forEach(function (c) {
    var slide = document.createElement("div");
    slide.className = "swiper-slide";

    var bgHtml = c.bg
      ? '<div class="cl-card-bg" style="background-image:url(\'' +
        c.bg +
        "');\"></div>"
      : '<div class="cl-card-bg-fallback"></div>';

    var badgeClass = c.logo ? "cl-badge" : "cl-badge cl-badge--no-img";
    var badgeContent = c.logo
      ? '<img src="' + c.logo + '" alt="' + c.name + ' Logo" />'
      : '<span class="cl-badge-initials">' +
        c.name.substring(0, 2).toUpperCase() +
        "</span>";

    slide.innerHTML =
      bgHtml +
      '<div class="cl-card-overlay"></div>' +
      '<div class="' +
      badgeClass +
      '">' +
      badgeContent +
      "</div>" +
      '<div class="cl-card-text">' +
      "<h3>" +
      c.name +
      "</h3>" +
      "<p>" +
      c.type +
      "</p>" +
      "</div>";

    wrapper.appendChild(slide);
  });

  new Swiper(".clientes-swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    initialSlide: 0,
    loop: true,
    speed: 600,
    coverflowEffect: {
      rotate: 0,
      stretch: -40,
      depth: 120,
      modifier: 1,
      slideShadows: false,
    },
    navigation: {
      nextEl: "#clientesNext",
      prevEl: "#clientesPrev",
    },
  });
})();
