// En: constants.ts

import { ModuleContent } from './types';

// Define los modulos del viaje del proyecto
export const MODULES: ModuleContent[] = [
  {
    id: 1,
    title: "Mision 1: El ADN del Agua",
    description: "Formaremos nuestro equipo de Guardianes y definiremos las preguntas clave de nuestra investigacion.",
    icon: 'TeamIcon',
    content: [
      { id: 'info_m1', type: 'info', text: 'Nuestra Mision: Usar el poder de los numeros para entender y proponer soluciones al problema del agua en nuestra comunidad.' },
      { id: 'header_equipo', type: 'header', text: 'Seccion 1: Constitucion del Equipo' },
      { id: 'rol_lider', type: 'text', label: 'Lider/Coordinador(a):', placeholder: 'Nombre del integrante' },
      { id: 'rol_investigador_principal', type: 'text', label: 'Investigador(a) Principal:', placeholder: 'Nombre del integrante' },
      { id: 'rol_investigador_campo', type: 'text', label: 'Investigador(a) de Campo:', placeholder: 'Nombre del integrante' },
      { id: 'rol_disenador', type: 'text', label: 'Disenador(a)/Arquitecto(a):', placeholder: 'Nombre del integrante' },
      { id: 'rol_comunicador', type: 'text', label: 'Comunicador(a)/Portavoz:', placeholder: 'Nombre del integrante' },
      { id: 'rol_escribano', type: 'text', label: 'Escribano(a)/Secretario(a):', placeholder: 'Nombre del integrante' },
      { id: 'rol_guardian_materiales', type: 'text', label: 'Guardian de Materiales:', placeholder: 'Nombre del integrante' },
      
      { id: 'header_indagacion', type: 'header', text: 'Seccion 2: Indagacion Inicial (Lluvia de Ideas)' },
      { id: 'observaciones_comunidad', type: 'textarea', label: 'Anoten todos los problemas o hechos relacionados con el agua que conocen o investigaron en su comunidad:', placeholder: 'Ej: La calle se inunda, falta el agua, las pipas cuestan dinero...' },

      { id: 'header_preguntas', type: 'header', text: 'Seccion 3: El Puente a las Matematicas' },
      { id: 'info_preguntas', type: 'info', text: 'Elijan 3 de sus observaciones y transformenlas en preguntas que se puedan medir o contar.' },
      { id: 'pregunta_1', type: 'textarea', label: 'Pregunta de Investigacion 1:', placeholder: 'Ej: Cuantos litros de agua se acumulan por metro cuadrado?' },
      { id: 'pregunta_2', type: 'textarea', label: 'Pregunta de Investigacion 2:', placeholder: 'Ej: Cual es el costo promedio de una pipa para una familia?' },
      { id: 'pregunta_3', type: 'textarea', label: 'Pregunta de Investigacion 3:', placeholder: 'Escriban su tercera pregunta medible' },
    ],
  },
  {
    id: 2,
    title: "Mision 2: Disenando Nuestro Plan de Ataque",
    description: "Crearemos un plan detallado para investigar nuestra pregunta y recolectar los datos necesarios.",
    icon: 'PlanIcon',
    content: [
      { id: 'header_pregunta_investigacion', type: 'header', text: 'Seccion 1: Nuestra Pregunta de Investigacion' },
      { id: 'pregunta_elegida_m1', type: 'textarea', label: 'Transcriban aqui la pregunta que eligieron de la Mision 1:', placeholder: 'Copien la pregunta seleccionada por el equipo.' },
      { id: 'pregunta_refinada', type: 'textarea', label: 'Ahora, haganla MAS especifica y medible (Que van a medir o contar EXACTAMENTE?):', placeholder: 'Ej: Cuantos litros de agua se estancan y que area en m2 cubre el charco?' },

      { id: 'header_plan_accion', type: 'header', text: 'Seccion 2: El Plan de Accion' },
      { id: 'info_plan_accion', type: 'info', text: 'Definan las acciones, materiales y responsables para su investigacion.' },
      // Accion 1
      { id: 'accion_1', type: 'text', label: 'Accion 1 - Que haremos?', placeholder: 'Ej: Medir el area del charco.' },
      { id: 'materiales_1', type: 'text', label: 'Accion 1 - Que materiales usaremos?', placeholder: 'Ej: Cinta metrica, gis.' },
      { id: 'rol_1', type: 'text', label: 'Accion 1 - Rol principal responsable?', placeholder: 'Ej: Disenador/Arquitecto.' },
      { id: 'tiempo_1', type: 'text', label: 'Accion 1 - Tiempo estimado?', placeholder: 'Ej: 15 min.' },
      { id: 'indicador_1', type: 'text', label: 'Accion 1 - Como sabremos que lo logramos? (Indicador)', placeholder: 'Ej: Tener las medidas en metros anotadas.' },
      // Accion 2
      { id: 'accion_2', type: 'text', label: 'Accion 2 - Que haremos?', placeholder: 'Ej: Recolectar muestras para medir profundidad.' },
      { id: 'materiales_2', type: 'text', label: 'Accion 2 - Que materiales usaremos?', placeholder: 'Ej: 3 vasos de plastico, regla.' },
      { id: 'rol_2', type: 'text', label: 'Accion 2 - Rol principal responsable?', placeholder: 'Ej: Investigador de Campo.' },
      { id: 'tiempo_2', type: 'text', label: 'Accion 2 - Tiempo estimado?', placeholder: 'Ej: 10 min.' },
      { id: 'indicador_2', type: 'text', label: 'Accion 2 - Como sabremos que lo logramos? (Indicador)', placeholder: 'Ej: Tener 3 mediciones de profundidad en cm.' },

      { id: 'header_matematicas', type: 'header', text: 'Seccion 3: Las Matematicas' },
      { id: 'herramientas_matematicas', type: 'checkbox', label: 'Marquen las herramientas matematicas que van a utilizar:', options: ['Conteos', 'Promedios', 'Mediciones', 'Porcentajes', 'Op. Basicas', 'Tablas/Graficas'] },

      { id: 'header_comunicacion', type: 'header', text: 'Seccion 4: Comunicando Descubrimientos' },
      { id: 'info_maqueta', type: 'info', text: 'Recuerden que la Maqueta del experimento o solucion es obligatoria.' },
      { id: 'metodo_comunicacion', type: 'radio', label: 'Elijan como van a comunicar los hallazgos de su maqueta:', options: ['Infografia', 'Video corto', 'Presentacion', 'Exposicion'] },
      
      { id: 'header_valores', type: 'header', text: 'Seccion 5: Valores en Accion' },
      { id: 'valor_equipo', type: 'select', label: 'Como equipo, elijan el valor mas importante que necesitaran para esta mision:', options: ['Paciencia', 'Comunicacion', 'Respeto', 'Colaboracion', 'Creatividad'] },
    ],
  },
  {
    id: 3,
    title: "Mision 3: Laboratorio de Hidraulica Urbana",
    description: "Manos a la obra! Es hora de construir, experimentar y recolectar datos con tu propia maqueta.",
    icon: 'ExperimentIcon',
    content: [
      { id: 'info_m3_intro', type: 'info', text: 'En esta fase, pasaran de la planificacion a la accion. Construiran sus modelos y los pondran a prueba para generar sus propios datos.' },
      
      { id: 'header_diseno', type: 'header', text: 'Momento 1: Diseno y Calculo (La Mesa del Arquitecto)' },
      { id: 'boceto_maqueta', type: 'file', label: 'Diseno del Boceto: Tomen una foto clara del boceto detallado de su maqueta que hicieron en su bitacora y subanla aqui.' },
      { id: 'calculos_previos', type: 'textarea', label: 'Calculos y Dimensiones: Anoten aqui los calculos de area y volumen que realizaron para planificar las dimensiones de su maqueta.', placeholder: 'Ej: Calle: 50cm largo x 20cm ancho. Area total: 1000 cm2. Volumen de agua a usar: 500 ml...' },
      { id: 'variables_medir', type: 'textarea', label: 'Variables a Medir (para 2o Grado): Definan las variables que mediran para su modelo de funcion lineal.', placeholder: 'Ej: Mediremos la altura del agua (en cm) cada 10 segundos.' },
  
      { id: 'header_construccion', type: 'header', text: 'Momento 2: Construccion (Manos a la Obra)' },
      { id: 'materiales_utilizados', type: 'textarea', label: 'Materiales: Hagan una lista de los materiales (principalmente reciclados) que utilizaron para construir su maqueta.' },
      { id: 'foto_maqueta_final', type: 'file', label: 'Maqueta Terminada: Suban una o varias fotos de su maqueta ya construida.' },
  
      { id: 'header_simulacion', type: 'header', text: 'Momento 3: La Simulacion (El Dia de la Inundacion)' },
      { id: 'info_error_inteligente', type: 'info', text: 'Recuerden, Guardianes! Si la maqueta tiene fugas o algo no sale como esperaban, no es un fracaso, es un dato! Anoten todo. El objetivo no es la maqueta perfecta, es el aprendizaje.' },
      { id: 'cantidad_agua_simulacion', type: 'text', label: 'Cantidad de Agua: Registren la cantidad controlada de agua que verteran sobre la maqueta.', placeholder: 'Ej: 1.5 litros' },
      { id: 'registro_resultados', type: 'textarea', label: 'Registro de Resultados: Describan sistematicamente lo que observaron y midieron durante la simulacion.', placeholder: 'Ej: Prueba 1: El agua tardo 45 segundos en drenar. Se estanco en la esquina inferior. Profundidad maxima: 2 cm...' },
      { id: 'foto_video_simulacion', type: 'file', label: 'Evidencia de la Simulacion: Suban una foto o un video corto (maximo 1 minuto) del experimento en accion.' },
      { id: 'conclusiones_experimento', type: 'textarea', label: 'Conclusiones del Experimento: Que aprendieron de la simulacion? Que funciono y que no? Que mejoras harian?' },
    ],
  },
];