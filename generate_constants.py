from pathlib import Path

def s(value: str) -> str:
    return value.replace('\\', '\\\\').replace("'", "\\'")

def format_field(field: dict, indent: int = 6) -> str:
    parts = [f"{{ id: '{field['id']}', type: '{field['type']}'"]
    for key in ['label', 'placeholder', 'text', 'aiTask', 'aiPrompt']:
        if key in field:
            parts.append(f", {key}: '{s(field[key])}'")
    if 'options' in field:
        opts = ', '.join(f"'{s(opt)}'" for opt in field['options'])
        parts.append(f", options: [{opts}]")
    if 'optionsSource' in field:
        parts.append(f", optionsSource: '{field['optionsSource']}'")
    parts.append(' }')
    return ' ' * indent + ''.join(parts)

def format_module(module: dict) -> str:
    lines = [
        '  {',
        f"    id: {module['id']},",
        f"    title: '{s(module['title'])}',",
        f"    description: '{s(module['description'])}',",
        f"    icon: '{module['icon']}',",
        '    content: [',
    ]
    content_lines = []
    for field in module['content']:
        if field['type'] in ('info', 'header'):
            content_lines.append(format_field(field, indent=6))
        else:
            content_lines.append(format_field(field, indent=6))
    lines.extend(',\n'.join(content_lines).split('\n'))
    lines.append('    ],')
    lines.append('  }')
    return '\n'.join(lines)

def format_modules(name: str, modules: list[dict]) -> str:
    module_strings = ',\n'.join(format_module(m) for m in modules)
    return f"const {name}: ModuleContent[] = [\n{module_strings}\n];\n"

BASE_MODULES = [
    {
        'id': 1,
        'title': 'Mision 1: El ADN del Agua',
        'description': 'Formaremos nuestro equipo de Guardianes y definiremos las preguntas clave de nuestra investigacion.',
        'icon': 'TeamIcon',
        'content': [
            {'id': 'info_m1', 'type': 'info', 'text': 'Nuestra Mision: Usar el poder de los numeros para entender y proponer soluciones al problema del agua en nuestra comunidad.'},
            {'id': 'header_equipo', 'type': 'header', 'text': 'Seccion 1: Constitucion del Equipo'},
            {'id': 'rol_lider', 'type': 'select', 'label': 'Lider/Coordinador(a):', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'rol_investigador_principal', 'type': 'select', 'label': 'Investigador(a) principal:', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'rol_investigador_campo', 'type': 'select', 'label': 'Investigador(a) de campo:', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'rol_disenador', 'type': 'select', 'label': 'Disenador(a)/Arquitecto(a):', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'rol_comunicador', 'type': 'select', 'label': 'Comunicador(a)/Portavoz:', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'rol_escribano', 'type': 'select', 'label': 'Escribano(a)/Secretario(a):', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'rol_guardian_materiales', 'type': 'select', 'label': 'Guardian de materiales:', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'header_indagacion', 'type': 'header', 'text': 'Seccion 2: Indagacion inicial (lluvia de ideas)'},
            {'id': 'observaciones_comunidad', 'type': 'textarea', 'label': 'Anoten los problemas o hechos relacionados con el agua que conocen o investigaron en su comunidad:', 'placeholder': 'Ej: La calle se inunda, falta el agua, las pipas cuestan dinero...'},
            {'id': 'header_preguntas', 'type': 'header', 'text': 'Seccion 3: El puente a las matematicas'},
            {'id': 'info_preguntas', 'type': 'info', 'text': 'Elijan 3 de sus observaciones y transformenlas en preguntas que se puedan medir o contar.'},
            {'id': 'pregunta_1', 'type': 'textarea', 'label': 'Pregunta de investigacion 1:', 'placeholder': 'Ej: Cuantos litros de agua se acumulan por metro cuadrado?', 'aiTask': 'researchQuestion', 'aiPrompt': 'Evalua si la pregunta de investigacion es medible, clara y conecta con el cuidado del agua. Propon mejoras concretas.'},
            {'id': 'pregunta_2', 'type': 'textarea', 'label': 'Pregunta de investigacion 2:', 'placeholder': 'Ej: Cual es el costo promedio de una pipa para una familia?', 'aiTask': 'researchQuestion', 'aiPrompt': 'Evalua si la pregunta de investigacion es medible, clara y conecta con el cuidado del agua. Propon mejoras concretas.'},
            {'id': 'pregunta_3', 'type': 'textarea', 'label': 'Pregunta de investigacion 3:', 'placeholder': 'Escriban su tercera pregunta medible', 'aiTask': 'researchQuestion', 'aiPrompt': 'Evalua si la pregunta de investigacion es medible, clara y conecta con el cuidado del agua. Propon mejoras concretas.'},
        ],
    },
    {
        'id': 2,
        'title': 'Mision 2: Disenando nuestro plan de ataque',
        'description': 'Crearemos un plan detallado para investigar nuestra pregunta y recolectar los datos necesarios.',
        'icon': 'PlanIcon',
        'content': [
            {'id': 'header_pregunta_investigacion', 'type': 'header', 'text': 'Seccion 1: Nuestra pregunta de investigacion'},
            {'id': 'pregunta_elegida_m1', 'type': 'textarea', 'label': 'Transcriban aqui la pregunta que eligieron de la Mision 1:', 'placeholder': 'Copien la pregunta seleccionada por el equipo.', 'aiTask': 'researchQuestion', 'aiPrompt': 'Evalua si la pregunta seleccionada mantiene claridad y enfoque. Sugiere ajustes para hacerla mas precisa y medible.'},
            {'id': 'pregunta_refinada', 'type': 'textarea', 'label': 'Ahora, haganla mas especifica y medible (que van a medir o contar exactamente?):', 'placeholder': 'Ej: Cuantos litros de agua se estancan y que area en m2 cubre el charco?', 'aiTask': 'researchQuestion', 'aiPrompt': 'Evalua si la version refinada de la pregunta es especifica, medible y accionable. Propon ajustes en caso necesario.'},
            {'id': 'header_plan_accion', 'type': 'header', 'text': 'Seccion 2: El plan de accion'},
            {'id': 'info_plan_accion', 'type': 'info', 'text': 'Definan las acciones, materiales y responsables para su investigacion.'},
            {'id': 'accion_1', 'type': 'text', 'label': 'Accion 1 - Que haremos?', 'placeholder': 'Ej: Medir el area del charco.'},
            {'id': 'materiales_1', 'type': 'text', 'label': 'Accion 1 - Materiales a utilizar', 'placeholder': 'Ej: Cinta metrica, gis.'},
            {'id': 'rol_1', 'type': 'select', 'label': 'Accion 1 - Quien lidera?', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'tiempo_1', 'type': 'text', 'label': 'Accion 1 - Tiempo estimado', 'placeholder': 'Ej: 15 min.'},
            {'id': 'indicador_1', 'type': 'text', 'label': 'Accion 1 - Como sabremos que lo logramos?', 'placeholder': 'Ej: Tener las medidas en metros anotadas.'},
            {'id': 'accion_2', 'type': 'text', 'label': 'Accion 2 - Que haremos?', 'placeholder': 'Ej: Recolectar muestras para medir profundidad.'},
            {'id': 'materiales_2', 'type': 'text', 'label': 'Accion 2 - Materiales a utilizar', 'placeholder': 'Ej: 3 vasos de plastico, regla.'},
            {'id': 'rol_2', 'type': 'select', 'label': 'Accion 2 - Quien lidera?', 'placeholder': 'Selecciona al integrante responsable', 'optionsSource': 'teamMembers'},
            {'id': 'tiempo_2', 'type': 'text', 'label': 'Accion 2 - Tiempo estimado', 'placeholder': 'Ej: 10 min.'},
            {'id': 'indicador_2', 'type': 'text', 'label': 'Accion 2 - Como sabremos que lo logramos?', 'placeholder': 'Ej: Tener 3 mediciones de profundidad en cm.'},
            {'id': 'header_matematicas', 'type': 'header', 'text': 'Seccion 3: Las matematicas'},
            {'id': 'herramientas_matematicas', 'type': 'checkbox', 'label': 'Marquen las herramientas matematicas que van a utilizar:', 'options': ['Conteos', 'Promedios', 'Mediciones', 'Porcentajes', 'Op. basicas', 'Tablas/Graficas']},
            {'id': 'header_comunicacion', 'type': 'header', 'text': 'Seccion 4: Comunicando descubrimientos'},
            {'id': 'info_maqueta', 'type': 'info', 'text': 'Recuerden que la maqueta del experimento o solucion es obligatoria.'},
            {'id': 'metodo_comunicacion', 'type': 'radio', 'label': 'Elijan como van a comunicar los hallazgos de su maqueta:', 'options': ['Infografia', 'Video corto', 'Presentacion', 'Exposicion']},
            {'id': 'header_valores', 'type': 'header', 'text': 'Seccion 5: Valores en accion'},
            {'id': 'valor_equipo', 'type': 'select', 'label': 'Como equipo, elijan el valor mas importante que necesitaran para esta mision:', 'options': ['Paciencia', 'Comunicacion', 'Respeto', 'Colaboracion', 'Creatividad']},
        ],
    },
    {
        'id': 3,
        'title': 'Mision 3: Laboratorio de hidraulica urbana',
        'description': 'Manos a la obra: construyan, experimenten y documenten su maqueta.',
        'icon': 'ExperimentIcon',
        'content': [
            {'id': 'info_m3_intro', 'type': 'info', 'text': 'En esta fase pasaran de la planificacion a la accion. Construiran sus modelos y los pondran a prueba para generar sus propios datos.'},
            {'id': 'header_diseno', 'type': 'header', 'text': 'Momento 1: Diseno y calculo (La mesa del arquitecto)'},
            {'id': 'boceto_maqueta', 'type': 'file', 'label': 'Diseno del boceto: Suban una foto clara del boceto detallado de su maqueta.'},
            {'id': 'calculos_previos', 'type': 'textarea', 'label': 'Calculos y dimensiones: Anoten aqui los calculos de area y volumen que realizaron para planificar su maqueta.', 'placeholder': 'Ej: Calle 50cm x 20cm. Volumen estimado de agua: 500 ml.'},
            {'id': 'variables_medir', 'type': 'textarea', 'label': 'Variables a medir: Definan las variables que observaran durante la simulacion.', 'placeholder': 'Ej: Altura del agua (cm) cada 10 segundos.'},
            {'id': 'header_construccion', 'type': 'header', 'text': 'Momento 2: Construccion (Manos a la obra)'},
            {'id': 'materiales_utilizados', 'type': 'textarea', 'label': 'Materiales utilizados:', 'placeholder': 'Enumera los materiales reciclados o comprados que usaron.'},
            {'id': 'foto_maqueta_final', 'type': 'file', 'label': 'Maqueta terminada: Suban una o varias fotos de su maqueta.'},
            {'id': 'header_simulacion', 'type': 'header', 'text': 'Momento 3: La simulacion (El dia de la inundacion)'},
            {'id': 'info_error_inteligente', 'type': 'info', 'text': 'Si la maqueta tiene fugas o algo no sale como esperaban, no es un fracaso. Registren los datos y aprendan de ellos.'},
            {'id': 'cantidad_agua_simulacion', 'type': 'text', 'label': 'Cantidad de agua utilizada en la simulacion (ml):', 'placeholder': 'Ej: 1500'},
            {'id': 'registro_resultados', 'type': 'textarea', 'label': 'Registro de resultados:', 'placeholder': 'Describe cada prueba, tiempos, medidas y observaciones.'},
            {'id': 'foto_video_simulacion', 'type': 'file', 'label': 'Evidencia de la simulacion: Foto o video corto (max 1 minuto).'},
            {'id': 'conclusiones_experimento', 'type': 'textarea', 'label': 'Conclusiones del experimento:', 'placeholder': 'Que aprendieron? Que cambiarias en la siguiente iteracion?'},
        ],
    },
]

# Additional project modules
PROJECT_MODULES_DATA = {
    'project1': {
        'title': 'Enfermedades relacionadas con el agua',
        'mission': 'Investigar la relacion entre agua contaminada y enfermedades para crear una campana preventiva basada en datos.',
        'summary': 'Analizan casos de enfermedades, construyen un modelo educativo y crean una campana de prevencion.',
        'color': '#38bdf8',
        'modules': [
            {
                'id': 110,
                'title': 'P1 · Fase 1: Indagacion enfocada',
                'description': 'Identifiquen la pregunta central sobre salud y agua.',
                'icon': 'PlanIcon',
                'content': [
                    {'id': 'p1_f1_info', 'type': 'info', 'text': 'Revisa tu bitacora y selecciona la pregunta principal relacionada con enfermedades y agua estancada.'},
                    {'id': 'p1_f1_pregunta', 'type': 'textarea', 'label': 'Pregunta principal sobre salud y agua:', 'placeholder': 'Escribe la pregunta que eligieron.'},
                    {'id': 'p1_f1_fuentes', 'type': 'textarea', 'label': 'Fuentes que consultaran para responderla:', 'placeholder': 'Menciona centros de salud, noticias o entrevistas planeadas.'},
                ],
            },
            {
                'id': 111,
                'title': 'P1 · Fase 2: Epidemiologia en accion',
                'description': 'Recolecten y analicen datos sobre enfermedades relacionadas con el agua.',
                'icon': 'ExperimentIcon',
                'content': [
                    {'id': 'p1_f2_tabla', 'type': 'textarea', 'label': 'Resumen de su tabla de casos mensuales:', 'placeholder': 'Describe los datos que registraron en la tabla (mes y numero de casos).'},
                    {'id': 'p1_f2_grafica', 'type': 'file', 'label': 'Evidencia de su grafica de lineas (foto o captura).'},
                    {'id': 'p1_f2_patrones', 'type': 'textarea', 'label': 'Patrones observados en la grafica:', 'placeholder': 'Ej: Los casos aumentan en meses de lluvia.'},
                    {'id': 'p1_f2_porcentajes', 'type': 'textarea', 'label': 'Calculos de porcentaje de aumento y tasa de incidencia:', 'placeholder': 'Incluye los valores que obtuvieron y explica que significan.'},
                ],
            },
            {
                'id': 112,
                'title': 'P1 · Fase 3: Maqueta educativa',
                'description': 'Construyan el modelo que explique el problema.',
                'icon': 'WaterDropIcon',
                'content': [
                    {'id': 'p1_f3_diseno', 'type': 'textarea', 'label': 'Describe el diseno de su modelo 3D o diorama:', 'placeholder': 'Que elementos incluye y que representa cada uno?'},
                    {'id': 'p1_f3_materiales', 'type': 'textarea', 'label': 'Materiales utilizados en la maqueta:', 'placeholder': 'Lista de materiales reciclados o escolares.'},
                    {'id': 'p1_f3_evidencia', 'type': 'file', 'label': 'Foto de la maqueta terminada:'},
                ],
            },
            {
                'id': 113,
                'title': 'P1 · Fase 4: Infografia preventiva',
                'description': 'Disenando la campana de prevencion.',
                'icon': 'PlanIcon',
                'content': [
                    {'id': 'p1_f4_guion', 'type': 'textarea', 'label': 'Plan para la infografia:', 'placeholder': 'Describe el titulo, dato impactante, causa y soluciones que incluiran.'},\n```
