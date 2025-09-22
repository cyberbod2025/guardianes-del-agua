
import type { ModuleContent } from './types';
import { BeakerIcon, ChatBubbleLeftRightIcon, LightBulbIcon, PencilSquareIcon, PresentationChartBarIcon } from './components/Icons';

export const MODULES: ModuleContent[] = [
  {
    id: 1,
    title: "Módulo 1: La Pregunta",
    icon: LightBulbIcon,
    description: "Transforma una observación de tu entorno en una pregunta medible y científicamente investigable.",
    mentorPrompts: [
      "¡Hola, equipo! Soy Mentor Aqua. He oído que han estado observando cómo las lluvias fuertes afectan su colonia. ¡Ese es un excelente primer paso de un científico!",
      "Para empezar nuestra misión, describan: ¿qué es lo MÁS problemático que han visto durante o después de una lluvia intensa? Sean específicos.",
      "Esa es una observación muy importante. Ahora, pensemos como ingenieros. ¿Cómo podríamos convertir esa observación en una pregunta que podamos medir o probar? Por ejemplo, en lugar de 'se inunda mucho', podríamos preguntar '¿Cuántos centímetros sube el agua en la calle X durante una lluvia de 30 minutos?'. ¿Qué pregunta se les ocurre a ustedes?",
    ],
    tasks: [
      { id: 'observation', label: 'Nuestra observación principal:', type: 'textarea', placeholder: 'Ej: El agua se estanca en la esquina de la cancha y tarda mucho en irse.' },
      { id: 'question', label: 'Nuestra pregunta de investigación (¡recuerden que sea medible!):', type: 'textarea', placeholder: 'Ej: ¿Cuánto tiempo tarda en drenarse un charco de 5 metros de diámetro en la esquina de la cancha?' },
    ],
  },
  {
    id: 2,
    title: "Módulo 2: El Plan",
    icon: PencilSquareIcon,
    description: "Desglosa tu pregunta en un plan de acción concreto con acciones, materiales y roles para tu equipo.",
    mentorPrompts: [
      "¡Excelente pregunta! Un buen plan es la clave del éxito. Ahora, vamos a trazar nuestro mapa para encontrar la respuesta.",
      "¿Qué acciones específicas necesitan realizar para contestar su pregunta? Piensen paso a paso, desde la construcción hasta la medición.",
      "¿Qué materiales necesitarán para construir su modelo o experimento? Miren a su alrededor, ¡la creatividad es clave! No todo tiene que ser comprado.",
      "Un gran equipo se organiza. ¿Qué roles tendrá cada integrante? Por ejemplo: 'Constructor/a Principal', 'Jefe/a de Mediciones', 'Documentador/a Visual'."
    ],
    tasks: [
      { id: 'actions', label: 'Plan de Acción (paso a paso):', type: 'textarea', placeholder: '1. Construir una maqueta de la cancha. 2. Simular lluvia con una regadera. 3. Medir el tiempo de drenado...' },
      { id: 'materials', label: 'Lista de Materiales:', type: 'textarea', placeholder: 'Cartón, botellas de plástico, tierra, pegamento, cronómetro, regla...' },
      { id: 'roles', label: 'Roles del Equipo:', type: 'textarea', placeholder: 'Ana: Constructora. Luis: Medidor. Sofía: Fotógrafa y apuntes.' },
    ],
  },
  {
    id: 3,
    title: "Módulo 3: La Investigación",
    icon: BeakerIcon,
    description: "Busca información para conectar tu problema local con el sistema a gran escala y crea un boceto de tu prototipo.",
    mentorPrompts: [
      "¡Ese plan se ve sólido! Antes de construir, los mejores ingenieros investigan. ¿Por qué creen que ocurre el problema que observaron?",
      "Su problema local es parte de un sistema más grande. Investiguen un poco: ¿Cómo funciona el sistema de drenaje en la Ciudad de México? ¿Qué desafíos enfrenta?",
      "Ahora, con esas ideas en mente, ¡es hora de diseñar! Hagan un boceto o dibujo de la maqueta o prototipo que construirán. No tiene que ser perfecto, solo claro. Describan las partes principales."
    ],
    tasks: [
      { id: 'research', label: 'Resumen de nuestra investigación:', type: 'textarea', placeholder: 'Descubrimos que el drenaje de la ciudad es muy antiguo y a veces se tapa con basura, lo que causa las inundaciones en nuestra colonia...' },
      { id: 'sketch', label: 'Descripción de nuestro boceto/prototipo:', type: 'file-description', placeholder: 'Nuestra maqueta mostrará una réplica de la cancha con coladeras. Usaremos una botella con agujeros para simular la lluvia y veremos cómo se acumula el agua...' },
    ],
  },
  {
    id: 4,
    title: "Módulo 4: El Experimento",
    icon: PresentationChartBarIcon,
    description: "Registra sistemáticamente los datos numéricos de las pruebas con tu maqueta. ¡La acción se convierte en evidencia!",
    mentorPrompts: [
      "¡Manos a la obra! Es el momento de construir y probar. Recuerden, los errores son oportunidades para aprender.",
      "Al hacer sus pruebas, ¿qué van a medir exactamente? (Ej: centímetros de agua, segundos en drenar, etc.) ¿Y cómo lo van a medir?",
      "¡Registren todo! Creen una tabla simple para anotar sus mediciones. La organización es clave para encontrar patrones. Anoten también cualquier observación inesperada."
    ],
    tasks: [
      { id: 'data', label: 'Registro de Datos (pueden hacer una tabla):', type: 'textarea', placeholder: 'Prueba 1: Lluvia ligera (1 litro/min) - Nivel de agua: 2cm - Tiempo de drenaje: 50 seg. \nPrueba 2: Lluvia fuerte (3 litros/min) - Nivel de agua: 6cm - Tiempo de drenaje: 180 seg.' },
      { id: 'observations', label: 'Observaciones Adicionales:', type: 'textarea', placeholder: 'Notamos que si la basura tapa una coladera, el tiempo de drenaje aumenta al doble...' },
    ],
  },
  {
    id: 5,
    title: "Módulo 5: La Comunicación",
    icon: ChatBubbleLeftRightIcon,
    description: "Analiza tus datos y crea un producto comunicativo final para presentar tus conclusiones basadas en evidencia.",
    mentorPrompts: [
      "¡Felicidades, Guardianes del Agua! Han recolectado evidencia valiosa. Miren sus datos. ¿Qué historia cuentan? ¿Responden a su pregunta inicial del Módulo 1?",
      "¿Cuál es la conclusión principal de su proyecto? ¿Qué aprendieron?",
      "El conocimiento se comparte. ¿Cómo pueden presentar sus hallazgos de una forma clara y poderosa? Podría ser una infografía, un video corto, una presentación. ¡Sean creativos!",
      "Esbocen su plan para comunicar. ¿Qué mensaje principal quieren transmitir? ¿Qué gráficos o imágenes usarán?"
    ],
    tasks: [
      { id: 'conclusion', label: 'Nuestra Conclusión Principal:', type: 'textarea', placeholder: 'Nuestros datos muestran que la acumulación de basura en las coladeras aumenta drásticamente el tiempo de drenaje, causando inundaciones con lluvias fuertes...' },
      { id: 'communication_plan', label: 'Plan de Comunicación:', type: 'textarea', placeholder: 'Haremos una infografía con fotos de nuestro experimento. Mostraremos un gráfico de barras comparando los tiempos de drenaje con y sin basura. La propondremos para el periódico mural de la escuela.' },
    ],
  },
];
