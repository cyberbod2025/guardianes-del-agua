// En: constants.ts

import { ModuleContent } from './types';

// Define los módulos del viaje del proyecto
export const MODULES: ModuleContent[] = [
  {
    id: 1,
    title: "Misión 1: El ADN del Agua",
    description: "Formaremos nuestro equipo de Guardianes y definiremos las preguntas clave de nuestra investigación.",
    icon: 'TeamIcon',
    content: [
      { id: 'info_m1', type: 'info', text: 'Nuestra Misión: Usar el poder de los números para entender y proponer soluciones al problema del agua en nuestra comunidad.' },
      { id: 'header_equipo', type: 'header', text: 'Sección 1: Constitución del Equipo' },
      { id: 'rol_lider', type: 'text', label: 'Líder/Coordinador(a):', placeholder: 'Nombre del integrante' },
      { id: 'rol_investigador_principal', type: 'text', label: 'Investigador(a) Principal:', placeholder: 'Nombre del integrante' },
      { id: 'rol_investigador_campo', type: 'text', label: 'Investigador(a) de Campo:', placeholder: 'Nombre del integrante' },
      { id: 'rol_disenador', type: 'text', label: 'Diseñador(a)/Arquitecto(a):', placeholder: 'Nombre del integrante' },
      { id: 'rol_comunicador', type: 'text', label: 'Comunicador(a)/Portavoz:', placeholder: 'Nombre del integrante' },
      { id: 'rol_escribano', type: 'text', label: 'Escribano(a)/Secretario(a):', placeholder: 'Nombre del integrante' },
      { id: 'rol_guardian_materiales', type: 'text', label: 'Guardián de Materiales:', placeholder: 'Nombre del integrante' },
      
      { id: 'header_indagacion', type: 'header', text: 'Sección 2: Indagación Inicial (Lluvia de Ideas)' },
      { id: 'observaciones_comunidad', type: 'textarea', label: 'Anoten todos los problemas o hechos relacionados con el agua que conocen o investigaron en su comunidad:', placeholder: 'Ej: La calle se inunda, falta el agua, las pipas cuestan dinero...' },

      { id: 'header_preguntas', type: 'header', text: 'Sección 3: El Puente a las Matemáticas' },
      { id: 'info_preguntas', type: 'info', text: 'Elijan 3 de sus observaciones y transfórmenlas en preguntas que se puedan medir o contar.' },
      { id: 'pregunta_1', type: 'textarea', label: 'Pregunta de Investigación 1:', placeholder: 'Ej: ¿Cuántos litros de agua se acumulan por metro cuadrado?' },
      { id: 'pregunta_2', type: 'textarea', label: 'Pregunta de Investigación 2:', placeholder: 'Ej: ¿Cuál es el costo promedio de una pipa para una familia?' },
      { id: 'pregunta_3', type: 'textarea', label: 'Pregunta de Investigación 3:', placeholder: 'Escriban su tercera pregunta medible' },
    ],
  },
  {
    id: 2,
    title: "Misión 2: Diseñando Nuestro Plan de Ataque",
    description: "Crearemos un plan detallado para investigar nuestra pregunta y recolectar los datos necesarios.",
    icon: 'PlanIcon',
    content: [
      { id: 'header_pregunta_investigacion', type: 'header', text: 'Sección 1: Nuestra Pregunta de Investigación' },
      { id: 'pregunta_elegida_m1', type: 'textarea', label: 'Transcriban aquí la pregunta que eligieron de la Misión 1:', placeholder: 'Copien la pregunta seleccionada por el equipo.' },
      { id: 'pregunta_refinada', type: 'textarea', label: 'Ahora, háganla MÁS específica y medible (¿Qué van a medir o contar EXACTAMENTE?):', placeholder: 'Ej: ¿Cuántos litros de agua se estancan y qué área en m² cubre el charco?' },

      { id: 'header_plan_accion', type: 'header', text: 'Sección 2: El Plan de Acción' },
      { id: 'info_plan_accion', type: 'info', text: 'Definan las acciones, materiales y responsables para su investigación.' },
      // Acción 1
      { id: 'accion_1', type: 'text', label: 'Acción 1 - ¿Qué haremos?', placeholder: 'Ej: Medir el área del charco.' },
      { id: 'materiales_1', type: 'text', label: 'Acción 1 - ¿Qué materiales usaremos?', placeholder: 'Ej: Cinta métrica, gis.' },
      { id: 'rol_1', type: 'text', label: 'Acción 1 - ¿Rol principal responsable?', placeholder: 'Ej: Diseñador/Arquitecto.' },
      { id: 'tiempo_1', type: 'text', label: 'Acción 1 - ¿Tiempo estimado?', placeholder: 'Ej: 15 min.' },
      { id: 'indicador_1', type: 'text', label: 'Acción 1 - ¿Cómo sabremos que lo logramos? (Indicador)', placeholder: 'Ej: Tener las medidas en metros anotadas.' },
      // Acción 2
      { id: 'accion_2', type: 'text', label: 'Acción 2 - ¿Qué haremos?', placeholder: 'Ej: Recolectar muestras para medir profundidad.' },
      { id: 'materiales_2', type: 'text', label: 'Acción 2 - ¿Qué materiales usaremos?', placeholder: 'Ej: 3 vasos de plástico, regla.' },
      { id: 'rol_2', type: 'text', label: 'Acción 2 - ¿Rol principal responsable?', placeholder: 'Ej: Investigador de Campo.' },
      { id: 'tiempo_2', type: 'text', label: 'Acción 2 - ¿Tiempo estimado?', placeholder: 'Ej: 10 min.' },
      { id: 'indicador_2', type: 'text', label: 'Acción 2 - ¿Cómo sabremos que lo logramos? (Indicador)', placeholder: 'Ej: Tener 3 mediciones de profundidad en cm.' },

      { id: 'header_matematicas', type: 'header', text: 'Sección 3: Las Matemáticas' },
      { id: 'herramientas_matematicas', type: 'checkbox', label: 'Marquen las herramientas matemáticas que van a utilizar:', options: ['Conteos', 'Promedios', 'Mediciones', 'Porcentajes', 'Op. Básicas', 'Tablas/Gráficas'] },

      { id: 'header_comunicacion', type: 'header', text: 'Sección 4: Comunicando Descubrimientos' },
      { id: 'info_maqueta', type: 'info', text: 'Recuerden que la Maqueta del experimento o solución es obligatoria.' },
      { id: 'metodo_comunicacion', type: 'radio', label: 'Elijan cómo van a comunicar los hallazgos de su maqueta:', options: ['Infografía', 'Video corto', 'Presentación', 'Exposición'] },
      
      { id: 'header_valores', type: 'header', text: 'Sección 5: Valores en Acción' },
      { id: 'valor_equipo', type: 'select', label: 'Como equipo, elijan el valor más importante que necesitarán para esta misión:', options: ['Paciencia', 'Comunicación', 'Respeto', 'Colaboración', 'Creatividad'] },
    ],
  },
  {
    id: 3,
    title: "Misión 3: Laboratorio de Hidráulica Urbana",
    description: "¡Manos a la obra! Es hora de construir, experimentar y recolectar datos con tu propia maqueta.",
    icon: 'ExperimentIcon',
    content: [
      { id: 'info_m3_intro', type: 'info', text: 'En esta fase, pasarán de la planificación a la acción. Construirán sus modelos y los pondrán a prueba para generar sus propios datos.' },
      
      { id: 'header_diseno', type: 'header', text: 'Momento 1: Diseño y Cálculo (La Mesa del Arquitecto)' },
      { id: 'boceto_maqueta', type: 'file', label: 'Diseño del Boceto: Tomen una foto clara del boceto detallado de su maqueta que hicieron en su bitácora y súbanla aquí.' },
      { id: 'calculos_previos', type: 'textarea', label: 'Cálculos y Dimensiones: Anoten aquí los cálculos de área y volumen que realizaron para planificar las dimensiones de su maqueta.', placeholder: 'Ej: Calle: 50cm largo x 20cm ancho. Área total: 1000 cm². Volumen de agua a usar: 500 ml...' },
      { id: 'variables_medir', type: 'textarea', label: 'Variables a Medir (para 2º Grado): Definan las variables que medirán para su modelo de función lineal.', placeholder: 'Ej: Mediremos la altura del agua (en cm) cada 10 segundos.' },
  
      { id: 'header_construccion', type: 'header', text: 'Momento 2: Construcción (Manos a la Obra)' },
      { id: 'materiales_utilizados', type: 'textarea', label: 'Materiales: Hagan una lista de los materiales (principalmente reciclados) que utilizaron para construir su maqueta.' },
      { id: 'foto_maqueta_final', type: 'file', label: 'Maqueta Terminada: Suban una o varias fotos de su maqueta ya construida.' },
  
      { id: 'header_simulacion', type: 'header', text: 'Momento 3: La Simulación (El Día de la Inundación)' },
      { id: 'info_error_inteligente', type: 'info', text: '¡Recuerden, Guardianes! Si la maqueta tiene fugas o algo no sale como esperaban, ¡no es un fracaso, es un dato! Anoten todo. El objetivo no es la maqueta perfecta, es el aprendizaje.' },
      { id: 'cantidad_agua_simulacion', type: 'text', label: 'Cantidad de Agua: Registren la cantidad controlada de agua que verterán sobre la maqueta.', placeholder: 'Ej: 1.5 litros' },
      { id: 'registro_resultados', type: 'textarea', label: 'Registro de Resultados: Describan sistemáticamente lo que observaron y midieron durante la simulación.', placeholder: 'Ej: Prueba 1: El agua tardó 45 segundos en drenar. Se estancó en la esquina inferior. Profundidad máxima: 2 cm...' },
      { id: 'foto_video_simulacion', type: 'file', label: 'Evidencia de la Simulación: Suban una foto o un video corto (máximo 1 minuto) del experimento en acción.' },
      { id: 'conclusiones_experimento', type: 'textarea', label: 'Conclusiones del Experimento: ¿Qué aprendieron de la simulación? ¿Qué funcionó y qué no? ¿Qué mejoras harían?' },
    ],
  },
];