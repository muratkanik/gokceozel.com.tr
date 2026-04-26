const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
const translations = {
  tr: {
    Footer: {
      description: "Ankara'nın KBB cerrahisi referans merkezi.",
      clinic: "Klinik",
      rights: "Tüm hakları saklıdır",
      privacy: "KVKK · Gizlilik Politikası"
    },
    Navigation: {
      beforeAfter: "Öncesi & Sonrası"
    }
  },
  en: {
    Footer: {
      description: "Ankara's reference center for ENT surgery.",
      clinic: "Clinic",
      rights: "All rights reserved",
      privacy: "Privacy Policy"
    },
    Navigation: {
      beforeAfter: "Before & After"
    }
  },
  ar: {
    Footer: {
      description: "المركز المرجعي لجراحة الأنف والأذن والحنجرة في أنقرة.",
      clinic: "العيادة",
      rights: "جميع الحقوق محفوظة",
      privacy: "سياسة الخصوصية"
    },
    Navigation: {
      beforeAfter: "قبل وبعد"
    }
  },
  ru: {
    Footer: {
      description: "Справочный центр ЛОР-хирургии в Анкаре.",
      clinic: "Клиника",
      rights: "Все права защищены",
      privacy: "Политика конфиденциальности"
    },
    Navigation: {
      beforeAfter: "До и После"
    }
  },
  fr: {
    Footer: {
      description: "Le centre de référence d'Ankara pour la chirurgie ORL.",
      clinic: "Clinique",
      rights: "Tous droits réservés",
      privacy: "Politique de confidentialité"
    },
    Navigation: {
      beforeAfter: "Avant et Après"
    }
  },
  de: {
    Footer: {
      description: "Ankaras Referenzzentrum für HNO-Chirurgie.",
      clinic: "Klinik",
      rights: "Alle Rechte vorbehalten",
      privacy: "Datenschutzrichtlinie"
    },
    Navigation: {
      beforeAfter: "Vorher & Nachher"
    }
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'src', 'messages', `${loc}.json`);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // merge Navigation
  if (!data.Navigation) data.Navigation = {};
  data.Navigation.beforeAfter = translations[loc].Navigation.beforeAfter;
  
  // merge Footer
  if (!data.Footer) data.Footer = {};
  data.Footer.description = translations[loc].Footer.description;
  data.Footer.clinic = translations[loc].Footer.clinic;
  data.Footer.privacy = translations[loc].Footer.privacy;
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Updated ${loc}.json`);
});
