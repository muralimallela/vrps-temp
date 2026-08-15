import { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://vaddera.org";

export const SITE_NAME_EN = "VRPS | Vaddera Reservation Porata Samithi";
export const SITE_NAME_TE = "VRPS | వడ్డెర రిజర్వేషన్ పోరాట సమితి";

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  locale?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  authors?: string[];
}

// Complete SEO metadata dictionary for all public and private pages in Telugu and English
export const SEO_PAGE_DATA: Record<
  string,
  {
    en: { title: string; description: string; keywords: string[] };
    te: { title: string; description: string; keywords: string[] };
  }
> = {
  home: {
    en: {
      title: "VRPS | Vaddera Reservation Porata Samithi — Official Portal",
      description:
        "Official platform of Vaddera Reservation Porata Samithi (VRPS). Dedicated to constitutional rights, education, community empowerment, welfare, and socio-economic progress.",
      keywords: [
        "VRPS",
        "Vaddera Reservation Porata Samithi",
        "Vaddera Community",
        "Vaddera Welfare",
        "Community Empowerment",
        "Vaddera Mahasabha",
        "Andhra Pradesh Vaddera",
        "Telangana Vaddera",
      ],
    },
    te: {
      title: "VRPS | వడ్డెర రిజర్వేషన్ పోరాట సమితి — అధికారిక వేదిక",
      description:
        "వడ్డెర రిజర్వేషన్ పోరాట సమితి (VRPS) అధికారిక వేదిక. విద్య, రాజ్యాంగ హక్కులు, సమాజ సాధికారత, సంక్షేమం మరియు అభివృద్ధి కోసం అంకితం.",
      keywords: [
        "VRPS",
        "వడ్డెర రిజర్వేషన్ పోరాట సమితి",
        "వడ్డెర సంక్షేమం",
        "వడ్డెర సంఘం",
        "వడ్డెర సాధికారత",
        "తెలంగాణ వడ్డెర",
        "ఆంధ్రప్రదేశ్ వడ్డెర",
      ],
    },
  },
  objectives: {
    en: {
      title: "Objectives & Mission | VRPS",
      description:
        "Discover the 11 core objectives and long-term mission of VRPS: constitutional rights, educational grants, vocational training, welfare programs, and youth development.",
      keywords: [
        "VRPS Objectives",
        "VRPS Mission",
        "Community Welfare Goals",
        "Vaddera Rights",
        "Youth Empowerment",
      ],
    },
    te: {
      title: "లక్ష్యాలు & ఆశయాలు | VRPS",
      description:
        "వడ్డెర రిజర్వేషన్ పోరాట సమితి (VRPS) యొక్క 11 ప్రధాన లక్ష్యాలు, విద్యా సహాయం, యువజన సాధికారత మరియు సంక్షేమ పథకాలు.",
      keywords: [
        "VRPS లక్ష్యాలు",
        "వడ్డెర పోరాట సమితి లక్ష్యాలు",
        "సంక్షేమ ఆశయాలు",
        "విద్యా సాధికారత",
      ],
    },
  },
  vrpsBirth: {
    en: {
      title: "How VRPS Was Born — The Historic Movement | VRPS",
      description:
        "The story behind the inception of Vaddera Reservation Porata Samithi. Learn about the pioneers, visionary leaders, and the movement that unified the community.",
      keywords: [
        "VRPS Birth",
        "VRPS History",
        "Movement Origins",
        "Vaddera Leaders",
        "Community Struggle",
      ],
    },
    te: {
      title: "VRPS ఆవిర్భావం — ఉద్యమ చరిత్ర | VRPS",
      description:
        "వడ్డెర రిజర్వేషన్ పోరాట సమితి పుట్టుక మరియు ఉద్యమ చరిత్ర. సమాజ నాయకుల కృషి మరియు ఐక్యత దిశగా సాగిన పోరాటం.",
      keywords: [
        "VRPS ఆవిర్భావం",
        "వడ్డెర ఉద్యమం",
        "చారిత్రక పోరాటం",
        "వడ్డెర నాయకత్వం",
      ],
    },
  },
  history: {
    en: {
      title: "History of the Vaddera Community & Heritage | VRPS",
      description:
        "Explore the rich cultural heritage, historical craftsmanship, courage, and socio-political milestones of the Vaddera community across India.",
      keywords: [
        "Vaddera History",
        "Odde Obanna",
        "Vaddera Heritage",
        "Historic Craftsmanship",
        "Community Heritage",
      ],
    },
    te: {
      title: "వడ్డెర సమాజ చరిత్ర & సాంస్కృతిక వారసత్వం | VRPS",
      description:
        "వడ్డెర సమాజం యొక్క చారిత్రక ఘనత, శిల్పకళా నైపుణ్యం, ధైర్య సాహసాలు మరియు చారిత్రక పోరాటాలు.",
      keywords: [
        "వడ్డెర చరిత్ర",
        "ఒడ్డె ఓబన్న",
        "వడ్డెర వారసత్వం",
        "చారిత్రక సాంస్కృతిక ప్రాభవం",
      ],
    },
  },
  assemblySiege: {
    en: {
      title: "Assembly Siege Protests & Historic Struggle | VRPS",
      description:
        "Detailed account of the historic Chalo Assembly sieges, peaceful mass demonstrations, and policy advocacy by VRPS for community welfare.",
      keywords: [
        "Assembly Siege",
        "Chalo Assembly",
        "VRPS Protests",
        "Vaddera Demands",
        "Democratic Struggle",
      ],
    },
    te: {
      title: "అసెంబ్లీ ముట్టడి — చారిత్రక పోరాటం | VRPS",
      description:
        "చలో అసెంబ్లీ ముట్టడి, శాంతియుత ప్రజా ఉద్యమాలు మరియు హక్కుల సాధన కోసం వడ్డెర రిజర్వేషన్ పోరాట సమితి చేపట్టిన చారిత్రక నిరసనలు.",
      keywords: [
        "అసెంబ్లీ ముట్టడి",
        "చలో అసెంబ్లీ",
        "VRPS పోరాటం",
        "వడ్డెర హక్కులు",
      ],
    },
  },
  vadderaCulture: {
    en: {
      title: "Vaddera Culture, Traditions & Identity | VRPS",
      description:
        "Celebrate the timeless traditions, cultural festivals, stone craftsmanship, architectural marvels, and social solidarity of the Vaddera community.",
      keywords: [
        "Vaddera Culture",
        "Vaddera Traditions",
        "Stone Sculpting Heritage",
        "Cultural Identity",
      ],
    },
    te: {
      title: "వడ్డెర సంస్కృతి & సాంప్రదాయాలు | VRPS",
      description:
        "వడ్డెర సమాజ సాంస్కృతిక విశిష్టత, జీవన విధానం, శిల్పకళా నైపుణ్యాలు మరియు సాంప్రదాయ పండుగలు.",
      keywords: [
        "వడ్డెర సంస్కృతి",
        "వడ్డెర సాంప్రదాయాలు",
        "శిల్పకళ",
        "సాంస్కృతిక గుర్తింపు",
      ],
    },
  },
  empowerment: {
    en: {
      title: "Socio-Economic & Youth Empowerment Initiatives | VRPS",
      description:
        "Learn about VRPS empowerment programs: higher education scholarships, skill development, employment guidance, and women self-help initiatives.",
      keywords: [
        "Empowerment Initiatives",
        "Vaddera Youth Skill Development",
        "Education Support",
        "Social Empowerment",
      ],
    },
    te: {
      title: "సాధికారత & విద్యా వికాస కార్యక్రమాలు | VRPS",
      description:
        "వడ్డెర యువత మరియు కుటుంబాల సాధికారత కొరకు విద్య, ఉపాధి, నైపుణ్యాభివృద్ధి మరియు ఆర్థిక చైతన్య కార్యక్రమాలు.",
      keywords: [
        "సాధికారత",
        "విద్యా వికాసం",
        "ఉపాధి అవకాశాలు",
        "యువజన నైపుణ్యాలు",
      ],
    },
  },
  executiveCommittee: {
    en: {
      title: "Executive Committee & State Leadership | VRPS",
      description:
        "Meet the dedicated state officers, executive committee members, and district coordinators leading VRPS initiatives across the nation.",
      keywords: [
        "VRPS Executive Committee",
        "State Leadership",
        "Office Bearers",
        "Community Representatives",
      ],
    },
    te: {
      title: "రాష్ట్ర కార్యవర్గం & నాయకత్వం | VRPS",
      description:
        "వడ్డెర రిజర్వేషన్ పోరాట సమితి రాష్ట్ర కార్యవర్గ సభ్యులు, బాధ్యులు మరియు ప్రతినిధుల వివరాలు.",
      keywords: [
        "VRPS కార్యవర్గం",
        "రాష్ట్ర నాయకత్వం",
        "కమిటీ బాధ్యులు",
        "సమితి ప్రతినిధులు",
      ],
    },
  },
  news: {
    en: {
      title: "News, Press Releases & Announcements | VRPS",
      description:
        "Stay updated with the latest news, state conventions, press releases, memorandum submissions, and official notices from VRPS.",
      keywords: [
        "VRPS News",
        "Press Releases",
        "Community Conventions",
        "VRPS Updates",
        "Official Notices",
      ],
    },
    te: {
      title: "వార్తలు & ప్రకటనలు | VRPS",
      description:
        "వడ్డెర రిజర్వేషన్ పోరాట సమితి తాజా వార్తలు, పత్రికా ప్రకటనలు, మహాసభలు మరియు ముఖ్యమైన సమాచారం.",
      keywords: [
        "VRPS వార్తలు",
        "పత్రికా ప్రకటనలు",
        "సమితి అప్‌డేట్స్",
        "మహాసభ వార్తలు",
      ],
    },
  },
  gallery: {
    en: {
      title: "Photo Archives & Community Galleries | VRPS",
      description:
        "Visual chronicles of state conventions, welfare drives, student felicitation events, and regional rallies organized by VRPS.",
      keywords: [
        "VRPS Photo Gallery",
        "Convention Photos",
        "Event Archives",
        "Community Photos",
      ],
    },
    te: {
      title: "ఫోటో గ్యాలరీ & చిత్రమాలిక | VRPS",
      description:
        "VRPS ఆధ్వర్యంలో జరిగిన సభలు, సమావేశాలు, సంక్షేమ కార్యక్రమాలు మరియు ర్యాలీల ఫోటో గ్యాలరీ.",
      keywords: [
        "VRPS ఫోటో గ్యాలరీ",
        "చిత్రమాలిక",
        "సభల ఫోటోలు",
        "కార్యక్రమాల దృశ్యాలు",
      ],
    },
  },
  communityMembers: {
    en: {
      title: "Verified Community Directory & Members | VRPS",
      description:
        "Explore the public directory of verified VRPS members uniting to advance educational, social, and economic representation.",
      keywords: [
        "VRPS Members",
        "Community Directory",
        "Verified Membership",
        "Vaddera Network",
      ],
    },
    te: {
      title: "సభ్యుల వివరాలు & కమ్యూనిటీ డైరెక్టరీ | VRPS",
      description:
        "VRPS లో నమోదైన ధృవీకృత సభ్యుల ప్రజా డైరెక్టరీ మరియు సమాజ బలం.",
      keywords: [
        "VRPS సభ్యులు",
        "కమ్యూనిటీ డైరెక్టరీ",
        "నమోదైన సభ్యత్వం",
      ],
    },
  },
  supporters: {
    en: {
      title: "Transparency: Community Supporters & Donors | VRPS",
      description:
        "Transparent acknowledgment of patrons, donors, and voluntary contributors powering VRPS welfare programs and community outreach.",
      keywords: [
        "VRPS Supporters",
        "Donors Transparency",
        "Welfare Contributors",
        "Community Giving",
      ],
    },
    te: {
      title: "సహాయకులు & దాతల వివరాలు | VRPS",
      description:
        "VRPS సంక్షేమ కార్యక్రమాలకు విరాళాలు అందించి తోడ్పాటునందిస్తున్న దాతల పారదర్శక సమాచారం.",
      keywords: [
        "VRPS దాతలు",
        "సహాయకులు",
        "పారదర్శక విరాళాలు",
      ],
    },
  },
  impact: {
    en: {
      title: "Community Impact & Transparency Metrics | VRPS",
      description:
        "Real-time transparency statistics showcasing verified memberships, welfare distributions, and social impact achieved through VRPS.",
      keywords: [
        "Community Impact",
        "Transparency Metrics",
        "VRPS Statistics",
        "Fund Utilization",
      ],
    },
    te: {
      title: "సామాజిక ప్రభావం & పారదర్శకత నివేదిక | VRPS",
      description:
        "VRPS ద్వారా సమాజంలో చేకూరిన ప్రయోజనాలు, సభ్యుల సంఖ్య మరియు పారదర్శక గణాంకాలు.",
      keywords: [
        "సామాజిక ప్రభావం",
        "పారదర్శకత నివేదిక",
        "సమితి గణాంకాలు",
      ],
    },
  },
  donations: {
    en: {
      title: "Support the Cause — Voluntary Donations | VRPS",
      description:
        "Support educational awareness, youth mentorship, and community welfare initiatives by contributing securely through Razorpay.",
      keywords: [
        "Donate to VRPS",
        "Community Support",
        "Welfare Donation",
        "Education Fund",
      ],
    },
    te: {
      title: "విరాళాలు అందించండి — సమాజ సేవలో భాగస్వామ్యం | VRPS",
      description:
        "వడ్డెర సమాజ విద్యాభివృద్ధి, సంక్షేమ కార్యక్రమాలు మరియు సేవా దృక్పథానికి మీ స్వచ్ఛంద విరాళం అందించండి.",
      keywords: [
        "VRPS విరాళాలు",
        "స్వచ్ఛంద విరాళం",
        "సంక్షేమ నిధి",
      ],
    },
  },
  membership: {
    en: {
      title: "Join VRPS — Official Membership Registration",
      description:
        "Register as an official member of Vaddera Reservation Porata Samithi. Get your authenticated digital member ID card and join our movement.",
      keywords: [
        "VRPS Membership",
        "Join VRPS",
        "Digital ID Card",
        "Member Registration",
      ],
    },
    te: {
      title: "సభ్యత్వం పొందండి — అధికారిక నమోదు | VRPS",
      description:
        "వడ్డెర రిజర్వేషన్ పోరాట సమితిలో అధికారిక సభ్యత్వం పొందండి. డిజిటల్ గుర్తింపు కార్డు అందుకోండి.",
      keywords: [
        "VRPS సభ్యత్వం",
        "సభ్యత్వ నమోదు",
        "డిజిటల్ ఐడీ కార్డు",
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy Notice & Data Protection Policy (DPDP) | VRPS",
      description:
        "Official privacy notice compliant with the Digital Personal Data Protection (DPDP) Act, 2023. Learn how your data is protected.",
      keywords: [
        "Privacy Policy",
        "DPDP Act Compliance",
        "Data Protection",
        "VRPS Privacy Notice",
      ],
    },
    te: {
      title: "గోప్యతా విధానం & డేటా రక్షణ విధానం | VRPS",
      description:
        "భారత డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ చట్టం 2023 కి అనుగుణంగా VRPS గోప్యతా నియమావళి మరియు డేటా రక్షణ విధానం.",
      keywords: [
        "గోప్యతా విధానం",
        "డేటా రక్షణ",
        "DPDP నియమావళి",
      ],
    },
  },
  terms: {
    en: {
      title: "Terms & Conditions | VRPS",
      description:
        "Official terms and conditions for using the VRPS platform, services, membership cards, and donations in compliance with Indian laws.",
      keywords: ["Terms and Conditions", "User Agreement", "VRPS Terms"],
    },
    te: {
      title: "నిబంధనలు & షరతులు | VRPS",
      description:
        "VRPS వెబ్‌సైట్ మరియు సేవల వినియోగానికి సంబంధించిన అధికారిక నిబంధనలు మరియు షరతులు.",
      keywords: ["నిబంధనలు", "షరతులు", "వినియోగ ఒప్పందం"],
    },
  },
  paymentPolicy: {
    en: {
      title: "Payment, Cancellation & Refund Policy | VRPS",
      description:
        "Official policy regarding membership contributions, voluntary donations, payment security via Razorpay, cancellations, and refunds.",
      keywords: [
        "Payment Policy",
        "Refund Policy",
        "Razorpay Security",
        "Donation Terms",
      ],
    },
    te: {
      title: "చెల్లింపులు & వాపసు విధానం | VRPS",
      description:
        "సభ్యత్వ రుసుము మరియు విరాళాల చెల్లింపులు, రద్దు మరియు రీఫండ్ నియమాలకు సంబంధించిన అధికారిక విధానం.",
      keywords: ["చెల్లింపు విధానం", "రీఫండ్ పాలసీ", "విరాళాల నిబంధనలు"],
    },
  },
  dataRights: {
    en: {
      title: "Exercise Data Principal Rights (DPDP) | VRPS",
      description:
        "Submit statutory requests for data access, correction, erasure, or grievance redressal under India's Digital Personal Data Protection Act, 2023.",
      keywords: [
        "Data Principal Rights",
        "DPDP Request",
        "Data Erasure",
        "Grievance Redressal",
      ],
    },
    te: {
      title: "డేటా హక్కుల అభ్యర్థన (DPDP) | VRPS",
      description:
        "DPDP చట్టం 2023 క్రింద మీ వ్యక్తిగత డేటా సమాచారం, సవరణ లేదా తొలగింపు కొరకు అధికారిక అభ్యర్థన సమర్పించండి.",
      keywords: [
        "డేటా హక్కులు",
        "DPDP అభ్యర్థన",
        "డేటా సవరణ",
        "ఫిర్యాదుల పరిష్కారం",
      ],
    },
  },
};

/**
 * Constructs a fully compliant Next.js Metadata object with SEO best practices:
 * - Canonical link & multilingual hreflangs
 * - OpenGraph (1200x630) & Twitter Cards
 * - Robots directives (index/follow or noindex)
 * - Locale alternates
 */
export function constructMetadata({
  title,
  description,
  path,
  locale = "te",
  image = "/VRPS-LOGO-FINAL.png",
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords,
  authors,
}: PageMetadataOptions): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}/${locale}${cleanPath === "/" ? "" : cleanPath}`;
  const teUrl = `${SITE_URL}/te${cleanPath === "/" ? "" : cleanPath}`;
  const enUrl = `${SITE_URL}/en${cleanPath === "/" ? "" : cleanPath}`;

  const absoluteImageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;

  const ogLocale = locale === "te" ? "te_IN" : "en_US";
  const alternateOgLocale = locale === "te" ? "en_US" : "te_IN";

  return {
    title,
    description,
    keywords,
    authors: authors ? authors.map((name) => ({ name })) : [{ name: "VRPS Leadership Council" }],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        te: teUrl,
        en: enUrl,
        "x-default": teUrl,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: locale === "te" ? SITE_NAME_TE : SITE_NAME_EN,
      locale: ogLocale,
      alternateLocale: [alternateOgLocale],
      type,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImageUrl],
      creator: "@VRPS_Official",
      site: "@VRPS_Official",
    },
  };
}

/**
 * Standard NoIndex metadata helper for private/admin/auth/user routes
 */
export function constructNoIndexMetadata(title: string): Metadata {
  return {
    title: `${title} | VRPS`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}
