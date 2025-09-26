import type { ModuleContent, ProjectId } from './types';

export interface ProjectDefinition {
  id: ProjectId;
  title: string;
  mission: string;
  summary: string;
  color: string;
  modules: ModuleContent[];
}

export const BASE_MODULES: ModuleContent[] = [
  {
    id: 1,
    title: 'Mision 1: El ADN del Agua',
    description: 'Formaremos nuestro equipo de Guardianes y definiremos las preguntas clave de nuestra investigacion.',
    icon: 'TeamIcon',
    content: [
      { id: 'info_m1', type: 'info', text: 'Nuestra Mision: Usar el poder de los numeros para entender y proponer soluciones al problema del agua en nuestra comunidad.' },
      { id: 'header_equipo', type: 'header', text: 'Seccion 1: Constitucion del Equipo' },
      { id: 'rol_lider', type: 'select', label: 'Lider/Coordinador(a):', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'rol_investigador_principal', type: 'select', label: 'Investigador(a) principal:', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'rol_investigador_campo', type: 'select', label: 'Investigador(a) de campo:', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'rol_disenador', type: 'select', label: 'Disenador(a)/Arquitecto(a):', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'rol_comunicador', type: 'select', label: 'Comunicador(a)/Portavoz:', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'rol_escribano', type: 'select', label: 'Escribano(a)/Secretario(a):', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'rol_guardian_materiales', type: 'select', label: 'Guardian de materiales:', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'header_indagacion', type: 'header', text: 'Seccion 2: Indagacion inicial (lluvia de ideas)' },
      { id: 'observaciones_comunidad', type: 'textarea', label: 'Anoten los problemas o hechos relacionados con el agua que conocen o investigaron en su comunidad:', placeholder: 'Ej: La calle se inunda, falta el agua, las pipas cuestan dinero...' },
      { id: 'header_preguntas', type: 'header', text: 'Seccion 3: El puente a las matematicas' },
      { id: 'info_preguntas', type: 'info', text: 'Elijan 3 de sus observaciones y transformenlas en preguntas que se puedan medir o contar.' },
      { id: 'pregunta_1', type: 'textarea', label: 'Pregunta de investigacion 1:', placeholder: 'Ej: Cuantos litros de agua se acumulan por metro cuadrado?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta de investigacion es medible, clara y conecta con el cuidado del agua. Propon mejoras concretas.' },
      { id: 'pregunta_2', type: 'textarea', label: 'Pregunta de investigacion 2:', placeholder: 'Ej: Cual es el costo promedio de una pipa para una familia?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta de investigacion es medible, clara y conecta con el cuidado del agua. Propon mejoras concretas.' },
      { id: 'pregunta_3', type: 'textarea', label: 'Pregunta de investigacion 3:', placeholder: 'Escriban su tercera pregunta medible', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta de investigacion es medible, clara y conecta con el cuidado del agua. Propon mejoras concretas.' },
    ],
  },
  {
    id: 2,
    title: 'Mision 2: Disenando nuestro plan de ataque',
    description: 'Crearemos un plan detallado para investigar nuestra pregunta y recolectar los datos necesarios.',
    icon: 'PlanIcon',
    content: [
      { id: 'header_pregunta_investigacion', type: 'header', text: 'Seccion 1: Nuestra pregunta de investigacion' },
      { id: 'pregunta_elegida_m1', type: 'textarea', label: 'Transcriban aqui la pregunta que eligieron de la Mision 1:', placeholder: 'Copien la pregunta seleccionada por el equipo.', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta seleccionada mantiene claridad y enfoque. Sugiere ajustes para hacerla mas precisa y medible.' },
      { id: 'pregunta_refinada', type: 'textarea', label: 'Ahora, haganla mas especifica y medible (que van a medir o contar exactamente?):', placeholder: 'Ej: Cuantos litros de agua se estancan y que area en m2 cubre el charco?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la version refinada de la pregunta es especifica, medible y accionable. Propon ajustes en caso necesario.' },
      { id: 'header_plan_accion', type: 'header', text: 'Seccion 2: El plan de accion' },
      { id: 'info_plan_accion', type: 'info', text: 'Definan las acciones, materiales y responsables para su investigacion.' },
      { id: 'accion_1', type: 'text', label: 'Accion 1 - Que haremos?', placeholder: 'Ej: Medir el area del charco.' },
      { id: 'materiales_1', type: 'text', label: 'Accion 1 - Materiales a utilizar', placeholder: 'Ej: Cinta metrica, gis.' },
      { id: 'rol_1', type: 'select', label: 'Accion 1 - Quien lidera?', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'tiempo_1', type: 'text', label: 'Accion 1 - Tiempo estimado', placeholder: 'Ej: 15 min.' },
      { id: 'indicador_1', type: 'text', label: 'Accion 1 - Como sabremos que lo logramos?', placeholder: 'Ej: Tener las medidas en metros anotadas.' },
      { id: 'accion_2', type: 'text', label: 'Accion 2 - Que haremos?', placeholder: 'Ej: Recolectar muestras para medir profundidad.' },
      { id: 'materiales_2', type: 'text', label: 'Accion 2 - Materiales a utilizar', placeholder: 'Ej: 3 vasos de plastico, regla.' },
      { id: 'rol_2', type: 'select', label: 'Accion 2 - Quien lidera?', placeholder: 'Selecciona al integrante responsable', optionsSource: 'teamMembers' },
      { id: 'tiempo_2', type: 'text', label: 'Accion 2 - Tiempo estimado', placeholder: 'Ej: 10 min.' },
      { id: 'indicador_2', type: 'text', label: 'Accion 2 - Como sabremos que lo logramos?', placeholder: 'Ej: Tener 3 mediciones de profundidad en cm.' },
      { id: 'header_matematicas', type: 'header', text: 'Seccion 3: Las matematicas' },
      { id: 'herramientas_matematicas', type: 'checkbox', label: 'Marquen las herramientas matematicas que van a utilizar:', options: ['Conteos', 'Promedios', 'Mediciones', 'Porcentajes', 'Op. basicas', 'Tablas/Graficas'] },
      { id: 'header_comunicacion', type: 'header', text: 'Seccion 4: Comunicando descubrimientos' },
      { id: 'info_maqueta', type: 'info', text: 'Recuerden que la maqueta del experimento o solucion es obligatoria.' },
      { id: 'metodo_comunicacion', type: 'radio', label: 'Elijan como van a comunicar los hallazgos de su maqueta:', options: ['Infografia', 'Video corto', 'Presentacion', 'Exposicion'] },
      { id: 'header_valores', type: 'header', text: 'Seccion 5: Valores en accion' },
      { id: 'valor_equipo', type: 'select', label: 'Como equipo, elijan el valor mas importante que necesitaran para esta mision:', options: ['Paciencia', 'Comunicacion', 'Respeto', 'Colaboracion', 'Creatividad'] },
    ],
  },
  {
    id: 3,
    title: 'Mision 3: Laboratorio de hidraulica urbana',
    description: 'Manos a la obra: construyan, experimenten y documenten su maqueta.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'info_m3_intro', type: 'info', text: 'En esta fase pasaran de la planificacion a la accion. Construiran sus modelos y los pondran a prueba para generar sus propios datos.' },
      { id: 'header_diseno', type: 'header', text: 'Momento 1: Diseno y calculo (La mesa del arquitecto)' },
      { id: 'boceto_maqueta', type: 'file', label: 'Diseno del boceto: Suban una foto clara del boceto detallado de su maqueta.' },
      { id: 'calculos_previos', type: 'textarea', label: 'Calculos y dimensiones: Anoten aqui los calculos de area y volumen que realizaron para planificar su maqueta.', placeholder: 'Ej: Calle 50cm x 20cm. Volumen estimado de agua: 500 ml.' },
      { id: 'variables_medir', type: 'textarea', label: 'Variables a medir: Definan las variables que observaran durante la simulacion.', placeholder: 'Ej: Altura del agua (cm) cada 10 segundos.' },
      { id: 'header_construccion', type: 'header', text: 'Momento 2: Construccion (Manos a la obra)' },
      { id: 'materiales_utilizados', type: 'textarea', label: 'Materiales utilizados:', placeholder: 'Enumera los materiales reciclados o comprados que usaron.' },
      { id: 'foto_maqueta_final', type: 'file', label: 'Maqueta terminada: Suban una o varias fotos de su maqueta.' },
      { id: 'header_simulacion', type: 'header', text: 'Momento 3: La simulacion (El dia de la inundacion)' },
      { id: 'info_error_inteligente', type: 'info', text: 'Si la maqueta tiene fugas o algo no sale como esperaban, no es un fracaso. Registren los datos y aprendan de ellos.' },
      { id: 'cantidad_agua_simulacion', type: 'text', label: 'Cantidad de agua utilizada en la simulacion (ml):', placeholder: 'Ej: 1500' },
      { id: 'registro_resultados', type: 'textarea', label: 'Registro de resultados:', placeholder: 'Describe cada prueba, tiempos, medidas y observaciones.' },
      { id: 'foto_video_simulacion', type: 'file', label: 'Evidencia de la simulacion: Foto o video corto (max 1 minuto).' },
      { id: 'conclusiones_experimento', type: 'textarea', label: 'Conclusiones del experimento:', placeholder: 'Que aprendieron? Que cambiarias en la siguiente iteracion?' },
    ],
  },
];

const p1Modules: ModuleContent[] = [
  {
    id: 110,
    title: 'P1 - Fase 1: Indagacion enfocada',
    description: 'Define la pregunta central sobre salud y agua.',
    icon: 'PlanIcon',
    content: [
      { id: 'p1_f1_intro', type: 'info', text: 'Revisa tu bitacora y elige la pregunta principal sobre enfermedades y agua estancada.' },
      { id: 'p1_f1_pregunta', type: 'textarea', label: 'Pregunta central del equipo:', placeholder: 'Que relacion encontraron entre el agua y la salud?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta central es clara, medible y conecta con el cuidado del agua. Propon ajustes puntuales.' },
      { id: 'p1_f1_fuentes', type: 'textarea', label: 'Fuentes que consultaremos:', placeholder: 'Centros de salud, noticias locales, entrevistas...' },
      { id: 'p1_f1_plan_datos', type: 'textarea', label: 'Datos que necesitaran recolectar:', placeholder: 'Casos por mes, edades, colonias afectadas...' },
    ],
  },
  {
    id: 111,
    title: 'P1 - Fase 2: Epidemiologia en accion',
    description: 'Recolecta y analiza datos sobre enfermedades relacionadas con el agua.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'p1_f2_tabla', type: 'textarea', label: 'Resumen de su tabla de casos mensuales:', placeholder: 'Describe los meses que investigaron y los casos registrados.' },
      { id: 'p1_f2_grafica', type: 'file', label: 'Evidencia de la grafica de lineas (foto o captura):' },
      { id: 'p1_f2_patrones', type: 'textarea', label: 'Patrones detectados en los datos:', placeholder: 'Ej: Los casos aumentan en temporada de lluvia.' },
      { id: 'p1_f2_calculos', type: 'textarea', label: 'Calculos de porcentaje de aumento y tasa de incidencia:', placeholder: 'Anoten los resultados y expliquen que significan.', aiTask: 'reflection', aiPrompt: 'Revisa si los calculos reportados son consistentes con los datos recopilados. Sugiere correcciones o interpretaciones adicionales.' },
    ],
  },
  {
    id: 112,
    title: 'P1 - Fase 3: Maqueta educativa',
    description: 'Construye el modelo que explica el problema y su causa.',
    icon: 'WaterDropIcon',
    content: [
      { id: 'p1_f3_diseno', type: 'textarea', label: 'Diseno de la maqueta o diorama:', placeholder: 'Explica que representa cada elemento del modelo.' },
      { id: 'p1_f3_materiales', type: 'textarea', label: 'Materiales utilizados:', placeholder: 'Plastilina, alambre, botellas PET, etc.' },
      { id: 'p1_f3_evidencia', type: 'file', label: 'Foto de la maqueta terminada:' },
      { id: 'p1_f3_mensaje', type: 'textarea', label: 'Mensaje clave que comunica la maqueta:', placeholder: 'Que debe recordar la comunidad despues de ver el modelo?' },
    ],
  },
  {
    id: 113,
    title: 'P1 - Fase 4: Infografia preventiva',
    description: 'Disena la campana de prevencion basada en sus datos.',
    icon: 'PlanIcon',
    content: [
      { id: 'p1_f4_titulo', type: 'text', label: 'Titulo propuesto para la infografia:', placeholder: 'Ej: El agua estancada nos enferma.' },
      { id: 'p1_f4_dato', type: 'textarea', label: 'Dato impactante que mostraran:', placeholder: 'Describe la grafica o cifra que utilizara el equipo.' },
      { id: 'p1_f4_causa', type: 'textarea', label: 'Causa principal identificada:', placeholder: 'Relaciona la maqueta con los datos obtenidos.' },
      { id: 'p1_f4_soluciones', type: 'textarea', label: 'Tres acciones de prevencion:', placeholder: 'Redacten acciones claras y realistas para la comunidad.' },
    ],
  },
  {
    id: 114,
    title: 'P1 - Fase 5: Coevaluacion sanitaria',
    description: 'Evalua tu trabajo y planifica mejoras.',
    icon: 'TeamIcon',
    content: [
      { id: 'p1_f5_reflexion', type: 'textarea', label: 'Fortalezas del proyecto:', placeholder: 'Que parte explica mejor el problema de salud?' },
      { id: 'p1_f5_mejoras', type: 'textarea', label: 'Mejoras pendientes antes de presentar:', placeholder: 'Anoten ajustes a la maqueta, infografia o datos.' },
      { id: 'p1_f5_feedback', type: 'textarea', label: 'Retroalimentacion entre equipos:', placeholder: 'Que les recomendaria Mentor Aqua?', aiTask: 'reflection', aiPrompt: 'Analiza la reflexion del equipo y sugiere un siguiente paso concreto para fortalecer la campana de prevencion.' },
    ],
  },
];

const p2Modules: ModuleContent[] = [
  {
    id: 210,
    title: 'P2 - Fase 1: Materiales en casa',
    description: 'Selecciona los materiales para construir el filtro.',
    icon: 'PlanIcon',
    content: [
      { id: 'p2_f1_intro', type: 'info', text: 'Revisa tu bitacora y confirma los materiales que cada integrante puede aportar para el filtro.' },
      { id: 'p2_f1_materiales', type: 'textarea', label: 'Lista de materiales disponibles:', placeholder: 'Algodon, arena, grava, carbon activado, botellas...' },
      { id: 'p2_f1_roles', type: 'textarea', label: 'Responsables de conseguir cada material:', placeholder: 'Anota quien aporta y cuando lo llevara.' },
      { id: 'p2_f1_preguntas', type: 'textarea', label: 'Preguntas iniciales sobre el filtrado:', placeholder: 'Que quieren comprobar sobre la claridad del agua?' },
    ],
  },
  {
    id: 211,
    title: 'P2 - Fase 2: Laboratorio de filtracion',
    description: 'Prueba el filtro y registra los resultados.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'p2_f2_tabla', type: 'textarea', label: 'Tabla de pruebas (describe claridad y volumen):', placeholder: 'Prueba 1: claridad 2 a 4, volumen 420 ml/min...' },
      { id: 'p2_f2_evidencia', type: 'file', label: 'Foto o video corto de la prueba:' },
      { id: 'p2_f2_grafica', type: 'file', label: 'Grafica de barras antes vs despues:' },
      { id: 'p2_f2_eficiencia', type: 'textarea', label: 'Calculo de eficiencia en porcentaje:', placeholder: 'Aplicamos la formula ((claridad final - claridad inicial) / claridad inicial) * 100', aiTask: 'reflection', aiPrompt: 'Revisa si el calculo de eficiencia coincide con los datos descritos y ofrece una recomendacion tecnica.' },
    ],
  },
  {
    id: 212,
    title: 'P2 - Fase 3: Maqueta del filtro',
    description: 'Documenta la construccion del filtro funcional.',
    icon: 'WaterDropIcon',
    content: [
      { id: 'p2_f3_boceto', type: 'file', label: 'Foto del boceto o diagrama de capas:' },
      { id: 'p2_f3_capas', type: 'textarea', label: 'Describe cada capa y su funcion:', placeholder: 'Algodon atrapa particulas finas, arena retiene solidos...' },
      { id: 'p2_f3_materiales', type: 'textarea', label: 'Materiales reciclados utilizados:', placeholder: 'Botella PET, tela, el liston...' },
      { id: 'p2_f3_mejoras', type: 'textarea', label: 'Que ajustes harian despues de probarlo?', placeholder: 'Cambiaremos el orden de las capas para mejorar la claridad.' },
    ],
  },
  {
    id: 213,
    title: 'P2 - Fase 4: Infografia DIY',
    description: 'Prepara la guia paso a paso para filtrar agua.',
    icon: 'PlanIcon',
    content: [
      { id: 'p2_f4_titulo', type: 'text', label: 'Titulo de la infografia:', placeholder: 'Ej: Agua limpia con tus propias manos.' },
      { id: 'p2_f4_historia', type: 'textarea', label: 'Resumen del experimento:', placeholder: 'Que aprendieron sobre medir claridad y volumen?' },
      { id: 'p2_f4_diagrama', type: 'textarea', label: 'Descripcion del diagrama del filtro:', placeholder: 'Como explicaran cada capa visualmente?' },
      { id: 'p2_f4_instrucciones', type: 'textarea', label: 'Pasos para replicar el filtro:', placeholder: '1. Corta la botella... 2. Coloca el carbon...' },
    ],
  },
  {
    id: 214,
    title: 'P2 - Fase 5: Coevaluacion de calidad',
    description: 'Valida el filtro con retroalimentacion del equipo.',
    icon: 'TeamIcon',
    content: [
      { id: 'p2_f5_datos', type: 'textarea', label: 'Los datos son claros y repetibles?', placeholder: 'Explica si las mediciones son faciles de entender.' },
      { id: 'p2_f5_presentacion', type: 'textarea', label: 'La maqueta comunica bien el proceso?', placeholder: 'Describe que entendio el publico al verla.' },
      { id: 'p2_f5_acciones', type: 'textarea', label: 'Acciones para mejorar antes de presentar:', aiTask: 'reflection', aiPrompt: 'Analiza la coevaluacion del filtro y sugiere el siguiente ajuste prioritario para elevar su impacto.' },
    ],
  },
];

const p3Modules: ModuleContent[] = [
  {
    id: 310,
    title: 'P3 - Fase 1: Radiografia del suelo',
    description: 'Investiga por que el agua se encharca en tu comunidad.',
    icon: 'PlanIcon',
    content: [
      { id: 'p3_f1_intro', type: 'info', text: 'Analicen su bitacora para identificar preguntas sobre pavimento, areas verdes y encharcamientos.' },
      { id: 'p3_f1_pregunta', type: 'textarea', label: 'Pregunta de investigacion del equipo:', placeholder: 'Ej: Por que el patio se inunda mas que el jardin?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta del equipo es concreta y permite medir diferencias de absorcion. Sugiere mejoras.' },
      { id: 'p3_f1_mapas', type: 'textarea', label: 'Lugares a comparar:', placeholder: 'Anota los sitios donde mediran absorcion.' },
      { id: 'p3_f1_datos', type: 'textarea', label: 'Datos que planean recolectar:', placeholder: 'Tiempo de absorcion, volumen escurrido, porcentaje de concreto...' },
    ],
  },
  {
    id: 311,
    title: 'P3 - Fase 2: Laboratorio de absorcion',
    description: 'Mide tiempos y volumenes para comparar superficies.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'p3_f2_tabla', type: 'textarea', label: 'Tabla de resultados (superficie, tiempo, volumen):', placeholder: 'Superficie impermeable: 45 s, 80 ml; Superficie permeable: 20 s, 15 ml...' },
      { id: 'p3_f2_grafica', type: 'file', label: 'Grafica comparativa del volumen de escurrimiento:' },
      { id: 'p3_f2_porcentaje', type: 'textarea', label: 'Porcentaje de concreto vs area verde en la escuela:', placeholder: 'Calculen el porcentaje y expliquen como lo midieron.' },
      { id: 'p3_f2_interpretacion', type: 'textarea', label: 'Interpretacion de los datos:', placeholder: 'Que superficie retiene mejor el agua y por que?', aiTask: 'reflection', aiPrompt: 'Valida si las conclusiones coinciden con los datos reportados y propone un argumento adicional para su infografia.' },
    ],
  },
  {
    id: 312,
    title: 'P3 - Fase 3: Maqueta permeable',
    description: 'Construye un diorama que contraste pavimento y zonas verdes.',
    icon: 'WaterDropIcon',
    content: [
      { id: 'p3_f3_diseno', type: 'textarea', label: 'Descripcion del diorama:', placeholder: 'Explica que elementos representan concreto y soluciones permeables.' },
      { id: 'p3_f3_materiales', type: 'textarea', label: 'Materiales utilizados:', placeholder: 'Charola, plastilina, arena, plantas...' },
      { id: 'p3_f3_evidencia', type: 'file', label: 'Foto de la maqueta terminada:' },
      { id: 'p3_f3_mensaje', type: 'textarea', label: 'Mensaje clave de la maqueta:', placeholder: 'Ej: Con mas areas verdes disminuye el escurrimiento.' },
    ],
  },
  {
    id: 313,
    title: 'P3 - Fase 4: Infografia del suelo inteligente',
    description: 'Comunica los datos y la propuesta permeable.',
    icon: 'PlanIcon',
    content: [
      { id: 'p3_f4_titulo', type: 'text', label: 'Titulo de la infografia:', placeholder: 'Ej: No toda el agua escurre.' },
      { id: 'p3_f4_datos', type: 'textarea', label: 'Dato principal para destacar:', placeholder: 'Describe que mostrara la grafica de barras.' },
      { id: 'p3_f4_porcentaje', type: 'textarea', label: 'Como mostraran el porcentaje de concreto vs verde?', placeholder: 'Explica el grafico circular o diagrama que planean.' },
      { id: 'p3_f4_solucion', type: 'textarea', label: 'Micro-solucion propuesta:', placeholder: 'Aduccion de adoquines con pasto, jardinera, etc.' },
    ],
  },
  {
    id: 314,
    title: 'P3 - Fase 5: Coevaluacion permeable',
    description: 'Valora el impacto de los datos y la maqueta.',
    icon: 'TeamIcon',
    content: [
      { id: 'p3_f5_claridad', type: 'textarea', label: 'La grafica explica claramente la diferencia?', placeholder: 'Que entendio el equipo sobre el patron observado?' },
      { id: 'p3_f5_maqueta', type: 'textarea', label: 'La maqueta muestra la solucion propuesta?', placeholder: 'Describe que parte del modelo destaca mejor la idea.' },
      { id: 'p3_f5_plan', type: 'textarea', label: 'Siguiente mejora antes de presentar:', aiTask: 'reflection', aiPrompt: 'Analiza la coevaluacion del proyecto permeable y recomienda el siguiente paso para fortalecer la propuesta urbana.' },
    ],
  },
];
const p4Modules: ModuleContent[] = [
  {
    id: 410,
    title: 'P4 - Fase 1: Mapear el servicio de pipas',
    description: 'Comprende por que llegan pipas a la colonia.',
    icon: 'PlanIcon',
    content: [
      { id: 'p4_f1_intro', type: 'info', text: 'Analicen sus notas sobre la frecuencia y motivos por los que llegan pipas de agua.' },
      { id: 'p4_f1_pregunta', type: 'textarea', label: 'Pregunta de investigacion:', placeholder: 'Ej: Cuanto mas cara es el agua de pipa comparada con la red publica?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta permite calcular costos y tomar decisiones informadas. Sugiere ajustes si falta precision.' },
      { id: 'p4_f1_fuentes', type: 'textarea', label: 'Proveedores o vecinos a entrevistar:', placeholder: 'Lista de personas o empresas y que informacion dara cada una.' },
      { id: 'p4_f1_datos', type: 'textarea', label: 'Datos que se deben recolectar:', placeholder: 'Costo total, litros por pipa, distancia, tiempo de espera...' },
    ],
  },
  {
    id: 411,
    title: 'P4 - Fase 2: Analisis de costos y litros',
    description: 'Calcula costos por litro y compara proveedores.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'p4_f2_tabla', type: 'textarea', label: 'Tabla de proveedores (costo total y costo por litro):', placeholder: 'Proveedor A: 950 pesos, 10 000 litros, costo por litro 0.095...' },
      { id: 'p4_f2_red', type: 'textarea', label: 'Costo del agua de la red publica:', placeholder: 'Incluye el dato del recibo y su fuente.' },
      { id: 'p4_f2_grafica', type: 'file', label: 'Grafica de barras comparativa de costos por litro:' },
      { id: 'p4_f2_porcentaje', type: 'textarea', label: 'Porcentaje mas caro de la pipa frente a la red:', placeholder: 'Explica el porcentaje y que significa para una familia.', aiTask: 'reflection', aiPrompt: 'Revisa si el analisis de costos es consistente y agrega una recomendacion para la comunidad.' },
    ],
  },
  {
    id: 412,
    title: 'P4 - Fase 3: Mapa 3D de la colonia',
    description: 'Construye la maqueta que muestra las zonas dependientes de pipas.',
    icon: 'WaterDropIcon',
    content: [
      { id: 'p4_f3_diseno', type: 'textarea', label: 'Plan de la maqueta:', placeholder: 'Que calles y zonas incluiran y que simbolos usaran?' },
      { id: 'p4_f3_materiales', type: 'textarea', label: 'Materiales empleados:', placeholder: 'Carton base, cajas pequenas, plastilina, fichas...' },
      { id: 'p4_f3_evidencia', type: 'file', label: 'Foto del mapa 3D o proceso de construccion:' },
      { id: 'p4_f3_insight', type: 'textarea', label: 'Que revela el mapa sobre la comunidad?', placeholder: 'Donde se concentran las pipas y por que?' },
    ],
  },
  {
    id: 413,
    title: 'P4 - Fase 4: Directorio del consumidor',
    description: 'Organiza la informacion para la infografia comunitaria.',
    icon: 'PlanIcon',
    content: [
      { id: 'p4_f4_titulo', type: 'text', label: 'Titulo tentativo:', placeholder: 'Ej: Cuanto cuesta realmente un vaso de agua?' },
      { id: 'p4_f4_historia', type: 'textarea', label: 'Dato clave a destacar:', placeholder: 'Que diferencia de precios sorprendera a la comunidad?' },
      { id: 'p4_f4_directorio', type: 'textarea', label: 'Resumen del directorio de proveedores:', placeholder: 'Incluye precio, telefono y recomendacion para cada proveedor.' },
      { id: 'p4_f4_acciones', type: 'textarea', label: 'Como ayudara esta informacion a la colonia?', placeholder: 'Propongan acciones concretas (ej: tablero informativo).' },
    ],
  },
  {
    id: 414,
    title: 'P4 - Fase 5: Coevaluacion economica',
    description: 'Revisa la claridad de la propuesta para la comunidad.',
    icon: 'TeamIcon',
    content: [
      { id: 'p4_f5_transparencia', type: 'textarea', label: 'Los calculos son faciles de entender?', placeholder: 'Que podria confundir a una familia y como lo explicaran mejor?' },
      { id: 'p4_f5_mapa', type: 'textarea', label: 'El mapa 3D comunica el problema?', placeholder: 'Que parte se deberia reforzar antes de presentar?' },
      { id: 'p4_f5_siguiente', type: 'textarea', label: 'Paso siguiente recomendado:', aiTask: 'reflection', aiPrompt: 'Analiza la coevaluacion y define el siguiente movimiento para fortalecer la propuesta sobre pipas.' },
    ],
  },
];

const p5Modules: ModuleContent[] = [
  {
    id: 510,
    title: 'P5 - Fase 1: Cartografia de baches',
    description: 'Identifica los baches criticos y su relacion con el agua.',
    icon: 'PlanIcon',
    content: [
      { id: 'p5_f1_intro', type: 'info', text: 'Localicen la calle que investigaran y relacionen cada bache con fugas o escurrimientos.' },
      { id: 'p5_f1_pregunta', type: 'textarea', label: 'Pregunta de investigacion:', placeholder: 'Ej: Que tan grande es el danio causado por el agua en los baches de la calle X?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta permite medir el impacto de los baches y propone ajustes para hacerla mas cuantificable.' },
      { id: 'p5_f1_ruta', type: 'textarea', label: 'Tramo seleccionado (metros y referencias):', placeholder: 'Describe puntos de inicio y fin para medir 20 metros.' },
      { id: 'p5_f1_seguridad', type: 'textarea', label: 'Medidas de seguridad y roles en campo:', placeholder: 'Quien mide, quien registra datos y quien vigila el entorno?' },
    ],
  },
  {
    id: 511,
    title: 'P5 - Fase 2: Laboratorio de volumen',
    description: 'Mide diametro, profundidad y volumen de los baches.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'p5_f2_tabla', type: 'textarea', label: 'Tabla de los cinco baches principales:', placeholder: 'Incluye diametro, profundidad, area y volumen aproximado.' },
      { id: 'p5_f2_grafica', type: 'file', label: 'Grafica de barras del volumen de cada bache:' },
      { id: 'p5_f2_porcentaje', type: 'textarea', label: 'Porcentaje de superficie danada en el tramo:', placeholder: 'Explica como calcularon el porcentaje sobre el area total.', aiTask: 'reflection', aiPrompt: 'Revisa el porcentaje reportado y su coherencia con los datos. Sugiere una interpretacion para la infografia.' },
      { id: 'p5_f2_costo', type: 'textarea', label: 'Costo estimado para reparar el bache mas grande:', placeholder: 'Usen la formula 0.50 x volumen y expliquen el resultado.' },
    ],
  },
  {
    id: 512,
    title: 'P5 - Fase 3: Maqueta del subsuelo',
    description: 'Construye un modelo que muestre como el agua genera baches.',
    icon: 'WaterDropIcon',
    content: [
      { id: 'p5_f3_diseno', type: 'textarea', label: 'Descripcion del corte transversal:', placeholder: 'Que capas representaran (asfalto, base, drenaje)?' },
      { id: 'p5_f3_materiales', type: 'textarea', label: 'Materiales del modelo:', placeholder: 'Arena, grava, arcilla, popotes para drenaje...' },
      { id: 'p5_f3_evidencia', type: 'file', label: 'Foto de la maqueta completa:' },
      { id: 'p5_f3_solucion', type: 'textarea', label: 'Propuesta de reparacion correcta:', placeholder: 'Describe paso a paso como rellenar y compactar el bache.' },
    ],
  },
  {
    id: 513,
    title: 'P5 - Fase 4: Infografia del enemigo oculto',
    description: 'Comunica datos, costos y solucion para los baches.',
    icon: 'PlanIcon',
    content: [
      { id: 'p5_f4_titulo', type: 'text', label: 'Titulo de la infografia:', placeholder: 'Ej: Radiografia de un bache.' },
      { id: 'p5_f4_datos', type: 'textarea', label: 'Dato impactante para abrir la historia:', placeholder: 'Selecciona el dato visual mas fuerte (volumen, costo, porcentaje).' },
      { id: 'p5_f4_costo', type: 'textarea', label: 'Como mostraran la formula de costo?', placeholder: 'Describe el paso a paso para que otros puedan calcular.' },
      { id: 'p5_f4_llamado', type: 'textarea', label: 'Accion que propondran a la comunidad:', placeholder: 'Campana de reportes, brigadas, etc.' },
    ],
  },
  {
    id: 514,
    title: 'P5 - Fase 5: Coevaluacion vial',
    description: 'Verifica claridad de datos y propuesta de reparacion.',
    icon: 'TeamIcon',
    content: [
      { id: 'p5_f5_datos', type: 'textarea', label: 'Nuestros calculos son faciles de seguir?', placeholder: 'Que parte necesita mejor explicacion?' },
      { id: 'p5_f5_maqueta', type: 'textarea', label: 'La maqueta explica como se forma el bache?', placeholder: 'Que detalles agregaran para mostrar el flujo de agua?' },
      { id: 'p5_f5_mejoras', type: 'textarea', label: 'Lista de ajustes antes de presentar:', aiTask: 'reflection', aiPrompt: 'Analiza la coevaluacion y define el ajuste urgente para fortalecer la propuesta contra baches.' },
    ],
  },
];
const p6Modules: ModuleContent[] = [
  {
    id: 610,
    title: 'P6 - Fase 1: Mapear el relieve',
    description: 'Identifica pendientes y zonas bajas de la comunidad.',
    icon: 'PlanIcon',
    content: [
      { id: 'p6_f1_intro', type: 'info', text: 'Ubica las calles o zonas con inclinaciones fuertes o muy bajas usando tu bitacora.' },
      { id: 'p6_f1_pregunta', type: 'textarea', label: 'Pregunta de investigacion sobre el relieve:', placeholder: 'Ej: Como influye la pendiente de la calle en la acumulacion de agua?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta permite medir pendientes y relacionarlas con inundaciones. Sugiere como hacerla mas precisa.' },
      { id: 'p6_f1_lugares', type: 'textarea', label: 'Tres lugares que mediran:', placeholder: 'Banqueta, rampa, calle cercana...' },
      { id: 'p6_f1_herramientas', type: 'textarea', label: 'Herramientas y roles para medir:', placeholder: 'Nivel de burbuja, app, cinta metrica, quien anota datos...' },
    ],
  },
  {
    id: 611,
    title: 'P6 - Fase 2: Laboratorio de pendientes',
    description: 'Calcula pendiente como relacion elevacion/distancia.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'p6_f2_tabla', type: 'textarea', label: 'Tabla de lugares y pendientes:', placeholder: 'Lugar, elevacion (cm), distancia (cm), pendiente decimal.' },
      { id: 'p6_f2_grafica', type: 'file', label: 'Grafica de barras que compara pendientes:' },
      { id: 'p6_f2_interpretacion', type: 'textarea', label: 'Que significa la pendiente mayor?', placeholder: 'Relacionen la inclinacion con el flujo del agua.' },
      { id: 'p6_f2_riesgos', type: 'textarea', label: 'Riesgos detectados en zonas bajas:', placeholder: 'Describan inundaciones recurrentes, charcos o riesgos de resbalones.', aiTask: 'reflection', aiPrompt: 'Revisa los riesgos reportados y sugiere una accion concreta para la maqueta o infografia.' },
    ],
  },
  {
    id: 612,
    title: 'P6 - Fase 3: Maqueta topografica',
    description: 'Construye una maqueta que muestre alturas y escurrimientos.',
    icon: 'WaterDropIcon',
    content: [
      { id: 'p6_f3_diseno', type: 'textarea', label: 'Diseno de la maqueta en capas:', placeholder: 'Explica como representaran las alturas con carton.' },
      { id: 'p6_f3_materiales', type: 'textarea', label: 'Materiales utilizados:', placeholder: 'Carton, plastilina, agua con colorante...' },
      { id: 'p6_f3_evidencia', type: 'file', label: 'Foto o video corto del flujo de agua en la maqueta:' },
      { id: 'p6_f3_conclusion', type: 'textarea', label: 'Que aprendieron al simular la lluvia?', placeholder: 'Describe hacia donde corrio el agua y por que.' },
    ],
  },
  {
    id: 613,
    title: 'P6 - Fase 4: Infografia del relieve',
    description: 'Explica el concepto de pendiente y su impacto.',
    icon: 'PlanIcon',
    content: [
      { id: 'p6_f4_titulo', type: 'text', label: 'Titulo propuesto:', placeholder: 'Ej: Por que siempre se inunda en la misma esquina?' },
      { id: 'p6_f4_diagrama', type: 'textarea', label: 'Como explicaran la pendiente (rise/run):', placeholder: 'Describe el dibujo o esquema que usaran.' },
      { id: 'p6_f4_datos', type: 'textarea', label: 'Datos que mostraran en la infografia:', placeholder: 'Incluye la grafica de barras y los lugares medidos.' },
      { id: 'p6_f4_solucion', type: 'textarea', label: 'Propuesta para la direccion escolar o comunidad:', placeholder: 'Canales, jardin de lluvia, rampas seguras...' },
    ],
  },
  {
    id: 614,
    title: 'P6 - Fase 5: Coevaluacion topografica',
    description: 'Reflexiona sobre la precision y claridad del proyecto.',
    icon: 'TeamIcon',
    content: [
      { id: 'p6_f5_precision', type: 'textarea', label: 'Las mediciones fueron precisas?', placeholder: 'Como lo saben y que repetirian?' },
      { id: 'p6_f5_maqueta', type: 'textarea', label: 'La maqueta demuestra el flujo de agua?', placeholder: 'Que detalle agregaras para mostrar los puntos bajos?' },
      { id: 'p6_f5_accion', type: 'textarea', label: 'Accion siguiente antes de presentar:', aiTask: 'reflection', aiPrompt: 'Analiza la coevaluacion y sugiere el ajuste mas importante para explicar el relieve con claridad.' },
    ],
  },
];

const p7Modules: ModuleContent[] = [
  {
    id: 710,
    title: 'P7 - Fase 1: Detectives del drenaje',
    description: 'Observa el estado de las alcantarillas cercanas.',
    icon: 'PlanIcon',
    content: [
      { id: 'p7_f1_intro', type: 'info', text: 'Identifiquen las alcantarillas mas cercanas y que tipo de basura han visto en ellas.' },
      { id: 'p7_f1_pregunta', type: 'textarea', label: 'Pregunta de investigacion:', placeholder: 'Ej: Como afecta la basura al flujo de agua en las alcantarillas del barrio?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta permite calcular obstrucciones y su impacto. Sugiere mejoras si falta claridad.' },
      { id: 'p7_f1_lista', type: 'textarea', label: 'Alcantarillas que observaran y ubicacion:', placeholder: 'Anota calles, referencias y nivel de basura observado.' },
      { id: 'p7_f1_seguridad', type: 'textarea', label: 'Medidas de seguridad y roles:', placeholder: 'Quien toma fotos, quien mide, quien anota?' },
    ],
  },
  {
    id: 711,
    title: 'P7 - Fase 2: Laboratorio de capacidad',
    description: 'Calcula el porcentaje obstruido y el area util de drenaje.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'p7_f2_tabla', type: 'textarea', label: 'Tabla de alcantarillas y porcentaje obstruido:', placeholder: 'Alcantarilla 1: 40% obstruida...' },
      { id: 'p7_f2_area', type: 'textarea', label: 'Calculo de area total y area util:', placeholder: 'Incluye diametro medido y area activa en cm2.' },
      { id: 'p7_f2_grafica', type: 'file', label: 'Grafico circular del estado promedio:' },
      { id: 'p7_f2_interpretacion', type: 'textarea', label: 'Interpretacion del experimento de flujo:', placeholder: 'Que paso al comparar el embudo limpio vs obstruido?', aiTask: 'reflection', aiPrompt: 'Valida la interpretacion y agrega una recomendacion para prevenir obstrucciones.' },
    ],
  },
  {
    id: 712,
    title: 'P7 - Fase 3: Maqueta del drenaje inteligente',
    description: 'Construye el experimento con embudos o botellas.',
    icon: 'WaterDropIcon',
    content: [
      { id: 'p7_f3_diseno', type: 'textarea', label: 'Descripcion del montaje experimental:', placeholder: 'Explica como simularon la alcantarilla limpia y la obstruida.' },
      { id: 'p7_f3_materiales', type: 'textarea', label: 'Materiales utilizados:', placeholder: 'Botellas, piedras, hojas, cronometro...' },
      { id: 'p7_f3_evidencia', type: 'file', label: 'Foto o video del flujo de agua en ambos montajes:' },
      { id: 'p7_f3_resultado', type: 'textarea', label: 'Que demuestra el experimento?', placeholder: 'Relaciona la cantidad drenada con la basura acumulada.' },
    ],
  },
  {
    id: 713,
    title: 'P7 - Fase 4: Infografia adopta una alcantarilla',
    description: 'Comunica el problema y la campana propuesta.',
    icon: 'PlanIcon',
    content: [
      { id: 'p7_f4_titulo', type: 'text', label: 'Titulo propuesto:', placeholder: 'Ej: El enemigo silencioso de las inundaciones.' },
      { id: 'p7_f4_dato', type: 'textarea', label: 'Dato que mostrara la infografia:', placeholder: 'Porcentaje obstruido promedio o tiempo de drenado.' },
      { id: 'p7_f4_campana', type: 'textarea', label: 'Descripcion de la campana Adopta una Alcantarilla:', placeholder: 'Quien la coordina, cada cuanto se limpia, que materiales se requieren.' },
      { id: 'p7_f4_mensaje', type: 'textarea', label: 'Mensaje final para la comunidad:', placeholder: 'Que deben recordar los ciudadanos para evitar obstrucciones?' },
    ],
  },
  {
    id: 714,
    title: 'P7 - Fase 5: Coevaluacion del drenaje',
    description: 'Evalua si los datos y la campana convencen al publico.',
    icon: 'TeamIcon',
    content: [
      { id: 'p7_f5_datos', type: 'textarea', label: 'Los datos impactan lo suficiente?', placeholder: 'Que evidencia falta para convencer mas?' },
      { id: 'p7_f5_maqueta', type: 'textarea', label: 'El experimento demuestra el problema?', placeholder: 'Que detalle deberian reforzar antes de presentar?' },
      { id: 'p7_f5_compromiso', type: 'textarea', label: 'Compromiso del equipo para la campana:', aiTask: 'reflection', aiPrompt: 'Analiza la coevaluacion y sugiere un compromiso o siguiente paso para activar la campana Adopta una Alcantarilla.' },
    ],
  },
];
const p8Modules: ModuleContent[] = [
  {
    id: 810,
    title: 'P8 - Fase 1: Mapa de charcos escolares',
    description: 'Identifica los puntos criticos tras la lluvia.',
    icon: 'PlanIcon',
    content: [
      { id: 'p8_f1_intro', type: 'info', text: 'Recuerden en que zonas aparecen los charcos mas grandes dentro del plantel.' },
      { id: 'p8_f1_pregunta', type: 'textarea', label: 'Pregunta de investigacion:', placeholder: 'Ej: Cuanto volumen de agua se acumula en el patio despues de la lluvia?', aiTask: 'researchQuestion', aiPrompt: 'Evalua si la pregunta permite medir volumenes y proponer soluciones. Sugiere ajustes para hacerla mas concreta.' },
      { id: 'p8_f1_zonas', type: 'textarea', label: 'Zonas que mediran:', placeholder: 'Patio central, entrada principal, jardin...' },
      { id: 'p8_f1_roles', type: 'textarea', label: 'Roles para medir y registrar:', placeholder: 'Quien mide largo, quien mide profundidad, quien registra datos.' },
    ],
  },
  {
    id: 811,
    title: 'P8 - Fase 2: Medicion de charcos',
    description: 'Calcula area, profundidad y volumen de agua acumulada.',
    icon: 'ExperimentIcon',
    content: [
      { id: 'p8_f2_tabla', type: 'textarea', label: 'Tabla de charcos medidos:', placeholder: 'Charco 1: area 4.5 m2, profundidad 1.8 cm, volumen 81 litros...' },
      { id: 'p8_f2_grafica', type: 'file', label: 'Grafica de barras comparando volumen de cada charco:' },
      { id: 'p8_f2_porcentaje', type: 'textarea', label: 'Porcentaje del total que representa el charco mas grande:', placeholder: 'Explica el calculo paso a paso.' },
      { id: 'p8_f2_interpretacion', type: 'textarea', label: 'Interpretacion de los datos:', placeholder: 'Que zona requiere intervencion urgente y por que?', aiTask: 'reflection', aiPrompt: 'Revisa la interpretacion y agrega un argumento para convencer a la direccion.' },
    ],
  },
  {
    id: 812,
    title: 'P8 - Fase 3: Maqueta del patio sin charcos',
    description: 'Construye una maqueta a escala con la solucion propuesta.',
    icon: 'WaterDropIcon',
    content: [
      { id: 'p8_f3_diseno', type: 'textarea', label: 'Descripcion de la maqueta:', placeholder: 'Como representaran los charcos y la solucion (canal, jardin de lluvia, rejilla)?' },
      { id: 'p8_f3_materiales', type: 'textarea', label: 'Materiales utilizados:', placeholder: 'Carton, esponjas, plastilina, arena...' },
      { id: 'p8_f3_evidencia', type: 'file', label: 'Foto de la maqueta con la propuesta:' },
      { id: 'p8_f3_costos', type: 'textarea', label: 'Estimado de materiales o mano de obra (si aplica):', placeholder: 'Incluye costos aproximados si tienen datos.' },
    ],
  },
  {
    id: 813,
    title: 'P8 - Fase 4: Propuesta formal a la direccion',
    description: 'Prepara la infografia o carta de solicitud.',
    icon: 'PlanIcon',
    content: [
      { id: 'p8_f4_titulo', type: 'text', label: 'Titulo o asunto de la propuesta:', placeholder: 'Ej: Propuesta para una escuela sin charcos.' },
      { id: 'p8_f4_mapa', type: 'textarea', label: 'Como mostraran el mapa del problema:', placeholder: 'Plano del patio con puntos rojos, notas, legendas...' },
      { id: 'p8_f4_solucion', type: 'textarea', label: 'Solucion recomendada por el equipo:', placeholder: 'Describan la intervencion y quien la realizaria.' },
      { id: 'p8_f4_argumento', type: 'textarea', label: 'Argumento final para convencer a la direccion:', placeholder: 'Incluye beneficios para estudiantes y docentes.' },
    ],
  },
  {
    id: 814,
    title: 'P8 - Fase 5: Coevaluacion escolar',
    description: 'Valida la claridad de la propuesta para la direccion.',
    icon: 'TeamIcon',
    content: [
      { id: 'p8_f5_datos', type: 'textarea', label: 'Los datos de volumen son convincentes?', placeholder: 'Que otra evidencia necesitan?' },
      { id: 'p8_f5_maqueta', type: 'textarea', label: 'La maqueta explica bien la solucion?', placeholder: 'Que detalle agregaras para mostrar el flujo del agua?' },
      { id: 'p8_f5_plan', type: 'textarea', label: 'Siguiente paso antes de entregar la propuesta:', aiTask: 'reflection', aiPrompt: 'Analiza la coevaluacion y sugiere el movimiento final para convencer a la direccion escolar.' },
    ],
  },
];

export const DEFAULT_PROJECT_ORDER: ProjectId[] = [
  'project1',
  'project2',
  'project3',
  'project4',
  'project5',
  'project6',
  'project7',
  'project8',
];

export const PROJECT_DEFINITIONS: Record<ProjectId, ProjectDefinition> = {
  project1: {
    id: 'project1',
    title: 'Enfermedades relacionadas con el agua',
    mission: 'Investiga la conexion entre agua estancada y enfermedades para disenar una campana de prevencion.',
    summary: 'Analizan datos epidemiologicos, construyen una maqueta educativa y crean una infografia preventiva.',
    color: '#22d3ee',
    modules: p1Modules,
  },
  project2: {
    id: 'project2',
    title: 'Filtro casero de emergencia',
    mission: 'Disenar, construir y probar un filtro casero que mejore la claridad del agua.',
    summary: 'Experimentan con claridad y volumen, documentan la maqueta y preparan una guia DIY.',
    color: '#38bdf8',
    modules: p2Modules,
  },
  project3: {
    id: 'project3',
    title: 'Pavimento y absorcion',
    mission: 'Comparar superficies permeables e impermeables para proponer soluciones urbanas.',
    summary: 'Miden tiempos de absorcion, construyen un diorama y disenan una infografia sobre suelos inteligentes.',
    color: '#0ea5e9',
    modules: p3Modules,
  },
  project4: {
    id: 'project4',
    title: 'Pipas de agua, solucion o problema',
    mission: 'Analizar costos y logistica de las pipas para informar a la comunidad.',
    summary: 'Calculan costos por litro, construyen un mapa 3D y crean un directorio para consumidores.',
    color: '#22d3ee',
    modules: p4Modules,
  },
  project5: {
    id: 'project5',
    title: 'Baches y socavones',
    mission: 'Medir el impacto del agua en los baches y proponer reparaciones fundamentadas.',
    summary: 'Calculan volumen y costo de reparacion, montan un modelo del subsuelo y preparan una infografia.',
    color: '#06b6d4',
    modules: p5Modules,
  },
  project6: {
    id: 'project6',
    title: 'El relieve y su impacto',
    mission: 'Analizar pendientes y puntos bajos para explicar inundaciones recurrentes.',
    summary: 'Miden pendientes, construyen una maqueta topografica y preparan una propuesta para la direccion.',
    color: '#0891b2',
    modules: p6Modules,
  },
  project7: {
    id: 'project7',
    title: 'Alcantarillas obstruidas',
    mission: 'Investigar como la basura reduce la capacidad del drenaje y proponer una campana comunitaria.',
    summary: 'Calculan porcentajes de obstruccion, experimentan con embudos y lanzan la campana Adopta una Alcantarilla.',
    color: '#0f766e',
    modules: p7Modules,
  },
  project8: {
    id: 'project8',
    title: 'Encharcamientos en la escuela',
    mission: 'Mapear charcos dentro del plantel y proponer soluciones formales.',
    summary: 'Miden volumenes, construyen una maqueta del patio y preparan una solicitud para la direccion.',
    color: '#1d4ed8',
    modules: p8Modules,
  },
};

export const PROJECTS: ProjectDefinition[] = DEFAULT_PROJECT_ORDER.map((projectId) => PROJECT_DEFINITIONS[projectId]);

export const MODULES = BASE_MODULES;

export const getProjectDefinition = (projectId: ProjectId): ProjectDefinition => PROJECT_DEFINITIONS[projectId];

export const getModulesForProject = (projectId?: ProjectId): ModuleContent[] => {
  if (!projectId) {
    return BASE_MODULES;
  }
  const definition = PROJECT_DEFINITIONS[projectId];
  if (!definition) {
    return BASE_MODULES;
  }
  return [...BASE_MODULES, ...definition.modules];
};
