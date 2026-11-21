/**
 * Copy for the service pages (/[locale]/services/[slug]) and the city pages
 * (/[locale]/web-design/[city]).
 *
 * Each page targets ONE search phrase (in `title`, `h1` and the first
 * paragraph) so two pages never compete for the same search. Keep every claim
 * true: no client counts, no results, no "best company" wording, and concept
 * projects are never presented as clients.
 *
 * `serviceKey` links a page to its service section on /services and to an
 * example project from projects.json (see categoryForService in lib/projects).
 */

export const SERVICE_PAGES = [
  {
    slug: 'bilingual-websites',
    serviceKey: 'company',
    ar: {
      title: 'تصميم مواقع ثنائية اللغة عربي وإنجليزي — وشيج',
      description:
        'تصميم وبرمجة مواقع بالعربية والإنجليزية: نسخة عربية أصلية من اليمين إلى اليسار ونسخة إنجليزية بنفس الجودة، لشركات مصر والسعودية والخليج.',
      label: 'مواقع ثنائية اللغة',
      h1: 'تصميم مواقع ثنائية اللغة، عربي وإنجليزي بنفس الجودة',
      intro:
        'أغلب المواقع ثنائية اللغة تُبنى بالإنجليزية ثم تُقلب للعربية، فتظهر النسخة العربية مكسورة: خطوط غير مناسبة، وأيقونات في الاتجاه الخطأ، ونصوص مترجمة حرفيًا. في وشيج نصمّم النسختين معًا من أول يوم.',
      sections: [
        {
          heading: 'ما الذي يختلف في الموقع ثنائي اللغة عندنا؟',
          list: [
            'العربية نسخة أصلية من اليمين إلى اليسار، لا انعكاس للتصميم الإنجليزي.',
            'خطوط عربية وإنجليزية متناسقة في الحجم والوزن.',
            'رابط مستقل لكل لغة (‎/ar و‎/en)، حتى يظهر كل منهما في نتائج جوجل بلغته.',
            'زر واضح للتبديل بين اللغتين يفتح نفس الصفحة باللغة الأخرى.',
            'عنوان ووصف لكل صفحة باللغتين، وكتابة المحتوى بأسلوب طبيعي لا ترجمة آلية.',
          ],
        },
        {
          heading: 'لمن يناسب؟',
          body: [
            'للشركات التي تخاطب عملاء عربًا وأجانب معًا: شركات في السعودية تتعامل مع شركاء دوليين، وشركات مصرية تصدّر أو تخدم عملاء في الخليج، وأي علامة تريد أن تبدو جادة باللغتين.',
          ],
        },
        {
          heading: 'كيف نعمل؟',
          body: [
            'نبدأ بجلسة نفهم فيها نشاطك وجمهورك في كل لغة، ثم نصمّم الواجهات باللغتين وتراجعها قبل البرمجة. بعدها نبني الموقع ولوحة التحكم، ونختبره على الجوال والكمبيوتر بالعربية والإنجليزية قبل الإطلاق.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل يمكن إضافة لغة ثالثة لاحقًا؟',
          a: 'نعم. نبني الموقع بطريقة تسمح بإضافة لغات أخرى دون إعادة بنائه.',
        },
        {
          q: 'من يكتب المحتوى بالإنجليزية؟',
          a: 'يمكنك إرسال المحتوى باللغتين، أو نساعدك في صياغته بحيث يبدو طبيعيًا في كل لغة.',
        },
      ],
    },
    en: {
      title: 'Bilingual Arabic & English Website Design — Washeej',
      description:
        'Arabic and English website design and development: a native right-to-left Arabic version and an English version of the same quality, for businesses in Egypt, Saudi Arabia and the Gulf.',
      label: 'Bilingual websites',
      h1: 'Bilingual website design, Arabic and English at the same quality',
      intro:
        'Most bilingual websites are built in English and then flipped for Arabic, so the Arabic side looks broken: the wrong fonts, icons pointing the wrong way, and word-for-word translations. At Washeej we design both languages together from day one.',
      sections: [
        {
          heading: 'What is different about our bilingual websites?',
          list: [
            'Arabic is a native right-to-left version, not a mirror of the English design.',
            'Arabic and English fonts matched in size and weight.',
            'A separate URL for each language (/ar and /en), so each one shows up in Google in its own language.',
            'A clear language switch that opens the same page in the other language.',
            'A title and description for every page in both languages, and copy written naturally, not machine-translated.',
          ],
        },
        {
          heading: 'Who is it for?',
          body: [
            'Businesses that speak to Arab and international customers at once: Saudi companies working with international partners, Egyptian companies exporting or serving Gulf clients, and any brand that wants to look serious in both languages.',
          ],
        },
        {
          heading: 'How we work',
          body: [
            'We start with a session to understand your business and your audience in each language. We then design the screens in both languages for you to review before any code. After that we build the site and its dashboard, and test it on mobile and desktop in Arabic and English before launch.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can a third language be added later?',
          a: 'Yes. We build the site so more languages can be added without rebuilding it.',
        },
        {
          q: 'Who writes the English copy?',
          a: 'You can send the copy in both languages, or we help you write it so it reads naturally in each one.',
        },
      ],
    },
  },
  {
    slug: 'company-websites',
    serviceKey: 'company',
    ar: {
      title: 'تصميم مواقع شركات تعريفية احترافية — وشيج',
      description:
        'تصميم وبرمجة مواقع شركات تعريفية بالعربية والإنجليزية: تعرض نشاطك وخدماتك وأعمالك، مع لوحة تحكم تعدّل منها المحتوى بنفسك. لشركات مصر والسعودية.',
      label: 'مواقع الشركات',
      h1: 'تصميم مواقع شركات تعرّف بنشاطك وتجيب لك طلبات',
      intro:
        'موقع الشركة هو أول مكان يزوره العميل قبل أن يتواصل معك. لذلك نصمّم مواقع شركات تشرح نشاطك بوضوح، وتعرض خدماتك وأعمالك، وتسهّل على الزائر أن يطلب عرض سعر.',
      sections: [
        {
          heading: 'ماذا يتضمن موقع الشركة؟',
          list: [
            'صفحة رئيسية تشرح ما تقدمه في ثوانٍ.',
            'صفحات للخدمات، وصفحة للأعمال، وصفحة عن الشركة، وصفحة تواصل.',
            'نموذج طلب ورابط واتساب يصلانك مباشرة.',
            'لوحة تحكم تعدّل منها النصوص والصور والمشاريع بنفسك.',
            'نسخة عربية وإنجليزية، وتصميم يعمل على كل الشاشات.',
            'أساسيات الظهور في جوجل: سرعة عالية، وعنوان ووصف لكل صفحة.',
          ],
        },
        {
          heading: 'تصميم لا يشبه القوالب',
          body: [
            'لا نستخدم قوالب جاهزة. نصمّم الموقع على هوية شركتك وجمهورك، حتى لا يبدو مثل عشرات المواقع الأخرى في نفس المجال.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل أستطيع إضافة مشاريع وأخبار بنفسي؟',
          a: 'نعم، من لوحة التحكم، دون الرجوع إلينا.',
        },
        {
          q: 'لمن يعود الموقع بعد التسليم؟',
          a: 'بعد إتمام السداد، الموقع ومحتواه ملكك.',
        },
      ],
    },
    en: {
      title: 'Company Website Design & Development — Washeej',
      description:
        'Company website design and development in Arabic and English: present your business, services and work, with a dashboard to edit the content yourself. For businesses in Egypt and Saudi Arabia.',
      label: 'Company websites',
      h1: 'Company websites that explain your business and bring in requests',
      intro:
        'Your company website is the first place a customer visits before contacting you. So we design company websites that explain your business clearly, show your services and work, and make it easy for a visitor to ask for a quote.',
      sections: [
        {
          heading: 'What a company website includes',
          list: [
            'A homepage that explains what you offer in seconds.',
            'Service pages, a work page, an about page and a contact page.',
            'A request form and a WhatsApp link that reach you directly.',
            'A dashboard to edit text, images and projects yourself.',
            'Arabic and English versions, and a design that works on every screen.',
            'The basics of showing up in Google: speed, and a title and description for every page.',
          ],
        },
        {
          heading: 'A design that does not look like a template',
          body: [
            'We do not use ready-made templates. We design the site around your brand and your audience, so it does not look like dozens of other sites in your field.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can I add projects and news myself?',
          a: 'Yes, from the dashboard, without coming back to us.',
        },
        {
          q: 'Who owns the website after delivery?',
          a: 'Once payment is complete, the website and its content are yours.',
        },
      ],
    },
  },
  {
    slug: 'ecommerce',
    serviceKey: 'store',
    ar: {
      title: 'تصميم وبرمجة متاجر إلكترونية في مصر والسعودية — وشيج',
      description:
        'تصميم وبرمجة متاجر إلكترونية بالعربية والإنجليزية: كتالوج وسلة ودفع إلكتروني ولوحة طلبات، مع بوابات دفع مصر والسعودية مثل مدى وApple Pay وPaymob.',
      label: 'المتاجر الإلكترونية',
      h1: 'تصميم متاجر إلكترونية تبيع من أول زيارة',
      intro:
        'المتجر الإلكتروني الناجح هو الذي يصل فيه العميل من المنتج إلى الدفع بأقل عدد من الخطوات. نصمّم ونبرمج متاجر إلكترونية سريعة على الجوال، مع لوحة تدير منها منتجاتك وطلباتك.',
      sections: [
        {
          heading: 'ماذا يتضمن المتجر؟',
          list: [
            'كتالوج منتجات بالأقسام والفلاتر والبحث.',
            'سلة ودفع بخطوات قليلة وواضحة.',
            'ربط ببوابة الدفع المناسبة لبلدك: مدى وApple Pay وتابي وتمارا في السعودية والخليج، وPaymob وفوري في مصر.',
            'لوحة تحكم للمنتجات والمخزون والطلبات.',
            'نسخة عربية وإنجليزية، وتصميم مبني للجوال أولًا.',
          ],
        },
        {
          heading: 'السرعة جزء من البيع',
          body: [
            'كل ثانية تأخير في تحميل صفحة المنتج تخسرك زوارًا. لذلك نضغط الصور ونحمّل ما يحتاجه الزائر فقط، ونختبر المتجر على الجوال قبل الإطلاق.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل تدعمون الدفع الإلكتروني؟',
          a: 'نعم، نربط متجرك ببوابة الدفع المناسبة لبلدك، مثل مدى وApple Pay وتابي وتمارا في الخليج، وPaymob وفوري في مصر.',
        },
        {
          q: 'هل أستطيع إضافة المنتجات بنفسي؟',
          a: 'نعم، من لوحة التحكم: المنتجات والأسعار والمخزون والصور.',
        },
      ],
    },
    en: {
      title: 'E-commerce Store Design & Development in Egypt and Saudi Arabia — Washeej',
      description:
        'Online store design and development in Arabic and English: catalog, cart, online payment and an orders dashboard, with Egyptian and Saudi gateways such as mada, Apple Pay and Paymob.',
      label: 'Online stores',
      h1: 'Online stores that sell from the first visit',
      intro:
        'A good online store gets the customer from the product to the payment in as few steps as possible. We design and build online stores that are fast on mobile, with a dashboard to manage your products and orders.',
      sections: [
        {
          heading: 'What the store includes',
          list: [
            'A product catalog with categories, filters and search.',
            'A cart and checkout in a few clear steps.',
            'The right payment gateway for your country: mada, Apple Pay, Tabby and Tamara in Saudi Arabia and the Gulf; Paymob and Fawry in Egypt.',
            'A dashboard for products, stock and orders.',
            'Arabic and English versions, and a mobile-first design.',
          ],
        },
        {
          heading: 'Speed is part of selling',
          body: [
            'Every second a product page takes to load costs you visitors. So we compress images, load only what the visitor needs, and test the store on mobile before launch.',
          ],
        },
      ],
      faq: [
        {
          q: 'Do you support online payment?',
          a: 'Yes. We connect your store to the right gateway for your country, such as mada, Apple Pay, Tabby and Tamara in the Gulf, and Paymob and Fawry in Egypt.',
        },
        {
          q: 'Can I add products myself?',
          a: 'Yes, from the dashboard: products, prices, stock and images.',
        },
      ],
    },
  },
  {
    slug: 'mobile-apps',
    serviceKey: null,
    ar: {
      title: 'برمجة تطبيقات الجوال iOS وAndroid — وشيج',
      description:
        'تصميم وبرمجة تطبيقات جوال لأجهزة iOS وAndroid بالعربية والإنجليزية، من الفكرة والتصميم إلى الرفع على App Store وGoogle Play. فريق في مصر والسعودية.',
      label: 'تطبيقات الجوال',
      h1: 'برمجة تطبيقات الجوال، من الفكرة إلى المتجر',
      intro:
        'نصمّم ونبرمج تطبيقات جوال لأجهزة iOS وAndroid، بالعربية والإنجليزية. ولأننا نبني المواقع والأنظمة أيضًا، يمكن أن يعمل تطبيقك وموقعك ولوحة التحكم على نفس النظام.',
      sections: [
        {
          heading: 'ماذا نقدّم في تطبيقات الجوال؟',
          list: [
            'تصميم واجهات التطبيق وتجربة الاستخدام قبل البرمجة.',
            'تطبيق يعمل على iOS وAndroid.',
            'لوحة تحكم لإدارة المحتوى والمستخدمين والطلبات.',
            'ربط التطبيق بموقعك أو بأنظمتك الحالية.',
            'المساعدة في رفع التطبيق على App Store وGoogle Play.',
          ],
        },
        {
          heading: 'كيف نعمل؟',
          body: [
            'نبدأ بجلسة نحدد فيها هدف التطبيق ومستخدميه وأهم الشاشات. ثم نصمّم الواجهات وتراجعها، وبعدها نبرمج التطبيق ونختبره على أجهزة حقيقية قبل الرفع.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل أحتاج تطبيقًا أم يكفي موقع؟',
          a: 'كثير من المشاريع يكفيها موقع سريع على الجوال. نساعدك في الجلسة الأولى على تحديد ما يناسب مشروعك فعلًا.',
        },
        {
          q: 'هل التطبيق بالعربية والإنجليزية؟',
          a: 'نعم، والعربية نسخة أصلية من اليمين إلى اليسار.',
        },
      ],
    },
    en: {
      title: 'Mobile App Development for iOS & Android — Washeej',
      description:
        'Mobile app design and development for iOS and Android in Arabic and English, from idea and design to publishing on the App Store and Google Play. A team in Egypt and Saudi Arabia.',
      label: 'Mobile apps',
      h1: 'Mobile app development, from idea to app store',
      intro:
        'We design and build mobile apps for iOS and Android, in Arabic and English. Because we also build websites and systems, your app, your website and your dashboard can run on the same system.',
      sections: [
        {
          heading: 'What we offer for mobile apps',
          list: [
            'App screen and experience design before any code.',
            'An app that runs on iOS and Android.',
            'A dashboard to manage content, users and orders.',
            'Connecting the app to your website or your existing systems.',
            'Help publishing the app on the App Store and Google Play.',
          ],
        },
        {
          heading: 'How we work',
          body: [
            'We start with a session to agree on the app’s goal, its users and its key screens. We then design the screens for you to review, build the app, and test it on real devices before publishing.',
          ],
        },
      ],
      faq: [
        {
          q: 'Do I need an app, or is a website enough?',
          a: 'Many projects only need a fast mobile website. In the first session we help you decide what your project really needs.',
        },
        {
          q: 'Is the app in Arabic and English?',
          a: 'Yes, and the Arabic is a native right-to-left version.',
        },
      ],
    },
  },
  {
    slug: 'landing-pages',
    serviceKey: 'landing',
    ar: {
      title: 'تصميم صفحات هبوط احترافية للإعلانات — وشيج',
      description:
        'تصميم صفحات هبوط (Landing Page) سريعة بالعربية والإنجليزية لحملات الإعلانات، تحوّل الزيارة إلى طلب أو مكالمة أو رسالة واتساب.',
      label: 'صفحات الهبوط',
      h1: 'تصميم صفحات هبوط تحوّل زوار حملتك إلى عملاء',
      intro:
        'عندما تدفع على إعلان، فالصفحة التي يصل إليها الزائر هي التي تقرر هل يصبح عميلًا أم لا. نصمّم صفحات هبوط لها هدف واحد واضح، وتعمل بسرعة على الجوال.',
      sections: [
        {
          heading: 'ما الذي يجعل صفحة الهبوط تنجح؟',
          list: [
            'رسالة واحدة واضحة في أول شاشة.',
            'زر واحد للطلب أو الاتصال أو واتساب يظهر طوال الصفحة.',
            'تحميل سريع على الجوال، لأن أغلب زوار الإعلانات يأتون منه.',
            'نموذج قصير يطلب ما تحتاجه فقط.',
            'نسخة عربية وإنجليزية إذا كانت حملتك باللغتين.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل يمكن ربط الصفحة بإعلانات جوجل وميتا؟',
          a: 'نعم، نضيف أكواد التتبع التي تحتاجها لقياس نتائج الحملة.',
        },
      ],
    },
    en: {
      title: 'Landing Page Design for Ad Campaigns — Washeej',
      description:
        'Fast landing page design in Arabic and English for ad campaigns, turning visits into a request, a call or a WhatsApp message.',
      label: 'Landing pages',
      h1: 'Landing pages that turn campaign visitors into customers',
      intro:
        'When you pay for an ad, the page the visitor lands on decides whether they become a customer. We design landing pages with one clear goal that load fast on mobile.',
      sections: [
        {
          heading: 'What makes a landing page work',
          list: [
            'One clear message on the first screen.',
            'One button to request, call or WhatsApp, visible throughout the page.',
            'Fast loading on mobile, where most ad visitors come from.',
            'A short form that asks only for what you need.',
            'Arabic and English versions if your campaign runs in both.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can the page be connected to Google and Meta ads?',
          a: 'Yes, we add the tracking codes you need to measure the campaign.',
        },
      ],
    },
  },
  {
    slug: 'booking-platforms',
    serviceKey: 'booking',
    ar: {
      title: 'برمجة منصات حجز ومواقع عقارات — وشيج',
      description:
        'تصميم وبرمجة منصات حجز ومواقع عقارات بالعربية والإنجليزية: عرض الوحدات والمواعيد، والحجز والدفع الآمن، ولوحة لإدارة الحجوزات.',
      label: 'منصات الحجز والعقارات',
      h1: 'منصات حجز ومواقع عقارات بتجربة واضحة',
      intro:
        'سواء كنت تعرض وحدات عقارية أو غرفًا فندقية أو مواعيد، يحتاج عميلك أن يرى المتاح ويحجز ويدفع في مكان واحد. نبني منصات حجز تجعل هذه الخطوات بسيطة.',
      sections: [
        {
          heading: 'ماذا تتضمن المنصة؟',
          list: [
            'عرض الوحدات أو الخدمات بالصور والتفاصيل والفلاتر.',
            'تقويم يوضح المتاح ويمنع الحجز المكرر.',
            'حجز ودفع إلكتروني آمن.',
            'لوحة لإدارة الحجوزات والعملاء والأسعار.',
            'نسخة عربية وإنجليزية.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل يمكن ربط المنصة بأنظمة أخرى؟',
          a: 'نعم، نربطها بأنظمتك الحالية أو ببوابات الدفع والرسائل.',
        },
      ],
    },
    en: {
      title: 'Booking Platform & Real Estate Website Development — Washeej',
      description:
        'Booking platform and real estate website design and development in Arabic and English: listings and availability, secure booking and payment, and a dashboard to manage bookings.',
      label: 'Booking & real estate',
      h1: 'Booking platforms and real estate websites with a clear experience',
      intro:
        'Whether you offer property units, hotel rooms or appointments, your customer needs to see what is available, book and pay in one place. We build booking platforms that keep those steps simple.',
      sections: [
        {
          heading: 'What the platform includes',
          list: [
            'Listings with photos, details and filters.',
            'A calendar that shows availability and prevents double bookings.',
            'Secure booking and online payment.',
            'A dashboard to manage bookings, customers and prices.',
            'Arabic and English versions.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can the platform connect to other systems?',
          a: 'Yes, we connect it to your existing systems or to payment and messaging gateways.',
        },
      ],
    },
  },
  {
    slug: 'custom-systems',
    serviceKey: 'systems',
    ar: {
      title: 'برمجة أنظمة ولوحات تحكم مخصصة — وشيج',
      description:
        'برمجة أنظمة ولوحات تحكم وبوابات خدمات مخصصة لطريقة عمل شركتك، بالعربية والإنجليزية، وربطها بأنظمتك الحالية. فريق برمجة في مصر والسعودية.',
      label: 'الأنظمة المخصصة',
      h1: 'برمجة أنظمة ولوحات تحكم على مقاس طريقة عملك',
      intro:
        'عندما لا تناسبك البرامج الجاهزة، نبرمج لك نظامًا يتبع طريقة عمل شركتك: لوحة تحكم لفريقك، أو بوابة لعملائك يقدّمون منها طلباتهم ويتابعونها.',
      sections: [
        {
          heading: 'أمثلة لما نبنيه',
          list: [
            'لوحات تحكم لإدارة الطلبات والعملاء والتقارير.',
            'بوابات خدمات إلكترونية بطلبات واضحة ورقم للمتابعة.',
            'صلاحيات مختلفة لكل دور في الفريق.',
            'ربط بأنظمتك الحالية، وإضافة الذكاء الاصطناعي حيث يفيد.',
          ],
        },
        {
          heading: 'فريق واحد من الواجهة إلى الخادم',
          body: [
            'نصمّم الواجهة ونبني الخادم وقاعدة البيانات في فريق واحد، فلا تتنقل بين مصمم ومبرمج ومزوّد خدمة.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل تبنون النظام على مراحل؟',
          a: 'نعم، نبدأ بأهم جزء يحتاجه فريقك، ثم نضيف الباقي على مراحل.',
        },
      ],
    },
    en: {
      title: 'Custom Systems & Dashboard Development — Washeej',
      description:
        'Custom systems, dashboards and service portals built around how your company works, in Arabic and English, connected to your existing systems. A development team in Egypt and Saudi Arabia.',
      label: 'Custom systems',
      h1: 'Custom systems and dashboards built around how you work',
      intro:
        'When off-the-shelf software does not fit, we build a system that follows how your company works: a dashboard for your team, or a portal where your customers submit and track their requests.',
      sections: [
        {
          heading: 'Examples of what we build',
          list: [
            'Dashboards to manage orders, customers and reports.',
            'Online service portals with clear requests and a tracking number.',
            'Different permissions for each role in your team.',
            'Connections to your existing systems, and AI where it helps.',
          ],
        },
        {
          heading: 'One team from front end to back end',
          body: [
            'We design the interface and build the server and database in one team, so you do not juggle a designer, a developer and a hosting provider.',
          ],
        },
      ],
      faq: [
        {
          q: 'Do you build the system in phases?',
          a: 'Yes. We start with the part your team needs most, then add the rest in phases.',
        },
      ],
    },
  },
  {
    slug: 'redesign',
    serviceKey: null,
    ar: {
      title: 'إعادة تصميم المواقع القديمة وتطويرها — وشيج',
      description:
        'إعادة تصميم موقعك القديم وتطويره: تصميم جديد، وسرعة أعلى على الجوال، ونسخة عربية وإنجليزية، مع الحفاظ على روابطك وظهورك في جوجل.',
      label: 'إعادة التصميم',
      h1: 'إعادة تصميم موقعك القديم، بشكل وسرعة اليوم',
      intro:
        'موقع بطيء أو بتصميم قديم يعطي انطباعًا أن الشركة نفسها قديمة. نعيد تصميم موقعك وبناءه بحيث يبدو حديثًا ويعمل بسرعة، دون أن تخسر ما بنيته في جوجل.',
      sections: [
        {
          heading: 'ماذا نفعل في إعادة التصميم؟',
          list: [
            'نراجع موقعك الحالي: ما الذي يعمل، وما الذي يُبعد الزوار.',
            'تصميم جديد على هويتك، بنسخة عربية وإنجليزية.',
            'بناء أسرع، خصوصًا على الجوال.',
            'تحويل الروابط القديمة إلى الجديدة حتى لا تخسر ترتيبك في جوجل.',
            'لوحة تحكم تعدّل منها المحتوى بنفسك.',
          ],
        },
        {
          heading: 'أمثلة من أعمالنا',
          body: [
            'في صفحة أعمالنا تجد إعادة تصوّر مستقلة لمواقع علامات معروفة. هذه أعمال صمّمها وشيج من تلقاء نفسه ليعرض أسلوبه، وليست أعمالًا رسمية لتلك العلامات.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل سأخسر ترتيبي في جوجل؟',
          a: 'نحوّل كل رابط قديم إلى الصفحة الجديدة المقابلة له، حتى يبقى ما بنيته في جوجل.',
        },
      ],
    },
    en: {
      title: 'Website Redesign for Outdated Sites — Washeej',
      description:
        'Redesign and rebuild your outdated website: a new design, faster on mobile, in Arabic and English, while keeping your links and your Google visibility.',
      label: 'Website redesign',
      h1: 'Redesign your outdated website for today',
      intro:
        'A slow or dated website makes the company itself look dated. We redesign and rebuild your site so it looks current and loads fast, without losing what you have built in Google.',
      sections: [
        {
          heading: 'What a redesign includes',
          list: [
            'A review of your current site: what works, and what drives visitors away.',
            'A new design around your brand, in Arabic and English.',
            'A faster build, especially on mobile.',
            'Redirecting old links to the new pages so you keep your Google rankings.',
            'A dashboard to edit the content yourself.',
          ],
        },
        {
          heading: 'Examples from our work',
          body: [
            'On our work page you will find independent redesigns of well-known brands’ websites. Washeej made these on its own to show its approach; they are not official work for those brands.',
          ],
        },
      ],
      faq: [
        {
          q: 'Will I lose my Google rankings?',
          a: 'We redirect every old link to its matching new page, so what you have built in Google stays.',
        },
      ],
    },
  },
];

export const CITY_PAGES = [
  {
    slug: 'riyadh',
    ar: {
      title: 'شركة تصميم مواقع في الرياض بالعربية والإنجليزية — وشيج',
      description:
        'وشيج شركة تصميم وبرمجة مواقع ومتاجر وتطبيقات لشركات الرياض والسعودية، بالعربية والإنجليزية، مع بوابات دفع سعودية مثل مدى وApple Pay وتابي وتمارا.',
      label: 'الرياض',
      h1: 'شركة تصميم مواقع في الرياض، بالعربية والإنجليزية',
      intro:
        'نصمّم ونبرمج مواقع ومتاجر وتطبيقات لشركات في الرياض وبقية مدن السعودية. فريقنا موجود في السعودية ومصر، ونعمل مع عملائنا عن بُعد وبتحديث منتظم في كل مرحلة.',
      sections: [
        {
          heading: 'ما نقدّمه لشركات الرياض',
          list: [
            'مواقع شركات تعريفية بنسخة عربية أصلية ونسخة إنجليزية.',
            'متاجر إلكترونية مربوطة بمدى وApple Pay وتابي وتمارا.',
            'منصات حجز وعقارات، وبوابات خدمات، ولوحات تحكم.',
            'تطبيقات جوال لأجهزة iOS وAndroid.',
          ],
        },
        {
          heading: 'لماذا العربية الأصلية مهمة في السعودية؟',
          body: [
            'عميلك في الرياض يقرأ بالعربية أولًا. موقع عربي مقلوب من نسخة إنجليزية يظهر فورًا بخطوط وأيقونات في غير مكانها. لذلك نبني العربية من اليمين إلى اليسار من البداية، ونضيف الإنجليزية لشركائك وعملائك الدوليين.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل تعملون مع شركات في الرياض عن بُعد؟',
          a: 'نعم. فريقنا في السعودية ومصر، ونتابع معك بجلسات مرئية وتحديث منتظم في كل مرحلة.',
        },
      ],
    },
    en: {
      title: 'Web Design Company in Riyadh, Arabic & English — Washeej',
      description:
        'Washeej designs and builds websites, online stores and apps for businesses in Riyadh and Saudi Arabia, in Arabic and English, with Saudi payment gateways such as mada, Apple Pay, Tabby and Tamara.',
      label: 'Riyadh',
      h1: 'Web design company in Riyadh, in Arabic and English',
      intro:
        'We design and build websites, online stores and apps for businesses in Riyadh and across Saudi Arabia. Our team is in Saudi Arabia and Egypt, and we work with clients remotely with regular updates at every stage.',
      sections: [
        {
          heading: 'What we offer businesses in Riyadh',
          list: [
            'Company websites with a native Arabic version and an English version.',
            'Online stores connected to mada, Apple Pay, Tabby and Tamara.',
            'Booking and real estate platforms, service portals and dashboards.',
            'Mobile apps for iOS and Android.',
          ],
        },
        {
          heading: 'Why native Arabic matters in Saudi Arabia',
          body: [
            'Your customers in Riyadh read Arabic first. An Arabic site flipped from an English one shows it at once, with fonts and icons out of place. So we build Arabic right-to-left from the start, and add English for your international partners and customers.',
          ],
        },
      ],
      faq: [
        {
          q: 'Do you work with Riyadh companies remotely?',
          a: 'Yes. Our team is in Saudi Arabia and Egypt, and we keep you updated with video calls and regular progress at every stage.',
        },
      ],
    },
  },
  {
    slug: 'cairo',
    ar: {
      title: 'شركة تصميم وبرمجة مواقع في القاهرة — وشيج',
      description:
        'وشيج شركة تصميم وبرمجة مواقع ومتاجر وتطبيقات في القاهرة ومصر، بالعربية والإنجليزية، مع بوابات دفع مصرية مثل Paymob وفوري.',
      label: 'القاهرة',
      h1: 'شركة تصميم وبرمجة مواقع في القاهرة',
      intro:
        'نصمّم ونبرمج مواقع ومتاجر وتطبيقات لشركات في القاهرة وبقية مصر. فريقنا موجود في مصر والسعودية، فنفهم السوق المصري، ونبني لعملائنا الذين يخدمون الخليج أيضًا.',
      sections: [
        {
          heading: 'ما نقدّمه لشركات القاهرة',
          list: [
            'مواقع شركات بالعربية والإنجليزية.',
            'متاجر إلكترونية مربوطة بـPaymob وفوري.',
            'أنظمة ولوحات تحكم وبوابات خدمات.',
            'تطبيقات جوال لأجهزة iOS وAndroid.',
          ],
        },
        {
          heading: 'للشركات المصرية التي تخدم الخليج',
          body: [
            'إذا كانت شركتك تصدّر أو تخدم عملاء في السعودية والخليج، فموقعك يحتاج أن يبدو جادًّا باللغتين وأن يدعم طرق دفع البلدين. نبني الموقع بحيث يخدم السوقين معًا.',
          ],
        },
      ],
      faq: [
        {
          q: 'هل تعملون مع شركات خارج القاهرة؟',
          a: 'نعم، نعمل مع شركات في كل مصر وفي الخليج، بجلسات مرئية وتحديث منتظم.',
        },
      ],
    },
    en: {
      title: 'Web Design & Development Company in Cairo — Washeej',
      description:
        'Washeej designs and builds websites, online stores and apps for businesses in Cairo and Egypt, in Arabic and English, with Egyptian payment gateways such as Paymob and Fawry.',
      label: 'Cairo',
      h1: 'Web design and development company in Cairo',
      intro:
        'We design and build websites, online stores and apps for businesses in Cairo and across Egypt. Our team is in Egypt and Saudi Arabia, so we know the Egyptian market and also build for clients who serve the Gulf.',
      sections: [
        {
          heading: 'What we offer businesses in Cairo',
          list: [
            'Company websites in Arabic and English.',
            'Online stores connected to Paymob and Fawry.',
            'Systems, dashboards and service portals.',
            'Mobile apps for iOS and Android.',
          ],
        },
        {
          heading: 'For Egyptian companies serving the Gulf',
          body: [
            'If your company exports to or serves clients in Saudi Arabia and the Gulf, your site needs to look serious in both languages and support both countries’ payment methods. We build it to serve both markets.',
          ],
        },
      ],
      faq: [
        {
          q: 'Do you work with companies outside Cairo?',
          a: 'Yes, we work with companies across Egypt and the Gulf, with video calls and regular updates.',
        },
      ],
    },
  },
];

/** Service section key on /services → its own page, for "learn more" links. */
export const SERVICE_PAGE_FOR_KEY = {
  landing: 'landing-pages',
  company: 'company-websites',
  store: 'ecommerce',
  booking: 'booking-platforms',
  portal: 'custom-systems',
  systems: 'custom-systems',
};

export const getServicePage = (slug) => SERVICE_PAGES.find((page) => page.slug === slug) ?? null;
export const getCityPage = (slug) => CITY_PAGES.find((page) => page.slug === slug) ?? null;
