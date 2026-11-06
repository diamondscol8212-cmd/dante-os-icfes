// 🇬🇧 src/services/bank/ingles.js - 1,100 Reactivos Calibrados ICFES Saber 11
import { generarReactivosInglesMasivos } from './generatorIngles.js';

const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" style="background:%23ffffff;font-family:sans-serif;">${content}</svg>`;

const reactivosSeed = [
    { id: 'item_ing_01', area: 'ingles', sub: 'grammar_reading',
        texto: "Read the conversation and select the best answer:\n\nTom: 'Have you seen my keys? I've been searching for them all morning!'\nSarah: 'Check the kitchen counter. I think I saw them ____ next to your laptop.'\n\nWhich option correctly completes Sarah's response?",
        recurso_visual: null,
        opciones: [
            "A) lying",
            "B) layed",
            "C) lies",
            "D) lain"
        ],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 }
    },
    { id: '44444444-0000-4000-8000-000000000001', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000002', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000003', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000004', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the public sign shown below: 'AUTHORIZED PERSONNEL ONLY BEYOND THIS POINT'. Where would you normally see this notice and what does it imply?",
        recurso_visual: generateSVG('<rect x="40" y="40" width="320" height="120" fill="%23e74c3c" stroke="%23444444" stroke-width="4"/><text x="60" y="85" fill="%23111111" font-weight="bold" font-size="14">AUTHORIZED PERSONNEL ONLY</text><text x="110" y="125" fill="%23111111" font-size="12">BEYOND THIS POINT</text>'),
        opciones: ["A) In a public park open to all visitors.", "B) At the entrance of a restricted laboratory or staff room.", "C) Inside a supermarket checkout aisle.", "D) On a bus stop schedule board."],
        ok: "B", a: 1.15, b: -0.90, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000005', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000006', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000007', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000008', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000009', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000010', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000011', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000012', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the notice: 'PLEASE LEAVE YOUR KEYS AT THE RECEPTION BEFORE DEPARTING'. Where would you see this sign?",
        recurso_visual: generateSVG('<rect x="60" y="50" width="280" height="100" fill="%231a1d26" stroke="%23d4af37" stroke-width="3"/><text x="80" y="90" fill="%2351e2f5" font-size="12">PLEASE LEAVE YOUR KEYS AT</text><text x="90" y="115" fill="%23111111" font-size="12">THE RECEPTION BEFORE DEPARTING</text>'),
        opciones: ["A) At a hotel front desk.", "B) Inside a public library.", "C) At a gas station pump.", "D) In a school gymnasium."],
        ok: "A", a: 1.10, b: -0.95, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000013', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000014', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000015', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000016', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000017', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000018', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the sign: 'NO SWIMMING - STRONG CURRENT HAZARD'. What is the purpose of this warning?",
        recurso_visual: generateSVG('<rect x="50" y="40" width="300" height="110" fill="%23e74c3c" stroke="%23444444" stroke-width="3"/><text x="110" y="80" fill="%23111111" font-weight="bold" font-size="16">NO SWIMMING</text><text x="75" y="115" fill="%23d4af37" font-size="12">STRONG CURRENT HAZARD</text>'),
        opciones: ["A) To prevent people from entering dangerous water currents.", "B) To invite people to take swimming lessons.", "C) To announce a water sport competition.", "D) To sell swimming equipment."],
        ok: "A", a: 1.15, b: -0.85, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000019', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000020', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000021', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000022', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000023', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000024', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000025', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000026', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000027', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000028', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000029', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000030', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000031', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000032', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000033', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000034', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the sign: 'SILENCE PLEASE - EXAMINATION IN PROGRESS'. Where would this sign be placed?",
        recurso_visual: generateSVG('<rect x="60" y="50" width="280" height="100" fill="%231a1d26" stroke="%2351e2f5" stroke-width="3"/><text x="120" y="90" fill="%2351e2f5" font-weight="bold" font-size="14">SILENCE PLEASE</text><text x="80" y="115" fill="%23111111" font-size="12">EXAMINATION IN PROGRESS</text>'),
        opciones: ["A) Outside a school classroom or university hall.", "B) Inside a noisy shopping mall food court.", "C) At a highway toll station.", "D) In a public swimming pool area."],
        ok: "A", a: 1.10, b: -0.95, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000035', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000036', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000037', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000038', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000039', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000040', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000041', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000042', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000043', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the notice: 'FASTEN SEATBELTS WHILE SEATED'. Where is this instruction routinely displayed?",
        recurso_visual: generateSVG('<rect x="50" y="50" width="300" height="90" fill="%231a1d26" stroke="%232ecc71" stroke-width="3"/><text x="75" y="100" fill="%23111111" font-weight="bold" font-size="14">FASTEN SEATBELTS WHILE SEATED</text>'),
        opciones: ["A) Inside commercial passenger airplanes and buses.", "B) On a park bench in a residential neighborhood.", "C) At an escalator entrance in a shopping mall.", "D) Inside an elevator in an office tower."],
        ok: "A", a: 1.10, b: -0.90, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000044', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000045', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000046', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000047', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000048', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000049', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the sign: 'KEEP CLEAR - EMERGENCY EXIT'. What does this instruction mean?",
        recurso_visual: generateSVG('<rect x="50" y="50" width="300" height="90" fill="%23e74c3c" stroke="%23444444" stroke-width="3"/><text x="80" y="90" fill="%23111111" font-weight="bold" font-size="14">KEEP CLEAR - EMERGENCY EXIT</text>'),
        opciones: ["A) Do not block this doorway so people can leave safely in an emergency.", "B) Park your vehicle in front of this door permanently.", "C) Lock this door from the outside with heavy chains.", "D) Use this exit for daily rubbish disposal only."],
        ok: "A", a: 1.15, b: -0.85, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000050', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000051', area: 'ingles', sub: 'grammar_reading',
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
    { id: '44444444-0000-4000-8000-000000000052', area: 'ingles', sub: 'reading_comprehension',
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
    { id: '44444444-0000-4000-8000-000000000053', area: 'ingles', sub: 'vocabulary',
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
    { id: '44444444-0000-4000-8000-000000000054', area: 'ingles', sub: 'grammar_reading',
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
    },
    { id: '44444444-0000-4000-8000-000000000055', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the option that correctly completes the conditional sentence: 'If the government had invested in solar energy earlier, the current energy crisis __________ avoided.'",
        recurso_visual: null,
        opciones: ["A) could have been", "B) can be", "C) will be", "D) is being"],
        ok: "A", a: 1.75, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000056', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the short paragraph: 'Artificial intelligence tools are rapidly transforming diagnostic medicine, enabling doctors to identify tumors in early stages with higher accuracy than traditional imaging methods.' What is the primary advantage mentioned?",
        recurso_visual: null,
        opciones: ["A) Enhanced precision in early tumor detection through AI assistance.", "B) Elimination of all medical doctors in public hospitals.", "C) Lower cost of surgical equipment in private clinics.", "D) Total replacement of radiologists by automated machinery."],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000057', area: 'ingles', sub: 'vocabulary',
        texto: "Select the word that best fits the sentence: 'The team's findings were considered __________ because they challenged decades of established geological consensus.'",
        recurso_visual: null,
        opciones: ["A) groundbreaking", "B) irrelevant", "C) predictable", "D) repetitive"],
        ok: "A", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000058', area: 'ingles', sub: 'grammar_reading',
        texto: "Complete the formal sentence correctly: 'Scarcely had the keynote speaker delivered his opening remarks __________ the fire alarm resonated across the auditorium.'",
        recurso_visual: null,
        opciones: ["A) when", "B) than", "C) then", "D) while"],
        ok: "A", a: 1.80, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000059', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Urban agriculture initiatives in Bogota have reduced food transport emissions by sourcing organic vegetables directly from rooftop gardens.' What is a key benefit highlighted in the passage?",
        recurso_visual: null,
        opciones: ["A) Reduction of carbon emissions associated with agricultural transport.", "B) Increase in vehicle sales across major metropolitan roads.", "C) Total ban on vegetable imports from neighboring municipalities.", "D) Higher electricity consumption in residential buildings."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000060', area: 'ingles', sub: 'vocabulary',
        texto: "Select the phrasal verb that best completes the sentence: 'Heavy rains forced event organizers to __________ the outdoor music festival until next month.'",
        recurso_visual: null,
        opciones: ["A) put off", "B) call out", "C) take over", "D) turn down"],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000061', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct subjunctive verb form: 'The ethics committee demanded that the lead researcher __________ all patient data before publication.'",
        recurso_visual: null,
        opciones: ["A) anonymize", "B) anonymizes", "C) anonymized", "D) will anonymize"],
        ok: "A", a: 1.85, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000062', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the statement: 'Studies show that students who practice active recall retain 50% more information during long-term memory evaluations than those relying solely on passive re-reading.' What study conclusion is supported?",
        recurso_visual: null,
        opciones: ["A) Active recall is significantly more effective for long-term retention than passive reading.", "B) Passive re-reading is the fastest method to master complex mathematical formulas.", "C) Memory evaluations are inaccurate indicators of academic performance.", "D) Students should avoid studying more than ten minutes per week."],
        ok: "A", a: 1.50, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000063', area: 'ingles', sub: 'grammar_reading',
        texto: "Fill in the blank with the appropriate relative pronoun: 'Professor Martinez, __________ groundbreaking work on Andean ecosystems earned an international prize, will deliver the opening address.'",
        recurso_visual: null,
        opciones: ["A) whose", "B) who", "C) whom", "D) which"],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000064', area: 'ingles', sub: 'vocabulary',
        texto: "Select the word that best completes the sentence: 'The director provided a __________ report detailing all operational expenditures and revenue projections for the upcoming year.'",
        recurso_visual: null,
        opciones: ["A) comprehensive", "B) superficial", "C) ambiguous", "D) incomplete"],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000065', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Linguists warn that half of the world's 7,000 spoken languages could become extinct by the end of this century if digital preservation efforts are not urgently expanded.' What threat is described?",
        recurso_visual: null,
        opciones: ["A) Potential extinction of thousands of indigenous languages due to lack of preservation.", "B) Complete disappearance of written books in public libraries worldwide.", "C) Universal adoption of a single mandatory global dialect.", "D) Total crash of international telecommunication networks."],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000066', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct passive voice construction: 'Environmental laws stipulate that all industrial wastewater __________ rigorously purified prior to release.'",
        recurso_visual: null,
        opciones: ["A) be", "B) being", "C) to be", "D) is been"],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000067', area: 'ingles', sub: 'vocabulary',
        texto: "Select the option that best completes the sentence: 'Despite unexpected technical obstacles, the engineers showed remarkable __________ and launched the satellite successfully.'",
        recurso_visual: null,
        opciones: ["A) resilience", "B) apathy", "C) hesitation", "D) indifference"],
        ok: "A", a: 1.40, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000068', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the sentence: 'When central banks raise interest rates, borrowing costs increase, which typically tempers consumer spending and cools inflation.' What is the expected outcome of raising interest rates?",
        recurso_visual: null,
        opciones: ["A) Reduction of consumer spending to control inflationary pressures.", "B) Immediate doubling of national minimum wage rates.", "C) Automatic reduction of international export tariffs.", "D) Free distribution of credit cards to all citizens."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000069', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct modal verb to express past advisability: 'You __________ brought a raincoat; the forecast explicitly predicted heavy downpours.'",
        recurso_visual: null,
        opciones: ["A) should have", "B) must to", "C) will have", "D) can have"],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000070', area: 'ingles', sub: 'vocabulary',
        texto: "Select the linking word that best expresses contrast: 'The infrastructure proposal was enthusiastically backed by local mayors; __________, national treasury officials expressed concern over fiscal deficits.'",
        recurso_visual: null,
        opciones: ["A) however", "B) furthermore", "C) consequently", "D) likewise"],
        ok: "A", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000071', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Ecotourism in rainforest reserves generates crucial revenue for local indigenous communities while incentivizing the protection of endangered fauna.' What dual impact is described?",
        recurso_visual: null,
        opciones: ["A) Economic empowerment of communities alongside biodiversity conservation.", "B) Increased deforestation rates and wildlife hunting.", "C) Total privatization of protected national parks.", "D) Displacement of native populations to urban centers."],
        ok: "A", a: 1.55, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000072', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct reported speech verb form: 'The minister announced that the government __________ new trade tariffs the following month.'",
        recurso_visual: null,
        opciones: ["A) would introduce", "B) will introduce", "C) introduces", "D) is introducing"],
        ok: "A", a: 1.70, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000073', area: 'ingles', sub: 'vocabulary',
        texto: "Select the adjective that best completes the sentence: 'The candidate's argument was so __________ that even skeptical committee members voted in favor of the proposal.'",
        recurso_visual: null,
        opciones: ["A) persuasive", "B) vague", "C) contradictory", "D) confusing"],
        ok: "A", a: 1.35, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000074', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Earth observation satellites provide essential real-time monitoring of deforestation, oceanic temperature changes, and urban expansion.' What role of satellites is highlighted?",
        recurso_visual: null,
        opciones: ["A) Environmental and urban monitoring through real-time observation.", "B) Commercial entertainment broadcasting to deep sea vessels.", "C) Direct manipulation of global weather patterns.", "D) Extraction of mineral resources on lunar craters."],
        ok: "A", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000075', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct relative pronoun: 'Dr. Martinez, __________ ground-breaking research on gene editing won international acclaim, will deliver tomorrow's keynote lecture.'",
        recurso_visual: null,
        opciones: ["A) whose", "B) whom", "C) which", "D) who's"],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000076', area: 'ingles', sub: 'vocabulary',
        texto: "Select the phrase that best completes the sentence: 'The company decided to __________ its old paper-based filing system and transition entirely to cloud storage.'",
        recurso_visual: null,
        opciones: ["A) phase out", "B) keep up", "C) look into", "D) take after"],
        ok: "A", a: 1.50, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000077', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the passage: 'Urban vertical farming utilizes soil-less hydroponic systems and controlled LED lighting, producing up to 30 times more crop yield per square meter than traditional agriculture.' What main advantage is mentioned?",
        recurso_visual: null,
        opciones: ["A) Significantly higher agricultural yield per unit of land area.", "B) Elimination of all electricity consumption in greenhouse operations.", "C) Lower initial capital investment requirements for farmers.", "D) Complete reliance on seasonal rainfall and sunlight."],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000078', area: 'ingles', sub: 'grammar_reading',
        texto: "Complete the sentence with the correct conditional structure: 'Had the team reviewed the contract more carefully, they __________ the hidden liability clause.'",
        recurso_visual: null,
        opciones: ["A) would have noticed", "B) noticed", "C) will notice", "D) have noticed"],
        ok: "A", a: 1.80, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000079', area: 'ingles', sub: 'vocabulary',
        texto: "Select the word that best completes the sentence: 'The mediator played a __________ role in helping both trade unions reach a peaceful compromise.'",
        recurso_visual: null,
        opciones: ["A) pivotal", "B) superficial", "C) redundant", "D) negligent"],
        ok: "A", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000080', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the text: 'Cybersecurity specialists emphasize that multi-factor authentication (MFA) substantially reduces the risk of unauthorized account access compared to passwords alone.' What is the author's primary recommendation?",
        recurso_visual: null,
        opciones: ["A) Adopting multi-factor authentication to strengthen digital account security.", "B) Discontinuing the use of digital banking platforms altogether.", "C) Sharing passwords openly among trusted co-workers.", "D) Changing passwords once every ten years."],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000081', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the option with inverted word order for emphasis: 'Not only __________ the audit on time, but they also uncovered significant cost savings.'",
        recurso_visual: null,
        opciones: ["A) did the accountants complete", "B) the accountants completed", "C) completed the accountants", "D) have completed accountants"],
        ok: "A", a: 1.85, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000082', area: 'ingles', sub: 'vocabulary',
        texto: "Select the synonym for 'meticulous' in context: 'The restoration of the ancient manuscript required meticulous attention to detail by master archivists.'",
        recurso_visual: null,
        opciones: ["A) painstaking", "B) careless", "C) hasty", "D) superficial"],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000083', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Artificial intelligence models trained on diverse multilingual datasets demonstrate improved translation accuracy and cultural nuance.' What leads to better AI translation performance?",
        recurso_visual: null,
        opciones: ["A) Training on comprehensive and diverse multilingual datasets.", "B) Reducing computer processing speeds during network training.", "C) Restricting training data exclusively to monolingual sources.", "D) Eliminating human feedback from software evaluation."],
        ok: "A", a: 1.50, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000084', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct prepositions: 'The new environmental regulation complies __________ international standards and takes effect __________ January 1st.'",
        recurso_visual: null,
        opciones: ["A) with / on", "B) to / in", "C) at / by", "D) for / at"],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000085', area: 'ingles', sub: 'vocabulary',
        texto: "Select the word that best fits: 'The research team was commended for conducting an __________ analysis that covered every variable involved in the experiment.'",
        recurso_visual: null,
        opciones: ["A) exhaustive", "B) exhausted", "C) exhausting", "D) exclusion"],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000086', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Microplastic pollution in marine food webs poses ecological threats, as toxic additives leach into tissues and biomagnify in predatory fish.' What hazard is described?",
        recurso_visual: null,
        opciones: ["A) Accumulation of toxic chemical additives in marine predators.", "B) Accelerated growth of coral reefs in polluted estuaries.", "C) Increased oxygenation of deep ocean currents.", "D) Desalination of seawater in coastal ecosystems."],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000087', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct gerund vs infinitive usage: 'The CEO recommended __________ the company's regional headquarters closer to key logistics hubs.'",
        recurso_visual: null,
        opciones: ["A) relocating", "B) to relocate", "C) relocate", "D) relocated"],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000088', area: 'ingles', sub: 'vocabulary',
        texto: "Select the option that best completes the sentence: 'The museum curator expressed concern that exposure to direct sunlight would __________ the vibrant pigments of the Renaissance oil painting.'",
        recurso_visual: null,
        opciones: ["A) degrade", "B) enhance", "C) illuminate", "D) preserve"],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000089', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Telemedicine platforms have expanded healthcare access in remote rural areas where specialized clinics are scarce.' What principal benefit is described?",
        recurso_visual: null,
        opciones: ["A) Improved healthcare access for geographically isolated populations.", "B) Mandatory relocation of rural doctors to metropolitan hospitals.", "C) Replacement of all medical doctors by automated robots.", "D) Increase in travel costs for rural patients seeking diagnostics."],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000090', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct phrase to express cause: 'The outdoor concert was postponed __________ unseasonal blizzard warnings issued by the meteorology department.'",
        recurso_visual: null,
        opciones: ["A) owing to", "B) in spite of", "C) with a view to", "D) regardless of"],
        ok: "A", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000091', area: 'ingles', sub: 'vocabulary',
        texto: "Select the antonym of 'subsequent': 'Prior to the launch event, the marketing department executed several preliminary trials.' What word in the sentence means the opposite of 'subsequent'?",
        recurso_visual: null,
        opciones: ["A) Preliminary", "B) Launch", "C) Department", "D) Executed"],
        ok: "A", a: 1.40, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000092', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Quantum computing leverages superposition and entanglement to solve cryptographic calculations exponentially faster than classical supercomputers.' What enables quantum computers' speed advantage?",
        recurso_visual: null,
        opciones: ["A) Utilizing quantum mechanics phenomena such as superposition and entanglement.", "B) Increasing mechanical fan cooling inside standard silicon chips.", "C) Replacing digital binary code with handwritten paper instructions.", "D) Running software exclusively on handheld smartphone battery power."],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000093', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct subjunctive structure: 'The committee insisted that every board member __________ present at the emergency shareholder meeting.'",
        recurso_visual: null,
        opciones: ["A) be", "B) is", "C) was", "D) to be"],
        ok: "A", a: 1.80, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000094', area: 'ingles', sub: 'vocabulary',
        texto: "Select the word that completes the phrase: 'To take something for __________' means to assume it is true without checking.",
        recurso_visual: null,
        opciones: ["A) granted", "B) guaranteed", "C) given", "D) grantedness"],
        ok: "A", a: 1.30, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000095', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the excerpt: 'Desalination plants remove salt from ocean water to produce potable water, but the process generates concentrated brine that requires careful environmental disposal.' What secondary challenge is highlighted?",
        recurso_visual: null,
        opciones: ["A) Environmentally responsible disposal of concentrated brine waste.", "B) Inability of ocean water to dissolve sodium chloride.", "C) Total lack of electricity in coastal municipalities.", "D) Contamination of clouds by atmospheric evaporation."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000096', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct passive voice construction: 'The historic bridge __________ by local craftsmen using traditional stone masonry techniques in 1845.'",
        recurso_visual: null,
        opciones: ["A) was constructed", "B) is constructed", "C) constructs", "D) was construct"],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000097', area: 'ingles', sub: 'vocabulary',
        texto: "Select the word that best completes the sentence: 'The university offers a __________ range of academic programs, spanning from astrophysics to fine arts.'",
        recurso_visual: null,
        opciones: ["A) broad", "B) narrow", "C) restricted", "D) solitary"],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000098', area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the passage: 'Preserving biodiversity hotspots protects Ecosystem Services, including pollination, water purification, and climate regulation upon which human agriculture relies.' Why are biodiversity hotspots vital?",
        recurso_visual: null,
        opciones: ["A) They sustain essential ecosystem services supporting human agricultural survival.", "B) They provide land for expanding urban concrete highways.", "C) They eliminate the necessity of soil irrigation in dry climates.", "D) They prevent solar eclipses from occurring."],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '44444444-0000-4000-8000-000000000099', area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct structure for past hypothetical regret: 'If I __________ about the deadline extension earlier, I wouldn't have stayed up all night finishing the report.'",
        recurso_visual: null,
        opciones: ["A) had known", "B) knew", "C) have known", "D) would know"],
        ok: "A", a: 1.70, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    }
];

const reactivosGen = generarReactivosInglesMasivos(1000);
export const reactivosIngles = [...reactivosSeed, ...reactivosGen];
