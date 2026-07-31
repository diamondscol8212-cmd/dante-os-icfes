// 🇬🇧 src/services/bank/ingles.js - 50 Reactivos Calibrados ICFES Saber 11
const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="background:%230d0f14;font-family:sans-serif;">${content}</svg>`;

export const reactivosIngles = [
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete the sentence with the correct grammatical option: 'If students __________ more attention during classes, they would pass the national exams with higher scores.'",
        recurso_visual: null,
        opciones: ["A) pay", "B) paid", "C) will pay", "D) have paid"],
        ok: "B", a: 1.50, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the option that best replaces the underlined phrasal verb in context: 'The local government decided to <u>put off</u> the construction of the new public library until next year.'",
        recurso_visual: null,
        opciones: ["A) accelerate", "B) postpone", "C) cancel permanently", "D) inspect"],
        ok: "B", a: 1.30, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Select the correct passive voice transformation for the sentence: 'Scientists discovered a new renewable energy source last month.'",
        recurso_visual: null,
        opciones: ["A) A new renewable energy source is discovered by scientists last month.", "B) A new renewable energy source was discovered by scientists last month.", "C) Scientists were discovered by a new renewable energy source.", "D) A new renewable energy source has been discovering."],
        ok: "B", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the public sign shown below: 'AUTHORIZED PERSONNEL ONLY BEYOND THIS POINT'. Where would you normally see this notice and what does it imply?",
        recurso_visual: generateSVG('<rect x="40" y="40" width="320" height="120" fill="%23e74c3c" stroke="%23ffffff" stroke-width="4"/><text x="60" y="85" fill="%23ffffff" font-weight="bold" font-size="14">AUTHORIZED PERSONNEL ONLY</text><text x="110" y="125" fill="%23ffffff" font-size="12">BEYOND THIS POINT</text>'),
        opciones: ["A) In a public park open to all visitors.", "B) At the entrance of a restricted laboratory or staff room.", "C) Inside a supermarket checkout aisle.", "D) On a bus stop schedule board."],
        ok: "B", a: 1.15, b: -0.90, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct modal verb to express strong obligation: 'Visitors __________ turn off their mobile phones during the museum exhibition.'",
        recurso_visual: null,
        opciones: ["A) might", "B) must", "C) could", "D) would"],
        ok: "B", a: 1.25, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "What is the antonym of the adjective 'ancient' in historical contexts?",
        recurso_visual: null,
        opciones: ["A) Modern", "B) Huge", "C) Old-fashioned", "D) Expensive"],
        ok: "A", a: 1.20, b: -0.80, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete with the correct comparative form: 'Bogotá is generally __________ than Cartagena during the rainy season.'",
        recurso_visual: null,
        opciones: ["A) more cold", "B) colder", "C) coldest", "D) as cold as"],
        ok: "B", a: 1.35, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the short text: 'Despite the heavy rain, the marathon runners completed the 42-kilometer course with excellent times.' What does 'Despite' mean in this context?",
        recurso_visual: null,
        opciones: ["A) Because of", "B) In spite of / Even with", "C) Before", "D) Instead of"],
        ok: "B", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct relative pronoun for the sentence: 'The scientist __________ discovered the new vaccine received an international award.'",
        recurso_visual: null,
        opciones: ["A) which", "B) who", "C) where", "D) whose"],
        ok: "B", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "What is the primary synonym for the word 'accurate' in technical and scientific reports?",
        recurso_visual: null,
        opciones: ["A) Precise / Correct", "B) Approximate", "C) Complex", "D) Brief"],
        ok: "A", a: 1.30, b: -0.45, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete the sentence with the correct tense: 'By the time the manager arrived at the office, the team __________ the project presentation.'",
        recurso_visual: null,
        opciones: ["A) had already finished", "B) finished", "C) will finish", "D) has been finishing"],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the notice: 'PLEASE LEAVE YOUR KEYS AT THE RECEPTION BEFORE DEPARTING'. Where would you see this sign?",
        recurso_visual: generateSVG('<rect x="60" y="50" width="280" height="100" fill="%231a1d26" stroke="%23d4af37" stroke-width="3"/><text x="80" y="90" fill="%2351e2f5" font-size="12">PLEASE LEAVE YOUR KEYS AT</text><text x="90" y="115" fill="%23ffffff" font-size="12">THE RECEPTION BEFORE DEPARTING</text>'),
        opciones: ["A) At a hotel front desk.", "B) Inside a public library.", "C) At a gas station pump.", "D) In a school gymnasium."],
        ok: "A", a: 1.10, b: -0.95, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Complete the sentence with the appropriate connector: 'She worked hard all semester; __________, she achieved the highest GPA in her class.'",
        recurso_visual: null,
        opciones: ["A) therefore", "B) although", "C) unless", "D) despite"],
        ok: "A", a: 1.40, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Select the option that correctly completes the third conditional sentence: 'If they __________ earlier, they wouldn't have missed the flight.'",
        recurso_visual: null,
        opciones: ["A) had left", "B) leave", "C) would leave", "D) have left"],
        ok: "A", a: 1.75, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the short paragraph: 'Renewable energy sources such as solar and wind power are becoming increasingly cost-effective. Consequently, many developing nations are skipping traditional fossil fuel infrastructure.' What is the author's main point?",
        recurso_visual: null,
        opciones: ["A) Lower costs are driving a global transition toward clean energy technologies.", "B) Fossil fuels are becoming cheaper than solar power.", "C) Developing nations refuse to use electricity.", "D) Wind turbines are too expensive for poor countries."],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the word that best completes the sentence: 'Due to severe weather conditions, the airline had to __________ all domestic flights.'",
        recurso_visual: null,
        opciones: ["A) cancel", "B) encourage", "C) celebrate", "D) publish"],
        ok: "A", a: 1.20, b: -0.70, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct reported speech form for: 'I am studying for the exam,' she said.",
        recurso_visual: null,
        opciones: ["A) She said that she was studying for the exam.", "B) She said that I am studying for the exam.", "C) She told she will study for the exam.", "D) She says she had studied for the exam."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the sign: 'NO SWIMMING - STRONG CURRENT HAZARD'. What is the purpose of this warning?",
        recurso_visual: generateSVG('<rect x="50" y="40" width="300" height="110" fill="%23e74c3c" stroke="%23ffffff" stroke-width="3"/><text x="110" y="80" fill="%23ffffff" font-weight="bold" font-size="16">NO SWIMMING</text><text x="75" y="115" fill="%23d4af37" font-size="12">STRONG CURRENT HAZARD</text>'),
        opciones: ["A) To prevent people from entering dangerous water currents.", "B) To invite people to take swimming lessons.", "C) To announce a water sport competition.", "D) To sell swimming equipment."],
        ok: "A", a: 1.15, b: -0.85, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Select the word that best fits the blank: 'The new employee showed great __________ by completing all assignments before the deadline.'",
        recurso_visual: null,
        opciones: ["A) efficiency", "B) hesitation", "C) conflict", "D) confusion"],
        ok: "A", a: 1.35, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct prepositions to fill the gaps: 'She has lived __________ Bogotá __________ 2018.'",
        recurso_visual: null,
        opciones: ["A) in / since", "B) at / for", "C) on / during", "D) inside / from"],
        ok: "A", a: 1.30, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Artificial Intelligence systems are transforming medical diagnosis by analyzing MRI scans faster than human radiologists.' What is the primary benefit mentioned?",
        recurso_visual: null,
        opciones: ["A) Increased speed and efficiency in processing diagnostic imagery.", "B) Complete replacement of human doctors in all hospitals.", "C) Lower prices for purchasing medical computers.", "D) Elimination of all diseases in patients."],
        ok: "A", a: 1.50, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Select the sentence with correct subject-verb agreement:",
        recurso_visual: null,
        opciones: ["A) Neither the teacher nor the students were present at the meeting.", "B) Neither the teacher nor the students was present at the meeting.", "C) Neither the teacher or the students is present.", "D) Neither the teacher and students are present."],
        ok: "A", a: 1.70, b: 0.55, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "What is the meaning of the idiom 'to hit the nail on the head'?",
        recurso_visual: null,
        opciones: ["A) To describe exactly what is causing a situation or problem.", "B) To cause an accidental physical injury with tools.", "C) To fail completely at a manual task.", "D) To build something with wood and hammers."],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete with the correct relative clause: 'The university __________ I studied engineering offers excellent postgraduate scholarships.'",
        recurso_visual: null,
        opciones: ["A) where", "B) which", "C) who", "D) whose"],
        ok: "A", a: 1.35, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the short article: 'Urban gardening initiatives in European cities have reduced heat island effects by up to 2 degrees Celsius.' What is the direct consequence of urban gardening?",
        recurso_visual: null,
        opciones: ["A) A measurable reduction in ambient urban temperatures.", "B) An increase in city traffic congestion.", "C) Higher costs for municipal water supply.", "D) Complete destruction of urban park infrastructure."],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Select the best synonym for the word 'mandatory' in administrative regulations:",
        recurso_visual: null,
        opciones: ["A) Obligatory / Compulsory", "B) Optional", "C) Temporary", "D) Flexible"],
        ok: "A", a: 1.25, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Fill in the blank with the correct form: 'She insisted on __________ the final report by herself.'",
        recurso_visual: null,
        opciones: ["A) writing", "B) write", "C) to write", "D) written"],
        ok: "A", a: 1.40, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the warning label: 'STORE IN A COOL, DRY PLACE AWAY FROM DIRECT SUNLIGHT'. How should the product be handled?",
        recurso_visual: null,
        opciones: ["A) Placed in a shaded area with low humidity.", "B) Left outside under direct sunlight all day.", "C) Submerged in boiling water before opening.", "D) Frozen at minus 20 degrees Celsius."],
        ok: "A", a: 1.15, b: -0.90, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the correct phrase to complete: 'I'm looking forward to __________ you at the conference next week.'",
        recurso_visual: null,
        opciones: ["A) meeting", "B) meet", "C) met", "D) have met"],
        ok: "A", a: 1.50, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete with the correct connector of contrast: '__________ the financial crisis, the tech startup managed to double its market share.'",
        recurso_visual: null,
        opciones: ["A) In spite of", "B) Furthermore", "C) Consequently", "D) Because"],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the short paragraph: 'Microplastics have been found in the deepest ocean trenches and on the highest mountain peaks, demonstrating the global reach of human pollution.' What is the passage illustrating?",
        recurso_visual: null,
        opciones: ["A) The pervasive and widespread distribution of plastic pollution across the planet.", "B) The benefits of recycling plastic bottles in cities.", "C) The discovery of new marine species in deep oceans.", "D) The high cost of mountain climbing equipment."],
        ok: "A", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the option that best completes the sentence: 'The CEO's speech was so __________ that the investors immediately backed the new initiative.'",
        recurso_visual: null,
        opciones: ["A) persuasive", "B) boring", "C) hostile", "D) ambiguous"],
        ok: "A", a: 1.30, b: -0.45, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete the sentence: 'Hardly __________ entered the room when the power went out.'",
        recurso_visual: null,
        opciones: ["A) had he", "B) he had", "C) did he", "D) has he"],
        ok: "A", a: 1.85, b: 0.90, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the sign: 'SILENCE PLEASE - EXAMINATION IN PROGRESS'. Where would this sign be placed?",
        recurso_visual: generateSVG('<rect x="60" y="50" width="280" height="100" fill="%231a1d26" stroke="%2351e2f5" stroke-width="3"/><text x="120" y="90" fill="%2351e2f5" font-weight="bold" font-size="14">SILENCE PLEASE</text><text x="80" y="115" fill="%23ffffff" font-size="12">EXAMINATION IN PROGRESS</text>'),
        opciones: ["A) Outside a school classroom or university hall.", "B) Inside a noisy shopping mall food court.", "C) At a highway toll station.", "D) In a public swimming pool area."],
        ok: "A", a: 1.10, b: -0.95, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Select the option that best completes: 'The government plans to __________ new policies to reduce carbon emissions.'",
        recurso_visual: null,
        opciones: ["A) implement", "B) ignore", "C) abandon", "D) interrupt"],
        ok: "A", a: 1.25, b: -0.65, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct tag question: 'You haven't seen my keys anywhere, __________?'",
        recurso_visual: null,
        opciones: ["A) have you", "B) haven't you", "C) did you", "D) do you"],
        ok: "A", a: 1.35, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the sentence: 'Despite being the smallest continent by land area, Australia hosts one of the most biodiverse ecosystems on Earth.' What does the text highlight?",
        recurso_visual: null,
        opciones: ["A) Australia's remarkable ecological diversity despite its compact geographical size.", "B) Australia's lack of native wildlife species.", "C) Australia's total dependence on imported food.", "D) The large physical size of Australian cities."],
        ok: "A", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "What is the antonym of the word 'scarce' in economic reports?",
        recurso_visual: null,
        opciones: ["A) Abundant", "B) Rare", "C) Limited", "D) Deficient"],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete: 'If I __________ you, I would consult a professional lawyer before signing the contract.'",
        recurso_visual: null,
        opciones: ["A) were", "B) am", "C) was been", "D) will be"],
        ok: "A", a: 1.30, b: -0.55, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'E-commerce sales surged by 35% during the pandemic, prompting traditional retailers to reevaluate their physical store strategies.' What was the main consequence of the e-commerce surge?",
        recurso_visual: null,
        opciones: ["A) Physical retailers had to adapt their business models to changing consumer behavior.", "B) Online shopping was banned by international law.", "C) All traditional stores closed permanently without alternative.", "D) Customers stopped purchasing consumer goods altogether."],
        ok: "A", a: 1.55, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the word that best completes the sentence: 'The team's success was largely due to their __________ effort and mutual trust.'",
        recurso_visual: null,
        opciones: ["A) collaborative", "B) isolated", "C) reluctant", "D) competitive"],
        ok: "A", a: 1.25, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Select the sentence with correct modal verb usage for past deduction: 'She __________ have forgotten her keys; her car is still parked outside.'",
        recurso_visual: null,
        opciones: ["A) must", "B) should", "C) would", "D) can"],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the notice: 'FASTEN SEATBELTS WHILE SEATED'. Where is this instruction routinely displayed?",
        recurso_visual: generateSVG('<rect x="50" y="50" width="300" height="90" fill="%231a1d26" stroke="%232ecc71" stroke-width="3"/><text x="75" y="100" fill="%23ffffff" font-weight="bold" font-size="14">FASTEN SEATBELTS WHILE SEATED</text>'),
        opciones: ["A) Inside commercial passenger airplanes and buses.", "B) On a park bench in a residential neighborhood.", "C) At an escalator entrance in a shopping mall.", "D) Inside an elevator in an office tower."],
        ok: "A", a: 1.10, b: -0.90, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Select the word that best completes: 'The company's commitment to sustainability is __________ in its zero-waste policy.'",
        recurso_visual: null,
        opciones: ["A) reflected", "B) concealed", "C) destroyed", "D) rejected"],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete the sentence with the correct form: 'No sooner __________ arrived at the station than the train departed.'",
        recurso_visual: null,
        opciones: ["A) had we", "B) we had", "C) did we", "D) have we"],
        ok: "A", a: 1.80, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the passage: 'Studies show that bilingual individuals exhibit greater cognitive flexibility and are better at multitasking compared to monolinguals.' What is the key advantage of bilingualism according to the text?",
        recurso_visual: null,
        opciones: ["A) Enhanced mental adaptability and multitasking skills.", "B) Automatic fluency in every spoken language in the world.", "C) Perfect photographic memory for mathematical numbers.", "D) Higher physical strength and athletic endurance."],
        ok: "A", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the word that best replaces 'crucial' in scientific literature:",
        recurso_visual: null,
        opciones: ["A) Vital / Essential", "B) Minor", "C) Unimportant", "D) Irrelevant"],
        ok: "A", a: 1.20, b: -0.75, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete with the correct form: 'The proposal __________ by the board of directors before the deadline expired.'",
        recurso_visual: null,
        opciones: ["A) was approved", "B) approved", "C) approving", "D) approves"],
        ok: "A", a: 1.50, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the sign: 'KEEP CLEAR - EMERGENCY EXIT'. What does this instruction mean?",
        recurso_visual: generateSVG('<rect x="50" y="50" width="300" height="90" fill="%23e74c3c" stroke="%23ffffff" stroke-width="3"/><text x="80" y="90" fill="%23ffffff" font-weight="bold" font-size="14">KEEP CLEAR - EMERGENCY EXIT</text>'),
        opciones: ["A) Do not block this doorway so people can leave safely in an emergency.", "B) Park your vehicle in front of this door permanently.", "C) Lock this door from the outside with heavy chains.", "D) Use this exit for daily rubbish disposal only."],
        ok: "A", a: 1.15, b: -0.85, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the word that best completes the sentence: 'The university offers a __________ range of academic programs across various fields of study.'",
        recurso_visual: null,
        opciones: ["A) broad", "B) narrow", "C) restricted", "D) tiny"],
        ok: "A", a: 1.25, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Fill in the blank with the correct structure: 'The more you practice speaking English, __________ confident you will become.'",
        recurso_visual: null,
        opciones: ["A) the more", "B) more", "C) the most", "D) as much"],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Global plastic production reached 400 million tons last year, prompting calls for legally binding international treaties to curb waste.' What action is being urged?",
        recurso_visual: null,
        opciones: ["A) Creation of international legal frameworks to limit plastic waste production.", "B) Total shutdown of all chemical factories in Europe.", "C) Increase of plastic packaging in food industries.", "D) Burning plastic waste in open landfills without regulation."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the best option to complete: 'The research paper provided __________ evidence supporting the new climate change theory.'",
        recurso_visual: null,
        opciones: ["A) compelling", "B) weak", "C) doubtful", "D) contradictory"],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Select the correct form to express regret about past actions: 'I wish I __________ more time preparing for the national examination.'",
        recurso_visual: null,
        opciones: ["A) had spent", "B) spend", "C) will spend", "D) am spending"],
        ok: "A", a: 1.70, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    }
];