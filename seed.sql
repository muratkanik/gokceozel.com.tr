-- Seed data for Testimonials
INSERT INTO "Testimonial" (id, author, rating, locale, text, source, approved, "createdAt")
VALUES
('test-1', 'Ayşe Yılmaz', 5, 'tr', 'Gökçe Hanım harika bir doktor, rinoplasti sonucumdan çok memnunum.', 'Google', true, NOW()),
('test-2', 'John Doe', 5, 'en', 'Excellent experience with Dr. Gokce for my rhinoplasty. Highly recommended.', 'Google', true, NOW()),
('test-3', 'Elena S.', 5, 'ru', 'Прекрасный врач. Результат превзошел все мои ожидания.', 'Yandex', true, NOW()),
('test-4', 'Mehmet K.', 4, 'tr', 'İlgi ve alaka çok iyiydi, ameliyat sonrası süreçte hep destek oldular.', 'Instagram', true, NOW()),
('test-5', 'Fatma B.', 5, 'tr', 'Endolift işlemi için başvurdum. İlk günden itibaren farkı hissettim, çok teşekkürler.', 'Google', true, NOW());

-- Seed data for FAQs (SSS - Sık Sorulan Sorular)
INSERT INTO "Faq" (id, locale, question, answer, "sortOrder")
VALUES
('faq-1', 'tr', 'Rinoplasti ameliyatı ne kadar sürer?', 'Genellikle 2-3 saat sürmektedir. Ameliyatın zorluk derecesine göre bu süre değişebilir.', 1),
('faq-2', 'tr', 'Ameliyat sonrası iyileşme süreci nasıldır?', 'İlk 1 hafta atel ve tampon kalır, sonrasında günlük hayata dönüş başlar. Tam oturma süreci 6 ay ile 1 yıl arasında değişir.', 2),
('faq-3', 'tr', 'Endolift lazer işlemi ağrılı mıdır?', 'İşlem lokal anestezi altında yapıldığı için ağrı hissedilmez. İşlem sonrası hafif bir hassasiyet olabilir.', 3),
('faq-4', 'tr', 'Botoks ve dolgu arasındaki fark nedir?', 'Botoks mimik kırışıklıklarını rahatlatmak için kullanılırken, dolgu hacim kaybı olan bölgelere (dudak, yanak vb.) hacim kazandırmak için kullanılır.', 4),
('faq-5', 'en', 'How long does rhinoplasty surgery take?', 'It usually takes about 2 to 3 hours depending on the complexity of the procedure.', 1),
('faq-6', 'en', 'When can I return to normal activities after rhinoplasty?', 'Most patients can return to normal activities and work within 1 to 2 weeks.', 2);
