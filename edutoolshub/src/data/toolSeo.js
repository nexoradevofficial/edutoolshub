const SITE_URL = "https://edutoolshub.com";

/** @typedef {{ question: string, answer: string }} ToolFaq */
/** @typedef {{ label: string, path: string }} RelatedTool */

/**
 * SEO copy, FAQs, meta tags, and schema data for each tool page.
 * Keys match `tools.js` ids.
 */
export const toolSeoById = {
  "gpa-calculator": {
    id: "gpa-calculator",
    name: "GPA / CGPA Calculator",
    path: "/tools/gpa-calculator",
    metaTitle: "GPA / CGPA Calculator - Free Online Tool | EduToolsHub",
    metaDescription:
      "Free GPA calculator for students — compute semester, cumulative, and CGPA on 4.0, 5.0, or custom scales. Learn how to calculate GPA step by step with country presets.",
    schemaDescription:
      "Calculate weighted and unweighted GPA, cumulative GPA, and CGPA with country presets and custom grading scales.",
    guideSections: [
      {
        title: "Understanding weighted GPA before you calculate",
        paragraphs: [
          "GPA is a credit-weighted average: each course grade is multiplied by credit hours, then divided by total credits. Skipping credits is the most common reason a spreadsheet GPA differs from an official transcript.",
          "Weighted scales give extra points for honors or advanced courses. Unweighted scales treat every A the same. Match the mode your school uses before you compare yourself to college admission ranges.",
          "After you compute semester and cumulative GPA here, convert scales with the GPA percentage tools if an application asks for a different format.",
        ],
      },
    ],
    howToUse: [
      "Our GPA calculator for students lets you add semesters, enter course grades and credit hours, and see your semester GPA, cumulative GPA, and CGPA update instantly. Choose your country preset or set a custom scale to match your school.",
      "To calculate GPA, select your grading system, add courses under each semester, and pick letter grades or point values. The live summary meter shows your standing at a glance, and you can generate a printable report when you are ready.",
      "This tool is built for high school and college students tracking academic progress, teachers explaining GPA to classes, and counselors helping applicants understand how grades roll up across terms.",
    ],
    faqs: [
      {
        question: "How do I calculate GPA with this tool?",
        answer:
          "Add each semester, then enter your courses with grades and credits. The calculator applies your selected scale automatically and shows semester GPA plus cumulative GPA. You can switch between weighted and unweighted modes where supported.",
      },
      {
        question: "Does this GPA calculator work for international students?",
        answer:
          "Yes. Presets cover common systems in the US, UK, Canada, Australia, Germany, and more. If your school uses a different maximum, set a custom scale and the math adjusts to your institution's rules.",
      },
      {
        question: "What is the difference between GPA and CGPA?",
        answer:
          "GPA usually refers to a single term or year, while CGPA (cumulative GPA) combines all completed semesters. This tool displays both so you can see short-term and long-term performance.",
      },
      {
        question: "Can I print or share my GPA report?",
        answer:
          "Yes. Fill in your name and institution details, then open the report preview to print a clean summary. It is useful for advising meetings or personal records.",
      },
      {
        question: "Is weighted GPA supported?",
        answer:
          "Where your country preset allows it, you can toggle weighted GPA for honors or AP-style courses. Advanced courses can carry extra grade points on supported scales.",
      },
      {
        question: "Is this GPA calculator free?",
        answer:
          "Completely free with no sign-up. All calculations run in your browser, so your grades are not uploaded to a server.",
      },
    ],
    relatedTools: [
      {
        label: "Convert your GPA to a percentage with our GPA to Percentage Converter",
        path: "/tools/gpa-to-percentage",
      },
      {
        label: "Check minimum GPA for college using the College GPA Requirement Checker",
        path: "/tools/college-university-gpa-requirement-checker",
      },
      {
        label: "Find out what grade you need on your final exam with the Final Grade Calculator",
        path: "/tools/final-grade-calculator",
      },
    ],
  },

  "gpa-to-percentage": {
    id: "gpa-to-percentage",
    name: "GPA to Percentage Converter",
    path: "/tools/gpa-to-percentage",
    metaTitle: "GPA to Percentage Converter - Free Online Tool | EduToolsHub",
    metaDescription:
      "Convert GPA to percentage instantly on 4.0, 5.0, or 10.0 scales. Free GPA to percentage calculator with letter grades, descriptors, and a visual score ring.",
    schemaDescription:
      "Convert GPA to an equivalent percentage on popular grading scales with letter grades and performance descriptors.",
    guideSections: [
      {
        title: "When applications ask for percentage instead of GPA",
        paragraphs: [
          "Some universities and scholarship forms request a percentage even when your transcript shows GPA. A transparent conversion helps you fill those fields consistently.",
          "Pick the scale printed on your transcript (4.0, 5.0, or 10.0). Institutions may publish their own tables — official charts always override an online estimate.",
          "If you have course-level grades, calculating GPA first and then converting is more accurate than converting a single overall percentage twice.",
        ],
      },
    ],
    howToUse: [
      "This GPA to percentage calculator converts your grade point average into an equivalent percentage on the 4.0, 5.0, or 10.0 scale. Enter your GPA, pick the scale your school uses, and the result updates immediately with a letter grade and descriptor.",
      "To convert GPA to percentage, type your GPA in the input field and select the correct scale from the options. A visual ring shows your score, and you can copy the full result text for applications or spreadsheets.",
      "Students applying to universities that ask for percentages, teachers comparing grading systems, and parents reviewing report cards all use this tool for quick, consistent conversions.",
    ],
    faqs: [
      {
        question: "How do I convert GPA to percentage?",
        answer:
          "Enter your GPA and choose your school's scale (4.0, 5.0, or 10.0). The converter maps your GPA to the equivalent percentage using standard conversion tables for that scale.",
      },
      {
        question: "Is GPA to percentage conversion the same at every school?",
        answer:
          "Institutions may use slightly different tables, but the ranges shown here follow widely accepted mappings. Always confirm with your registrar if an official transcript percentage is required.",
      },
      {
        question: "Which scale should I select?",
        answer:
          "Use the maximum GPA on your report card. US high schools often use 4.0 or 5.0 weighted; many universities abroad use 10.0. Pick the scale that matches your transcript.",
      },
      {
        question: "What do the letter grade and descriptor mean?",
        answer:
          "They provide a quick performance label — for example, whether a GPA falls in the excellent, good, or average band on the scale you selected. They appear alongside the percentage for context.",
      },
      {
        question: "Can I copy the conversion result?",
        answer:
          "Yes. Use the copy button to grab a formatted summary including GPA, percentage, letter grade, and descriptor for emails or notes.",
      },
      {
        question: "Is this GPA to percentage calculator free?",
        answer:
          "Yes. It is free, runs entirely in your browser, and requires no account.",
      },
    ],
    relatedTools: [
      {
        label: "Calculate your semester and cumulative GPA with our GPA Calculator",
        path: "/tools/gpa-calculator",
      },
      {
        label: "See which universities match your GPA with the College GPA Requirement Checker",
        path: "/tools/college-university-gpa-requirement-checker",
      },
      {
        label: "Work out marks needed on your final exam with the Final Grade Calculator",
        path: "/tools/final-grade-calculator",
      },
    ],
  },

  "gpa-requirement-checker": {
    id: "gpa-requirement-checker",
    name: "College / University GPA Requirement Checker",
    path: "/tools/college-university-gpa-requirement-checker",
    metaTitle:
      "College GPA Requirement Checker - Free Online Tool | EduToolsHub",
    metaDescription:
      "Free college GPA requirement checker — compare minimum GPA for college admission across the US, UK, Canada, Australia, and Germany. Enter your GPA to see match results instantly.",
    schemaDescription:
      "Search and compare university GPA admission requirements and see how your GPA matches schools worldwide.",
    guideSections: [
      {
        title: "How to read minimum vs average admitted GPA",
        paragraphs: [
          "Minimum GPA is often a floor. Average admitted GPA reflects the middle of a competitive pool and is usually higher. Plan with both numbers, not only the minimum.",
          "Filter by country and type, enter your GPA, and use Strong Match / Possible Match / Reach labels as planning signals — not admission guarantees. Holistic review still weighs essays, tests, and coursework rigor.",
          "Always confirm figures on the university admissions site for the year you apply. Published averages change, and campuses within the same system can differ.",
        ],
      },
    ],
    howToUse: [
      "Filter by country, institution type, and ranking, then enter your GPA to see Strong Match, Possible Match, and Reach results across universities in the database.",
      "Start by choosing a country and optional filters, then type your GPA in the banner at the top. Each university card shows the published GPA range and how your score compares, so you can build a realistic shortlist for applications.",
      "High school seniors, transfer students, international applicants, and school counselors use this tool to research admission standards before applying.",
    ],
    faqs: [
      {
        question: "How does the college GPA requirement checker work?",
        answer:
          "Select a country and browse or filter universities. Enter your GPA to highlight whether each school is a Strong Match, Possible Match, or Reach based on published admission GPA ranges.",
      },
      {
        question: "Where does the GPA requirement data come from?",
        answer:
          "Figures are compiled from official Common Data Sets and similar public admissions sources where available. Requirements can change yearly, so always verify on the university's website.",
      },
      {
        question: "Which countries are covered?",
        answer:
          "The database includes institutions in the United States, Canada, United Kingdom, Australia, and Germany, with filters to narrow results by type and ranking.",
      },
      {
        question: "Does meeting the GPA requirement guarantee admission?",
        answer:
          "No. GPA is one factor among essays, tests, extracurriculars, and holistics review. Use this tool for planning, not as a guarantee of acceptance.",
      },
      {
        question: "Can I compare my GPA on different scales?",
        answer:
          "Enter your GPA on the scale you normally use. For cross-country comparisons, convert first with our GPA to Percentage or GPA Calculator tools if needed.",
      },
      {
        question: "Is this college GPA checker free?",
        answer:
          "Yes. Search, filter, and compare universities at no cost with no registration required.",
      },
    ],
    relatedTools: [
      {
        label: "Calculate your current GPA with our GPA / CGPA Calculator",
        path: "/tools/gpa-calculator",
      },
      {
        label: "Convert GPA to percentage before comparing international requirements",
        path: "/tools/gpa-to-percentage",
      },
      {
        label: "Check what final exam score you still need with the Final Grade Calculator",
        path: "/tools/final-grade-calculator",
      },
    ],
  },

  "attendance-sheet": {
    id: "attendance-sheet",
    name: "Attendance Sheet Generator",
    path: "/tools/attendance-sheet",
    metaTitle: "Attendance Sheet Generator - Free Online Tool | EduToolsHub",
    metaDescription:
      "Free attendance sheet generator for teachers — build printable monthly class registers with holidays, roll numbers, and live marking. A simple student attendance tracker for schools.",
    schemaDescription:
      "Generate printable monthly attendance sheets with institute branding, holidays, custom columns, and optional live marking.",
    guideSections: [
      {
        title: "Build a monthly register teachers can actually use",
        paragraphs: [
          "A usable attendance sheet needs the right month, readable student rows, holidays that do not count against percentages, and space for present/absent marks without clutter.",
          "Start with institute and class details, add names or blank rows, mark holidays on the calendar headers, then print a blank grid or use live marking to tap P/A/L in the browser before exporting.",
          "Keep data local: print or save PDF when finished. Refreshing clears unsaved work, which is intentional for classroom privacy.",
        ],
      },
    ],
    howToUse: [
      "Add your institute name, logo, class details, and student list, then customize holidays and optional columns before printing.",
      "Pick the month and year, enter student names (or leave blank rows), mark holidays by clicking dates, and preview the sheet. Switch to live marking mode to click cells for Present, Absent, or Leave, then print or export when finished.",
      "Classroom teachers, homeroom instructors, tuition centers, and school admins use it as a lightweight attendance register without spreadsheets or paid software.",
    ],
    faqs: [
      {
        question: "How do I create a free attendance sheet?",
        answer:
          "Fill in institute and class details, choose the month, add student names, and customize holidays. The preview updates live — print directly from your browser or save as PDF.",
      },
      {
        question: "Can I add my school logo?",
        answer:
          "Yes. Upload an optional institute logo (PNG, JPG, WEBP, or SVG) and it appears in the printed header alongside your school name and address.",
      },
      {
        question: "What is live marking mode?",
        answer:
          "Live marking lets you click day cells to cycle through P (Present), A (Absent), and L (Leave). Attendance percentage is calculated automatically, excluding Sundays and holidays.",
      },
      {
        question: "Can I mark public holidays and weekends?",
        answer:
          "Sundays are highlighted automatically. Click any date header to add a holiday with a custom label that prints vertically in the column.",
      },
      {
        question: "Is there a roll number column?",
        answer:
          "You can enable roll numbers with a custom prefix, starting number, and zero-padding for neatly formatted student IDs.",
      },
      {
        question: "Does this student attendance tracker store data online?",
        answer:
          "No. Everything runs in your browser. Refreshing the page clears unsaved work, so print or export when you are done.",
      },
    ],
    relatedTools: [
      {
        label: "Plan your teaching schedule with our free Lesson Planner for teachers",
        path: "/tools/lesson-planner",
      },
      {
        label: "Issue fee receipts to parents with the School Fee Receipt Generator",
        path: "/tools/fee-receipt",
      },
      {
        label: "Track student grades and GPA with the GPA / CGPA Calculator",
        path: "/tools/gpa-calculator",
      },
    ],
  },

  "lesson-planner": {
    id: "lesson-planner",
    name: "Lesson Planner",
    path: "/tools/lesson-planner",
    metaTitle: "Lesson Planner - Free Online Tool | EduToolsHub",
    metaDescription:
      "Free lesson plan maker for teachers — build lesson plans, map curriculum units, and create substitute plans online. A lesson planner that saves locally in your browser.",
    schemaDescription:
      "Create lesson plans, schedule units, map curriculum standards, and build substitute teacher handouts — saved locally in the browser.",
    guideSections: [
      {
        title: "Plan lessons, units, and substitute days in one workflow",
        paragraphs: [
          "Effective planning links daily lessons to unit goals and standards, then leaves a clear handoff when you are absent. Spreading that across three apps usually means something falls through.",
          "Use the lesson builder for sectioned plans, the unit calendar for pacing, curriculum mapping for standards tracking, and substitute packets so a cover teacher can run the day without guessing.",
          "Plans save in your browser on this device. Export PDF when you need a copy for a binder, department review, or another computer.",
        ],
      },
    ],
    howToUse: [
      "Draft structured lesson plans, organize units on a calendar, map curriculum standards, and prepare substitute teacher packets — all in one place.",
      "Start in the Lesson Builder to create a plan from scratch or a template, add sections with drag-and-drop, and save automatically to your browser. Switch to Units, Curriculum, or Substitute modules to schedule topics and attach plans for printing.",
      "K–12 teachers, college instructors, tutors, and department heads use this planner to stay organized without juggling multiple apps.",
    ],
    faqs: [
      {
        question: "Is this lesson planner really free?",
        answer:
          "Yes. Every module is free with no subscription. Plans are stored in your browser's local storage, so there is no cloud account to create.",
      },
      {
        question: "Do I need an internet connection after loading the page?",
        answer:
          "Once the page loads, you can create and edit plans offline. Reconnect to access the latest version of the tool itself.",
      },
      {
        question: "Can I print or export lesson plans?",
        answer:
          "Yes. Open any saved plan and use Print or Export PDF. Substitute plans can include attached lesson plans in the printout.",
      },
      {
        question: "What templates are available?",
        answer:
          "The builder includes templates filtered by subject, grade, and duration. You can customize every section after applying a template.",
      },
      {
        question: "How does the curriculum mapper work?",
        answer:
          "Define your school year range, add topics week by week, and track framework standards and status. Export the map as CSV or PDF for department reviews.",
      },
      {
        question: "Will my lesson plans sync across devices?",
        answer:
          "Plans stay on the device and browser where you created them. Export PDFs or print copies if you need to move plans to another computer.",
      },
    ],
    relatedTools: [
      {
        label: "Generate printable class registers with the Attendance Sheet Generator",
        path: "/tools/attendance-sheet",
      },
      {
        label: "Create school fee receipts with the Fee Receipt Generator",
        path: "/tools/fee-receipt",
      },
      {
        label: "Help students calculate GPA with our GPA Calculator",
        path: "/tools/gpa-calculator",
      },
    ],
  },

  "exam-marks-needed": {
    id: "exam-marks-needed",
    name: "Final Grade Calculator",
    path: "/tools/final-grade-calculator",
    metaTitle: "Final Grade Calculator - Free Online Tool | EduToolsHub",
    metaDescription:
      "Free final grade calculator — find out what grade you need on your final exam to pass or hit your target percentage. See exactly how many marks you need instantly.",
    schemaDescription:
      "Calculate how many marks you need on a final exam to reach a target overall percentage based on coursework completed so far.",
    guideSections: [
      {
        title: "Turn final-exam stress into a concrete target score",
        paragraphs: [
          "Knowing the exact marks you need on a final turns vague anxiety into a study goal. The inputs are simple: points earned so far, points possible so far, final exam weight, and the overall percentage you want.",
          "If the required score exceeds the final exam total, the goal is not reachable with remaining points alone — talk to your instructor about options or adjust the target.",
          "Pair the result with a daily study plan so the remaining hours match the difficulty of hitting that score.",
        ],
      },
    ],
    howToUse: [
      "Enter marks earned so far, total marks completed, final exam weight, and your target percentage to see what you need on the final.",
      "Fill in each field and the result updates instantly. You will see whether your goal is achievable, how many marks you need on the final, and the projected overall percentage if you hit that score.",
      "High school and college students, parents helping with study planning, and teachers demonstrating grade math all use this before exam season.",
    ],
    faqs: [
      {
        question: "What grade do I need to pass my class?",
        answer:
          "Enter your current marks, total completed assessment marks, final exam total marks, and your passing percentage (often 40% or 50%). The calculator shows the exact marks required on the final.",
      },
      {
        question: "What if the required marks exceed the final exam total?",
        answer:
          "The tool flags the goal as not achievable and shows the maximum percentage you can reach. You may need to speak with your instructor about extra credit or remediation.",
      },
      {
        question: "Can I use this if I am already passing?",
        answer:
          "Yes. Set a higher target percentage to see what you need for an A or B. The calculator also shows when you have already met your goal before the final.",
      },
      {
        question: "Which numbers should I enter for coursework?",
        answer:
          "Use the sum of points you have earned so far and the maximum points possible on all graded work excluding the final. Check your syllabus if weights are uneven.",
      },
      {
        question: "Does this account for extra credit?",
        answer:
          "Include any extra credit already added to your earned marks. Future extra credit is not predicted — adjust inputs if more points become available.",
      },
      {
        question: "Is this final grade calculator free?",
        answer:
          "Yes. It is completely free, requires no login, and calculates locally in your browser.",
      },
    ],
    relatedTools: [
      {
        label: "Track your overall GPA with the GPA / CGPA Calculator",
        path: "/tools/gpa-calculator",
      },
      {
        label: "Convert between GPA and percentage with the GPA to Percentage Converter",
        path: "/tools/gpa-to-percentage",
      },
      {
        label: "Research college GPA cutoffs with the College GPA Requirement Checker",
        path: "/tools/college-university-gpa-requirement-checker",
      },
    ],
  },

  "fee-receipt": {
    id: "fee-receipt",
    name: "Fee Receipt Generator",
    path: "/tools/fee-receipt",
    metaTitle: "Fee Receipt Generator - Free Online Tool | EduToolsHub",
    metaDescription:
      "Free school fee receipt generator for teachers and admins — create subject-wise fee receipts with tax, discounts, and PDF download. A simple fee receipt maker for schools.",
    schemaDescription:
      "Generate professional school fee receipts with subject-wise fees, discounts, tax, payment status, and PDF export.",
    guideSections: [
      {
        title: "Issue clear fee receipts parents can trust",
        paragraphs: [
          "A good fee receipt shows who paid, for which student, which line items, any discount or tax, payment method, and whether the balance is paid or due — without looking like a rough draft.",
          "Add school branding, student and parent details, subject or fee rows, then download PDF or print. Use consistent receipt numbers if your office tracks payments offline.",
          "This tool is for documentation convenience. It does not replace accounting software for large institutions that need ledgers and audit trails.",
        ],
      },
    ],
    howToUse: [
      "Create polished receipts for tuition, subject fees, and miscellaneous charges. Add school and student details, line items, optional discounts and tax, then preview and download.",
      "Enter school name and optional logo, fill student and parent information, add fee rows with the Add Subject button, and set currency and payment status. The live preview updates as you type — download a PDF or print when ready.",
      "Private tutors, coaching centers, school office staff, and small institutions use this instead of manual Word templates.",
    ],
    faqs: [
      {
        question: "How do I make a school fee receipt?",
        answer:
          "Enter school and student details, list each subject with its fee amount, and set payment method and status. The preview shows the formatted receipt — click Download PDF to save it.",
      },
      {
        question: "Can I add discounts and tax?",
        answer:
          "Yes. Apply a flat or percentage discount and toggle tax with a custom label such as GST or VAT. Totals update automatically in the preview.",
      },
      {
        question: "Which currencies are supported?",
        answer:
          "USD, GBP, EUR, PKR, AUD, and CAD are built in. The selected currency symbol appears on every amount in the receipt.",
      },
      {
        question: "Can I upload a school logo?",
        answer:
          "Yes. Upload an optional institute logo that appears in the receipt header on screen, in printouts, and in the PDF export.",
      },
      {
        question: "Is an authorized signature required?",
        answer:
          "You can use a text placeholder or upload a signature image. A default footer note explains that the receipt is computer-generated.",
      },
      {
        question: "Is this fee receipt generator free?",
        answer:
          "Completely free with unlimited receipts. No account or payment is needed.",
      },
    ],
    relatedTools: [
      {
        label: "Track class attendance with the Attendance Sheet Generator",
        path: "/tools/attendance-sheet",
      },
      {
        label: "Organize your teaching week with the Lesson Planner",
        path: "/tools/lesson-planner",
      },
      {
        label: "Help families understand grades with the GPA Calculator",
        path: "/tools/gpa-calculator",
      },
    ],
  },

  "tracing-sheet": {
    id: "tracing-sheet",
    name: "Tracing Sheet Generator",
    path: "/tools/tracing-sheet-generator",
    metaTitle: "Tracing Sheet Generator - Free Printable Alphabet & Numbers | EduToolsHub",
    metaDescription:
      "Free tracing sheet generator for kindergarten teachers — create printable alphabet, number, and name tracing worksheets with dotted guide lines. No login required.",
    schemaDescription:
      "Generate printable alphabet and number tracing sheets with dotted guide lines, custom words, and multiple practice rows for kindergarten handwriting.",
    guideSections: [
      {
        title: "Print tracing practice matched to early literacy skills",
        paragraphs: [
          "Young learners need repeated, correctly formed letter and word practice. Tracing sheets work best when the skill matches the week’s phonics focus — alphabet, CVC, or sight words — not a random printable.",
          "Browse categories, customize what you need, and print for centers or take-home practice. Keep sessions short and model the stroke order before independent work.",
          "Teachers and parents can use the same sheets; adjust difficulty rather than mixing unrelated skills on one page.",
        ],
      },
    ],
    howToUse: [
      "This tracing sheet generator helps kindergarten and playgroup teachers create handwriting practice worksheets in seconds. Choose letters A–Z, numbers 0–9, or type a custom name or word, then set uppercase, lowercase, or both.",
      "Adjust how many dotted tracing rows appear under each solid guide letter, add an optional student name and sheet title, and preview the full page before printing. Everything runs in your browser with no account needed.",
      "Early years teachers, homeschool parents, and special education aides use it for daily letter formation practice, name writing, and number tracing without buying workbooks.",
    ],
    faqs: [
      {
        question: "How do I make a tracing sheet for my class?",
        answer:
          "Select letters or numbers from the grid, or enter a custom word. Choose uppercase or lowercase, set tracing rows (2–5), add a title and student name, then click Print to open your browser print dialog.",
      },
      {
        question: "Can I trace custom names or words?",
        answer:
          "Yes. Switch to Custom word mode and type any name or short word. Each letter gets a solid guide row plus dotted rows for students to trace.",
      },
      {
        question: "What font style is used for tracing?",
        answer:
          "Characters render with dotted dashed outlines using SVG guide lines — ideal for pencil tracing. A solid reference letter appears above the dotted rows.",
      },
      {
        question: "Is this tracing sheet generator free?",
        answer:
          "Completely free with unlimited sheets. No sign-up, no downloads, and no watermarks on printed output.",
      },
      {
        question: "Does this tool store student data?",
        answer:
          "No. All choices stay in your browser session only. Nothing is sent to a server.",
      },
      {
        question: "What paper size does it print on?",
        answer:
          "Sheets are formatted for A4 portrait printing with a clean white background. Use Save as PDF in the print dialog to keep a digital copy.",
      },
    ],
    relatedTools: [
      {
        label: "Reward good behavior with the Behavior Star Chart Generator",
        path: "/tools/behavior-chart-generator",
      },
      {
        label: "Plan lessons with the free Lesson Planner for teachers",
        path: "/tools/lesson-planner",
      },
      {
        label: "Track class attendance with the Attendance Sheet Generator",
        path: "/tools/attendance-sheet",
      },
    ],
  },

  "behavior-chart": {
    id: "behavior-chart",
    name: "Behavior Star Chart Generator",
    path: "/tools/behavior-chart-generator",
    metaTitle: "Behavior Star Chart Generator - Free Printable Reward Chart | EduToolsHub",
    metaDescription:
      "Free behavior chart generator for kindergarten — create weekly or monthly star charts for up to 30 students with reward icons. Print A4 sheets for stickers and stamps.",
    schemaDescription:
      "Generate printable weekly or monthly behavior reward charts with student names, optional behavior categories, and sticker-sized grid cells.",
    guideSections: [
      {
        title: "Use star charts as feedback, not just decoration",
        paragraphs: [
          "Behavior charts work when goals are specific, achievable within the week, and tied to recognition students care about. Vague charts that never get updated train students to ignore them.",
          "Set the period (weekly or monthly), list students, print A4 sheets for stickers or stamps, and review progress with the class so the chart stays meaningful.",
          "Pair charts with calm, consistent consequences and praise. The printable is a tool for visibility — not a substitute for relationship and clear expectations.",
        ],
      },
    ],
    howToUse: [
      "This behavior chart generator creates classroom reward trackers teachers can print and hang on the wall. Add up to 30 student names, pick a weekly Mon–Fri chart or a monthly 1–31 day chart, and choose a reward icon like stars or hearts.",
      "Enter your class name and week or month label, optionally add behavior categories such as Listening or Sharing, and watch the live preview update. Your progress saves automatically in the browser so you can return later.",
      "Kindergarten teachers, preschool aides, and after-school program leaders use printed charts so children earn stickers for positive behavior each day.",
    ],
    faqs: [
      {
        question: "How many students can I add?",
        answer:
          "Up to 30 student names. Each student gets a row with blank cells teachers fill with stickers, stamps, or checkmarks during the week or month.",
      },
      {
        question: "What is the difference between weekly and monthly charts?",
        answer:
          "Weekly charts show Monday through Friday in A4 landscape with large sticker-sized cells. Monthly charts show days 1–31 in A4 portrait for a full-month tracker.",
      },
      {
        question: "Can I add behavior categories?",
        answer:
          "Yes. Enable behavior categories to add up to four row labels like Listening, Sharing, or Tidying Up. Each student then gets a sub-row per category.",
      },
      {
        question: "Does my chart save automatically?",
        answer:
          "Yes. Student names, settings, and labels save in your browser localStorage. Use Clear saved data to reset. Data never leaves your device.",
      },
      {
        question: "Which reward icons are available?",
        answer:
          "Choose from star, smiley, gold star, or heart icons shown in the chart header as a visual cue for children.",
      },
      {
        question: "Is this behavior chart generator free?",
        answer:
          "Yes. Unlimited charts with no login. Print as many copies as you need for your classroom.",
      },
    ],
    relatedTools: [
      {
        label: "Create handwriting worksheets with the Tracing Sheet Generator",
        path: "/tools/tracing-sheet-generator",
      },
      {
        label: "Track daily attendance with the Attendance Sheet Generator",
        path: "/tools/attendance-sheet",
      },
      {
        label: "Plan your week with the Lesson Planner",
        path: "/tools/lesson-planner",
      },
    ],
  },

  "percentage-to-gpa": {
    id: "percentage-to-gpa",
    name: "Percentage to GPA Converter",
    path: "/tools/percentage-to-gpa",
    metaTitle: "Percentage to GPA Converter - Free Online Tool | EduToolsHub",
    metaDescription:
      "Convert percentage to GPA instantly on 4.0, 5.0, or 10.0 scales. Free percentage to GPA calculator with letter grades and reference tables.",
    schemaDescription:
      "Convert percentage scores to equivalent GPA on popular international grading scales.",
    guideSections: [
      {
        title: "Converting percentages to GPA the right way",
        paragraphs: [
          "Many report cards show percentages while university applications ask for GPA on a 4.0 (or other) scale. A transparent conversion helps you fill forms consistently — but official transcripts still override any online estimate.",
          "On a linear 4.0 mapping, GPA ≈ (percentage ÷ 100) × 4. Some regions use different tables (for example, percentage ÷ 9.5 on a 10-point CGPA system). Always pick the scale your school publishes, not a generic internet rumor.",
          "After converting, verify standing with the full GPA calculator if you have course-by-course grades and credits — that is more accurate than converting a single overall percentage.",
        ],
      },
    ],
    howToUse: [
      "Enter your percentage score (0–100) exactly as shown on your mark sheet or portal.",
      "Select the GPA scale used by your school or the form you are filling — commonly 4.0, 5.0, or 10.0.",
      "Read the equivalent GPA, letter grade, and performance descriptor. Compare with the on-page reference table for common bands.",
      "If an application asks for both percentage and GPA, report the official transcript values first; use this tool only when a conversion is explicitly allowed.",
      "Switch to the GPA to Percentage Converter when you need the reverse direction with the same scale conventions.",
    ],
    faqs: [
      {
        question: "How do I convert percentage to GPA?",
        answer:
          "Enter your percentage (0–100) and choose your scale. On a common 4.0 linear map, GPA = (percentage ÷ 100) × 4. On many 10.0 systems, GPA ≈ percentage ÷ 9.5 — confirm your registrar’s table.",
      },
      {
        question: "Is this the reverse of GPA to percentage?",
        answer:
          "Yes. Use our GPA to Percentage Converter for the opposite direction. Both tools use the same standard scale mappings.",
      },
      {
        question: "Will universities accept this conversion?",
        answer:
          "Treat it as an estimate. Admissions offices often recalculate from official transcripts. Use their published conversion chart when one exists.",
      },
      {
        question: "What if my school uses plus/minus letter grades?",
        answer:
          "A single overall percentage may not capture plus/minus nuances. Prefer course-level GPA calculation when individual grades are available.",
      },
      {
        question: "Is this tool free?",
        answer: "Yes. No sign-up required. All calculations run in your browser.",
      },
      {
        question: "Which scale should international students choose?",
        answer:
          "Choose the scale named on your transcript or target application. U.S. forms usually expect 4.0; many South Asian universities use 10.0 CGPA.",
      },
    ],
    relatedTools: [
      { label: "GPA to Percentage Converter", path: "/tools/gpa-to-percentage" },
      { label: "GPA / CGPA Calculator", path: "/tools/gpa-calculator" },
      { label: "Final Grade Calculator", path: "/tools/final-grade-calculator" },
    ],
  },

  "citation-generator": {
    id: "citation-generator",
    name: "Citation & Bibliography Generator",
    path: "/tools/citation-generator",
    metaTitle: "Free APA & MLA Citation Generator | EduToolsHub",
    metaDescription:
      "Generate APA 7 and MLA 9 citations for websites, books, and journal articles. Copy bibliography entries and in-text citations instantly — no sign-up.",
    schemaDescription:
      "Create formatted APA and MLA citations for academic sources with copy-ready bibliography entries.",
    guideSections: [
      {
        title: "Why accurate citations matter",
        paragraphs: [
          "Citations give credit to original authors, help readers locate sources, and protect you from accidental plagiarism. Instructors often mark down papers that mix APA and MLA punctuation, omit DOIs, or invent page numbers.",
          "APA 7th edition is common in psychology, education, and social sciences. MLA 9th edition is common in literature and language courses. Both expect consistent author names, titles, dates, and container details — a missing publisher or URL can make a reference incomplete.",
          "Use this generator to draft a correctly ordered entry, then compare it with your syllabus or style handbook before you submit. Treat the output as a high-quality starting point, not a substitute for your school’s official guide.",
        ],
      },
    ],
    howToUse: [
      "Choose APA 7 or MLA 9, then pick the source type that matches what you used: website, book, or journal article. The form only shows fields that matter for that combination.",
      "Enter authors carefully (family name and given name where asked), plus title, publication date, and container details such as site name, publisher, volume, or issue.",
      "Copy the bibliography entry into your reference list and use the matching in-text citation format beside the claim you support. Keep hanging indents and alphabetization as your style requires.",
      "If a field is unknown (no DOI, no page range), leave it blank rather than guessing — incomplete but honest citations are safer than fabricated details.",
      "Re-run the tool for each source so every entry follows the same edition rules. Consistency across the whole list is as important as any single citation.",
    ],
    faqs: [
      {
        question: "Which citation styles are supported?",
        answer:
          "APA 7th edition and MLA 9th edition for websites, books, and journal articles. Choose the style your instructor assigned before filling the form.",
      },
      {
        question: "How do in-text citations differ from the bibliography?",
        answer:
          "The bibliography (or Works Cited) lists full source details. In-text citations are short pointers in the body — typically author and year (APA) or author and page (MLA). This tool provides both so you can paste the right form in each place.",
      },
      {
        question: "What if my source has multiple authors?",
        answer:
          "Enter each author in the order shown on the source. APA and MLA abbreviate long author lists differently in-text; verify the final shortened form against your style guide when there are three or more authors.",
      },
      {
        question: "Do I need an account?",
        answer:
          "No. Citations are generated instantly in your browser with no login and no upload of your paper.",
      },
      {
        question: "Should I verify the citation before submitting?",
        answer:
          "Yes. Always double-check against your institution’s style guide or librarian resources. Edge cases (translated works, social media, datasets) may need manual tweaks.",
      },
      {
        question: "Is this citation generator free?",
        answer: "Completely free with unlimited citations and no signup.",
      },
    ],
    relatedTools: [
      { label: "Study Time Calculator", path: "/tools/study-time-calculator" },
      { label: "GPA Calculator", path: "/tools/gpa-calculator" },
    ],
  },

  "study-time-calculator": {
    id: "study-time-calculator",
    name: "Study Time Calculator",
    path: "/tools/study-time-calculator",
    metaTitle: "Study Time Calculator — Plan Exam Revision | EduToolsHub",
    metaDescription:
      "Free study time calculator for students. Enter subjects, hours needed, and days until your exam to get a daily revision schedule.",
    schemaDescription:
      "Plan exam study schedules by subject with daily time breakdowns based on available study hours.",
    guideSections: [
      {
        title: "Build a revision plan that fits real days",
        paragraphs: [
          "Effective exam prep starts with constraints: days left, hours you can honestly study each day, and how much each subject still needs. Without those numbers, schedules either over-promise or ignore weak topics.",
          "A proportional plan assigns more daily time to subjects that need more total hours, while still respecting your daily capacity. If the math says you need more hours than you have, you must either add days, cut scope, or increase daily study — the calculator makes that trade-off visible.",
          "Pair this schedule with grade targets from the Final Grade Calculator so you know which courses deserve the most remaining effort before exams begin.",
        ],
      },
    ],
    howToUse: [
      "Enter how many days remain before your exam (or exam week) and how many focused hours you can study on a typical day — exclude meals, commute, and passive scrolling.",
      "Add each subject with a realistic total of revision hours still needed. Be honest: a weak topic may need more hours than a strong one with the same credit weight.",
      "Review the daily breakdown. The tool spreads your daily capacity across subjects in proportion to remaining need so every subject gets attention.",
      "If the plan shows a shortfall, increase daily hours, reduce lower-priority topics, or start earlier. Adjust inputs until the schedule is achievable.",
      "Revisit the plan mid-week. After completing sessions, lower remaining hours for finished topics so the remaining days rebalance automatically.",
    ],
    faqs: [
      {
        question: "How does the study plan work?",
        answer:
          "The calculator divides your daily study hours among subjects proportionally based on how many hours each subject still needs, then shows a day-by-day view you can follow or adjust.",
      },
      {
        question: "What if I don't have enough time?",
        answer:
          "You will see how many extra hours are required and what daily total would close the gap. Use that signal to cut topics, add study days, or raise daily hours.",
      },
      {
        question: "Should I study every subject every day?",
        answer:
          "Proportional daily splits keep all subjects warm. If you prefer blocked days (one subject per day), use the totals as a weekly budget and rearrange manually.",
      },
      {
        question: "How do I estimate hours needed per subject?",
        answer:
          "Start from past quizzes: topics you scored below target may need 1.5–2× the hours of topics you already know. Include practice tests, not just rereading notes.",
      },
      {
        question: "Is my data saved?",
        answer:
          "No. Everything runs in your browser session — no account or server storage of your study plan.",
      },
      {
        question: "Is the study time calculator free?",
        answer: "Yes. Free forever with no signup.",
      },
    ],
    relatedTools: [
      { label: "Final Grade Calculator", path: "/tools/final-grade-calculator" },
      { label: "GPA Calculator", path: "/tools/gpa-calculator" },
      { label: "Citation Generator", path: "/tools/citation-generator" },
    ],
  },

  "report-card-comments": {
    id: "report-card-comments",
    name: "Report Card Comment Generator",
    path: "/tools/report-card-comment-generator",
    metaTitle: "Report Card Comment Generator for Teachers | EduToolsHub",
    metaDescription:
      "Free report card comment generator for teachers. Create professional comments for academics, behavior, participation, and work habits — copy and edit instantly.",
    schemaDescription:
      "Generate editable report card comments for teachers based on student performance levels.",
    guideSections: [
      {
        title: "Write report comments that sound like the student you teach",
        paragraphs: [
          "Strong report-card comments are specific, balanced, and actionable. Parents and students should leave knowing what is going well, what needs work, and what to try next — not a stack of vague praise.",
          "Start from clear performance levels across academics, behavior, participation, and work habits, then personalize names, pronouns, and one concrete classroom example. Templates save time; your edits make the comment authentic.",
          "Never paste an unchanged bank comment for every learner. Review tone for younger vs older students, and align language with your school’s reporting policy before you publish.",
        ],
      },
    ],
    howToUse: [
      "Enter the student's preferred name, pronouns, and the subject or learning area so the comment reads naturally in first draft.",
      "Select performance levels for academics, behavior, participation, and work habits that match your evidence from the term.",
      "Generate the comment, then edit: add one specific strength, one growth area, and a next step parents can support at home.",
      "Copy the finalized text into your student information system or printable report. Repeat per student — do not mass-send identical paragraphs.",
      "If your school requires standard stems or character limits, trim the draft to fit while keeping the individualized details.",
    ],
    faqs: [
      {
        question: "Can I customize the generated comment?",
        answer:
          "Yes. The comment is a starting point — edit tone, examples, and goals so each student receives an accurate, individual message.",
      },
      {
        question: "Does this replace professional judgment?",
        answer:
          "No. Use these comments as templates. Teachers should review and adjust every comment for accuracy, fairness, and school policy.",
      },
      {
        question: "How do I avoid comments that sound AI-generated?",
        answer:
          "Add a concrete classroom moment (a project, lab, or discussion) and remove generic adjectives. Specific evidence is what makes comments feel human.",
      },
      {
        question: "Can I use this for progress reports mid-term?",
        answer:
          "Yes. Choose levels that reflect current standing and frame next steps as short-cycle goals before the final report.",
      },
      {
        question: "Is this free for teachers?",
        answer: "Yes. Unlimited comments with no login required.",
      },
      {
        question: "Is student data stored?",
        answer:
          "Names stay in your browser session for drafting only. We do not require accounts or upload class lists to a server.",
      },
    ],
    relatedTools: [
      { label: "Rubric Generator", path: "/tools/rubric-generator" },
      { label: "Certificate Maker", path: "/tools/certificate-maker" },
      { label: "Behavior Star Chart Generator", path: "/tools/behavior-chart-generator" },
    ],
  },

  "rubric-generator": {
    id: "rubric-generator",
    name: "Rubric Generator",
    path: "/tools/rubric-generator",
    metaTitle: "Free Rubric Generator for Teachers | EduToolsHub",
    metaDescription:
      "Create printable assessment rubrics with custom criteria and performance levels. Free rubric generator for teachers — no sign-up.",
    schemaDescription:
      "Build and print customizable grading rubrics with criteria rows and performance level columns.",
    guideSections: [
      {
        title: "Design rubrics students can actually use",
        paragraphs: [
          "A clear rubric tells learners what quality looks like before they submit work. Each criterion should describe observable performance — not personality — across levels from emerging to exemplary.",
          "Limit criteria to what you will truly score. Too many rows slow grading and dilute feedback. Four to six well-defined criteria usually beat a dozen vague ones.",
          "Share the rubric with the assignment brief, then use the same grid when marking so feedback stays aligned with expectations you already published.",
        ],
      },
    ],
    howToUse: [
      "Name your rubric after the assignment (for example, “Persuasive Essay — Grade 8”) and set performance level headers such as Beginning, Developing, Proficient, and Advanced.",
      "Add criteria that match learning goals — organization, evidence, collaboration, safety, accuracy — and write short descriptors for each level.",
      "Keep language student-friendly. Avoid jargon so learners can self-assess before they turn work in.",
      "Print the landscape table for folders or project packets, or keep it on-screen while you score digital submissions.",
      "Reuse the structure for similar tasks next term; swap descriptors instead of rebuilding from scratch.",
    ],
    faqs: [
      {
        question: "Can I add my own criteria?",
        answer: "Yes. Add, remove, and rename as many criteria rows as your assignment needs.",
      },
      {
        question: "How do I print the rubric?",
        answer:
          "Click Print rubric to open a landscape A4 print dialog with a clean table layout suitable for handouts.",
      },
      {
        question: "Analytic vs holistic rubrics — which is this?",
        answer:
          "This tool builds analytic rubrics (separate scores per criterion). Holistic rubrics use one overall description; you can approximate that with a single criterion if your school prefers it.",
      },
      {
        question: "Should point values appear on the rubric?",
        answer:
          "Many teachers add points in the level headers or criteria names. Keep totals consistent with your gradebook so conversion stays transparent.",
      },
      {
        question: "Is this rubric generator free?",
        answer: "Yes. No account required and unlimited rubrics.",
      },
      {
        question: "Can students use this for self-assessment?",
        answer:
          "Absolutely. Printing a student copy encourages reflection before final submission and reduces “surprise” grades.",
      },
    ],
    relatedTools: [
      { label: "Report Card Comment Generator", path: "/tools/report-card-comment-generator" },
      { label: "Lesson Planner", path: "/tools/lesson-planner" },
    ],
  },

  "certificate-maker": {
    id: "certificate-maker",
    name: "Certificate Maker",
    path: "/tools/certificate-maker",
    metaTitle: "Free Student Certificate Maker for Teachers | EduToolsHub",
    metaDescription:
      "Design printable student achievement certificates in seconds. Free certificate maker for teachers — custom names, titles, and styles.",
    schemaDescription:
      "Create printable student achievement certificates with customizable fields and styles.",
    guideSections: [
      {
        title: "Recognize students without starting from a blank slide",
        paragraphs: [
          "Certificates reinforce effort, improvement, citizenship, and academic milestones. A consistent template with a clear achievement title is more meaningful than a cluttered design students cannot read from the back of the room.",
          "Include the student name, achievement, school or class, presenter, and date. Leave space to sign by hand — a wet signature still matters for formal recognition ceremonies.",
          "Print one certificate at a time when names differ, or keep the style locked and only swap the student field for classroom awards night.",
        ],
      },
    ],
    howToUse: [
      "Enter the student name exactly as it should appear on the printed award, plus a concise achievement title (for example, “Most Improved in Science”).",
      "Optionally add school name, presenter name, and date. Choose a visual style that matches the occasion — classic, gold, or academic green.",
      "Preview the landscape layout, then print on quality paper if the certificate will be framed or presented on stage.",
      "Sign in the presenter area after printing. Change the student name and reprint for the next awardee without rebuilding the design.",
      "For digital recognition, print to PDF and attach to an email or learning platform announcement.",
    ],
    faqs: [
      {
        question: "Can I print multiple certificates?",
        answer:
          "Yes. Change the student name (and title if needed) and print as many certificates as you need — no batch upload required.",
      },
      {
        question: "What styles are available?",
        answer: "Classic blue, gold achievement, and academic green themes suitable for classroom and assembly use.",
      },
      {
        question: "What paper size should I use?",
        answer:
          "Landscape letter or A4 works best. Use heavier paper (120–160 gsm) for ceremonies if your printer supports it.",
      },
      {
        question: "Do I need to create an account?",
        answer: "No. Certificates are generated instantly in your browser.",
      },
      {
        question: "Can I use this for staff or volunteer awards?",
        answer:
          "Yes. Adjust the achievement title and presenter fields — the layout works for student and adult recognition.",
      },
      {
        question: "Is the certificate maker free?",
        answer: "Yes. Unlimited certificates with no watermark from EduToolsHub.",
      },
    ],
    relatedTools: [
      { label: "Behavior Star Chart Generator", path: "/tools/behavior-chart-generator" },
      { label: "Report Card Comment Generator", path: "/tools/report-card-comment-generator" },
    ],
  },
};

/** Build WebApplication JSON-LD for a tool. */
export function buildToolSchema(seo) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.name,
    description: seo.schemaDescription,
    url: `${SITE_URL}${seo.path}`,
    applicationCategory: "EducationApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
