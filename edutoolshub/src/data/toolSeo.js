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
    howToUse: [
      "This college GPA requirement checker helps you find minimum GPA for college programs at hundreds of universities. Filter by country, institution type, and ranking, then enter your GPA to see Strong Match, Possible Match, and Reach results.",
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
    howToUse: [
      "This attendance sheet generator free tool creates a professional monthly class register in minutes. Add your institute name, logo, class details, and student list, then customize holidays and optional extra columns before printing.",
      "Pick the month and year, enter student names (or leave blank rows), mark holidays by clicking dates, and preview the sheet. Switch to live marking mode to click cells for Present, Absent, or Leave, then print or export when finished.",
      "Classroom teachers, homeroom instructors, tuition centers, and school admins use it as a lightweight student attendance tracker without spreadsheets or paid software.",
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
    howToUse: [
      "This lesson plan maker for teachers helps you draft structured lesson plans, organize units on a calendar, map curriculum standards, and prepare substitute teacher packets — all in one place.",
      "Start in the Lesson Builder to create a plan from scratch or a template, add sections with drag-and-drop, and save automatically to your browser. Switch to Units, Curriculum, or Substitute modules to schedule topics and attach plans for printing.",
      "K–12 teachers, college instructors, tutors, and department heads use this free lesson planner online to stay organized without juggling multiple apps.",
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
    howToUse: [
      "This final grade calculator answers the question every student asks before finals: what grade do I need to pass? Enter marks earned so far, total marks completed, final exam weight, and your target percentage.",
      "Fill in each field and the result updates instantly. You will see whether your goal is achievable, how many marks you need on the final, and the projected overall percentage if you hit that score.",
      "High school and college students, parents helping with study planning, and teachers demonstrating grade math all use this tool before exam season.",
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
    howToUse: [
      "This school fee receipt generator creates polished receipts for tuition, subject fees, and miscellaneous charges. Add school and student details, line items per subject, optional discounts and tax, then preview and download.",
      "Enter school name and optional logo, fill student and parent information, add fee rows with the Add Subject button, and set currency and payment status. The live preview updates as you type — download a PDF or print when ready.",
      "Private tutors, coaching centers, school office staff, and small institutions use this fee receipt maker free of charge instead of manual Word templates.",
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
