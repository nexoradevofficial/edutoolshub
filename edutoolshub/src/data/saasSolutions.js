/**
 * SaaS product catalog — add new products here only.
 * Marketplace cards and landing pages are generated from this data.
 */

export const saasSolutions = [
  {
    id: "school-college-management-system",
    slug: "school-college-management-system",
    title: "School & College Management System",
    shortTitle: "School ERP",
    subtitle: "Complete ERP solution for Schools, Colleges & Institutes.",
    description:
      "Manage admissions, students, staff, fees, attendance, examinations and administration from one secure cloud platform — with Admin and Teacher portals.",
    category: "Education",
    categoryBadge: "Cloud Based",
    techBadge: "Cloud SaaS",
    billingBadge: "Monthly Subscription",
    status: "active",
    accent: {
      from: "from-teal-500/20",
      via: "via-sky-500/10",
      to: "to-blue-600/20",
      solid: "bg-saas-teal",
      text: "text-saas-teal",
      ring: "ring-saas-teal/30",
    },
    cardFeatures: [
      "Admissions",
      "Students",
      "Staff",
      "Attendance (QR)",
      "Fees & Vouchers",
      "Exams",
      "WhatsApp Messaging",
      "ID Cards",
      "Reports",
      "Role-Based Access",
    ],
    hero: {
      heading: "Complete School & College Management System",
      subheading:
        "Manage admissions, students, staff, examinations and administration from one secure cloud platform — built for Admin and Teacher portals.",
      ctaPrimary: "Book Demo",
      ctaSecondary: "Contact on WhatsApp",
      ctaTertiary: "View Pricing",
    },
    trusted: [
      { id: "cloud", label: "Cloud Based", icon: "Cloud" },
      { id: "secure", label: "Secure", icon: "ShieldCheck" },
      { id: "fast", label: "Fast", icon: "Zap" },
      { id: "support", label: "24/7 Support", icon: "Headset" },
      { id: "scalable", label: "Scalable", icon: "Layers" },
      { id: "responsive", label: "Responsive", icon: "Smartphone" },
    ],
    usedBy: [
      "Schools",
      "Colleges",
      "Academies",
      "Universities",
      "Coaching Centers",
    ],
    metrics: [
      { value: 50, suffix: "+", label: "Modules" },
      { value: 99.9, suffix: "%", label: "Uptime" },
      { value: 24, suffix: "/7", label: "Support" },
      { value: 1, suffix: "", label: "Cloud Hosted", display: "Cloud Hosted" },
    ],
    process: [
      {
        step: 1,
        title: "Contact",
        description: "Share institute details and goals with our team.",
      },
      {
        step: 2,
        title: "Demo",
        description: "Walk through live modules tailored to your workflows.",
      },
      {
        step: 3,
        title: "Setup",
        description: "Configure campuses, roles, fees and academic structure.",
      },
      {
        step: 4,
        title: "Training",
        description: "Hands-on training for admins and teachers.",
      },
      {
        step: 5,
        title: "Go Live",
        description: "Launch with confidence and ongoing cloud support.",
      },
    ],
    modules: [
      {
        id: "admissions",
        title: "Admissions Management",
        icon: "UserPlus",
        description: "End-to-end admission workflows for new and pre-class intakes.",
        bullets: [
          "Add Student",
          "Add Bulk Student",
          "Pre Classes Admissions",
          "Admission Inquiries",
          "Admission reports",
        ],
      },
      {
        id: "students",
        title: "Student Management",
        icon: "GraduationCap",
        description: "Complete student records, promotions, discounts and scholarships.",
        bullets: [
          "Student Information",
          "Student Promotion",
          "Student Info Reports Generator",
          "Discounted Students handling",
          "Scholarship Management",
        ],
      },
      {
        id: "staff",
        title: "Staff Management",
        icon: "Users",
        description: "Hire, manage and pay staff with CV bank and salary tools.",
        bullets: [
          "Add Staff",
          "Manage Staff",
          "CV Bank",
          "Manage Staff Salary",
          "Staff Reports Generator",
        ],
      },
      {
        id: "classes",
        title: "Classes & Groups / Sections",
        icon: "School",
        description: "Organize academic structure with classes and groups.",
        bullets: ["Add & manage Classes", "Add & Manage Groups"],
      },
      {
        id: "attendance",
        title: "Manage Attendance",
        icon: "ClipboardCheck",
        description: "QR or manual attendance for staff and students, plus leave control.",
        bullets: [
          "Mark Attendance by QR or manual (Staff & Students)",
          "Bulk Holiday & Leave Management",
          "Attendance report Generator",
        ],
      },
      {
        id: "subjects",
        title: "Manage Subjects",
        icon: "BookOpen",
        description: "Define and assign subjects across classes and groups.",
        bullets: ["Subject catalog", "Class mapping", "Teacher assignment"],
      },
      {
        id: "timetable",
        title: "Time Table Management",
        icon: "CalendarDays",
        description: "Build and publish conflict-aware class timetables.",
        bullets: ["Period planner", "Teacher schedules", "Room / section view"],
      },
      {
        id: "exams",
        title: "Exam Management",
        icon: "FileText",
        description: "Plan exams, enter marks and publish results efficiently.",
        bullets: ["Exam schedules", "Marks entry", "Result processing"],
      },
      {
        id: "fees",
        title: "Fee Management",
        icon: "Wallet",
        description: "Monthly, custom and bulk fee workflows with collection tracking.",
        bullets: [
          "Generate Monthly Fee",
          "Generate Custom Fee",
          "Fee Receive Individual",
          "Bulk fee Payment",
          "Fee Collection Record",
        ],
      },
      {
        id: "vouchers",
        title: "Voucher Management",
        icon: "Receipt",
        description: "Print, scan and track fee vouchers with QR verification.",
        bullets: ["Print Vouchers", "Scan Voucher (QR)", "Voucher verification"],
      },
      {
        id: "security-fee",
        title: "Security Fees Return",
        icon: "Shield",
        description: "Track security deposits and process returns cleanly.",
        bullets: ["Deposit ledger", "Return requests", "Clearance reports"],
      },
      {
        id: "reporting",
        title: "Reporting Area",
        icon: "FileBarChart",
        description: "Operational and academic reports for every department.",
        bullets: [
          "Detailed Income Report",
          "Fee Defaulters Report",
          "Head Wise Dues Summary",
          "Export-ready summaries",
        ],
      },
      {
        id: "degrees",
        title: "Degrees & Marksheets",
        icon: "Award",
        description: "Generate degrees and marksheets for graduating students.",
        bullets: ["Marksheet templates", "Degree printing", "Verification codes"],
      },
      {
        id: "certificates",
        title: "Certificates Generator",
        icon: "ScrollText",
        description: "Create institutional certificates in minutes.",
        bullets: ["Certificate templates", "Bulk generate", "Print-ready output"],
      },
      {
        id: "id-cards",
        title: "Student & Staff ID Cards",
        icon: "IdCard",
        description: "Design and print professional ID cards for students and staff.",
        bullets: ["Photo ID cards", "Batch print", "Custom layouts"],
      },
      {
        id: "whatsapp",
        title: "WhatsApp Messaging",
        icon: "MessageCircle",
        description: "Reach contacts via WhatsApp with QR-based messaging workflows.",
        bullets: [
          "QR code scanning for WhatsApp",
          "Fee & notice messaging",
          "No SMS dependency",
        ],
      },
      {
        id: "roles",
        title: "Role-Based Access",
        icon: "KeyRound",
        description: "Granular permissions so every user sees only what they need.",
        bullets: ["Admin controls", "Teacher permissions", "Secure module locks"],
      },
      {
        id: "portals",
        title: "Admin & Teacher Portals",
        icon: "Laptop",
        description: "Dedicated portals for institute admins and teaching staff.",
        bullets: ["Admin console", "Teacher portal", "Mobile-friendly access"],
      },
      {
        id: "backup",
        title: "System Backup",
        icon: "HardDriveDownload",
        description: "Automated cloud backups to protect institute data.",
        bullets: ["Scheduled backups", "Restore options", "Encrypted storage"],
      },
    ],
    highlights: [
      {
        id: "fast",
        title: "Fast",
        description: "Optimized cloud stack for snappy dashboards and fee operations.",
      },
      {
        id: "reliable",
        title: "Reliable",
        description: "Battle-tested workflows used across educational institutes.",
      },
      {
        id: "modern",
        title: "Modern",
        description: "Clean UI designed for admins and teachers on every device.",
      },
      {
        id: "secure",
        title: "Secure",
        description: "Role-based access, SSL and encrypted cloud storage.",
      },
      {
        id: "cloud",
        title: "Cloud",
        description: "Access from anywhere — no local servers to maintain.",
      },
      {
        id: "easy",
        title: "Easy to Use",
        description: "Short learning curve with guided onboarding and training.",
      },
    ],
    whyChoose: [
      {
        id: "cloud-ready",
        title: "Cloud Ready",
        icon: "Cloud",
        description: "Hosted and maintained for you — launch without IT overhead.",
      },
      {
        id: "modern-ui",
        title: "Modern UI",
        icon: "Palette",
        description: "Premium interface that staff actually enjoy using.",
      },
      {
        id: "mobile",
        title: "Mobile Friendly",
        icon: "Smartphone",
        description: "Responsive Admin and Teacher portals for phones and tablets.",
      },
      {
        id: "affordable",
        title: "Affordable",
        icon: "Coins",
        description: "Transparent monthly plans without surprise license fees.",
      },
      {
        id: "whatsapp",
        title: "WhatsApp Ready",
        icon: "MessageCircle",
        description: "QR-powered WhatsApp messaging — no SMS dependency.",
      },
      {
        id: "updates",
        title: "Regular Updates",
        icon: "RefreshCw",
        description: "Continuous product improvements at no extra cost.",
      },
      {
        id: "secure-data",
        title: "Secure Data",
        icon: "Lock",
        description: "Hardened access controls and encrypted backups.",
      },
      {
        id: "performance",
        title: "Fast Performance",
        icon: "Gauge",
        description: "Built for peak admission and exam seasons.",
      },
      {
        id: "unlimited",
        title: "Unlimited Users",
        icon: "Infinity",
        description: "Add staff without per-seat pricing shock.",
      },
    ],
    security: {
      title: "Security & Data Privacy",
      description:
        "Enterprise-grade safeguards so student, fee and academic data stay protected.",
      points: [
        "SSL encryption in transit",
        "Role-based access & permissions",
        "Encrypted cloud backups",
        "Audit-friendly activity trails",
        "Admin & Teacher portal isolation",
        "Privacy-first design",
      ],
    },
    support: {
      title: "Tech Support & Maintenance",
      description:
        "Dedicated support so your institute never feels alone after go-live.",
      points: [
        "Priority WhatsApp support channel",
        "Email response within 24 hours",
        "Remote troubleshooting",
        "Version updates & patches",
        "Performance monitoring",
        "On-demand training refreshers",
      ],
    },
    customization: {
      title: "Customization on Demand",
      description:
        "Need institute-specific workflows? Customization is available on client demand and charged as per requirements.",
      note: "First-time bulk data entry (if requested) is charged separately.",
    },
    screenshots: [
      {
        id: "login",
        title: "Secure Login Portal",
        caption: "Role-based sign-in for Admin and Teachers",
        image: "/saas/school-college/login.png",
      },
      {
        id: "dash",
        title: "Admin Dashboard",
        caption: "Shortcuts, live widgets and subscription status",
        image: "/saas/school-college/dashboard-full.png",
      },
      {
        id: "shortcuts",
        title: "Quick Pages",
        caption: "One-tap access to fees, attendance and admissions",
        image: "/saas/school-college/dashboard-shortcuts.png",
      },
      {
        id: "mobile",
        title: "Mobile Console",
        caption: "Manage your institute on the go",
        image: "/saas/school-college/mobile-dashboard.png",
      },
    ],
    pricing: {
      billingNote:
        "One package · All modules · Monthly billing · August 2026 sale — 50% off",
      saleValidUntil: "31st August 2026",
      plans: [
        {
          id: "complete",
          name: "Complete Package",
          onSale: true,
          badge: "August Sale · 50% OFF",
          saleNote:
            "On sale for the month of August — 50% off. Offer valid till 31st August 2026.",
          saleValidUntil: "31st August 2026",
          originalPricePkr: 20000,
          originalPriceUsd: 72,
          pricePkr: 10000,
          priceUsd: 36,
          period: "/ month",
          highlighted: true,
          features: [
            "All modules included",
            "Admissions, Students & Staff",
            "QR attendance & Scan Voucher",
            "Fee & voucher management",
            "Exams, degrees & marksheets",
            "Certificates & ID cards",
            "WhatsApp messaging (QR)",
            "Admin & Teacher portals",
            "Role-based access",
            "Cloud hosting & SSL",
            "System backup",
            "Technical support & training",
          ],
          cta: "Start Subscription",
          action: "quote",
        },
      ],
    },
    faq: [
      {
        q: "Can I migrate existing data?",
        a: "Yes. We support structured migration from spreadsheets and common ERPs. First-time bulk data entry, if requested, is charged separately.",
      },
      {
        q: "Can multiple campuses be managed?",
        a: "Yes. Multi-campus controls can be configured so each campus stays organized with clear reporting.",
      },
      {
        q: "Who can access the portals?",
        a: "The system includes Admin and Teacher portals. Parent and Student portals are not part of the current product.",
      },
      {
        q: "Can teachers upload attendance?",
        a: "Yes. Teachers can mark attendance via QR or manually for staff and students, with holiday and leave management tools.",
      },
      {
        q: "Is hosting included?",
        a: "Yes. Cloud hosting, SSL, backups and updates are included in monthly subscription plans.",
      },
      {
        q: "Do you support SMS notifications?",
        a: "No. Messaging is handled via WhatsApp using QR code scanning workflows — there is no SMS module.",
      },
      {
        q: "Can custom features be added?",
        a: "Customization is available on demand and billed as per requirements after a scoped estimate.",
      },
    ],
    cta: {
      title: "Ready to Digitize Your Institute?",
      subtitle:
        "Book a free demo and see how one platform replaces scattered sheets and legacy software.",
    },
    footerCta: {
      title: "Need Custom Software?",
      subtitle:
        "We also develop custom SaaS solutions for every business — from hospitals to gyms, CRM to POS.",
    },
    seo: {
      title: "School & College Management System Software | EduToolsHub SaaS",
      description:
        "Best school & college management system in Pakistan — cloud ERP with admissions, fee vouchers, QR attendance, WhatsApp messaging, exams, ID cards, Admin & Teacher portals. Book a free demo.",
      keywords:
        "school management system, college management system, school ERP Pakistan, college ERP software, institute management system, fee management software, fee voucher software, QR attendance system, WhatsApp school messaging, student information system, education SaaS Pakistan, cloud school software, Admin Teacher portal, EduToolsHub",
      ogImage: "/saas/school-college/dashboard-full.png",
      sitemapPriority: "0.9",
      changefreq: "weekly",
      h2: "School & College Management System — Cloud ERP for Institutes",
      paragraphs: [
        "EduToolsHub School & College Management System is a complete cloud SaaS ERP built for schools, colleges, academies, universities and coaching centers. Digitize admissions, student records, staff management, fee collection, QR attendance, examinations, certificates, ID cards and reporting from one secure platform.",
        "Designed for institutes in Pakistan and worldwide, the software includes Admin and Teacher portals, role-based access, voucher scanning, WhatsApp messaging via QR, degrees and marksheets, and automated system backups — without SMS modules or parent/student portals.",
      ],
      secondaryHeading: "Why institutes choose this school management software",
      secondaryParagraphs: [
        "Replace spreadsheets and legacy desktop ERPs with a modern cloud school management system. Generate monthly and custom fees, print vouchers, track defaulters, mark attendance by QR or manually, and produce academic and operational reports in minutes.",
        "Pricing is simple: one complete package with all modules included. Current August 2026 sale offers 50% off — PKR 10,000/month (approx. USD 36) instead of PKR 20,000, valid till 31st August 2026.",
      ],
      modulesHeading: "School ERP modules covered by this SaaS solution",
      closing:
        "Looking for a reliable school management system, college ERP or institute automation software? Contact EduToolsHub for a free demo, quote or consultation — WhatsApp replies are handled quickly and email queries within 24 hours.",
    },
    buttons: {
      demoEmail: {
        to: "nexoradevofficial@gmail.com",
        subject: "School Management System Demo",
        body: "I want a demo of your School Management System.",
      },
      whatsapp: {
        url: "https://wa.me/923055231526",
        message:
          "Hi EduToolsHub, I need more info related to SaaS solution subscription.",
      },
    },
    images: {
      hero: "/saas/school-college/dashboard-full.png",
      dashboard: "/saas/school-college/dashboard-full.png",
      laptop: "/saas/school-college/dashboard-shortcuts.png",
      tablet: "/saas/school-college/dashboard-full.png",
      mobile: "/saas/school-college/mobile-dashboard.png",
      login: "/saas/school-college/login.png",
      card: "/saas/school-college/dashboard-shortcuts.png",
    },
  },
];

export function getAllSaasSolutions() {
  return saasSolutions.filter((s) => s.status !== "hidden");
}

export function getSaasBySlug(slug) {
  return saasSolutions.find((s) => s.slug === slug) ?? null;
}

export function getAllSaasSlugs() {
  return getAllSaasSolutions().map((s) => s.slug);
}
