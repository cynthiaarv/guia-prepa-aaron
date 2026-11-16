(() => {
  let serial = 0;
  const F = [];
  const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const shuffle = a => [...a].sort(()=>Math.random()-.5);
  const uniq = a => [...new Set(a.map(x=>String(x)))];

  function make(area, topic, subtopic, prompt, correct, distractors, explanation, extra={}) {
    let opts = uniq([correct, ...(distractors||[])]);
    while (opts.length < 4) opts.push("Ninguna de las anteriores " + (opts.length+1));
    opts = shuffle(opts.slice(0,4));
    return {
      id: "GEN-" + Date.now().toString(36) + "-" + (++serial) + "-" + Math.random().toString(36).slice(2,7),
      area, topic, subtopic, q: prompt, options: opts, answer: opts.indexOf(String(correct)),
      explanation, generated: true, ...extra
    };
  }
  function add(area,topic,subtopic,fn){ F.push(()=>fn(area,topic,subtopic)); }
  function addStatic(area,topic,subtopic,items){
    add(area,topic,subtopic,(a,t,s)=>{
      const x=pick(items);
      return make(a,t,s,x[0],x[1],x[2],x[3],x[4]||{});
    });
  }

  // HABILIDAD COGNOSCITIVA
  add("Habilidad cognoscitiva","Transformaciones lógicas","Orden de letras y números",(a,t,s)=>{
    const letters=shuffle(["M","R","S","T","K","P"]).slice(0,2), nums=shuffle(["3","5","7","8","11","14"]).slice(0,2);
    const order=shuffle([letters[0],letters[1],nums[0],nums[1]]);
    const [w,x,y,z]=order;
    const prompt=`¿Qué orden cumple todas las condiciones? ${w} está antes que ${x}; ${x} está al lado de ${y}; ${y} está antes que ${z}; ${w} está antes que ${z}.`;
    const perms=shuffle([
      order.join(""),
      [x,w,y,z].join(""),
      [w,y,x,z].join(""),
      [z,y,x,w].join(""),
      [y,w,z,x].join("")
    ]).filter((v,i,ar)=>ar.indexOf(v)===i);
    return make(a,t,s,prompt,order.join(""),perms.filter(v=>v!==order.join("")).slice(0,3),"Revisa cada relación en orden. La opción correcta es la única que satisface simultáneamente las cuatro condiciones.");
  });
  addStatic("Habilidad cognoscitiva","Relaciones","Metáforas",[
    ["En la frase «su voz era terciopelo», ¿qué significa la metáfora?","Su voz era suave y agradable",["Su voz era de tela","Su voz era muy fuerte","No podía hablar"],"La metáfora compara la cualidad de la voz con la suavidad del terciopelo."],
    ["«Ese problema es una montaña». ¿Qué expresa la metáfora?","Que el problema parece muy difícil",["Que el problema está en una montaña","Que es un problema pequeño","Que se resolvió fácilmente"],"La montaña representa una dificultad grande."],
    ["«Mi abuelo es un libro abierto». ¿Qué idea comunica?","Que expresa con claridad lo que piensa o siente",["Que siempre lleva un libro","Que no habla con nadie","Que trabaja en una biblioteca"],"Un «libro abierto» representa transparencia o facilidad para conocer a alguien."]
  ]);
  addStatic("Habilidad cognoscitiva","Relaciones","Analogías",[
    ["Brújula es a orientación como termómetro es a:","temperatura",["velocidad","distancia","peso"],"La relación es instrumento y magnitud o información que permite conocer."],
    ["Semilla es a planta como huevo es a:","ave",["nido","pluma","árbol"],"La relación es origen o etapa inicial respecto del organismo que se desarrolla."],
    ["Página es a libro como ladrillo es a:","muro",["cemento","ventana","techo"],"La relación es parte constitutiva respecto de un todo."]
  ]);
  add("Habilidad cognoscitiva","Patrones","Secuencias complejas",(a,t,s)=>{
    const kind=rand(0,3);
    if(kind===0){ const st=rand(2,9),d=rand(2,8); const seq=[0,1,2,3].map(i=>st+i*d); const ans=st+4*d; return make(a,t,s,`Completa la secuencia: ${seq.join(", ")}, ___`,ans,[ans+d,ans-d,ans+1],"La secuencia aumenta siempre la misma cantidad: "+d+".");}
    if(kind===1){ const n=rand(2,5); const seq=[n*n,(n+1)**2,(n+2)**2,(n+3)**2]; const ans=(n+4)**2; return make(a,t,s,`Completa la secuencia: ${seq.join(", ")}, ___`,ans,[ans-2*(n+4)+1,ans+2*(n+4)+1,(n+5)**2],"Son cuadrados consecutivos.");}
    if(kind===2){ const st=rand(2,6),r=2; const seq=[st,st*r,st*r*r,st*r*r*r]; const ans=st*r**4; return make(a,t,s,`Completa la secuencia: ${seq.join(", ")}, ___`,ans,[ans/2,ans+st,ans*2],"Cada término se obtiene multiplicando por 2.");}
    const a1=rand(2,8),b1=rand(10,20); const seq=[a1,b1,a1+2,b1-2,a1+4,b1-4]; const ans=a1+6; return make(a,t,s,`Completa la secuencia: ${seq.join(", ")}, ___`,ans,[b1-6,a1+8,b1-8],"Hay dos secuencias intercaladas: una aumenta de 2 en 2 y la otra disminuye de 2 en 2.");
  });
  add("Habilidad cognoscitiva","Patrones","Matrices",(a,t,s)=>{
    const x=rand(1,7), y=rand(2,8), k=rand(1,5);
    const row1=[x,y,x+y+k], row2=[x+1,y+1,x+y+k+2], ans=x+y+k+4;
    const stim=`${row1.join(" | ")}\\n${row2.join(" | ")}\\n${x+2} | ${y+2} | ?`;
    return make(a,t,s,"En cada fila, el tercer número se obtiene sumando los dos primeros y agregando una constante. ¿Qué número falta?",ans,[ans-2,ans+2,x+y+k],`En la primera fila: ${x}+${y}+${k}=${row1[2]}. La misma regla se mantiene; por eso el valor faltante es ${ans}.`,{stimulus:stim});
  });
  addStatic("Habilidad cognoscitiva","Consideraciones lógicas","Diagramas y conjuntos",[
    ["Todos los músicos pertenecen al club A. Ningún integrante del club A pertenece al club B. Si Elena es música, ¿qué debe ser cierto?","Elena no pertenece al club B",["Elena pertenece al club B","Elena no pertenece al club A","Elena dirige ambos clubes"],"Si todos los músicos están en A y A no comparte integrantes con B, Elena no puede estar en B."],
    ["Todos los robles son árboles. Algunos árboles son muy altos. ¿Qué afirmación es necesariamente correcta?","Todo roble es árbol",["Todo árbol es roble","Todo roble es muy alto","Ningún árbol es alto"],"La única conclusión garantizada por las premisas es que todo roble pertenece al conjunto de árboles."],
    ["Ningún triángulo es círculo. La figura X es un triángulo. ¿Qué conclusión es válida?","X no es un círculo",["X es un círculo","X puede ser círculo y triángulo","X no es una figura"],"La exclusión entre ambos conjuntos hace imposible que X sea un círculo."]
  ]);
  addStatic("Habilidad cognoscitiva","Consideraciones lógicas","Razonamiento condicional",[
    ["Si estudio, termino la guía. Si termino la guía, puedo hacer el simulacro. Estudié. ¿Qué se concluye?","Puedo hacer el simulacro",["No terminé la guía","No estudié","El simulacro se cancela"],"Aplicando las dos condiciones en cadena: estudiar implica terminar la guía, y terminarla implica poder hacer el simulacro."],
    ["Si una tarjeta es azul, entonces tiene un círculo. La tarjeta no tiene círculo. ¿Qué se concluye?","La tarjeta no es azul",["La tarjeta es azul","La tarjeta es roja necesariamente","No se puede saber nada"],"Por contraposición: si ser azul implica tener círculo y no tiene círculo, entonces no puede ser azul."],
    ["Todos los atletas entrenan. Diego no entrena. ¿Qué conclusión es válida?","Diego no es atleta",["Diego es atleta","Todos los que entrenan son atletas","Diego entrena en secreto"],"Si todos los atletas entrenan, alguien que no entrena no puede pertenecer al conjunto de atletas."]
  ]);
  addStatic("Habilidad cognoscitiva","Razonamiento práctico","Solución de problemas cotidianos",[
    ["Tienes que llegar a una cita a las 5:00 p. m. El trayecto dura 35 minutos y quieres llegar 10 minutos antes. ¿A qué hora deberías salir como máximo?","4:15 p. m.",["4:25 p. m.","4:35 p. m.","4:05 p. m."],"Debes llegar a las 4:50; restando 35 minutos, la salida máxima es 4:15."],
    ["Un equipo tiene una sola computadora disponible y tres tareas urgentes: una tarda 10 min y vence en 20, otra 30 min y vence en 2 h, y otra 15 min y vence en 1 h. ¿Cuál conviene hacer primero?","La de 10 minutos que vence en 20",["La de 30 minutos","La de 15 minutos","Cualquiera da lo mismo"],"La primera tarea tiene el plazo más cercano y puede terminarse antes de vencer."],
    ["Un recipiente pierde agua. Antes de comprar otro, ¿qué acción es más útil para identificar la causa?","Revisar de dónde proviene exactamente la fuga",["Llenarlo más","Pintarlo","Cambiarlo de lugar sin revisarlo"],"Primero conviene identificar la causa concreta para elegir una solución adecuada."]
  ]);

  // ESPAÑOL — LENGUA
  addStatic("Español","Lengua","Mayúsculas y minúsculas",[
    ["¿Cuál oración está escrita correctamente?","La Organización Mundial de la Salud publicó el informe.",["La organización Mundial de la salud publicó el informe.","La Organización mundial De la Salud publicó el informe.","la Organización Mundial de la Salud publicó el informe."],"Los nombres oficiales de instituciones llevan mayúscula inicial en sus palabras significativas."],
    ["¿Cuál opción usa correctamente las mayúsculas?","El lunes visitaremos Oaxaca.",["El Lunes visitaremos oaxaca.","El lunes visitaremos oaxaca.","el lunes visitaremos Oaxaca."],"Los días se escriben con minúscula y los nombres propios, como Oaxaca, con mayúscula."],
    ["¿Cuál está escrita correctamente?","La ONU celebró una reunión en México.",["La onu celebró una reunión en méxico.","La Onu celebró una reunión en México.","la ONU celebró una reunión en México."],"Las siglas se escriben con mayúsculas y los nombres propios también."]
  ]);
  addStatic("Español","Lengua","Acentuación regular y especial",[
    ["¿Cuál oración usa correctamente la tilde diacrítica?","Tú sabes que él llegará tarde.",["Tu sabes que el llegará tarde.","Tú sabes que el llegara tarde.","Tu sabes que él llegara tarde."],"«Tú» y «él» llevan tilde cuando son pronombres; «llegará» es palabra aguda terminada en vocal."],
    ["¿Cuál palabra está correctamente acentuada?","también",["tambien","tambi én","tambíen"],"«También» es aguda terminada en n y lleva tilde."],
    ["¿Cuál oración está escrita correctamente?","No sé cuándo empieza la función.",["No se cuando empieza la función.","No sé cuando empieza la funcion.","No se cuándo empieza la función."],"«Sé» lleva tilde diacrítica, «cuándo» en interrogación indirecta y «función» por ser aguda terminada en n."]
  ]);
  addStatic("Español","Lengua","Palabras juntas o separadas",[
    ["Elige la oración correcta.","No fui porque estaba enfermo.",["No fui por que estaba enfermo.","No fui porqué estaba enfermo.","No fui por qué estaba enfermo."],"«Porque» introduce una causa o explicación."],
    ["Elige la oración correcta.","No entiendo por qué cambió de opinión.",["No entiendo porque cambió de opinión.","No entiendo porqué cambió de opinión.","No entiendo por que cambió de opinión."],"En una pregunta indirecta se escribe «por qué» separado y con tilde."],
    ["Elige la opción correcta.","Había demasiadas personas; los demás esperaron afuera.",["Había de más personas; los de más esperaron afuera.","Había demás personas; los de mas esperaron afuera.","Había de más personas; los demás esperaron afuera."],"«Demasiadas» expresa cantidad; «los demás» significa las otras personas."]
  ]);
  addStatic("Español","Lengua","Sufijos y prefijos",[
    ["¿Qué significa el prefijo «pre-» en «prehistoria»?","anterioridad",["negación","repetición","superioridad"],"El prefijo «pre-» indica anterioridad."],
    ["¿Qué idea aporta el sufijo «-mente» en «cuidadosamente»?","forma o manera",["lugar","tamaño","negación"],"«-mente» forma adverbios que expresan modo."],
    ["En «desconectar», ¿qué aporta el prefijo «des-»?","inversión o negación de la acción",["aumento","tiempo futuro","lugar"],"«Des-» suele expresar negación, privación o inversión."]
  ]);
  addStatic("Español","Lengua","Homófonos, homónimos y parónimos",[
    ["Completa correctamente: «Voy a ___ por el candidato que propuso mejorar la escuela».","votar",["botar","votarh","bottar"],"«Votar» significa emitir un voto; «botar» significa arrojar o desechar."],
    ["¿Cuál palabra completa correctamente? «El científico decidió ___ el resultado con otro experimento».","confirmar",["conformar","confimar","confinar"],"«Confirmar» significa comprobar o ratificar; las otras palabras tienen significados distintos."],
    ["Completa: «La maestra pidió ___ el documento antes de enviarlo».","revisar",["revezar","rebisar","revisár"],"«Revisar» es examinar o comprobar algo."]
  ]);
  addStatic("Español","Lengua","Verbos irregulares, participio y gerundio",[
    ["¿Cuál oración es correcta?","Ayer conduje hasta la escuela.",["Ayer conducí hasta la escuela.","Ayer conducíe hasta la escuela.","Ayer condujó hasta la escuela."],"El pretérito de «conducir» en primera persona es «conduje»."],
    ["¿Cuál participio es correcto?","He escrito tres páginas.",["He escribido tres páginas.","He escreído tres páginas.","He escribiendo tres páginas."],"El participio irregular de «escribir» es «escrito»."],
    ["¿Cuál oración usa correctamente el gerundio?","Entró al salón sonriendo.",["Entró al salón sonreído.","Entró al salón sonreír.","Entró al salón sonrióndo."],"«Sonriendo» expresa una acción simultánea y es el gerundio correcto."]
  ]);
  addStatic("Español","Lengua","Complementos del verbo",[
    ["En «María entregó el proyecto al profesor», ¿cuál es el complemento directo?","el proyecto",["María","al profesor","entregó"],"Lo entregado es «el proyecto»; recibe directamente la acción del verbo."],
    ["En «Luis habló con su entrenador después del partido», ¿qué grupo funciona como complemento circunstancial de tiempo?","después del partido",["Luis","con su entrenador","habló"],"«Después del partido» indica cuándo ocurrió la acción."],
    ["En «Ana dio un consejo a su amiga», ¿cuál es el complemento indirecto?","a su amiga",["un consejo","Ana","dio"],"«A su amiga» señala a quién se destina la acción."]
  ]);
  addStatic("Español","Lengua","Concordancia sujeto-verbo",[
    ["¿Cuál oración presenta concordancia correcta?","El grupo de alumnos llegó temprano.",["El grupo de alumnos llegaron temprano.","El grupo de alumnos llegarón temprano.","El grupo de alumnos llegar temprano."],"El núcleo del sujeto es «grupo», singular, por eso el verbo va en singular."],
    ["¿Cuál oración es correcta?","Las noticias fueron sorprendentes.",["Las noticias fue sorprendentes.","Las noticias fueron sorprendente.","Las noticia fueron sorprendentes."],"Sujeto, verbo y atributo deben concordar en número."],
    ["¿Cuál oración es correcta?","Cada uno de los jugadores recibió una medalla.",["Cada uno de los jugadores recibieron una medalla.","Cada uno de los jugadores recibieron medallas.","Cada unos de los jugadores recibió una medalla."],"El núcleo «cada uno» exige verbo en singular."]
  ]);
  addStatic("Español","Lengua","Orden de los componentes de la oración",[
    ["¿Cuál oración tiene un orden claro y correcto?","Aarón terminó la tarea antes de entrenar.",["Terminó Aarón antes de entrenar la tarea.","La tarea antes Aarón terminó de entrenar.","Antes la tarea entrenar Aarón terminó."],"El orden sujeto-verbo-complementos facilita claridad y comprensión."],
    ["Ordena mentalmente los elementos: «mañana / presentará / el equipo / su proyecto».","El equipo presentará su proyecto mañana.",["Mañana su proyecto el equipo presentará.","Presentará mañana su el equipo proyecto.","Su proyecto mañana presentará equipo el."],"La oración conserva un orden sintáctico claro: sujeto, verbo, complemento y circunstancial."],
    ["¿Cuál versión es más clara?","Mis compañeros entregaron hoy el reporte final.",["Hoy el final mis reporte compañeros entregaron.","Entregaron mis hoy compañeros reporte el final.","El reporte hoy final compañeros mis entregaron."],"La colocación ordenada de los componentes evita ambigüedad."]
  ]);
  addStatic("Español","Lengua","Preposiciones",[
    ["Completa: «Llegaremos ___ Monterrey por la tarde».","a",["en","de","por"],"Con verbos de movimiento hacia un destino se usa normalmente «a»."],
    ["Completa: «El libro está ___ la mesa».","sobre",["hacia","desde","contra"],"«Sobre» expresa ubicación encima de una superficie."],
    ["Completa: «Estudio ___ mejorar mi resultado».","para",["desde","contra","ante"],"«Para» expresa finalidad."]
  ]);

  const spPassages=[
    {text:"En una colonia se instaló un sistema de captación de lluvia en la escuela. El agua recolectada no se usa para beber, sino para limpiar patios y regar jardines. Durante los primeros meses, el consumo de agua potable para esas tareas disminuyó.", main:"La captación de lluvia permitió reducir el uso de agua potable en algunas tareas escolares.", detail:"El agua recolectada se utiliza para limpiar patios y regar jardines.", infer:"El sistema ayuda a aprovechar un recurso que antes se desperdiciaba.", title:"Aprovechamiento de lluvia en la escuela"},
    {text:"Una biblioteca amplió su horario durante la temporada de exámenes. Antes cerraba a las seis; ahora permanece abierta hasta las nueve. La medida se tomó después de que muchos estudiantes pidieran más tiempo para estudiar en un espacio tranquilo.", main:"La biblioteca extendió su horario para responder a una necesidad de los estudiantes.", detail:"Ahora la biblioteca cierra a las nueve.", infer:"La administración tomó en cuenta las solicitudes estudiantiles.", title:"Más tiempo para estudiar"},
    {text:"Las abejas transportan polen de una flor a otra mientras buscan alimento. Ese proceso favorece la reproducción de numerosas plantas. Por eso, la disminución de poblaciones de abejas puede afectar también a ecosistemas y cultivos.", main:"Las abejas cumplen una función importante en la reproducción de muchas plantas.", detail:"Las abejas transportan polen entre flores.", infer:"Una reducción importante de abejas puede perjudicar la producción de ciertas plantas.", title:"La importancia de las abejas"}
  ];
  add("Español","Comprensión y análisis de lectura","Idea central e ideas secundarias",(a,t,s)=>{const p=pick(spPassages);return make(a,t,s,"¿Cuál es la idea central del texto?",p.main,[p.detail,p.title,"El texto solo enumera datos sin una idea central."],"La idea central resume el mensaje global, mientras que los detalles apoyan esa idea.",{stimulus:p.text});});
  add("Español","Comprensión y análisis de lectura","Información explícita",(a,t,s)=>{const p=pick(spPassages);return make(a,t,s,"¿Qué información aparece de manera explícita en el texto?",p.detail,[p.infer,p.main,"Ninguna de las anteriores"],"La respuesta correcta está expresada directamente en el texto.",{stimulus:p.text});});
  add("Español","Comprensión y análisis de lectura","Información implícita e inferencias",(a,t,s)=>{const p=pick(spPassages);return make(a,t,s,"¿Qué se puede inferir razonablemente a partir del texto?",p.infer,[p.detail,"El texto demuestra lo contrario.","No se puede inferir nada."],"Una inferencia se obtiene combinando información del texto sin que la conclusión aparezca literalmente.",{stimulus:p.text});});
  add("Español","Comprensión y análisis de lectura","Título de una lectura",(a,t,s)=>{const p=pick(spPassages);return make(a,t,s,"¿Cuál sería el título más adecuado?",p.title,[p.detail,"Datos sin relación","Una historia completamente diferente"],"El mejor título resume el tema central del texto.",{stimulus:p.text});});
  addStatic("Español","Comprensión y análisis de lectura","Significado en contexto",[
    ["En «la medida fue bien recibida por los estudiantes», ¿qué significa «medida»?","decisión o acción adoptada",["unidad de longitud","tamaño físico","cantidad exacta"],"El contexto indica que «medida» se refiere a una decisión tomada."],
    ["En «el científico descartó esa hipótesis», ¿qué significa «descartó»?","la rechazó después de evaluarla",["la guardó","la publicó","la repitió"],"En contexto, «descartar» significa excluir una posibilidad."],
    ["En «la propuesta generó resistencia», ¿qué significa «resistencia»?","oposición",["velocidad","silencio","celebración"],"Aquí «resistencia» se usa como oposición a una idea o cambio."]
  ]);
  addStatic("Español","Comprensión y análisis de lectura","Estructura y elementos de un texto literario",[
    ["En una narración, ¿qué elemento indica dónde y cuándo ocurren los hechos?","ambiente",["rima","tesis","bibliografía"],"El ambiente comprende el espacio y el tiempo de la historia."],
    ["¿Cómo se llama el personaje que enfrenta el conflicto principal de una narración?","protagonista",["editor","narratario","verso"],"El protagonista ocupa el centro de la acción principal."],
    ["¿Qué elemento organiza los acontecimientos de una narración?","trama",["métrica","nota al pie","definición"],"La trama es la secuencia de acontecimientos que estructura la historia."]
  ]);
  addStatic("Español","Comprensión y análisis de lectura","Tipología discursiva y géneros literarios",[
    ["Un texto que presenta razones para defender una postura es principalmente:","argumentativo",["narrativo","descriptivo","instructivo únicamente"],"El texto argumentativo busca sostener una postura mediante razones."],
    ["Un texto que cuenta una serie de acontecimientos con personajes es principalmente:","narrativo",["argumentativo","expositivo técnico","lista de datos"],"La narración organiza acciones y acontecimientos en el tiempo."],
    ["Una obra escrita para ser representada por actores pertenece al género:","dramático",["lírico exclusivamente","ensayístico","periodístico"],"El género dramático se construye para la representación escénica."]
  ]);
  addStatic("Español","Comprensión y análisis de lectura","Recursos literarios",[
    ["«Tus ojos brillan como estrellas» es un ejemplo de:","símil",["metáfora","hipérbole","paradoja"],"El símil establece una comparación explícita mediante «como»."],
    ["«El viento susurraba entre los árboles» es un ejemplo de:","personificación",["paradoja","enumeración","eufemismo"],"Se atribuye al viento una acción humana: susurrar."],
    ["«Te lo he dicho un millón de veces» es un ejemplo de:","hipérbole",["símil","metonimia","paradoja"],"La hipérbole exagera deliberadamente una idea."]
  ]);
  addStatic("Español","Comprensión y análisis de lectura","Conclusiones",[
    ["Un texto explica que una planta recibió menos luz durante semanas y creció menos que las demás. ¿Qué conclusión está mejor apoyada?","La cantidad de luz pudo influir en su crecimiento",["Toda planta sin luz muere inmediatamente","La luz no tiene relación con las plantas","La planta necesariamente estaba enferma"],"La conclusión debe apoyarse en la evidencia presentada sin ir más allá de ella."],
    ["Si una encuesta muestra que 8 de cada 10 alumnos prefieren estudiar en silencio, ¿qué conclusión es válida?","En ese grupo, la mayoría prefiere estudiar en silencio",["Todos los estudiantes del país estudian en silencio","Nadie estudia con música","El silencio garantiza mejores calificaciones"],"La conclusión válida se limita a la información de la encuesta."],
    ["Si los datos muestran que el tráfico disminuyó después de abrir una nueva ruta, ¿qué conclusión prudente puede formularse?","La nueva ruta pudo contribuir a reducir el tráfico",["La nueva ruta eliminó todo el tráfico","El tráfico nunca volverá a aumentar","No existe relación posible"],"Una conclusión adecuada reconoce la asociación sin afirmar más de lo que los datos permiten."]
  ]);

  // ESPAÑOL — REDACCIÓN
  addStatic("Español","Destrezas de redacción","Oración para comenzar un texto",[
    ["Un texto explicará cómo el ejercicio regular beneficia al cuerpo. ¿Cuál es el mejor inicio?","La actividad física frecuente puede mejorar distintos aspectos de la salud.",["Ayer compré unos tenis nuevos.","Los deportes tienen muchos colores.","Por último, conviene dormir temprano."],"El inicio adecuado introduce directamente el tema general."],
    ["Un texto tratará sobre el uso responsable de redes sociales. ¿Cuál es el mejor comienzo?","Las redes sociales ofrecen ventajas, pero también exigen decisiones responsables.",["Mi aplicación favorita cambió de logo.","En conclusión, todo está resuelto.","El teléfono pesa 180 gramos."],"La oración introduce el tema y prepara el desarrollo."],
    ["Un texto explicará por qué es importante ahorrar agua. ¿Cuál inicio es más adecuado?","El agua dulce disponible es limitada, por lo que usarla con cuidado resulta esencial.",["Mi vaso favorito es azul.","Ayer llovió durante veinte minutos.","Finalmente, cerramos la llave."],"Un buen inicio presenta el asunto central que se desarrollará."]
  ]);
  addStatic("Español","Destrezas de redacción","Oración para concluir o resumir",[
    ["Después de un texto sobre hábitos de estudio constantes, ¿cuál es la mejor conclusión?","En síntesis, estudiar con regularidad facilita una preparación más sólida.",["Mi escritorio tiene tres cajones.","Ayer estudié matemáticas.","Los cuadernos pueden ser de muchos tamaños."],"La conclusión resume y cierra la idea principal."],
    ["Un texto explica ventajas de reciclar. ¿Cuál cierre es más adecuado?","Por ello, separar y reutilizar materiales puede reducir parte de los residuos que generamos.",["El plástico puede ser transparente.","Mi vecino compró un contenedor.","Existen camiones de distintos tamaños."],"El cierre retoma la idea principal y deriva una consecuencia."],
    ["Un texto analiza la importancia de dormir bien. ¿Cuál es la mejor conclusión?","En conclusión, un descanso suficiente favorece tanto el rendimiento como el bienestar.",["Las almohadas pueden ser blandas.","La noche empieza al oscurecer.","Algunas personas leen antes de dormir."],"La oración resume de manera coherente el contenido."]
  ]);
  addStatic("Español","Destrezas de redacción","Oración sin relación directa",[
    ["Tema: beneficios de leer. ¿Cuál oración rompe la coherencia?","Los automóviles eléctricos utilizan baterías.",["Leer amplía el vocabulario.","La lectura permite conocer otras perspectivas.","Leer con frecuencia puede mejorar la comprensión."],"La oración sobre automóviles no se relaciona con el tema de la lectura."],
    ["Tema: alimentación equilibrada. ¿Cuál oración está fuera de tema?","Los eclipses ocurren cuando se alinean ciertos cuerpos celestes.",["Una dieta variada aporta distintos nutrientes.","Las frutas y verduras pueden formar parte de una alimentación equilibrada.","La hidratación también es importante."],"La oración sobre eclipses no guarda relación con la alimentación."],
    ["Tema: seguridad vial. ¿Cuál oración sobra?","Las ballenas migran grandes distancias.",["Usar cinturón reduce riesgos.","Respetar los límites de velocidad es importante.","Los peatones deben cruzar por zonas seguras."],"La oración sobre ballenas rompe la unidad temática."]
  ]);
  addStatic("Español","Destrezas de redacción","Secuencia lógica",[
    ["Ordena las acciones para enviar una tarea digital: 1) revisar el archivo, 2) subirlo, 3) presionar enviar, 4) comprobar que se cargó correctamente.","1-2-4-3",["2-1-3-4","3-1-2-4","4-3-2-1"],"Primero se revisa, luego se sube, se comprueba la carga y finalmente se envía."],
    ["Orden lógico para preparar una exposición: 1) investigar, 2) organizar ideas, 3) elaborar diapositivas, 4) ensayar.","1-2-3-4",["4-3-2-1","2-1-4-3","1-3-2-4"],"La preparación avanza desde la investigación hasta el ensayo final."],
    ["Orden lógico para resolver un problema: 1) identificar datos, 2) elegir estrategia, 3) ejecutar operaciones, 4) verificar resultado.","1-2-3-4",["2-3-1-4","4-1-2-3","1-4-3-2"],"La verificación ocurre después de aplicar una estrategia y obtener un resultado."]
  ]);
  addStatic("Español","Destrezas de redacción","Conectores",[
    ["Completa: «Estudió con constancia; ___, mejoró su resultado».","por lo tanto",["sin embargo","aunque","mientras"],"«Por lo tanto» introduce una consecuencia."],
    ["Completa: «Quería salir a correr; ___, comenzó a llover».","sin embargo",["por eso","además","porque"],"«Sin embargo» expresa contraste entre dos ideas."],
    ["Completa: «Lleva agua ___ hará mucho calor».","porque",["aunque","sin embargo","además"],"«Porque» introduce la causa que justifica llevar agua."]
  ]);
  addStatic("Español","Destrezas de redacción","Puntuación",[
    ["¿Cuál oración está puntuada correctamente?","Si terminas temprano, avísame.",["Si terminas temprano avísame.","Si, terminas temprano avísame.","Si terminas, temprano avísame."],"La oración subordinada inicial se separa con coma."],
    ["¿Cuál opción usa correctamente los dos puntos?","Lleva tres cosas: lápiz, borrador y sacapuntas.",["Lleva: tres cosas lápiz, borrador y sacapuntas.","Lleva tres cosas;: lápiz, borrador y sacapuntas.","Lleva tres cosas, lápiz: borrador y sacapuntas."],"Los dos puntos introducen adecuadamente la enumeración."],
    ["¿Cuál oración está correctamente puntuada?","No obstante, decidieron continuar.",["No obstante decidieron, continuar.","No obstante decidieron continuar,","No, obstante decidieron continuar."],"El conector inicial «No obstante» se separa con coma."]
  ]);
  addStatic("Español","Destrezas de redacción","Léxico apropiado",[
    ["Elige la palabra más apropiada: «El investigador ___ los resultados antes de publicar el informe».","analizó",["miró","hizo","puso"],"«Analizó» expresa con precisión la acción realizada sobre los resultados."],
    ["Elige la opción más precisa: «La tormenta ___ varios árboles».","derribó",["hizo","movió","puso"],"«Derribó» describe con exactitud el efecto de la tormenta."],
    ["Completa con el verbo más adecuado: «La directora ___ nuevas medidas de seguridad».","implementó",["puso cosas","hizo algo","miró"],"«Implementó» es específico y apropiado para medidas o acciones organizacionales."]
  ]);
  addStatic("Español","Destrezas de redacción","Precisión y concisión",[
    ["¿Cuál versión es más concisa?","Subió al segundo piso.",["Subió para arriba al segundo piso.","Ascendió hacia arriba al segundo piso.","Subió arriba hacia el segundo piso."],"«Subir» ya implica movimiento hacia arriba; añadir «arriba» es redundante."],
    ["¿Cuál expresión es más precisa?","El experimento confirmó la hipótesis.",["El experimento hizo que la hipótesis estuviera bien.","El experimento tuvo algo que ver con la hipótesis.","El experimento fue una cosa sobre la hipótesis."],"La versión precisa usa un verbo específico y elimina vaguedad."],
    ["¿Cuál oración evita redundancia?","Entró al salón.",["Entró adentro del salón.","Ingresó para adentro del salón.","Entró hacia adentro dentro del salón."],"«Entrar» ya expresa movimiento hacia el interior."]
  ]);
  addStatic("Español","Destrezas de redacción","Relación de estructuras oracionales",[
    ["Combina mejor: «El equipo investigó el tema. El equipo preparó una presentación».","El equipo investigó el tema y preparó una presentación.",["El equipo investigó el tema, porque el equipo preparó una presentación.","El equipo investigó el tema aunque preparó.","Investigó el equipo tema presentación."],"La conjunción «y» coordina acciones del mismo sujeto sin repetirlo innecesariamente."],
    ["Combina: «Llovía mucho. El partido continuó».","Aunque llovía mucho, el partido continuó.",["Porque llovía mucho, el partido continuó por causa.","El partido continuó y porque llovía.","Llovía el partido continuó mucho."],"«Aunque» expresa correctamente la relación concesiva."],
    ["Combina: «Terminó la tarea. Salió a entrenar».","Después de terminar la tarea, salió a entrenar.",["Terminó la tarea porque salió a entrenar.","Salió a entrenar y antes terminó después.","La tarea salió a entrenar."],"La estructura deja clara la relación temporal entre las acciones."]
  ]);

  // MATEMÁTICAS
  add("Matemáticas","Numeración y operación","Números reales",(a,t,s)=>{
    const n=rand(2,15), d=rand(2,9), val=(n/d).toFixed(2);
    return make(a,t,s,`¿Cuál número es equivalente aproximadamente a ${n}/${d}?`,val,[((n+1)/d).toFixed(2),(n/(d+1)).toFixed(2),((n-1)/d).toFixed(2)],`Al dividir ${n} entre ${d} se obtiene aproximadamente ${val}.`);
  });
  add("Matemáticas","Numeración y operación","Potencias y leyes de exponentes",(a,t,s)=>{
    const m=rand(2,7), n=rand(2,7), ans=m+n;
    return make(a,t,s,`Simplifica: x^${m} · x^${n}`,`x^${ans}`,[`x^${m*n}`,`x^${Math.abs(m-n)}`,`2x^${ans}`],`Al multiplicar potencias de la misma base, se suman exponentes: ${m}+${n}=${ans}.`);
  });
  add("Matemáticas","Numeración y operación","Raíz cuadrada",(a,t,s)=>{
    const n=rand(4,18), sq=n*n;
    return make(a,t,s,`¿Cuál es √${sq}?`,n,[n-1,n+1,Math.floor(n/2)],`${n}×${n}=${sq}, por lo tanto √${sq}=${n}.`);
  });
  add("Matemáticas","Numeración y operación","Operaciones y jerarquía",(a,t,s)=>{
    const x=rand(2,9),y=rand(2,9),z=rand(2,6),ans=x+y*z;
    return make(a,t,s,`Calcula: ${x} + ${y} × ${z}`,ans,[(x+y)*z,x*y+z,ans+z],`Primero se multiplica ${y}×${z} y después se suma ${x}.`);
  });
  add("Matemáticas","Numeración y operación","MCM y MCD",(a,t,s)=>{
    const pairs=[[12,18,36,6],[8,20,40,4],[15,25,75,5],[18,24,72,6]], p=pick(pairs);
    const ask=Math.random()<.5?"mcm":"MCD",ans=ask==="mcm"?p[2]:p[3];
    return make(a,t,s,`¿Cuál es el ${ask} de ${p[0]} y ${p[1]}?`,ans,[p[2],p[3],p[0]*p[1]].filter(x=>x!==ans),`Al descomponer ambos números en factores primos se obtiene ${ask} = ${ans}.`);
  });
  add("Matemáticas","Álgebra","Expresiones algebraicas",(a,t,s)=>{
    const p=rand(2,9),q=rand(2,9),r=rand(1,7),u=rand(1,7), ca=p+r, cb=q-u;
    return make(a,t,s,`Reduce: (${p}x + ${q}) + (${r}x - ${u})`,`${ca}x + ${cb}`,[`${p+r}x + ${q+u}`,`${p-r}x + ${q-u}`,`${p*r}x + ${q-u}`],"Se suman los términos semejantes en x y, por separado, los términos constantes.");
  });
  add("Matemáticas","Álgebra","Ecuaciones en una variable",(a,t,s)=>{
    const x=rand(2,12),m=rand(2,8),b=rand(1,15),rhs=m*x+b;
    return make(a,t,s,`Resuelve: ${m}x + ${b} = ${rhs}`,x,[x-1,x+1,rhs-b],`Restando ${b} queda ${m}x=${m*x}; al dividir entre ${m}, x=${x}.`);
  });
  add("Matemáticas","Álgebra","Inecuaciones en una variable",(a,t,s)=>{
    const k=rand(2,8),b=rand(1,10),x=rand(3,12),rhs=k*x+b;
    return make(a,t,s,`Resuelve: ${k}x + ${b} < ${rhs}`,`x < ${x}`,[`x > ${x}`,`x ≤ ${x}`,`x = ${x}`],`Restando ${b} y dividiendo entre ${k} (positivo) se conserva el signo: x < ${x}.`);
  });
  add("Matemáticas","Álgebra","Ecuaciones lineales en varias variables",(a,t,s)=>{
    const x=rand(1,6),m=rand(2,5),b=rand(1,8),y=m*x+b;
    return make(a,t,s,`Si y = ${m}x + ${b}, ¿cuánto vale y cuando x=${x}?`,y,[y-m,y+b,m+b],`Sustituye x=${x}: y=${m}(${x})+${b}=${y}.`);
  });
  add("Matemáticas","Álgebra","Polinomios",(a,t,s)=>{
    const deg=rand(2,5);
    return make(a,t,s,`¿Cuál es el grado del polinomio 4x^${deg} - 3x² + 7?`,deg,[deg-1,deg+1,2],"El grado de un polinomio es el mayor exponente de la variable con coeficiente distinto de cero.");
  });
  add("Matemáticas","Álgebra","Factorización de polinomios",(a,t,s)=>{
    const k=rand(2,7),a1=rand(2,6),b1=rand(1,8);
    if(Math.random()<.5){
      return make(a,t,s,`Factoriza: ${k*a1}x² + ${k*b1}x`,`${k}x(${a1}x + ${b1})`,[`${k}(${a1}x²+${b1}x)`,`x(${k*a1}x+${b1})`,`${k}x(${a1}x²+${b1})`],"Se extrae el factor común máximo, incluyendo x.");
    }
    const n=rand(3,12),sq=n*n;
    return make(a,t,s,`Factoriza: x² - ${sq}`,`(x-${n})(x+${n})`,[`(x-${n})²`,`(x-${sq})(x+1)`,`x(x-${sq})`],`Es una diferencia de cuadrados: x²-${n}²=(x-${n})(x+${n}).`);
  });
  add("Matemáticas","Álgebra","Fracciones algebraicas",(a,t,s)=>{
    const n=rand(2,8);
    return make(a,t,s,`Simplifica: (${n}x²)/(${n}x), con x≠0`,"x",[`${n}x`,"x²",`1/${n}`],"Se cancelan el factor común "+n+" y una potencia de x: x²/x=x.");
  });
  add("Matemáticas","Álgebra","Ecuaciones cuadráticas",(a,t,s)=>{
    const r1=rand(1,7),r2=rand(1,7),sum=r1+r2,prod=r1*r2;
    return make(a,t,s,`¿Cuáles son las soluciones de x² - ${sum}x + ${prod}=0?`,`x=${r1} y x=${r2}`,[`x=-${r1} y x=-${r2}`,`x=${sum} y x=${prod}`,`x=0 y x=${sum}`],`La ecuación factoriza como (x-${r1})(x-${r2})=0.`);
  });
  add("Matemáticas","Álgebra","Plano cartesiano",(a,t,s)=>{
    const x=pick([-6,-4,-3,3,4,6]), y=pick([-7,-5,-2,2,5,7]);
    const quad=x>0&&y>0?"I":x<0&&y>0?"II":x<0&&y<0?"III":"IV";
    return make(a,t,s,`¿En qué cuadrante está el punto (${x}, ${y})?`,quad,["I","II","III","IV"].filter(v=>v!==quad),`El signo de x es ${x>0?"positivo":"negativo"} y el de y es ${y>0?"positivo":"negativo"}, por lo que corresponde al cuadrante ${quad}.`);
  });
  add("Matemáticas","Álgebra","Funciones y sus gráficas",(a,t,s)=>{
    const m=rand(2,5),b=rand(-5,5),x=rand(1,6),ans=m*x+b;
    return make(a,t,s,`Para f(x)=${m}x${b>=0?"+":""}${b}, calcula f(${x}).`,ans,[ans-m,ans+m,m+b],`Sustituye x=${x}: f(${x})=${m}(${x})${b>=0?"+":""}${b}=${ans}.`);
  });
  add("Matemáticas","Álgebra","Sistemas de ecuaciones lineales",(a,t,s)=>{
    const x=rand(1,6),y=rand(1,6),s1=x+y,s2=x-y;
    return make(a,t,s,`Resuelve el sistema: x + y = ${s1}; x - y = ${s2}.`,`x=${x}, y=${y}`,[`x=${y}, y=${x}`,`x=${s1}, y=${s2}`,`x=${x+1}, y=${y-1}`],"Al sumar ambas ecuaciones se obtiene 2x; después se sustituye para hallar y.");
  });
  add("Matemáticas","Geometría y medición","Ángulos y triángulos",(a,t,s)=>{
    const A=rand(30,70),B=rand(30,70),C=180-A-B;
    if(C<=10) return make(a,t,s,"¿Cuánto suman los ángulos interiores de un triángulo?",180,[90,270,360],"Todo triángulo tiene 180° en la suma de sus ángulos interiores.");
    return make(a,t,s,`Un triángulo tiene ángulos de ${A}° y ${B}°. ¿Cuánto mide el tercero?`,C,[180-A,180-B,A+B],`Los ángulos interiores suman 180°: 180-${A}-${B}=${C}°.`);
  });
  add("Matemáticas","Geometría y medición","Paralelas y secante",(a,t,s)=>{
    const ang=pick([35,40,50,60,70,75]);
    return make(a,t,s,`Dos rectas paralelas son cortadas por una secante. Si un ángulo correspondiente mide ${ang}°, ¿cuánto mide su ángulo correspondiente en la otra intersección?`,ang,[180-ang,90-ang,ang+20],"Los ángulos correspondientes formados por una secante sobre rectas paralelas son congruentes.");
  });
  add("Matemáticas","Geometría y medición","Congruencia y semejanza",(a,t,s)=>{
    const k=pick([2,3,4]), side=rand(3,9), ans=k*side;
    return make(a,t,s,`Dos triángulos son semejantes con razón de escala ${k}. Si un lado del menor mide ${side}, ¿cuánto mide el lado correspondiente del mayor?`,ans,[side+k,side*k+1,side],"En figuras semejantes, los lados correspondientes guardan la misma razón de escala.");
  });
  add("Matemáticas","Geometría y medición","Pitágoras y triángulos especiales",(a,t,s)=>{
    const tri=pick([[3,4,5],[5,12,13],[6,8,10],[8,15,17]]);
    return make(a,t,s,`Un triángulo rectángulo tiene catetos de ${tri[0]} y ${tri[1]}. ¿Cuánto mide la hipotenusa?`,tri[2],[tri[0]+tri[1],tri[2]+2,tri[1]],`Por Pitágoras: ${tri[0]}²+${tri[1]}²=${tri[2]}².`);
  });
  add("Matemáticas","Geometría y medición","Círculos",(a,t,s)=>{
    const r=rand(2,10), d=2*r;
    return make(a,t,s,`Un círculo tiene radio ${r}. ¿Cuál es su diámetro?`,d,[r,r*r,Math.round(Math.PI*r)],"El diámetro equivale a dos radios: d=2r.");
  });
  add("Matemáticas","Geometría y medición","Sólidos",(a,t,s)=>{
    const l=rand(2,8),w=rand(2,8),h=rand(2,8),v=l*w*h;
    return make(a,t,s,`Un prisma rectangular mide ${l}×${w}×${h}. ¿Cuál es su volumen?`,v,[l+w+h,2*(l*w+l*h+w*h),l*w],`El volumen de un prisma rectangular es largo×ancho×alto = ${v}.`);
  });
  add("Matemáticas","Geometría y medición","Perímetro, área y volumen",(a,t,s)=>{
    const l=rand(4,12),w=rand(3,10),area=l*w;
    return make(a,t,s,`¿Cuál es el área de un rectángulo de ${l} por ${w} unidades?`,area,[2*(l+w),l+w,area+2],`Área = base×altura = ${l}×${w}=${area}.`);
  });
  add("Matemáticas","Estadística y probabilidad","Tablas y gráficas",(a,t,s)=>{
    const vals=[rand(3,9),rand(3,9),rand(3,9),rand(3,9)], labs=["A","B","C","D"], idx=vals.indexOf(Math.max(...vals));
    const stim=labs.map((x,i)=>x+": "+vals[i]).join(" | ");
    return make(a,t,s,"Según la tabla, ¿qué categoría tiene la frecuencia más alta?",labs[idx],labs.filter(x=>x!==labs[idx]),"La categoría correcta es la que presenta el mayor valor de frecuencia.",{stimulus:stim});
  });
  add("Matemáticas","Estadística y probabilidad","Medidas de tendencia central",(a,t,s)=>{
    const vals=[rand(4,12),rand(4,12),rand(4,12),rand(4,12),rand(4,12)],sum=vals.reduce((x,y)=>x+y,0),mean=(sum/5).toFixed(1);
    return make(a,t,s,`Calcula la media de: ${vals.join(", ")}.`,mean,[((sum+5)/5).toFixed(1),((sum-5)/5).toFixed(1),String(vals.sort((x,y)=>x-y)[2])],`La media es la suma ${sum} dividida entre 5: ${mean}.`);
  });
  add("Matemáticas","Estadística y probabilidad","Probabilidad de un evento",(a,t,s)=>{
    const red=rand(2,8),blue=rand(2,8),tot=red+blue;
    return make(a,t,s,`En una bolsa hay ${red} fichas rojas y ${blue} azules. ¿Cuál es la probabilidad de sacar una roja?`,`${red}/${tot}`,[`${blue}/${tot}`,`${red}/${blue}`,`1/${tot}`],"La probabilidad es casos favorables entre casos totales.");
  });
  add("Matemáticas","Estadística y probabilidad","Espacio muestral",(a,t,s)=>{
    const coins=rand(2,3),ans=2**coins;
    return make(a,t,s,`Si se lanzan ${coins} monedas, ¿cuántos resultados posibles hay en el espacio muestral?`,ans,[coins*2,ans-1,ans+2],`Cada moneda tiene 2 resultados posibles; con ${coins} monedas hay 2^${coins}=${ans} resultados.`);
  });

  // INGLÉS PIENSE
  addStatic("Inglés PIENSE","Uso del lenguaje","Orden y estructura de la oración",[
    ["Choose the correct sentence.","She usually studies after dinner.",["Usually she after dinner studies.","She studies usually after dinner always.","After dinner she usually study."],"Frequency adverbs normally go before the main verb."],
    ["Choose the correct question.","Where did you leave your backpack?",["Where you did leave your backpack?","Where did you left your backpack?","Where you left did your backpack?"],"Past simple questions use did + base verb."],
    ["Choose the correct negative sentence.","They do not need extra time.",["They not do need extra time.","They does not need extra time.","They do not needs extra time."],"With plural subjects, use do not + base verb."]
  ]);
  addStatic("Inglés PIENSE","Uso del lenguaje","Inflections: verbs and voice",[
    ["Choose the correct option: The report ___ yesterday.","was completed",["completed","was complete by","is completing"],"The passive voice uses be + past participle."],
    ["Choose the correct form: By the time we arrived, the class ___.","had started",["has start","starting","will started"],"Past perfect describes an action completed before another past event."],
    ["Choose the correct option: The students ___ the experiment now.","are conducting",["conducts","conducted now","is conducting"],"Present continuous fits an action happening now and agrees with the plural subject."]
  ]);
  addStatic("Inglés PIENSE","Uso del lenguaje","Comparatives and superlatives",[
    ["This problem is ___ than the previous one.","more difficult",["most difficult","difficulter","the difficult"],"Multi-syllable adjectives usually form the comparative with more."],
    ["Of the three routes, this one is the ___.","shortest",["shorter","more short","short"],"A superlative is required when comparing three or more."],
    ["My new backpack is ___ than the old one.","lighter",["lightest","more lightest","light"],"The comparative of light is lighter."]
  ]);
  addStatic("Inglés PIENSE","Uso del lenguaje","Function words",[
    ["We arrived ___ the station at 7:00.","at",["in","on","by"],"Use at for a specific place such as a station in this context."],
    ["Neither Ana nor Luis brought ___ notebook.","their",["his only","our","its"],"Their is the natural gender-neutral possessive for two people."],
    ["I studied hard ___ I wanted to improve my score.","because",["although","unless","however"],"Because introduces the reason."]
  ]);
  const enPassages=[
    {text:"Maya joined the school robotics club because she wanted to learn how machines respond to instructions. At first, she found programming frustrating, but after several weeks she could identify many of her own errors and fix them.",detail:"Maya joined the robotics club to learn how machines respond to instructions.",infer:"Practice helped Maya become more independent at debugging.",cause:"She kept practicing and learned to identify her errors.",purpose:"to describe Maya's learning progress",tone:"encouraging"},
    {text:"The city opened a protected bicycle lane along a busy avenue. Six months later, local surveys showed that more residents were using bicycles for short trips, although some drivers still complained about reduced parking.",detail:"More residents used bicycles for short trips after the lane opened.",infer:"The bicycle lane changed some travel behavior.",cause:"A protected lane made cycling on the avenue more accessible.",purpose:"to report effects of a transportation change",tone:"informative"},
    {text:"Leo expected the science fair presentation to be easy because he knew his topic well. During rehearsal, however, he noticed that he spoke too quickly. He practiced again, adding pauses and shortening several explanations.",detail:"Leo noticed during rehearsal that he spoke too quickly.",infer:"Rehearsal helped Leo improve how he presented his knowledge.",cause:"He practiced again after noticing a problem.",purpose:"to show how rehearsal improved a presentation",tone:"reflective"}
  ];
  add("Inglés PIENSE","Reading comprehension","Details",(a,t,s)=>{const p=pick(enPassages);return make(a,t,s,"Which detail is stated explicitly?",p.detail,[p.infer,p.purpose,"The passage does not provide any details."],"The correct option is directly stated in the passage.",{stimulus:p.text});});
  add("Inglés PIENSE","Reading comprehension","Cause and effect",(a,t,s)=>{const p=pick(enPassages);return make(a,t,s,"Which option best describes a cause-and-effect relationship in the passage?",p.cause,[p.detail,p.purpose,"No event has a cause."],"The answer links an event or action with a resulting outcome.",{stimulus:p.text});});
  add("Inglés PIENSE","Reading comprehension","Inference",(a,t,s)=>{const p=pick(enPassages);return make(a,t,s,"What can reasonably be inferred?",p.infer,[p.detail,"The opposite of what the passage suggests.","Nothing can be inferred."],"An inference is supported by details even when it is not stated word for word.",{stimulus:p.text});});
  add("Inglés PIENSE","Reading comprehension","Purpose",(a,t,s)=>{const p=pick(enPassages);return make(a,t,s,"What is the writer's main purpose?",p.purpose,[p.detail,"to provide unrelated instructions","to advertise a product"],"The purpose describes why the passage was written as a whole.",{stimulus:p.text});});
  add("Inglés PIENSE","Reading comprehension","Tone",(a,t,s)=>{const p=pick(enPassages);return make(a,t,s,"Which word best describes the tone?",p.tone,["angry","sarcastic","frightening"].filter(x=>x!==p.tone),"Tone is the writer's attitude conveyed through the passage.",{stimulus:p.text});});
  addStatic("Inglés PIENSE","Reading comprehension","Conclusions",[
    ["A school tested two study schedules. Students using shorter focused sessions completed more practice questions with fewer careless errors. Which conclusion is best supported?","Short focused sessions may help these students work more accurately.",["Long sessions never work for anyone.","All students must use the same schedule.","Careless errors are unrelated to study habits."],"A conclusion should stay within the evidence provided."],
    ["A garden received more pollinating insects after native flowers were planted. Which conclusion is best supported?","The native flowers may have attracted more pollinators.",["Native flowers always double crop production.","Pollinators avoid all other plants.","The garden no longer needs water."],"The data support a cautious connection, not an absolute claim."],
    ["After a library added more evening hours, evening attendance increased. Which conclusion is reasonable?","The extended hours may have made the library more accessible in the evening.",["Everyone prefers evening study.","Morning attendance must have disappeared.","The library should close during the day."],"The conclusion follows the observed change without overgeneralizing."]
  ]);
  addStatic("Inglés PIENSE","Reading comprehension","Chronological order",[
    ["Which sequence is chronological? 1) submit the form, 2) complete the form, 3) receive confirmation.","2-1-3",["1-2-3","3-2-1","2-3-1"],"The form must be completed before submission, and confirmation comes after submission."],
    ["Order the events: 1) the seed sprouted, 2) the seed was planted, 3) leaves appeared.","2-1-3",["1-2-3","3-2-1","2-3-1"],"Planting occurs before sprouting, and leaves appear afterward."],
    ["Order the steps: 1) boarding begins, 2) passengers arrive at the gate, 3) the plane departs.","2-1-3",["1-3-2","3-2-1","1-2-3"],"Passengers reach the gate before boarding, and departure follows boarding."]
  ]);
  addStatic("Inglés PIENSE","Reading comprehension","Characters",[
    ["In a story, the character whose decisions drive the main conflict is usually the:","protagonist",["setting","narrator's punctuation","chapter title"],"The protagonist is the central character involved in the main action."],
    ["A character who opposes the protagonist's main goal often functions as the:","antagonist",["setting","theme","editor"],"The antagonist creates or represents opposition to the protagonist."],
    ["A character who changes significantly because of the events is described as:","dynamic",["static","geographic","chronological"],"A dynamic character undergoes meaningful change."]
  ]);
  addStatic("Inglés PIENSE","Reading comprehension","Types of conflict",[
    ["A student must decide whether to tell the truth even though it may cause trouble. This is mainly:","character vs. self",["character vs. nature","character vs. technology","character vs. weather only"],"The struggle occurs inside the character's own values and decision-making."],
    ["A hiker struggles to reach shelter during a severe storm. This is:","character vs. nature",["character vs. self","character vs. society","character vs. narrator"],"The main opposing force is a natural event."],
    ["A teenager challenges an unfair rule imposed by the community. This is:","character vs. society",["character vs. nature","character vs. self only","character vs. grammar"],"The conflict is between an individual and social rules or institutions."]
  ]);
  addStatic("Inglés PIENSE","Reading comprehension","Figurative language",[
    ["“The classroom was a freezer” is an example of:","metaphor",["simile","personification","literal measurement"],"The sentence directly compares the classroom to a freezer without using like or as."],
    ["“The leaves danced in the wind” is an example of:","personification",["hyperbole","simile","technical language"],"Human behavior is attributed to leaves."],
    ["“He ran like the wind” is an example of:","simile",["metaphor","paradox","allusion"],"The comparison uses the word like."]
  ]);
  addStatic("Inglés PIENSE","Reading comprehension","Types of writing",[
    ["A text that presents evidence to support a claim is mainly:","argumentative",["narrative","descriptive only","chronological list"],"Argumentative writing supports a position with reasons and evidence."],
    ["A text that explains how volcanoes form is mainly:","informative",["narrative fiction","argumentative campaign","personal dialogue only"],"Informative writing explains a topic using facts and explanations."],
    ["A story about a character's journey is mainly:","narrative",["informative chart","instruction manual","argumentative editorial"],"Narrative writing tells events involving characters."]
  ]);
  addStatic("Inglés PIENSE","Writing skills","Opening sentence",[
    ["Which sentence best opens a paragraph about the benefits of public parks?","Public parks provide communities with spaces for recreation, exercise, and social interaction.",["Yesterday I saw a green bench.","In conclusion, parks are useful.","Some shoes are designed for running."],"A strong opening introduces the paragraph's central topic."],
    ["Which is the best opening for a paragraph about online learning?","Online learning can offer flexibility, but it also requires strong self-management.",["My laptop is silver.","Finally, the class ended.","There are many kinds of chairs."],"The sentence clearly introduces the topic and its main direction."],
    ["Which is the best opening for a paragraph about recycling?","Recycling can reduce the amount of reusable material that reaches landfills.",["The truck arrived at noon.","In conclusion, everyone agreed.","My bin has a blue lid."],"The opening states the paragraph's central idea."]
  ]);
  addStatic("Inglés PIENSE","Writing skills","Concluding sentence",[
    ["Which sentence best concludes a paragraph about regular practice?","Overall, consistent practice helps skills become stronger and more reliable.",["My notebook is on the desk.","Practice begins at four.","Some pencils are mechanical."],"A conclusion summarizes the main idea rather than adding an unrelated detail."],
    ["Which sentence best concludes a paragraph about saving energy?","Therefore, small reductions in unnecessary energy use can add up over time.",["My lamp is beside the bed.","Electricity was discovered long ago.","The wall is white."],"The conclusion draws together the paragraph's main point."],
    ["Which is the best conclusion for a paragraph about teamwork?","In short, effective teamwork depends on communication, shared responsibility, and trust.",["Teams can have different names.","Yesterday was Monday.","The room has six tables."],"The sentence summarizes the key idea."]
  ]);
  addStatic("Inglés PIENSE","Writing skills","Logical sequence and transitions",[
    ["Choose the best transition: “The first experiment failed. ___, the team changed one variable and tried again.”","Therefore",["Meanwhile forever","Because of although","Unless"],"Therefore introduces a consequence or next step resulting from the previous sentence."],
    ["Choose the best transition: “The route is longer. ___, it is safer for cyclists.”","However",["Because","For example of","Therefore because"],"However introduces a contrast."],
    ["Choose the best transition: “First, gather the materials. ___, read the instructions carefully.”","Next",["Although","Because","Instead of why"],"Next signals chronological sequence."]
  ]);
  addStatic("Inglés PIENSE","Writing skills","Unrelated sentence",[
    ["Topic: preparing for an exam. Which sentence is unrelated?","Whales communicate using sounds.",["Review weak topics first.","Practice under time limits occasionally.","Sleep well before the exam."],"The whale sentence has no connection to exam preparation."],
    ["Topic: bicycle safety. Which sentence is unrelated?","Some planets have rings.",["Wear a helmet.","Use lights when visibility is low.","Follow traffic rules."],"The statement about planets breaks topic unity."],
    ["Topic: healthy sleep habits. Which sentence is unrelated?","Volcanoes can remain inactive for years.",["Keep a consistent bedtime.","Avoid excessive screen use right before sleep.","Make the room comfortable for rest."],"The volcano sentence is unrelated to sleep habits."]
  ]);
  addStatic("Inglés PIENSE","Writing skills","Punctuation",[
    ["Which sentence is punctuated correctly?","Before we leave, check the tickets.",["Before we leave check, the tickets.","Before, we leave check the tickets.","Before we leave check the tickets,"],"An introductory dependent clause is followed by a comma."],
    ["Which sentence is punctuated correctly?","We need three items: paper, tape, and scissors.",["We need: three items paper, tape, and scissors.","We need three items;: paper, tape, and scissors.","We need three items paper: tape and scissors."],"A colon can introduce a list after a complete clause."],
    ["Which sentence is punctuated correctly?","However, the results were different.",["However the results, were different.","However the results were different,","How, ever the results were different."],"An introductory conjunctive adverb is followed by a comma."]
  ]);
  addStatic("Inglés PIENSE","Writing skills","Precision and concision",[
    ["Choose the most concise sentence.","The meeting ended at noon.",["The meeting ended at noon at twelve o'clock.","At noon, which was twelve, the meeting ended at noon.","The meeting had its ending conclusion at noon."],"The concise version communicates the full meaning without repetition."],
    ["Choose the most precise verb: “The scientist ___ the data.”","analyzed",["did","made","looked at stuff in"],"Analyzed states the action precisely."],
    ["Choose the clearest version.","The coach postponed practice because of the storm.",["The coach did a postponement of practice due to the storm situation.","Because of the storm, a practice thing was postponed by the coach in a way.","The coach made practice later because weather happened."],"The correct sentence is concise and specific."]
  ]);
  addStatic("Inglés PIENSE","Writing skills","Combining sentences",[
    ["Combine: “Nora finished the report. Nora emailed it to her teacher.”","Nora finished the report and emailed it to her teacher.",["Nora finished because emailed the report teacher.","Nora emailed and because she report.","The report Nora teacher emailed finished."],"The coordinated sentence avoids unnecessary repetition of the subject."],
    ["Combine: “It was raining. The game continued.”","Although it was raining, the game continued.",["Because the game continued, raining.","The game continued and because rain.","Raining game continued although because."],"Although correctly expresses concession."],
    ["Combine: “Sam checked the calculations. Sam submitted the assignment.”","After checking the calculations, Sam submitted the assignment.",["Sam submitted because calculations after.","Checking submitted Sam calculations assignment.","Sam calculations and assignment because."],"The combined sentence clearly shows the sequence of actions."]
  ]);

  window.PIENSE_TAXONOMY = {
    "Habilidad cognoscitiva":["Transformaciones lógicas","Relaciones","Patrones","Consideraciones lógicas","Razonamiento práctico"],
    "Español":["Lengua","Comprensión y análisis de lectura","Destrezas de redacción"],
    "Matemáticas":["Numeración y operación","Álgebra","Geometría y medición","Estadística y probabilidad"],
    "Inglés PIENSE":["Uso del lenguaje","Reading comprehension","Writing skills"]
  };

  window.generatePiensePool = function(target=480){
    const out=[];
    if(!F.length) return out;
    let guard=0;
    while(out.length<target && guard<target*4){
      guard++;
      const fn=F[(out.length+rand(0,F.length-1))%F.length];
      try{
        const item=fn();
        if(item && item.options && item.options.length===4 && item.answer>=0) out.push(item);
      }catch(e){ console.warn("PIENSE generator skipped a family",e); }
    }
    return shuffle(out);
  };
})();