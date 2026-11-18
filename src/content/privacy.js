/**
 * Privacy policy text, per language. The Arabic is the approved original;
 * the English is a faithful translation of it.
 *
 * Blocks: { h: heading } · { p: paragraph } · { ul: [items] }.
 * **bold** inside a string is rendered as <strong>.
 * Update `updated` whenever the text changes.
 */

export const PRIVACY_UPDATED = '2026-11-18';

export const privacy = {
  ar: {
    title: 'سياسة الخصوصية',
    updatedLabel: 'آخر تحديث',
    blocks: [
      { p: 'توضّح هذه السياسة كيف تجمع «وشيج» («نحن») بياناتك الشخصية وتستخدمها وتحميها عند زيارتك موقع washeej.site أو تواصلك معنا. نلتزم في ذلك بنظام حماية البيانات الشخصية في المملكة العربية السعودية ولوائحه التنفيذية.' },

      { h: 'البيانات التي نجمعها' },
      {
        ul: [
          '**بيانات تقدّمها أنت عبر نموذج طلب المشروع:** الاسم، رقم الجوال أو واتساب، البريد الإلكتروني (اختياري)، اسم الشركة أو النشاط، الدولة، الخدمة المطلوبة، ونص رسالتك.',
          '**بيانات المحادثة عند تواصلك معنا عبر واتساب أو البريد الإلكتروني:** رقمك أو بريدك ومحتوى الرسائل.',
          '**بيانات تقنية تُجمع تلقائيًا:** مثل عنوان IP ونوع المتصفح والجهاز، وتُسجَّل في سجلات خادم الاستضافة لأغراض التشغيل والأمان.',
        ],
      },
      { p: 'لا نطلب أي بيانات حساسة، ولا نجمع بيانات الدفع عبر هذا الموقع.' },

      { h: 'لماذا نستخدم بياناتك' },
      {
        ul: [
          'للرد على طلبك والتواصل معك بشأن مشروعك.',
          'لإعداد عرض سعر أو نسخة تجريبية من موقعك عند طلبك ذلك.',
          'لتشغيل الموقع وحمايته من الاستخدام الضار والرسائل الآلية.',
        ],
      },
      { p: 'نعالج بياناتك بناءً على موافقتك عند إرسال النموذج أو مراسلتنا، ولتنفيذ ما تطلبه منا. ولن نرسل لك رسائل تسويقية دون موافقتك المسبقة.' },

      { h: 'مع من نشارك بياناتك' },
      { p: 'لا نبيع بياناتك ولا نؤجّرها لأي طرف. نستعين بمزوّدي خدمات يعالجون البيانات نيابةً عنا وفق الحاجة فقط:' },
      {
        ul: [
          '**Web3Forms:** لاستقبال طلبات النموذج وتحويلها إلى بريدنا.',
          '**Google (Gmail):** لاستقبال الرسائل والرد عليها.',
          '**Vercel:** لاستضافة الموقع.',
          '**WhatsApp (Meta):** عند اختيارك التواصل عبره.',
        ],
      },

      { h: 'نقل البيانات خارج المملكة' },
      { p: 'قد يعالج مزوّدو الخدمات المذكورون بياناتك على خوادم خارج المملكة العربية السعودية. نختار مزوّدين يطبّقون معايير حماية معتمدة، ولا ننقل إلا الحد الأدنى من البيانات اللازمة للغرض.' },

      { h: 'مدة الاحتفاظ' },
      { p: 'نحتفظ ببيانات طلبك طوال فترة تواصلنا أو تنفيذ مشروعك. وإن لم يتحوّل الطلب إلى مشروع، نحذفه خلال 24 شهرًا من آخر تواصل، ما لم يلزمنا نظام بالاحتفاظ به مدة أطول.' },

      { h: 'ملفات تعريف الارتباط' },
      { p: 'نستخدم ملفات تعريف ارتباط ضرورية لتشغيل الموقع، مثل حفظ اللغة التي اخترتها. لا نستخدم حاليًا ملفات تتبّع إعلانية، وإن أضفنا أدوات تحليل سنحدّث هذه السياسة.' },

      { h: 'حقوقك' },
      { p: 'يحق لك:' },
      {
        ul: [
          'معرفة كيف نعالج بياناتك.',
          'الاطلاع على بياناتك والحصول على نسخة منها.',
          'تصحيح بياناتك أو تحديثها.',
          'طلب حذف بياناتك.',
          'سحب موافقتك في أي وقت، دون أن يؤثر ذلك على ما تم قبل السحب.',
        ],
      },
      { p: 'لممارسة أي من هذه الحقوق، راسلنا على hellowasheej@gmail.com أو عبر واتساب +966533819980. نرد على طلبك خلال 30 يومًا، وإن احتجنا مدة إضافية نبلغك بالسبب قبل انتهائها.' },
      { p: 'وإن رأيت أننا لم نتعامل مع بياناتك وفق النظام، يحق لك تقديم شكوى إلى الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).' },

      { h: 'حماية بياناتك' },
      { p: 'نطبّق إجراءات تقنية وتنظيمية معقولة لحماية بياناتك، منها الاتصال المشفّر (HTTPS) وتقييد الوصول إلى الطلبات على فريق العمل فقط. لكن لا توجد وسيلة نقل أو تخزين آمنة تمامًا عبر الإنترنت.' },

      { h: 'الأطفال' },
      { p: 'الموقع موجّه لأصحاب الأعمال، ولا نجمع عن قصد بيانات من هم دون 18 عامًا.' },

      { h: 'التعديلات على هذه السياسة' },
      { p: 'قد نحدّث هذه السياسة من وقت لآخر، ونوضّح تاريخ آخر تحديث أعلى الصفحة. وإن كان التغيير جوهريًا، ننشر تنبيهًا واضحًا على الموقع.' },

      { h: 'تواصل معنا' },
      { ul: ['البريد الإلكتروني: hellowasheej@gmail.com', 'واتساب: +966533819980'] },
    ],
  },

  en: {
    title: 'Privacy Policy',
    updatedLabel: 'Last updated',
    blocks: [
      { p: 'This policy explains how Washeej ("we") collects, uses and protects your personal data when you visit washeej.site or contact us. In doing so, we comply with the Personal Data Protection Law of the Kingdom of Saudi Arabia and its implementing regulations.' },

      { h: 'Data we collect' },
      {
        ul: [
          '**Data you provide through the project request form:** your name, mobile or WhatsApp number, email address (optional), company or business name, country, the service you need, and your message.',
          '**Conversation data when you contact us on WhatsApp or by email:** your number or email address and the content of the messages.',
          '**Technical data collected automatically:** such as your IP address and browser and device type, recorded in the hosting server logs for operational and security purposes.',
        ],
      },
      { p: 'We do not ask for any sensitive data, and we do not collect payment data through this website.' },

      { h: 'Why we use your data' },
      {
        ul: [
          'To respond to your request and contact you about your project.',
          'To prepare a quotation or a demo version of your website when you ask for one.',
          'To operate the website and protect it from misuse and automated messages.',
        ],
      },
      { p: 'We process your data on the basis of your consent when you submit the form or message us, and to carry out what you ask of us. We will not send you marketing messages without your prior consent.' },

      { h: 'Who we share your data with' },
      { p: 'We do not sell or rent your data to anyone. We rely on service providers that process data on our behalf, only as needed:' },
      {
        ul: [
          '**Web3Forms:** to receive form submissions and forward them to our inbox.',
          '**Google (Gmail):** to receive messages and reply to them.',
          '**Vercel:** to host the website.',
          '**WhatsApp (Meta):** when you choose to contact us through it.',
        ],
      },

      { h: 'Transfers outside the Kingdom' },
      { p: 'The service providers listed above may process your data on servers outside the Kingdom of Saudi Arabia. We choose providers that apply recognised protection standards, and we transfer only the minimum data needed for the purpose.' },

      { h: 'How long we keep your data' },
      { p: 'We keep your request data for as long as we are in contact or working on your project. If a request does not become a project, we delete it within 24 months of the last contact, unless a law requires us to keep it longer.' },

      { h: 'Cookies' },
      { p: 'We use cookies that are necessary for the website to work, such as remembering the language you chose. We do not currently use advertising tracking cookies, and if we add analytics tools we will update this policy.' },

      { h: 'Your rights' },
      { p: 'You have the right to:' },
      {
        ul: [
          'Know how we process your data.',
          'Access your data and obtain a copy of it.',
          'Correct or update your data.',
          'Ask us to delete your data.',
          'Withdraw your consent at any time, without affecting anything done before the withdrawal.',
        ],
      },
      { p: 'To exercise any of these rights, email us at hellowasheej@gmail.com or message us on WhatsApp at +966533819980. We respond within 30 days, and if we need more time we will tell you why before that period ends.' },
      { p: 'If you believe we have not handled your data in accordance with the law, you have the right to file a complaint with the Saudi Data and Artificial Intelligence Authority (SDAIA).' },

      { h: 'How we protect your data' },
      { p: 'We apply reasonable technical and organisational measures to protect your data, including encrypted connections (HTTPS) and limiting access to requests to our team only. However, no method of transmission or storage over the internet is completely secure.' },

      { h: 'Children' },
      { p: 'This website is intended for business owners, and we do not knowingly collect data from anyone under 18.' },

      { h: 'Changes to this policy' },
      { p: 'We may update this policy from time to time, and the date of the last update is shown at the top of the page. If a change is significant, we will post a clear notice on the website.' },

      { h: 'Contact us' },
      { ul: ['Email: hellowasheej@gmail.com', 'WhatsApp: +966533819980'] },
    ],
  },
};
