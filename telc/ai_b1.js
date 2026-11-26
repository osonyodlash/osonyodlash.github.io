/* ai_b1.js — telc Deutsch B1 (Zertifikat Deutsch) Sprechen, AI imtihon oluvchi bilan.
   26.11.2026: faqat exam_access.scope = "B1M" bo'lgan o'quvchi uchun (imtihon funksiyasi b1Page() exam sahifasida ai.js o'rniga shu faylni yuklaydi).
   Boshqa o'quvchilar B2 ai.js dan foydalanishda davom etadi — bu faylning ularga ta'siri yo'q.
   Teil 1 Einander kennenlernen (15 ball), Teil 2 Über ein Thema sprechen (30), Teil 3 Gemeinsam etwas planen (30); jami 75, o'tish 45.
   Ichki baho: har Teil 5 mezon x 0–5 = 25; B1 balliga aylantiriladi (x15/25, x30/25).
   Asl B2 izohi: Sprechen — telc B2 mündliche Prüfung.
   Asosiy bot (app.html ichidan: AISprech.mount(el, {t2: MUND, t3: MT3})): AI yo'q, o'quvchi o'z ovozini yozib, qayta eshitadi.
   Imtihon boti (data.exam bilan): AI imtihon oluvchi (Gemini) va baho. */
(function () {
  var FN = "https://yhljeyxcporqienvdjax.supabase.co/functions/v1/sprechen_b1";
  var MAXSEC = { 1: 120, 2: 150, 3: 120 };
  // telc B2 mündliche Prüfung – Teil 1: 7 rasmiy mavzu. Har biri: [nemischa, o'zbekcha, kichik punktlar (nemischa), o'zbekcha izoh]
  var T1 = [
    ["Reise", "Sayohat", "Ziel, Zeit, Land und Leute, Sehenswürdigkeiten", "Manzil, vaqt, mamlakat va odamlar, diqqatga sazovor joylar"],
    ["Buch", "Kitob", "Thema, Autor, Meinung", "Mavzu, muallif, fikringiz"],
    ["Film", "Film", "Thema, Handlung, Schauspieler, Meinung", "Mavzu, syujet, aktyorlar, fikringiz"],
    ["Sportereignis", "Sport voqeasi", "Sportart, Ort, Personen, Ergebnis", "Sport turi, joy, ishtirokchilar, natija"],
    ["Musikveranstaltung", "Musiqa tadbiri", "Musikrichtung, Musiker, Ort", "Musiqa yo'nalishi, musiqachi, joy"],
    ["Wichtige Person im Leben", "Hayotdagi muhim inson", "wer, wann, warum wichtig", "kim, qachon, nega muhim"],
    ["Wichtige Erfahrung", "Muhim tajriba", "was, wann, wo, mit wem, warum wichtig", "nima, qachon, qayerda, kim bilan, nega muhim"]
  ];
  var TN = { 1: "Teil 1 · Einander kennenlernen", 2: "Teil 2 · Über ein Thema sprechen", 3: "Teil 3 · Gemeinsam etwas planen" };
  // ---- telc B1 ma'lumotlari (ustoz PDF lari: «B1 Sprechen 2.teil», «Sprechen B1 Teil 3 – TELC mit FARRUX», «Gemeinsam etwas planen»)
  var B1MAX = { 1: 15, 2: 30, 3: 30 };
  function b1pts(teil, tot) { return Math.round((+tot || 0) * B1MAX[teil] / 25 * 2) / 2; }
  var B1T1 = { title: "Einander kennenlernen", uz: "Bir-biringiz bilan tanishish", points: "Name · Herkunft · Wohnort · Familie · Beruf / Ausbildung · Sprachen · Hobbys / Freizeit · Reisen · Zukunftspläne", pointsUz: "Ism · qayerdan · qayerda yashaysiz · oila · kasb / o'qish · tillar · qiziqishlar · sayohat · kelajak rejalari" };
  var B1T2 = [["Haustiere", "Uy hayvonlari", "Udo Franke (39), Betriebswirt, meint, dass Haustiere Kindern helfen, Verantwortung zu lernen. Ein Hund kann besonders für schüchterne oder einsame Kinder ein guter Freund sein.", "Saskia Vorbeck (35), Grafikerin, erzählt, dass ihr Sohn Timo einen Hund möchte. Doch sie denkt, dass er mit sieben Jahren noch zu jung ist, da ein Hund viel Arbeit macht."], ["TikTok", "TikTok", "Einige Menschen verbringen viel Zeit mit TikTok-Videos, was als Zeitverschwendung gesehen wird. Der Autor findet, dass man stattdessen ein Hobby wählen sollte, da es viele Alternativen gibt.", "Die Tochter des Autors postet regelmäßig Videos auf TikTok. Zuerst war der Autor besorgt, aber jetzt sieht er, dass es ihr guttut. Sie hat Talent als Schauspielerin und Sängerin und teilt es mit anderen. Ihre Videos sind erfolgreich."], ["Haustiere in der Familie", "Oiladagi uy hayvonlari", "Anna Herzog, 28 Jahre alt, Sekretärin, mag Tiere. Sie hat zwei Katzen und viele Fische. Ihre Tochter kümmert sich meistens um die Tiere. Sie machen der Familie viel Freude.", "Frank Ehrmann, 38 Jahre alt, Verkäufer, hat keinen Platz für Haustiere. Er lebt in einer kleinen Wohnung und reist oft. Er mag keine Tiere in der Wohnung und findet, dass sie in Freiheit leben sollten."], ["Am Wochenende etwas unternehmen", "Dam olish kunlari", "Am Wochenende plant der Autor mit Freundinnen und Freunden gemeinsame Aktivitäten. Sie gehen oft ins Restaurant, ins Kino oder ins Konzert. Wenn sie keine Ideen haben, treffen sie sich zu Hause für einen entspannten Abend.", "Die Autorin möchte am Wochenende vor allem Ruhe haben. Nach einer anstrengenden Woche bleibt sie lieber allein zu Hause, schläft lange, liest und plant gar nichts."], ["Kleidung im Internet kaufen", "Internetdan kiyim sotib olish", "Heike Bittner (36), Hausfrau, bestellt ihre Kleider am liebsten im Internet. Sie schätzt die größere Auswahl und vermeidet überfüllte Geschäfte. Sie sucht lieber zu Hause aus und probiert in Ruhe an.", "Carlo Marchese (33), Malermeister, kauft nicht oft Kleidung. Wenn er etwas braucht, nimmt er sich Zeit und geht in die Stadt. Er mag es nicht, im Internet zu bestellen."], ["Brief oder E-Mail", "Xat yoki e-mail", "Max Bayer (30), Lehrer, findet es schade, dass viele Menschen nicht mehr mit der Hand schreiben wollen. Er freut sich immer über einen handgeschriebenen Brief oder eine Karte, besonders zum Geburtstag.", "Tina Klein (35), Pflegerin, schreibt keine Briefe, weil es zu lange dauert, bis ein Brief ankommt. Sie schreibt lieber E-Mails oder Nachrichten mit dem Handy, weil diese sofort beim Empfänger sind."], ["Zukunftspläne", "Kelajak rejalari", "Jana, 16 Jahre alt, möchte heiraten, aber ihr Partner muss flexibel sein, weil sie in verschiedenen Ländern leben möchte. Sie weiß noch nicht, ob sie Kinder haben will. Zuerst will sie die Matura machen und Medizin studieren.", "Max, 17 Jahre alt, möchte später drei Kinder haben und auch zu Hause bei ihnen sein. Ein gutes Familienleben ist ihm wichtig. Er interessiert sich für Umweltschutz und will einen Job mit gutem Einkommen."], ["Lebensmittel online kaufen", "Oziq-ovqatni onlayn sotib olish", "Irina Kovalcik, 25 Jahre, Webdesignerin, kauft Lebensmittel online, um Zeit zu sparen und nicht an der Supermarktkasse zu warten. Sie kann rund um die Uhr einkaufen.", "Tobias Krämer, 27 Jahre, Student, kauft Lebensmittel lieber auf dem Markt, weil dort alles frisch ist. Er spricht gern mit den Verkäufern und sieht die Produkte vor dem Kauf."], ["Fernsehen", "Televizor", "Eine Frau hat früher sehr viel ferngesehen, oft nur aus Langeweile, und wurde immer passiver. Letzten Monat hat sie ihren Fernseher verkauft. Jetzt hört sie Nachrichten im Radio, liest die Zeitung und geht ins Kino. Ohne Fernseher geht es ihr besser.", "Markus Jahn, 34 Jahre alt, sitzt fast jeden Abend ein paar Stunden vor dem Fernseher. Am liebsten schaut er amerikanische Krimis. So kann er gut entspannen und Kraft für den nächsten Arbeitstag tanken."], ["Auto, Bus oder Zug", "Mashina, avtobus yoki poyezd", "Ein Mann fährt meistens mit dem Zug, besonders bei längeren Reisen. Das ist bequem und stressfrei, weil er nicht selbst fahren muss. Bus und Zug sind außerdem umweltfreundlicher und oft günstiger als das Auto.", "Eine Frau fährt fast immer mit dem Auto. Das Auto ist für sie flexibel: Sie kann jederzeit losfahren und muss nicht auf Fahrpläne achten. Busse und Züge sind oft unpünktlich und in der Hauptverkehrszeit sehr voll."], ["Gemeinsame Mahlzeiten", "Birgalikdagi ovqatlanish", "In der Familie des Autors sind gemeinsame Mahlzeiten sehr wichtig. Alle helfen beim Kochen. Mindestens einmal am Tag, meistens abends, sitzen alle zusammen am großen Tisch, essen und erzählen, was am Tag passiert ist.", "Eine junge Frau isst meistens allein und schnell, oft vor dem Computer. Alle in ihrer Familie arbeiten zu unterschiedlichen Zeiten, deshalb ist ein gemeinsames Essen fast unmöglich. Sie findet das nicht so schlimm."], ["Klassentreffen", "Sinfdoshlar uchrashuvi", "Ein Mann war vor kurzem bei einem Klassentreffen. Er hat alte Freunde wiedergesehen und viel mit ihnen gelacht. Es war interessant zu sehen, was die anderen im Leben erreicht haben. Er freut sich schon auf das nächste Treffen.", "Eine Frau geht nicht gern zu Klassentreffen. Sie findet, dass dort alle nur von ihren Erfolgen erzählen. Ihre wichtigen Freunde aus der Schulzeit trifft sie sowieso privat."], ["Smartphone für Kinder", "Bolalar uchun smartfon", "Eine Mutter findet Smartphones für Kinder problematisch. Kinder verbringen zu viel Zeit mit dem Handy, und das kann ihrer Entwicklung schaden. Sie sollen lieber draußen spielen und mit anderen Kindern sprechen.", "Ein Vater hat seinem Kind ein Smartphone gekauft und findet das gut. Das Kind nutzt Lern-Apps und bleibt mit Freunden in Kontakt. Unterwegs gibt das Handy der Familie Sicherheit. Es gibt klare Regeln für die Nutzung."], ["Fitnessstudio", "Fitnes zal", "Ein junger Mann geht seit einem Jahr dreimal pro Woche ins Fitnessstudio. Die Geräte sind modern und die Trainer helfen ihm. Am Anfang war es schwer, aber jetzt ist es eine Gewohnheit und er fühlt sich fitter.", "Eine Frau findet Fitnessstudios zu teuer und zu voll. Sie macht lieber kostenlos Sport im Park: Sie joggt und fährt Fahrrad an der frischen Luft."], ["Umzug", "Ko'chib o'tish", "Eine Frau ist vor kurzem in eine neue Stadt umgezogen. Am Anfang war es anstrengend, aber sie hat schnell nette Nachbarn kennengelernt. Für sie war der Umzug ein guter neuer Anfang.", "Ein Mann findet Umzüge sehr stressig. Man muss alles packen und sich an einen neuen Ort gewöhnen. Nach seinem letzten Umzug hat er sich lange nicht wohlgefühlt und möchte nie wieder umziehen."], ["Serie oder Film", "Serial yoki film", "Ein Student schaut lieber Serien als Filme. Serien sind länger und spannender, und man lernt die Personen besser kennen. Mit deutschen Serien verbessert er auch seine Sprache.", "Eine Frau schaut lieber Filme. Ein Film dauert nur zwei Stunden und hat ein Ende. Bei Serien, findet sie, wird man schnell süchtig und verliert viel Zeit."], ["Einkaufen auf dem Bauernmarkt", "Dehqon bozoridan xarid", "Eva Winters (37) kauft meistens samstags auf dem Bauernmarkt ein. Dort bekommt sie frisches Gemüse aus der Region, Brot und sogar Biofleisch. Sie findet, dass Lebensmittel aus dem Supermarkt nicht so gut schmecken.", "Jan Peters (41) kauft alles im Supermarkt. Dort ist es billiger, er findet alles an einem Ort und kann auch spät abends nach der Arbeit einkaufen."], ["Verwandtschaft", "Qarindoshlar", "Tanja Wegener, 37 Jahre alt, Erzieherin, hat eine sehr große Verwandtschaft. Ihre Familie trifft sich regelmäßig bei Familienfesten, und alle können sich gut miteinander unterhalten.", "Max Bühner, 35 Jahre alt, Journalist, möchte nichts mit seiner Verwandtschaft zu tun haben. Er findet, dass sie zu verschieden sind. Er verbringt seine Zeit lieber mit Freunden."], ["Kleidung und Mode", "Kiyim va moda", "Tano Romer, 30 Jahre alt, Ingenieur, meint, dass Kleidung vor allem bequem und praktisch sein soll. Das Aussehen ist ihm nicht so wichtig, und er gibt sein Geld lieber für andere Dinge aus.", "Eine junge Frau liebt schöne und elegante Kleidung. Wenn sie gut angezogen ist, fühlt sie sich wohl. Sie geht gern einkaufen und sucht lange nach passenden Kleidungsstücken."], ["Große Feier veranstalten", "Katta bayram o'tkazish", "Marcus Blei erzählt, dass seine Familie bald den 80. Geburtstag der Großmutter feiert. Die Feier findet im Garten statt, damit die große Familie genug Platz hat. Seit Wochen überlegen sie, wer was kocht.", "Sybille Sauer hat mit ihrer Familie den 50. Hochzeitstag ihrer Eltern im Restaurant gefeiert. Sie musste nichts vorbereiten, das Essen war bestellt. Die Erwachsenen haben die Feier genossen, aber die Kinder haben sich gelangweilt."], ["Gemeinschaftsgarten", "Umumiy bog'", "Lisa Feldmann (43), Kamerafrau, nutzt seit einem Jahr ein Stück Land in einem Gemeinschaftsgarten. Sie baut Gemüse und Kräuter an, damit ihr Essen biologisch ist.", "Harald Daubner (29), Kaufmann, erzählt, dass seine Eltern einen Garten in einem Gemeinschaftsgarten haben. Dort gibt es oft Stress, zum Beispiel wenn es nicht regnet und die Pflanzen vertrocknen."], ["Stadt oder Land", "Shahar yoki qishloq", "Uwe wohnt gern auf dem Land. Er liebt die Natur und seinen Garten. Die Stadt ist ihm zu laut und stressig. Manchmal fährt er zum Einkaufen hin, aber er fühlt sich besser, wenn er wieder zu Hause ist.", "Anna liebt das Leben in der Großstadt. Deshalb ist sie nach Berlin gezogen. Dort gibt es viele Menschen, verschiedene Kulturen und immer Veranstaltungen. Als Musikerin findet sie nur in einer großen Stadt genug Arbeit."], ["Hauskauf", "Uy sotib olish", "Silke Kühne hat vor drei Jahren ein Haus gekauft. Sie sagt, es war teuer, aber besser, als Miete zu zahlen. Ihre Kinder haben jetzt viel Platz und einen Garten.", "Jörg Göbel ist 30 Jahre alt und arbeitet als Ingenieur. Er möchte kein Haus kaufen, weil er vielleicht ins Ausland gehen muss. Er lebt allein und braucht nicht viel Platz."], ["Stress", "Stress", "Andreas Elbert ist 35 Jahre alt und Verkaufsleiter. Er braucht Abwechslung und reist viel. Stress ist für ihn kein Problem, solange er viel zu tun hat.", "Claudia Gärtner ist 42 Jahre alt und arbeitet als Sekretärin. Sie hat sehr viel zu tun und fühlt sich oft müde. Sie wünscht sich mehr Zeit für Entspannung und für ihre Familie."], ["Der beste Freund / die beste Freundin", "Eng yaqin do'st", "Sandra kennt ihre beste Freundin seit ihrer Kindheit. Die Freundin lebt jetzt in einer anderen Stadt, aber sie telefonieren oft. Sie verstehen sich gut und teilen Freude und Sorgen. Streit gibt es fast nie.", "Holger Münz, 25, hat keinen besten Freund, aber viele Bekannte im Sportverein. Sie treffen sich zweimal pro Woche zum Sport und gehen danach manchmal in die Kneipe."], ["Hochzeit", "To'y", "Frank Ehrmann, 58 Jahre, Verkäufer, ist seit acht Jahren mit seiner Partnerin zusammen. Sie sind glücklich, wollen aber nicht heiraten, weil sie keine Hochzeit brauchen, um ihre Liebe zu zeigen.", "Anna Herzog, 36 Jahre, Sekretärin, ist seit vier Jahren verheiratet. Ihre Hochzeit war ein großes Fest mit 70 Gästen und dauerte drei Tage. Sie sagt, es war unvergesslich."], ["Gruppenreisen", "Guruh bo'lib sayohat", "Sabine Klostermann, 33 Jahre, Bürokauffrau, reist gern in Gruppen, weil sie das Alleinreisen langweilig findet. Sie lernt gern neue Leute kennen.", "Jens Mühle, 39 Jahre, Physiker, reist lieber allein, weil er frei entscheiden möchte, was er tut. Er mag es nicht, an ein festes Programm gebunden zu sein."], ["Ausziehen und allein wohnen", "Ota-onadan alohida yashash", "Jenny, 21 Jahre, Studentin, könnte ausziehen, aber sie bleibt lieber bei ihren Eltern. Dort hat sie mehr Platz, und ihre Mutter leiht ihr das Auto.", "Carsten Daubner, 18 Jahre alt, Auszubildender, ist ausgezogen. Er hat eine kleine, günstige Wohnung. Er wollte selbstständig sein, auch wenn seine Eltern zuerst dagegen waren."], ["Gesundheit", "Salomatlik", "Karsten Martens, 23 Jahre, kümmert sich nicht um seine Gesundheit. Er isst, was er will, und macht keinen Sport. Er ist schlank und denkt deshalb nicht an sein Gewicht.", "Silke Bauer, 21 Jahre, Studentin, achtet auf ihre Gesundheit. Sie raucht nicht und macht viel Sport, aber sie isst gern Süßigkeiten und Kuchen."], ["Schöne Wohnung", "Chiroyli uy", "Mara Weiß, 39 Jahre, Teamleiterin, liebt schöne Möbel. Ihre Wohnung ist immer ordentlich, und das gibt ihr ein gutes Gefühl.", "Stefan Heeg, 38 Jahre, Lehrer, ist das Aussehen seiner Möbel egal. Bequemlichkeit und Qualität sind ihm wichtig."], ["Verkehrsmittel", "Transport vositalari", "Bernd Kleinefeld, 45 Jahre, Elektrotechniker, nutzt sein Auto für die Arbeit, für Stadtbesuche und in der Freizeit. Er fährt auch die Kinder.", "Carola Ahrenholz, 25 Jahre, Sekretärin, fährt im Sommer mit dem Fahrrad, bei Regen mit dem Bus und im Winter mit einer Kollegin im Auto."], ["Einkaufen", "Xarid qilish", "Paul Krügel, 27 Jahre, kauft einmal pro Woche im Großmarkt ein. Er nimmt immer die Einkaufsliste seiner Frau mit, um Geld zu sparen.", "Juliane Teubert, 18 Jahre, ist in der Ausbildung, verdient wenig Geld und lebt bei ihren Eltern. Sie bezahlt nur ihre persönlichen Ausgaben."], ["Reisen", "Sayohat", "Klaus Schmidt, 31 Jahre, Kundenberater, reist viel für seinen Job, etwa 100.000 Kilometer im Jahr. Inzwischen findet er das Reisen langweilig.", "Stefanie Berger, 24 Jahre, Studentin, liebt Reisen und besucht Freunde im Ausland. Zugfahrten sind für Studenten günstig."], ["Tanzen", "Raqs", "Ben Kloss, 37 Jahre, Mathematiker, tanzt nicht gern. Er hört gern Musik, aber seine Frau schafft es nicht, ihn zu einem Tanzkurs zu überreden.", "Sarah Winter, 34 Jahre, Bankangestellte, liebt es, zur Musik zu tanzen. Sie besucht Tanzkurse und geht am Wochenende mit Freundinnen in die Disko."], ["Sport treiben", "Sport bilan shug'ullanish", "Martin Mayen, 20 Jahre, Grafiker, treibt dreimal pro Woche Sport, bei jedem Wetter. Er geht oft im Wald joggen, besonders gern, wenn es dunkel ist.", "Ella Sand, 30 Jahre, Büroangestellte, findet Sport anstrengend. Nach der Arbeit zieht sie bequeme Kleidung an und entspannt sich auf dem Sofa mit Musik oder einem spannenden Buch."], ["Lebenslanges Lernen", "Umr bo'yi o'rganish", "Jürgen Grunwald, 34 Jahre, Ingenieur, hat studiert. Jetzt möchte er nicht mehr lernen, sondern Geld verdienen und Zeit mit seiner Familie verbringen.", "Eine Bibliothekarin, 25 Jahre, denkt, dass man immer lernen muss, weil sich die Welt schnell ändert. Sie macht oft Kurse oder kauft Bücher, um mehr zu lernen."], ["Geld", "Pul", "Anne Smeler, 30 Jahre, Apothekerin, sagt, sie verdient Geld, um es auszugeben. Sie kauft gern schöne Kleidung und Schmuck, auch wenn sie das nicht dringend braucht. Man lebt nur einmal.", "Marco Schmetz, 24 Jahre, Bankangestellter, ist sparsam und überlegt genau, wann er etwas kauft. Er gibt ungern Geld für überflüssige Dinge aus."], ["Arbeitszeiten in der Gastronomie", "Restoran-mehmonxonada ish vaqti", "Alexander, 29 Jahre, arbeitet im Hotel und macht oft Überstunden. An seinen freien Tagen erledigt er Behördengänge oder trifft sich mit Freunden.", "Angelika, 46 Jahre, hat eine 21-jährige Tochter in der Hotelausbildung. Die Tochter arbeitet lange Schichten, bekommt aber kein Geld für die Überstunden. Angelika findet das nicht normal."], ["Sammeln", "Kolleksiya yig'ish", "Kai Bachmann, 33 Jahre, Ökologe, hat als Kind Spielzeugautos gesammelt, aber heute sammelt er nichts mehr. Er findet es anstrengend und teuer, Dinge zu sammeln.", "Eine 38-jährige Architektin sammelt Armbanduhren. Sie hat eine große Sammlung und sucht oft im Internet nach Uhren, egal ob sie neu oder gebraucht sind."], ["Nachbarn", "Qo'shnilar", "Horst Gebhardt, 21 Jahre, Büroangestellter, hat gute Nachbarn in seinem Alter. Sie feiern kleine Partys und besuchen sich. Ein Nachbar hilft ihm oft bei Reparaturen.", "Ein junger Mann, 24 Jahre, ist neu in einem großen Haus und kennt seine Nachbarn nicht. Er wohnt allein, zwischen den Nachbarn gibt es oft Streit. Er möchte seine Ruhe haben."], ["Gefahren im Internet", "Internetdagi xavflar", "Mathias Schweiger, 31 Jahre, Bauingenieur, kauft oft im Internet ein und macht auch seine Bankgeschäfte online. Er hat keine Angst vor Betrug oder Diebstahl.", "Janina Groß, 21 Jahre, Verkäuferin, kauft selten im Internet. Sie geht lieber in echte Geschäfte und lässt sich dort beraten."], ["Großeltern", "Buvi va bobolar", "Michael Schmidt, 32 Jahre, Manager, sieht seine Großeltern selten. Er findet es langweilig, dass sie immer wieder die gleichen alten Geschichten erzählen.", "Katja Jantos, 29 Jahre, Fotografin, hat ihre Großeltern nie kennengelernt. Sie hätte gern mit ihnen über ihre Kindheit und die Familiengeschichte gesprochen und ihnen viele Fragen gestellt."], ["Der ideale Urlaub", "Ideal ta'til", "Katrin Woll möchte sich im Urlaub entspannen. Sie liegt gern am Strand, liest ein gutes Buch, geht gut essen oder tut einfach nichts. Ihre Arbeit ist anstrengend, und sie braucht viel Erholung.", "Torsten Frankenberger möchte im Urlaub viel Sport machen, Ausflüge unternehmen und Neues entdecken. Für ihn ist ein Abenteuerurlaub der ideale Urlaub. Langweilig wird es ihm erst wieder zu Hause."], ["Geburtstagsfeier", "Tug'ilgan kun", "Lambert feiert seinen Geburtstag nicht besonders. Für ihn ist der Geburtstag ein normaler Tag. Er findet Feiern, Partys und Geschenke überflüssig und glaubt, dass es wichtigere Dinge im Leben gibt.", "Lena Reimer freut sich jedes Jahr sehr auf ihren Geburtstag. Sie nimmt sich an diesem Tag frei, lädt viele Freunde ein und feiert eine große Party."], ["Essen und Kochen", "Ovqat tayyorlash", "Martina Jahn liebt das Kochen und hat viele Rezeptbücher. Sie steht gern stundenlang am Herd und kocht leckere Gerichte für ihre Familie und für sich.", "Julian Berger kocht selten, weil er allein lebt und sich Kochen für ihn nicht lohnt. Wenn er gut essen möchte, geht er lieber in sein Lieblingsrestaurant."], ["Urlaub mit Freunden", "Do'stlar bilan ta'til", "Ein Ingenieur erzählt, dass er nie allein in den Urlaub fährt, weil ihm das zu langweilig wäre. Er reist mit Freunden, sie machen viele Ausflüge und feiern abends gern.", "Tamara Rößner und ihr Mann fahren nie mit Bekannten in den Urlaub. Sie möchten die Zeit lieber zu zweit verbringen, sich entspannen und tun, was ihnen gefällt."], ["Arbeitszeiten", "Ish vaqti", "Bernd Hinze hat als Inhaber eines Elektrogeschäfts keine festen Arbeitszeiten. Er arbeitet oft abends und am Wochenende. Urlaub macht er selten, aber er ist froh, dass sein Geschäft erfolgreich ist.", "Dagmar Schütt arbeitet momentan nur vormittags, weil sie sich um ihre zwei kleinen Kinder und den Haushalt kümmert. Wenn die Kinder älter sind, möchte sie wieder ganztags arbeiten."], ["Allein leben", "Yolg'iz yashash", "Doris, eine 35-jährige Kosmetikerin, lebt gern allein, weil sie ihre Freiheit schätzt und tun kann, was sie möchte. Wenn sie sich einsam fühlt, trifft sie Freunde oder besucht ihre Eltern.", "Bernd Mannfeldt, ein 42-jähriger Malermeister, lebt mit seiner Frau, seinen drei Kindern und seinem Schwiegervater zusammen. Er lebt gern nicht allein, weil immer etwas los ist."], ["In einer Wohngemeinschaft leben", "Ijaraga birga yashash (WG)", "Lina Junker wohnt mit zwei Freunden in einer großen Altbauwohnung in Berlin. Sie teilen die Kosten und verstehen sich gut.", "Marco Pfeiffer hat früher mit Freunden in einer Wohngemeinschaft gewohnt. Es gab oft Streit über die Hausarbeit und die Kosten. Jetzt lebt er allein und genießt seine Unabhängigkeit."], ["Kinder im Freizeitstress", "Bolalarning bo'sh vaqti", "Marie Baumann erzählt, dass ihr Sohn keinen Sport im Verein machen wollte, sondern lieber einen Malkurs. Seit drei Jahren malt er mit großer Freude. Sie findet, Kinder sollen selbst wählen, was ihnen Spaß macht.", "Volker Diestel, 35 Jahre alt, wollte, dass seine Tochter zwei Musikinstrumente lernt und auch Sport im Verein macht. Sie lernt jetzt Schlagzeug und macht Leichtathletik. Vielleicht fängt sie bald auch mit Gitarre an."], ["Autokauf", "Mashina sotib olish", "Sabine Pfister, 38 Jahre, Industriekauffrau, möchte sich bald ein neues Auto kaufen. Sie hat lange dafür gespart. Für sie ist das Auto nicht nur ein Fahrzeug, sondern auch ein Teil ihres Lebensstils.", "Markus Böhm, 39 Jahre alt, lebt in einer Großstadt und fährt jeden Tag mit der U-Bahn zur Arbeit. Ein Auto ist ihm zu teuer und zu schlecht für die Umwelt. Außerdem hat er keinen Parkplatz."], ["Gastfreundschaft", "Mehmondo'stlik", "Niklas Weber, 30 Jahre alt, lädt selten Gäste ein, weil er es anstrengend findet, sich um sie zu kümmern. Überraschungsbesuche mag er überhaupt nicht.", "Karina Fohrbeck, 34 Jahre alt, Lehrerin, freut sich über jeden Besuch, weil sie nicht gern allein ist. Sie hat sogar ein Gästezimmer eingerichtet, damit Freunde und Familie bei ihr übernachten können."]];
  var B1T3 = [["Nachbarin bei großem Familientreffen helfen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner haben eine gemeinsame Nachbarin, die ein großes Familientreffen plant. Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner wollen ihr helfen. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wann?", "Wie viele Personen?", "Tische und Stühle?", "Übernachtung?"]], ["Treffen mit den ehemaligen Mitschülerinnen", "Sie haben zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner Abitur gemacht. Nun möchten Sie ein Treffen mit den ehemaligen Mitschülerinnen veranstalten. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wann?", "Wo?", "Musik?", "Kosten?"]], ["Abschiedsparty feiern", "Sie haben zwei Wochen Urlaub gemacht und in dieser Zeit einige nette Deutsche kennengelernt. Vor dem Ende des Urlaubs und bevor Ihre Bekannten alle wieder nach Hause fahren, möchten Sie eine Abschiedsparty feiern. Sie haben die Aufgabe, zusammen mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin diese Party zu planen. Überlegen Sie sich, was alles zu tun ist und wer welche Aufgaben übernimmt.", ["Wann?", "Wo?", "Essen und Getränke", "Wer bezahlt wofür?"]], ["Abschlussfest organisieren", "Sie lernen gemeinsam in einem Deutschkurs und veranstalten ein Abschlussfest. Sie möchten einige Dinge mit Ihren Freunden planen und vorbereiten. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Kuchen backen oder Kaffee (wo)", "Dekorieren", "Tisch decken", "Wo und wann"]], ["Willkommensfeier", "Ein Freund ist wieder aus dem Ausland zurück. Bereiten Sie mit Ihrem Partner eine Feier für ihn vor. Vergleichen Sie Ihre Vorschläge und vereinbaren Sie einen gemeinsamen Plan.", ["Wie wollen Sie ihn begrüßen?", "Wo soll die Feier stattfinden?", "Welche früheren Freunde laden Sie ein?", "Was möchten Sie unternehmen?"]], ["Geburtstagsfeier eines Kollegen", "In drei Wochen feiert ein Kollege seinen 50. Geburtstag. Bereiten Sie mit Ihrem Partner aus derselben Firma eine kleine Feier vor. Wählen Sie ein Geschenk und teilen Sie die Aufgaben auf.", ["Was schenken Sie ihm?", "Wie finanzieren Sie das Geschenk?", "Was gibt es zu essen?", "Welche Getränke besorgen Sie?", "Wie gestalten Sie die Feier?"]], ["Straßenfest", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner sind Nachbarn. Sie wollen gemeinsam in Ihrer Straße ein Straßenfest organisieren. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist.", ["Einladungen", "Geeigneter Ort", "Bänke, Tische", "Essen, Getränke", "Helfer und Helferinnen"]], ["Firmenjubiläum", "Sie arbeiten im selben Unternehmen. Das Unternehmen feiert gerade sein 80-jähriges Jubiläum und Sie möchten die Feier gemeinsam planen. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Musik", "Disko", "Kostüm"]], ["Sommerfest", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner arbeiten in der gleichen Firma. Sie sollen gemeinsam ein Sommerfest für Ihre Kolleginnen und Kollegen organisieren. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist.", ["Wann?", "Wo?", "Essen, Getränke", "Spiele", "Musik und Tanz"]], ["Firmenfeier organisieren", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner arbeiten in der gleichen Firma. Sie wollen gemeinsam mit Ihren Kolleginnen und Kollegen eine Party für die Kollegen in einem kleinen Unternehmen organisieren.", ["Wen einladen?", "Termin?", "Essen/Getränke?", "Musik?", "Wo?"]], ["Firmen-Olympiade", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner arbeiten in der gleichen Firma. Sie wollen gemeinsam mit Ihren Kolleginnen und Kollegen eine „Firmen-Olympiade“ organisieren und einen ganzen Tag lang viel Spaß haben. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wo?", "Wann?", "Welche Sportarten?", "Essen und Getränke", "Kosten"]], ["Einen Spieleabend organisieren", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten gemeinsam einen Spieleabend organisieren. Tauschen Sie Ihre Ideen aus und einigen Sie sich am Ende auf einen Plan.", ["Wann?", "Wo?", "Welche Spiele?"]], ["Gemeinsam Fernsehabend", "Sie möchten wieder einmal einen Fernsehabend für gemeinsame Freunde organisieren. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Bei wem?", "Wann?", "Film oder Talent-Show?", "Essen und Getränke"]], ["Kinder-Lesenacht", "Ihre Kinder sind befreundet und wollen eine Lesenacht organisieren. Sie wollen sie unterstützen. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wann?", "Wo?", "Übernachten?"]], ["Deutschland-Abend organisieren", "Sie lernen mit einem Freund Deutsch. Gestalten Sie zusammen einen Abend rund um Deutschland. Besprechen Sie anhand Ihrer Notizen, wie Sie den Abend vorbereiten.", ["Welcher Ort eignet sich?", "Welchen Termin wählen Sie?", "Welche deutschen Speisen und Getränke bieten Sie an?", "Wie schmücken Sie den Raum?", "Wie gestalten Sie das Programm mit Musik oder Tanz?"]], ["Ausflug mit neuen Kollegen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner haben zwei neue Kollegen in Ihrer Firma. Sie möchten sich gemeinsam mit ihnen treffen und einen Ausflug organisieren. Tauschen Sie Ihre Ideen aus und einigen Sie sich am Ende auf einen Plan.", ["Wann?", "Wo?", "Verkehrsmittel?"]], ["Tierpark besuchen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten zusammen in den Tierpark gehen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Welcher Zoo oder Tierpark?", "Wann?", "Verkehrsmittel?", "Wen mitbringen?"]], ["Tag im Wald mit Familien", "Sie wollen zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner und Ihren Familien einen Tag im Wald verbringen. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wo?", "Wann?", "Aktivitäten?"]], ["Wanderung", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten zusammen mit Freunden eine Wanderung machen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wohin wandern?", "Wann?", "Wen einladen?", "Was mitbringen?"]], ["Ausflug auf den höchsten Berg", "Gemeinsam mit den anderen Teilnehmern Ihres Deutschkurses wollen Sie einen Ausflug auf den höchsten Berg Deutschlands machen: die Zugspitze in den Alpen. Sie und Ihre Partnerin bzw. Ihr Partner haben sich bereit erklärt, die Organisation zu übernehmen. Planen Sie gemeinsam den Ausflug. Sie haben sich schon diese Liste gemacht.", ["Wie reisen?", "Übernachten?", "Kosten?", "Spezielle Kleidung einpacken?", "Wer übernimmt welche Aufgabe?"]], ["Schwimmausflug", "Ihre Kinder wollen mit Freunden an einem beliebten See schwimmen. Organisieren Sie die gemeinsame Fahrt. Besprechen Sie Ihre Ideen und einigen Sie sich auf einen Plan.", ["Welcher Termin passt?", "Ist das Wetter zum Baden geeignet?", "Fahren Sie mit dem Zug oder dem Auto?", "Was nehmen Sie zum Essen und Trinken mit?"]], ["Eine Städtereise machen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten zusammen eine Städtereise machen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["In welche Stadt reisen?", "Wie?", "Wann?", "Übernachtung?"]], ["Gruppenreise nach Berlin", "Zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner und zwei Freunden haben Sie eine dreitägige Gruppenreise nach Berlin gebucht. Leider sind Ihre Freunde krank geworden und können nicht mitfahren. Für zwei Reisende ist das Gruppenticket aber zu teuer. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist.", ["Zu zweit fahren?", "Neuen Termin suchen?", "Andere Mitreisende suchen? Wen fragen?", "Gruppenticket verkaufen? Wie?"]], ["Ausflug: Fahrrad oder Auto", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten gemeinsam mit ihren Freunden eine mehrtägige Fahrradtour machen. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wie?", "Wann?", "Wie viele Personen?", "Übernachtung?"]], ["Wochenende im Waldhaus", "Verbringen Sie mit Ihrem Partner und gemeinsamen Freunden ein Wochenende in einem gemieteten Häuschen im Wald. Besprechen Sie verschiedene Möglichkeiten und entscheiden Sie gemeinsam.", ["In welcher Gegend möchten Sie wohnen?", "Welches Wochenende passt?", "Was kostet das Haus?"]], ["Schiffsreise planen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten gemeinsam eine Schiffsreise machen. Planen Sie die Reise. Überlegen Sie sich zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wohin?", "Wann?", "Wie viel Geld?"]], ["Eine gewonnene Schiffsreise planen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner haben gemeinsam eine Schiffsreise im Wert von 3000 Euro gewonnen. Planen Sie die Reise. Überlegen Sie sich zusammen mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wohin?", "Wann?", "Wie lange?", "Visa, Pässe", "Koffer packen"]], ["Einen Computerkurs besuchen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner wollen Urlaubsfotos bearbeiten. Dazu müssen Sie ein Computerprogramm erlernen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Ein gutes Programm finden?", "Einen Kurs besuchen?", "Lernen mit Buch?", "Zeitplan?"]], ["Einen Sprachkurs planen", "Sie und Ihr Freund/Ihre Freundin planen, im Sommer einen weiteren Sprachkurs zu besuchen. Überlegen Sie sich zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wo?", "Wann?", "Wie lange?", "Wie anmelden?", "Welche Sprache?"]], ["Ein Musikinstrument lernen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner wollen gemeinsam ein Musikinstrument lernen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist.", ["Welches Instrument?", "Instrument kaufen?", "Unterricht nehmen?", "Musikschule bzw. Lehrer finden", "Kosten"]], ["Einen Tanzkurs besuchen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten gemeinsam einen Tanzkurs besuchen. Überlegen Sie sich zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Tanzschule oder Verein?", "Wann und wie oft?", "Kosten?", "Welche Tanzart?", "Andere Freunde fragen?"]], ["Sportkurse besuchen", "Sie möchten sich gemeinsam für einen Sportkurs entscheiden. Besprechen Sie mit Ihrem Partner die nächsten Schritte anhand Ihrer Notizen.", ["Passt ein Verein oder ein Fitnessstudio besser?", "Welche Sportart wählen Sie?", "Wann und wie häufig trainieren Sie?", "Wie hoch sind die Gebühren?", "Wie kommen Sie zum Training?"]], ["Kochkurs: deutsche Küche", "Sie wollen gemeinsam mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner mehr über die deutsche Küche und ihre Spezialitäten lernen. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Kochkurs?", "Wo?", "Video von YouTube?"]], ["Einen Kochkurs besuchen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner interessieren sich für Kochen. Sie wollen gemeinsam einen Kochkurs besuchen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Was für ein Kochkurs?", "Wann?", "Wo?", "Wie oft?", "Kosten"]], ["Zusammen kochen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten zusammen kochen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wo?", "Rezept?", "Wann?", "Wen einladen?", "Etwas kaufen?"]], ["Gemeinsam Abendessen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner arbeiten in der gleichen Firma. Sie wollen am Abend gemeinsam etwas essen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wann?", "Wo?", "Essen/Getränke?", "Musik?"]], ["Sich auf die Deutschprüfung vorbereiten", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten sich gemeinsam auf die Deutschprüfung vorbereiten. Planen Sie zusammen, wie Sie das machen können. Tauschen Sie Ihre Ideen aus und einigen Sie sich am Ende auf einen Plan.", ["Wann?", "Wo?", "Bücher/YouTube?", "Mit Bekannten aus dem Deutschkurs?"]], ["Kinder beim Deutschlernen unterstützen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner kennen eine Familie, die Hilfe braucht. Die Kinder dieser Familie gehen zur Schule, können aber nicht so gut Deutsch sprechen. Gemeinsam möchten Sie der Familie helfen.", ["Wer hat Zeit?", "Welche Fächer?", "Nachhilfe an welchen Tagen?", "Vereinsaktivitäten für Kinder", "Spielnachmittage mit anderen Kindern"]], ["Auf die Kinder aufpassen", "Ihr Bruder ist auf Geschäftsreise und braucht Ihre Hilfe, auf seine Kinder aufzupassen. Gemeinsam mit Ihrem Partner/Ihrer Partnerin erstellen Sie einen Plan und besprechen diesen.", ["Spielen", "Essen", "Mittagsschlafen"]], ["Kinderbetreuung während der Hochzeit", "Ein Bekannter von Ihnen nimmt an einer Hochzeit teil und Sie erhalten die Bitte, bei der Betreuung seiner kleinen Kinder zu helfen. Überlegen Sie gemeinsam mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was Sie in dieser Situation tun können. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wie viele Kinder?", "Alter?", "Wo?", "Spielen?"]], ["Ferienspiele für die Kinder", "Es sind Schulferien. Sie und Ihr Gesprächspartner/Ihre Gesprächspartnerin möchten Ferienspiele für die Kinder organisieren. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist.", ["Wann und wie viele Kinder einladen?", "Zeit und Ort", "Essen und Getränke", "Helfer/Helferinnen", "Spiele, Aktivitäten"]], ["Einen kranken Freund besuchen", "Ihr Freund ist krank. Sie und Ihr Freund/Ihre Gesprächspartnerin planen, gemeinsam einen kranken Freund zu besuchen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Essen mitbringen", "Etwas kaufen", "Zum Arzt gehen", "Medikamente holen", "Haushalt helfen"]], ["Hilfe bei der Hausarbeit", "Der Mann Ihrer gemeinsamen Freundin ist im Krankenhaus. Ihre Freundin hat keine Zeit für die Hausarbeit. Sie wollen ihr helfen. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wann?", "Wer?", "Einkaufen", "Kochen"]], ["Beim Umziehen helfen", "Ein Teilnehmer Ihres Deutschkurses wechselt die Wohnung und bittet den ganzen Kurs um Hilfe. Organisieren Sie diese Hilfe mit Ihrem Partner anhand Ihrer Notizen.", ["Wo liegt die neue Wohnung?", "Wer kann mithelfen?", "Wie viel Zeit brauchen Sie?", "Wie verteilen Sie die Arbeiten?", "Möchten Sie anschließend feiern?"]], ["Kindergarten verschönern", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner haben Kinder, die denselben Kindergarten besuchen. Dieser Kindergarten soll verschönert werden und alle Eltern sollen mithelfen. Machen Sie einen Plan. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Gebäude/Räume", "Spielplatz", "Werkzeug", "Materialien", "Wer kann was machen?"]], ["Ein Haus zusammen renovieren", "Sie und Ihre Freunde leben in einem Haus, in dem Sie wohnen, das ziemlich alt ist. Sie möchten das Haus renovieren. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Wann?", "Wie viele Tage einplanen?", "Kosten?", "Was verändern?", "Wen möchten Sie noch einladen/um Hilfe bitten?"]], ["Baumhaus bauen", "Sie wollen für die Kinder ein Baumhaus bauen. Planen Sie das Vorhaben mit Ihrem Partner und treffen Sie gemeinsam eine Entscheidung.", ["An welchem Tag bauen Sie?", "Welche Werkzeuge brauchen Sie?", "Wie hoch sind die Ausgaben?"]], ["Eine Spendenaktion organisieren", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner möchten armen Familien helfen und eine Spendenaktion organisieren. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist. Sie haben sich schon einen Zettel mit Notizen gemacht.", ["Für wen bzw. welche Organisation spenden?", "Wie viele Personen können helfen?", "Was tun (etwas verkaufen, Geld sammeln, usw.)?", "Wann?", "Wo?"]], ["Menschen helfen", "Sie wollen zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner Menschen helfen, die nicht sehr viel Glück im Leben hatten bzw. die schwere Zeiten im Leben haben. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wie?", "Welche Organisation?", "Mit Freunden?"]], ["Pflanzen auf dem Balkon", "Ihre Nachbarin möchte nach dem Winter neue Pflanzen auf dem Balkon anpflanzen. Sie sollen ihr dabei helfen. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wann?", "Wer?", "Blumen kaufen?", "Transport?"]], ["Von Ihrer Heimatstadt erzählen", "In Ihrem Sprachkurs sollten Sie etwas über Ihre Heimatstadt erzählen. Ihre Gesprächspartnerin/Ihr Gesprächspartner kommt aus derselben Stadt wie Sie. Überlegen Sie zusammen mit Ihrer Gesprächspartnerin/Ihrem Gesprächspartner, was zu tun ist. Tauschen Sie Ideen aus und diskutieren Sie darüber. Einigen Sie sich zum Schluss.", ["Wie lange?", "Größe und Bedeutung?", "Alte Fotos?", "Video aus YouTube?"]], ["Geburtstagsparty in einer anderen Stadt", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner sind zu einer Geburtstagsfeier in einer anderen Stadt eingeladen. Sie möchten gemeinsam mit Ihrer Familie dorthin fahren. Überlegen Sie sich, was alles zu tun ist und wer welche Aufgaben übernimmt. Sie haben sich schon eine Liste gemacht.", ["Wie viele Personen?", "Wie weit?", "Mit dem Auto oder Zug?", "Geschenk?"]], ["Die alte Sprachschule besuchen", "Sie und Ihre Gesprächspartnerin/Ihr Gesprächspartner haben an derselben Sprachschule gelernt. Es ist Tag der offenen Tür und Sie möchten Ihre alte Schule besuchen. Überlegen Sie mit Ihrem Gesprächspartner/Ihrer Gesprächspartnerin, was zu tun ist.", ["Wann?", "Werbung?", "Ausstellung?", "Vortrag?", "Führung im Haus?"]], ["Ins Konzert gehen", "Planen Sie zu zweit einen Konzertbesuch. Machen Sie einander Vorschläge und einigen Sie sich auf einen Plan.", ["Welche Gruppe möchten Sie hören?", "Welcher Veranstaltungsort passt?", "Wen möchten Sie mitnehmen?"]], ["Einen Freund vom Flughafen abholen", "Ein gemeinsamer Freund war lange im Ausland und kommt jetzt zurück. Planen Sie mit Ihrem Partner eine Überraschung bei seiner Ankunft am Flughafen.", ["Wie viele Freunde kommen mit?", "Was könnten Sie ihm schenken?", "Mieten Sie einen Wagen oder eine Limousine?", "Wie planen Sie das Essen in seinem Lieblingsrestaurant?", "Mit welchen Ausgaben rechnen Sie?"]]];
  var CR = [["aufgabe", "Topshiriqni bajarish"], ["fluss", "Ravonlik"], ["korrekt", "Grammatika"], ["wortschatz", "So'z boyligi"], ["aussprache", "Talaffuz"]];

  // ---- Ovozli mashq (asosiy bot @Shogirtlarim_uchun_bot): AI yo'q. O'quvchi o'z ovozini yozib oladi va qayta eshitib tahlil qiladi.
  // Yozuvlar faqat telefonda (xotirada) turadi, serverga yuborilmaydi.
  var EXAM_BOT = "Timur_B2simulyatsiya_bot";
  var PR_RATE = 22050; // eshitish sifati uchun (AI uchun 16 kHz yetarli edi)
  var Q2 = [
    ["Worum geht es im Text?", "Matn nima haqida? Asosiy fikrni o'z so'zlaringiz bilan qisqacha aytib bering."],
    ["Haben Sie persönliche Erfahrungen zu diesem Thema?", "Bu mavzu bo'yicha shaxsiy tajribangiz bormi? Misol keltiring."],
    ["Welche positiven Aspekte hat das Thema?", "Ijobiy tomonlari qanday? Sabab bilan ayting."],
    ["Welche negativen Aspekte sehen Sie?", "Salbiy tomonlari qanday? Sabab bilan ayting."],
    ["Was ist Ihr Fazit?", "Xulosangiz: siz qaysi fikrdasiz va nega?"]
  ];
  var CHECK = {
    1: ["Mavzuni aytib, kirish qildimmi?", "Barcha punktlar bo'yicha gapirdimmi?", "Bog'lovchilar ishlatdimmi (zuerst, außerdem, deshalb, zum Schluss)?", "Xulosa bilan tugatdimmi?", "Taxminan 2 daqiqa gapira oldimmi?"],
    2: ["Matn mazmunini o'z so'zlarim bilan aytdimmi?", "Fikrimni sabab bilan asosladimmi (weil, da, denn)?", "Misol keltirdimmi?", "Ijobiy va salbiy tomonlarni aniq ajratdimmi?", "Aniq xulosa (Fazit) aytdimmi?"],
    3: ["Taklif berdimmi (Ich schlage vor …, Wie wäre es, wenn …)?", "Sherigimning fikrini so'radimmi?", "Rozilik yoki rad etishni sabab bilan aytdimmi?", "Vazifalarni taqsimladimmi (wer macht was)?", "Kelishilgan natijani yakunladimmi?"],
    all: ["Fe'l o'rni to'g'rimi (fe'l 2-o'rinda; weil/dass bilan oxirida)?", "Artikl va kelishiklar to'g'rimi (der/die/das, Akkusativ/Dativ)?", "Uzoq pauzalar va «äh» kam bo'ldimi?", "Talaffuz aniq, so'zlar tushunarlimi?"]
  };
  var PHRASES = {
    1: ["Ich möchte heute über … sprechen.", "Zuerst möchte ich erzählen, …", "Besonders gut gefallen hat mir, dass …", "Abschließend kann ich sagen, dass …"],
    2: ["In dem Text geht es um …", "Ich habe selbst die Erfahrung gemacht, dass …", "Ein großer Vorteil ist, dass …", "Andererseits muss man bedenken, dass …", "Zusammenfassend bin ich der Meinung, dass …"],
    3: ["Ich schlage vor, dass wir …", "Wie wäre es, wenn wir …?", "Das ist eine gute Idee, aber …", "Was hältst du davon?", "Dann machen wir es so: Ich kümmere mich um …"]
  };
  var prCleanup = null;

  var CSS =
    ".ai{max-width:560px;margin:0 auto;padding:4px 2px 30px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1b2333}" +
    ".ai-card{background:#fff;border-radius:16px;padding:16px;box-shadow:0 4px 16px rgba(30,42,68,.08);margin-bottom:12px}" +
    ".ai-card h3{margin:0 0 6px;font-size:17px}.ai-card p{margin:6px 0;color:#5b6577;font-size:14px;line-height:1.45}" +
    ".ai-tabs{display:flex;gap:6px;margin-bottom:12px}.ai-tabs button{flex:1;border:2px solid #e3d3ea;background:#fff;border-radius:12px;padding:10px 4px;font-weight:700;font-size:13px;color:#7a2a5a;cursor:pointer}" +
    ".ai-tabs button.on{background:#db2777;border-color:#db2777;color:#fff}" +
    ".ai-q{width:100%;box-sizing:border-box;border:2px solid #dde3ef;border-radius:12px;padding:11px 12px;font-size:15px;margin-bottom:10px;background:#fff;color:#1b2333}" +
    ".ai-it{display:block;width:100%;text-align:left;border:0;border-bottom:1px solid #eef1f6;background:none;padding:11px 4px;font-size:15px;cursor:pointer;color:#1b2333}" +
    ".ai-it small{display:block;color:#8a93a6;font-size:12.5px;margin-top:2px}.ai-it:last-child{border-bottom:0}" +
    ".ai-btn{display:block;width:100%;margin-top:10px;background:#db2777;color:#fff;border:0;border-radius:12px;padding:14px;font-size:16px;font-weight:700;cursor:pointer}" +
    ".ai-btn.alt{background:#fbe7f1;color:#b0185f}.ai-btn:disabled{opacity:.5}" +
    ".ai-top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;font-size:13px;color:#5b6577}" +
    ".ai-top b{color:#1b2333;font-size:14px}.ai-x{border:0;background:#eef2fb;color:#3b4a6b;border-radius:10px;padding:7px 10px;font-weight:700;cursor:pointer}" +
    ".ai-task{font-size:14px;line-height:1.45;color:#3b4a6b}.ai-task details{margin-top:6px}.ai-task summary{cursor:pointer;color:#b0185f;font-weight:700}" +
    ".ai-task .tx{white-space:pre-wrap;max-height:260px;overflow:auto;background:#f7f8fc;border-radius:10px;padding:10px;margin-top:6px;font-size:13.5px}" +
    ".ai-chat{display:flex;flex-direction:column;gap:10px;margin:12px 0 150px}" +
    ".ai-m{max-width:86%;padding:11px 13px;border-radius:16px;font-size:15.5px;line-height:1.45;word-break:break-word;position:relative}" +
    ".ai-m.ai{align-self:flex-start;background:#fff;box-shadow:0 2px 10px rgba(30,42,68,.08);border-bottom-left-radius:4px}" +
    ".ai-m.me{align-self:flex-end;background:#db2777;color:#fff;border-bottom-right-radius:4px}" +
    ".ai-m .who{display:block;font-size:11.5px;opacity:.65;margin-bottom:3px;font-weight:700}" +
    ".ai-m .pl{border:0;background:#fbe7f1;color:#b0185f;border-radius:20px;padding:4px 10px;font-size:13px;font-weight:700;margin-top:7px;cursor:pointer}" +
    ".ai-m.wait{opacity:.7;font-style:italic}" +
    ".ai-bar{position:fixed;left:0;right:0;bottom:0;background:rgba(244,246,251,.97);backdrop-filter:blur(6px);padding:10px 14px calc(12px + env(safe-area-inset-bottom));box-shadow:0 -4px 16px rgba(30,42,68,.08);z-index:50}" +
    ".ai-bar .in{max-width:560px;margin:0 auto;display:flex;align-items:center;gap:10px}" +
    ".ai-mic{flex:1;border:0;border-radius:16px;padding:16px 10px;font-size:17px;font-weight:800;background:#db2777;color:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".ai-mic.rec{background:#e0453a;animation:aiP 1.2s infinite}.ai-mic:disabled{background:#c9cfdc}" +
    "@keyframes aiP{50%{box-shadow:0 0 0 8px rgba(224,69,58,.18)}}" +
    ".ai-sm{border:0;background:#fff;border-radius:14px;padding:14px 13px;font-size:18px;box-shadow:0 2px 8px rgba(30,42,68,.1);cursor:pointer}" +
    ".ai-txt{display:flex;gap:8px;max-width:560px;margin:8px auto 0}.ai-txt textarea{flex:1;border:2px solid #dde3ef;border-radius:12px;padding:9px;font-size:15px;resize:none;font-family:inherit}" +
    ".ai-txt button{border:0;background:#db2777;color:#fff;border-radius:12px;padding:0 14px;font-weight:800;font-size:15px}" +
    ".ai-fin{max-width:560px;margin:6px auto 0;display:block;width:100%;border:0;background:none;color:#b0185f;font-weight:700;font-size:13.5px;padding:4px;cursor:pointer}" +
    ".ai-sc{display:flex;align-items:center;gap:8px;margin:7px 0;font-size:14px}.ai-sc span{width:130px}.ai-sc i{flex:1;height:9px;background:#eef1f6;border-radius:9px;overflow:hidden}" +
    ".ai-sc i b{display:block;height:100%;background:#db2777;border-radius:9px}.ai-sc em{font-style:normal;font-weight:800;width:34px;text-align:right}" +
    ".ai-big{text-align:center}.ai-big .n{font-size:42px;font-weight:900;color:#db2777;line-height:1.1}.ai-big .lv{display:inline-block;margin-top:6px;background:#fbe7f1;color:#b0185f;font-weight:800;border-radius:20px;padding:4px 12px}" +
    ".ai-l{margin:6px 0 0;padding-left:18px;font-size:14.5px;line-height:1.5}.ai-l li{margin:4px 0}" +
    ".ai-fx{border-top:1px solid #eef1f6;padding:9px 0;font-size:14.5px;line-height:1.45}.ai-fx .w{color:#b3261e;text-decoration:line-through}.ai-fx .r{color:#127a3e;font-weight:700}.ai-fx .y{color:#5b6577;font-size:13.5px}" +
    ".ai-err{background:#fdecec;color:#b3261e;border-radius:12px;padding:10px 12px;font-size:14px;margin:8px 0}" +
    // Ovozli mashq (asosiy bot)
    ".pr-st{border-left:4px solid #db2777}.pr-st .n{display:inline-block;background:#fbe7f1;color:#b0185f;font-weight:800;font-size:12px;border-radius:20px;padding:2px 9px;margin-bottom:6px}" +
    ".pr-st .de{font-size:16px;font-weight:700;color:#1b2333;margin:2px 0}.pr-st .uz{font-size:13.5px;color:#5b6577;margin:4px 0 8px;line-height:1.4}" +
    ".pr-rec{display:block;width:100%;border:0;border-radius:14px;padding:13px;font-size:16px;font-weight:800;background:#db2777;color:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".pr-rec.on{background:#e0453a;animation:aiP 1.2s infinite}.pr-rec:disabled{background:#c9cfdc}" +
    ".pr-tk{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid #eef1f6}.pr-tk b{font-size:13px;white-space:nowrap;color:#3b4a6b}" +
    ".pr-tk audio{flex:1;min-width:0;height:38px}.pr-tk button{border:0;background:#eef2fb;border-radius:10px;padding:8px 9px;cursor:pointer;font-size:14px}" +
    ".pr-ck label{display:flex;gap:9px;align-items:flex-start;padding:7px 0;font-size:14.5px;line-height:1.4;border-bottom:1px solid #f1f3f8;cursor:pointer}.pr-ck label:last-child{border-bottom:0}" +
    ".pr-ck input{width:19px;height:19px;margin:1px 0 0;flex:none;accent-color:#db2777}.pr-ck h4{margin:12px 0 2px;font-size:13px;color:#b0185f;text-transform:uppercase;letter-spacing:.03em}";

  function css() { if (document.getElementById("ai-css")) return; var s = document.createElement("style"); s.id = "ai-css"; s.textContent = CSS; document.head.appendChild(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var INIT = "";
  function initData() { if (INIT) return INIT; try { return (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) || ""; } catch (e) { return ""; } }
  function hap(t) { try { Telegram.WebApp.HapticFeedback.impactOccurred(t || "light"); } catch (e) {} }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function errText(e, msg) {
    if (msg && (e === "limit" || e === "nosession" || e === "moved")) return msg; // server yuborgan aniq xabar
    return { auth: "Kirish tasdiqlanmadi. Botdan saytni qayta oching.", nokey: "AI hali ulanmagan. Ustoz sozlashi kerak.", cap: "Bugungi limit tugadi. Ertaga davom eting.", limit: "Bugungi limit tugadi. Ertaga davom eting.", nosession: "Suhbat topilmadi. Mavzuni qaytadan tanlab boshlang.", big: "Yozuv juda uzun. Qisqaroq gapiring.", net: "Internet aloqasini tekshiring." }[e] || "AI hozir band (Google serverlari). Bir necha soniyadan keyin «Qayta yuborish»ni bosing.";
  }

  // AI band bo'lsa (Google serveri) bir marta avtomatik qayta urinadi
  function post(path, meta, blob) {
    return post1(path, meta, blob).catch(function (e) {
      if (e.message !== "ai") throw e;
      return new Promise(function (r) { setTimeout(r, 2500); }).then(function () { return post1(path, meta, blob); });
    });
  }
  function post1(path, meta, blob) {
    meta.initData = initData(); meta.lvl = "B1";
    var opt = { method: "POST" };
    if (blob) { var fd = new FormData(); fd.append("meta", JSON.stringify(meta)); fd.append("audio", blob, "a.wav"); opt.body = fd; }
    else { opt.headers = { "content-type": "application/json" }; opt.body = JSON.stringify(meta); }
    return fetch(FN + path, opt).then(function (r) {
      if (path === "/tts" && r.ok) return r.blob();
      return r.json().then(function (j) { if (!j.ok) { var er = new Error(j.err || "ai"); er.msg = j.msg; throw er; } return j; }, function () { throw new Error("ai"); });
    }, function () { throw new Error("net"); });
  }

  // ---- Ovoz yozish: 16 kHz mono WAV
  var Rec = {
    ctx: null, stream: null, node: null, src: null, bufs: [], rate: 16000, on: false,
    start: function (rate) {
      var self = this;
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("nomic"));
      return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } }).then(function (st) {
        var AC = window.AudioContext || window.webkitAudioContext;
        self.ctx = self.ctx || new AC();
        if (self.ctx.state === "suspended") self.ctx.resume();
        self.rate = Math.min(rate || 16000, self.ctx.sampleRate || 48000);
        self.stream = st; self.bufs = []; self.on = true;
        self.src = self.ctx.createMediaStreamSource(st);
        self.node = self.ctx.createScriptProcessor(4096, 1, 1);
        self.node.onaudioprocess = function (e) { if (self.on) self.bufs.push(new Float32Array(e.inputBuffer.getChannelData(0))); };
        self.src.connect(self.node); self.node.connect(self.ctx.destination);
      });
    },
    stop: function () {
      this.on = false;
      try { this.src.disconnect(); this.node.disconnect(); } catch (e) {}
      try { this.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      var inRate = this.ctx ? this.ctx.sampleRate : 48000, n = 0, i, j;
      for (i = 0; i < this.bufs.length; i++) n += this.bufs[i].length;
      var all = new Float32Array(n), o = 0;
      for (i = 0; i < this.bufs.length; i++) { all.set(this.bufs[i], o); o += this.bufs[i].length; }
      this.bufs = [];
      var ratio = inRate / this.rate, len = Math.floor(n / ratio), pcm = new Int16Array(len);
      for (i = 0; i < len; i++) {
        var a = Math.floor(i * ratio), b = Math.min(n, Math.floor((i + 1) * ratio)), s = 0, c = 0;
        for (j = a; j < b; j++) { s += all[j]; c++; }
        var v = c ? s / c : 0; v = Math.max(-1, Math.min(1, v)); pcm[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
      }
      var buf = new ArrayBuffer(44 + pcm.length * 2), d = new DataView(buf), r = this.rate;
      var w = function (p, s) { for (var k = 0; k < s.length; k++) d.setUint8(p + k, s.charCodeAt(k)); };
      w(0, "RIFF"); d.setUint32(4, 36 + pcm.length * 2, true); w(8, "WAVE"); w(12, "fmt "); d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true);
      d.setUint32(24, r, true); d.setUint32(28, r * 2, true); d.setUint16(32, 2, true); d.setUint16(34, 16, true); w(36, "data"); d.setUint32(40, pcm.length * 2, true);
      new Int16Array(buf, 44).set(pcm);
      return { blob: new Blob([buf], { type: "audio/wav" }), sec: len / r };
    }
  };

  // ---- Ovoz chiqarish (iOS uchun bitta "ochilgan" audio element)
  var player = null, curUrl = null;
  function unlock() {
    if (!player) { player = new Audio(); player.setAttribute("playsinline", ""); }
    try { player.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="; var p = player.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  function stopPlay() { try { player && player.pause(); } catch (e) {} try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }
  function speakFallback(text) {
    try {
      if (!window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(text); u.lang = "de-DE"; u.rate = 0.95;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^de/i.test(x.lang); })[0]; if (v) u.voice = v;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  }
  var ttsCache = {};
  function say(text, btn) {
    stopPlay();
    if (btn) btn.textContent = "⏳ Ovoz…";
    var done = function () { if (btn) btn.textContent = "🔊 Qayta eshitish"; };
    var play = function (blob) {
      if (!player) unlock();
      if (curUrl && !ttsCache[text]) URL.revokeObjectURL(curUrl);
      curUrl = URL.createObjectURL(blob); ttsCache[text] = curUrl;
      player.src = curUrl; var p = player.play(); done();
      if (p && p.catch) p.catch(function () { speakFallback(text); });
    };
    if (ttsCache[text]) { player.src = ttsCache[text]; var p0 = player.play(); if (p0 && p0.catch) p0.catch(function () {}); done(); return; }
    post("/tts", { text: text, voice: "Kore" }).then(play, function () { done(); speakFallback(text); });
  }

  function mount(el, data) {
    css();
    data = data || {};
    var T2 = (data.t2 || []).map(function (m) { return { title: m.t, uz: m.u, head: m.ot || m.t, text: m.od || "", textUz: m.ou || "" }; });
    var T3 = (data.t3 || []).map(function (x) { return { title: x[1], uz: x[2], task: x[3], taskUz: x[4], points: (x[5] || []).map(function (p) { return p[0]; }).join(" / ") }; });
    var teil = +(localStorage.getItem("ai_teil") || 2) || 2, q = "", S = null;
    // Imtihon rejimi (@Timur_B2simulyatsiya_bot): Teil 1→2→3 ketma-ket, baho oxirida
    var EX = data.exam || null, done = [];
    T2 = B1T2.map(function (x) { return { title: x[0], uz: x[1], head: x[0], text: x[2], partner: x[3] }; });
    T3 = B1T3.map(function (x) { return { title: x[0], uz: "", task: x[1], points: (x[2] || []).join(" / ") }; });
    if (EX) { INIT = EX.initData || ""; done = (EX.done || []).slice(); teil = done.length + 1; EX.topics = EX.topics || {}; }
    el.innerHTML = '<div class="ai"></div>'; var root = el.firstChild;

    function list() {
      if (teil === 1) return [B1T1];
      return teil === 2 ? T2 : T3;
    }

    function home() {
      if (EX) return examHome();
      if (prCleanup) prCleanup();
      stopPlay(); S = null; removeBar();
      var L = list(), qq = q.trim().toLowerCase();
      var rows = L.map(function (t, i) { return [t, i]; }).filter(function (p) { return !qq || (p[0].title + " " + (p[0].uz || "")).toLowerCase().indexOf(qq) >= 0; });
      root.innerHTML =
        '<div class="ai-card"><h3>🎙 Sprechen: o\'z ovozingizni eshiting</h3><p>Mavzuni tanlang, savollarga <b>nemischa gapirib yozib oling</b>, keyin o\'z ovozingizni qayta eshitib tahlil qiling. Bir savolga bir necha marta yozib, urinishlarni solishtirishingiz mumkin.</p><p>🔒 Yozuvlar faqat telefoningizda qoladi, hech qayerga yuborilmaydi.</p></div>' +
        '<div class="ai-card"><h3>🤖 AI bilan baho</h3><p>AI imtihon oluvchi bilan to\'liq Sprechen va telc mezonlari bo\'yicha baho endi imtihon botida.</p><button class="ai-btn alt" id="aiexam">@' + EXAM_BOT + ' ga o\'tish</button></div>' +
        '<div class="ai-tabs">' + [1, 2, 3].map(function (n) { return '<button data-tl="' + n + '" class="' + (teil === n ? "on" : "") + '">Teil ' + n + '<br><small style="font-weight:600">' + ["Präsentation", "Diskussion", "Planen"][n - 1] + '</small></button>'; }).join("") + '</div>' +
        '<div class="ai-card"><input class="ai-q" id="aiq" placeholder="Mavzu qidirish…" value="' + esc(q) + '" autocomplete="off">' +
        (teil === 1 ? '<button class="ai-it" data-own="1"><b>✏️ O\'z mavzuim</b><small>Imtihonda tushgan mavzuni o\'zingiz yozing</small></button>' : "") +
        rows.map(function (p) { var sub = teil === 1 ? ((p[0].uz ? p[0].uz + " · " : "") + (p[0].points || "")) : (p[0].uz || ""); return '<button class="ai-it" data-i="' + p[1] + '"><b>' + esc(p[0].title) + '</b><small>' + esc(sub) + '</small></button>'; }).join("") +
        (rows.length ? "" : '<p>Topilmadi.</p>') + '</div>';
      root.querySelector("#aiexam").onclick = function () {
        var u = "https://t.me/" + EXAM_BOT;
        try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openTelegramLink) { Telegram.WebApp.openTelegramLink(u); return; } } catch (e) {}
        window.open(u, "_blank");
      };
      [].forEach.call(root.querySelectorAll("[data-tl]"), function (b) { b.onclick = function () { teil = +b.dataset.tl; q = ""; try { localStorage.setItem("ai_teil", teil); } catch (e) {} home(); }; });
      var qi = root.querySelector("#aiq"); qi.oninput = function () { q = qi.value; var pos = qi.selectionStart; home(); var n = root.querySelector("#aiq"); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} };
      [].forEach.call(root.querySelectorAll("[data-i]"), function (b) { b.onclick = function () { begin(list()[+b.dataset.i]); }; });
      var own = root.querySelector("[data-own]");
      if (own) own.onclick = function () {
        var t = prompt("Mavzuni nemischa yozing:", ""); if (!t || !t.trim()) return; begin({ title: t.trim(), uz: "" });
      };
    }

    function examHead() {
      return '<div class="ai-top"><b>telc B1 · Sprechen · Teil ' + teil + ' / 3</b><span>' + ["Einander kennenlernen", "Über ein Thema sprechen", "Gemeinsam etwas planen"][teil - 1] + '</span></div>';
    }
    function examHome() {
      stopPlay(); S = null; removeBar();
      if (teil > 3) return exDone(done.slice());
      if (teil === 1) {
        var t1 = B1T1;
        root.innerHTML = examHead() +
          '<div class="ai-card"><h3>👋 Teil 1 · Einander kennenlernen</h3><p>Imtihon oluvchi bilan bir-biringizni tanishtirasiz (taxminan 3 daqiqa). O\'zingiz haqingizda gapiring <b>va unga ham savollar bering</b>.</p>' +
          '<p><i>Stellen Sie sich vor und lernen Sie Ihre Gesprächspartnerin / Ihren Gesprächspartner kennen.</i></p>' +
          '<p style="color:#1b2333"><b>Themen:</b> ' + esc(t1.points) + '</p><p style="color:#8a93a6">' + esc(t1.pointsUz) + '</p><button class="ai-btn" id="aigo">🎙 Boshlash</button></div>';
        root.querySelector("#aigo").onclick = function () { begin(t1); };
        return;
      }
      var L = teil === 2 ? T2 : T3;
      var ix = +EX.topics[teil];
      if (!(ix >= 0 && ix < L.length)) { ix = Math.floor(Math.random() * L.length); EX.topics[teil] = ix; if (EX.onTopic) EX.onTopic(teil, ix); }
      var t = L[ix];
      root.innerHTML = examHead() +
        '<div class="ai-card"><h3>🎲 Ihr Thema · Sizning mavzuingiz</h3><p style="font-size:17px;color:#1b2333"><b>' + esc(teil === 2 ? t.head : t.title) + '</b></p><p>' +
        (teil === 2 ? "Mavzu tasodifiy tanlandi. Sizga bitta odamning fikri (matn) beriladi: avval uni o'z so'zlaringiz bilan aytib bering, keyin o'z fikringiz va tajribangizni ayting. Imtihon oluvchi boshqa odamning fikrini aytadi — u bilan suhbatlashasiz (taxminan 5–6 daqiqa)." : "Mavzu tasodifiy tanlandi. Imtihon oluvchi bilan birgalikda reja tuzasiz: barcha punktlar bo'yicha taklif bering, uning takliflariga javob bering va oxirida kelishib oling (taxminan 5–6 daqiqa).") +
        '</p><button class="ai-btn" id="aigo">🎙 Boshlash</button></div>';
      root.querySelector("#aigo").onclick = function () { begin(t); };
    }
    // 21.11.2026 (ustoz so'rovi): imtihon tugagach, past ball olgan o'quvchiga AI tahlili — xatolar va to'g'risi,
    // nega past ball olgani (o'zbekcha), maslahatlar, maslahatlar va foydali iboralar. Natija avval odatdagidek yuboriladi (EX.onDone),
    // keyin tahlil oynasi ochiladi. Past ball: Mündlich < 45/75 yoki biror Teil < 15/25. Boshqalarga — «📋 Sprechen tahlili» tugmasi.
    function exDone(items) {
      // B1: yakuniy natija (B1 ballari) sprechen_b1/done orqali ustozga va o'quvchiga Telegramda yuboriladi
      post("/done", { items: items }).catch(function () { setTimeout(function () { post("/done", { items: items }).catch(function () {}); }, 4000); });
      var r = EX.onDone(items);
      setTimeout(function () { try { analysisUI(items); } catch (e) {} }, 700);
      return r;
    }
    function analysisUI(items) {
      if (!items || !items.length) return;
      var tot = items.reduce(function (a, x) { return a + b1pts(x.teil, x.tot); }, 0);
      var low = tot < 45 || items.some(function (x) { return b1pts(x.teil, x.tot) < B1MAX[x.teil] * 0.6; });
      var old = document.getElementById("ai-anb"); if (old) old.remove();
      var b = document.createElement("button");
      b.id = "ai-anb"; b.type = "button";
      b.textContent = "📋 Sprechen tahlili: xatolar va maslahatlar";
      b.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom));z-index:2147483000;border:0;border-radius:24px;padding:12px 18px;font:800 14.5px -apple-system,system-ui,sans-serif;background:#db2777;color:#fff;box-shadow:0 6px 20px rgba(219,39,119,.35);cursor:pointer;max-width:92vw";
      b.onclick = function () { openAnalysis(items, tot, low); };
      document.body.appendChild(b);
      openAnalysis(items, tot, low); // B1: natija (B1 ballari) har doim ko'rsatiladi
    }
    function openAnalysis(items, tot, low) {
      css();
      var o = document.createElement("div");
      o.id = "ai-an";
      o.style.cssText = "position:fixed;inset:0;z-index:2147483600;background:#f4f6fb;overflow:auto;-webkit-overflow-scrolling:touch;padding:14px 12px calc(40px + env(safe-area-inset-bottom))";
      var ul = function (a) { return (a && a.length) ? '<ul class="ai-l">' + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : ""; };
      var teilHTML = function (x) {
        var bp = b1pts(x.teil, x.tot), bad = bp < B1MAX[x.teil] * 0.6;
        var sc = x.s || {};
        return '<details class="ai-card"' + (bad || !low ? " open" : "") + ' style="border-left:5px solid ' + (bad ? "#e0453a" : "#16a34a") + '">' +
          '<summary style="cursor:pointer;font-weight:800;font-size:16px;list-style:none">' + (bad ? "🔴 " : "🟢 ") + esc(TN[x.teil] || ("Teil " + x.teil)) + ' — ' + String(bp).replace(".", ",") + ' / ' + B1MAX[x.teil] + (x.title ? '<div style="font-weight:600;font-size:13px;color:#5b6577;margin-top:2px">' + esc(x.title) + '</div>' : "") + '</summary>' +
          '<div style="margin-top:8px">' + CR.map(function (c) { var v = Math.max(0, Math.min(5, +sc[c[0]] || 0)); return '<div class="ai-sc"><span>' + c[1] + '</span><i><b style="width:' + (v * 20) + '%;background:' + (v < 3 ? "#e0453a" : "#db2777") + '"></b></i><em>' + v + '/5</em></div>'; }).join("") + '</div>' +
          (x.summary ? '<h3 style="margin-top:12px">📝 Nega shu ball?</h3><p style="color:#1b2333">' + esc(x.summary) + '</p>' : "") +
          (x.fixes && x.fixes.length ? '<h3 style="margin-top:12px">✏️ Xatolar va to\'g\'risi</h3>' + x.fixes.map(function (f) { return '<div class="ai-fx"><div class="w">' + esc(f.wrong) + '</div><div class="r">✓ ' + esc(f.right) + '</div><div class="y">' + esc(f.why) + '</div></div>'; }).join("") : "") +
          (x.tips && x.tips.length ? '<h3 style="margin-top:12px">🎯 Maslahatlar</h3>' + ul(x.tips) : "") +
          (x.phrases && x.phrases.length ? '<h3 style="margin-top:12px">💬 Foydali iboralar</h3>' + ul(x.phrases) : "") +
          (x.good && x.good.length ? '<h3 style="margin-top:12px">👍 Yaxshi tomonlar</h3>' + ul(x.good) : "") +
          '</details>';
      };
      o.innerHTML = '<div class="ai" style="padding-top:0">' +
        '<div class="ai-card ai-big"><div>🗣 telc B1 · Sprechen — natija va AI tahlili</div><div class="n" style="color:' + (tot < 45 ? "#e0453a" : "#16a34a") + '">' + String(tot).replace(".", ",") + ' / 75</div><div style="font-weight:800;color:' + (tot < 45 ? "#e0453a" : "#16a34a") + '">' + (tot >= 45 ? "✅ Bestanden (o\'tish bali 45)" : "❌ Nicht bestanden (o\'tish bali 45)") + '</div>' +
        '<div style="color:#5b6577;font-size:14px">' + (low ? "Ballingiz past chiqqan qismlar qizil bilan belgilangan. Quyida AI xatolaringizni to\'g\'rilab, nega past ball olganingizni tushuntirib beradi." : "Yaxshi natija! Quyida har bir Teil bo\'yicha tahlil.") + '</div></div>' +
        items.slice().sort(function (a, b) { return (a.tot || 0) - (b.tot || 0); }).map(teilHTML).join("") +
        '<button class="ai-btn" id="ai-anx">Yopish ✕</button></div>';
      document.body.appendChild(o);
      o.querySelector("#ai-anx").onclick = function () { o.remove(); };
    }
    function examNext(item) {
      done.push(item);
      if (EX.onTeil) EX.onTeil(done.slice());
      teil++; stopPlay(); removeBar(); S = null;
      if (teil > 3) return exDone(done.slice());
      root.innerHTML = '<div class="ai-card" style="text-align:center"><h3>✅ Teil ' + (teil - 1) + ' tugadi</h3><p>Natijalar barcha qismlar tugagandan keyin chiqadi.</p><button class="ai-btn" id="ainx">Teil ' + teil + ' ga o\'tish ➜</button></div>';
      root.querySelector("#ainx").onclick = examHome;
      window.scrollTo(0, 0);
    }
    function examItem(ev) {
      var sc = ev.scores || {}, s = {}, tot = 0;
      CR.forEach(function (c) { var v = Math.max(0, Math.min(5, Math.round(+sc[c[0]] || 0))); s[c[0]] = v; tot += v; });
      var arr = function (a, n) { return (Array.isArray(a) ? a : []).slice(0, n).map(function (x) { return String(x).slice(0, 300); }); };
      return {
        teil: teil, title: S.topic.title, s: s, tot: tot, niveau: String(ev.niveau || "").slice(0, 20), summary: String(ev.summary || "").slice(0, 1200),
        good: arr(ev.good, 3), tips: arr(ev.tips, 4), phrases: arr(ev.phrases, 4),
        fixes: (Array.isArray(ev.fixes) ? ev.fixes : []).slice(0, 10).map(function (f) { return { wrong: String(f.wrong || "").slice(0, 300), right: String(f.right || "").slice(0, 300), why: String(f.why || "").slice(0, 300) }; })
      };
    }

    function removeBar() { var b = document.getElementById("ai-bar"); if (b) b.remove(); }

    function begin(topic) {
      if (!EX) return practice(topic); // asosiy bot: AI o'rniga ovozli mashq
      unlock(); hap();
      S = { topic: topic, hist: [], busy: false, ended: false, rec: false, t0: 0, tmr: null, typing: false };
      chat(); ask({ start: true });
    }

    function topicMeta() {
      var t = S.topic;
      if (teil === 1) return { lvl: "B1", title: t.title, task: "Themen zum Kennenlernen: " + t.points, points: t.points || "" };
      return { lvl: "B1", title: t.title, task: t.task || t.head || "", text: t.text || "", partner: t.partner || "", points: t.points || "" };
    }

    // ---------- Ovozli mashq: yozib olish va qayta eshitish ----------
    function practice(topic) {
      if (prCleanup) prCleanup();
      stopPlay(); removeBar(); hap();
      var t = topic, steps;
      if (teil === 1) {
        steps = [
          { de: "Präsentation (ca. 2 Minuten)", uz: "Kirish → punktlar bo'yicha asosiy qism → xulosa. Taxminan 2 daqiqa to'xtamasdan gapiring.", max: MAXSEC[1] },
          { de: "Nachfrage des Prüfers", uz: "Imtihonda taqdimotdan keyin 1 ta savol beriladi. Taqdimotda aytmagan bir jihat haqida 30–60 soniya javob bering, masalan: «Wie ist das in Usbekistan?»", max: 90 }
        ];
      } else if (teil === 2) {
        steps = Q2.map(function (x) { return { de: x[0], uz: x[1], max: 120 }; });
      } else {
        var pts = String(t.points || "").split(" / ").map(function (s) { return s.trim(); }).filter(Boolean);
        steps = pts.map(function (p) { return { de: "Vorschlag: " + p, uz: "Shu punkt bo'yicha taklif bering, sababini ayting va sherigingiz fikrini so'rang.", max: 120 }; });
        if (!steps.length) steps.push({ de: "Gemeinsam planen", uz: "Takliflar bering, fikr bildiring, vazifalarni taqsimlang.", max: 120 });
        steps.push({ de: "Zusammenfassung", uz: "Kelishilgan rejani qisqacha yakunlang: kim nima qiladi.", max: 90 });
      }
      steps.forEach(function (s) { s.takes = []; });
      var P = { steps: steps, rec: -1, t0: 0, tmr: null };
      prCleanup = function () {
        if (P.tmr) clearInterval(P.tmr);
        if (P.rec >= 0) { try { Rec.stop(); } catch (e) {} P.rec = -1; }
        P.steps.forEach(function (s) { s.takes.forEach(function (k) { try { URL.revokeObjectURL(k.url); } catch (e) {} }); s.takes = []; });
        prCleanup = null;
      };
      var ul = function (a) { return '<ul class="ai-l">' + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; };
      var ck = function (a) { return a.map(function (x) { return '<label><input type="checkbox"><span>' + esc(x) + '</span></label>'; }).join(""); };
      root.innerHTML =
        '<div class="ai-top"><b>' + TN[teil] + '</b><button class="ai-x" id="prback">✕ Chiqish</button></div>' +
        '<div class="ai-card ai-task">' + taskHtml(t) + '</div>' +
        steps.map(function (s, i) {
          return '<div class="ai-card pr-st" data-st="' + i + '"><span class="n">' + (steps.length > 1 ? (i + 1) + ' / ' + steps.length : "Javob") + '</span>' +
            '<div class="de">' + esc(s.de) + '</div><div class="uz">' + esc(s.uz) + '</div>' +
            '<button class="pr-rec" data-rec="' + i + '">🎙 Yozib olish</button><div class="pr-takes"></div></div>';
        }).join("") +
        '<div class="ai-card"><h3>🎧 Qanday tahlil qilish kerak</h3><p>1) Yozuvni eshiting va xatolaringizni yozib oling. 2) Shu javobni qayta yozing. 3) Ikki urinishni solishtiring. 4) Pastdagi ro\'yxatni belgilang.</p></div>' +
        '<div class="ai-card pr-ck"><h3>✅ O\'zingizni tekshiring</h3><h4>' + esc(TN[teil]) + '</h4>' + ck(CHECK[teil]) + '<h4>Til</h4>' + ck(CHECK.all) + '</div>' +
        '<div class="ai-card"><h3>💬 Foydali iboralar</h3>' + ul(PHRASES[teil]) + '</div>' +
        '<button class="ai-btn alt" id="prhome">Boshqa mavzu</button>';
      window.scrollTo(0, 0);
      root.querySelector("#prback").onclick = root.querySelector("#prhome").onclick = function () {
        var n = 0; P.steps.forEach(function (s) { n += s.takes.length; });
        if (P.rec >= 0 || n) { if (!confirm("Chiqsangiz yozuvlaringiz o'chadi. Chiqasizmi?")) return; }
        home();
      };
      [].forEach.call(root.querySelectorAll("[data-rec]"), function (b) { b.onclick = function () { tap(+b.dataset.rec); }; });

      function syncBtns() {
        [].forEach.call(root.querySelectorAll("[data-rec]"), function (b) {
          var i = +b.dataset.rec;
          if (P.rec === i) { b.className = "pr-rec on"; b.disabled = false; b.textContent = "⏹ To'xtatish · " + mmss((Date.now() - P.t0) / 1000) + " / " + mmss(P.steps[i].max); }
          else { b.className = "pr-rec"; b.disabled = P.rec >= 0; b.textContent = P.steps[i].takes.length ? "🎙 Yana yozib olish" : "🎙 Yozib olish"; }
        });
      }
      function note(i, html, ms) {
        var box = root.querySelector('[data-st="' + i + '"]'); if (!box) return;
        var e = document.createElement("div"); e.className = "ai-err"; e.innerHTML = html; box.appendChild(e);
        if (ms) setTimeout(function () { e.remove(); }, ms);
      }
      function drawTakes(i) {
        var box = root.querySelector('[data-st="' + i + '"] .pr-takes'); if (!box) return;
        var s = P.steps[i];
        box.innerHTML = s.takes.map(function (k, j) {
          return '<div class="pr-tk"><b>' + (j + 1) + '-urinish · ' + mmss(k.sec) + '</b><audio controls preload="metadata" playsinline src="' + k.url + '"></audio><button data-del="' + j + '" title="O\'chirish">🗑</button></div>';
        }).join("");
        [].forEach.call(box.querySelectorAll("audio"), function (a) {
          a.addEventListener("play", function () { [].forEach.call(root.querySelectorAll("audio"), function (o) { if (o !== a) try { o.pause(); } catch (e) {} }); });
        });
        [].forEach.call(box.querySelectorAll("[data-del]"), function (d) {
          d.onclick = function () { var j = +d.dataset.del; try { URL.revokeObjectURL(s.takes[j].url); } catch (e) {} s.takes.splice(j, 1); drawTakes(i); syncBtns(); };
        });
      }
      function tap(i) {
        if (P.rec >= 0 && P.rec !== i) return;
        if (P.rec < 0) {
          [].forEach.call(root.querySelectorAll("audio"), function (o) { try { o.pause(); } catch (e) {} });
          hap("medium");
          Rec.start(PR_RATE).then(function () {
            if (!prCleanup) { try { Rec.stop(); } catch (e) {} return; } // foydalanuvchi chiqib ketgan
            P.rec = i; P.t0 = Date.now(); syncBtns();
            P.tmr = setInterval(function () { if (P.rec < 0) return; syncBtns(); if ((Date.now() - P.t0) / 1000 >= P.steps[P.rec].max) tap(P.rec); }, 500);
          }, function () {
            note(i, "🎙 Mikrofonga ruxsat berilmadi. Telegram sozlamalaridan mikrofonga ruxsat bering va qayta urinib ko'ring.");
          });
          return;
        }
        clearInterval(P.tmr); P.tmr = null; P.rec = -1; hap("medium");
        var r = Rec.stop();
        if (r.sec < 1) { syncBtns(); note(i, "Juda qisqa yozuv. Tugmani bosing, gapiring, tugatgach yana bosing.", 4000); return; }
        P.steps[i].takes.push({ url: URL.createObjectURL(r.blob), sec: r.sec });
        drawTakes(i); syncBtns();
      }
    }

    function taskHtml(t) {
      if (teil === 1) return '<b>' + esc(t.title) + '</b> <span style="color:#8a93a6">(' + esc(t.uz) + ')</span><br><span style="color:#5b6577">' + esc(t.points) + '</span><br>Gapiring, savol bering, javob bering — taxminan 3 daqiqa.';
      if (EX && teil === 2) return '<b>' + esc(t.head) + '</b> <span style="color:#8a93a6">(' + esc(t.uz || "") + ')</span><div class="tx"><b>Ihr Text:</b> ' + esc(t.text) + '</div><span style="color:#5b6577">1) Matnni o\'z so\'zlaringiz bilan aytib bering · 2) O\'z fikringiz · 3) O\'z tajribangiz · 4) Prüfer bilan suhbat</span>';
      if (EX && teil === 3) return '<b>' + esc(t.title) + '</b><br>' + esc(t.task || "") + (t.points ? '<br><span style="color:#5b6577">Punkte: ' + esc(t.points) + '</span>' : "");
      return teil === 1
        ? '<b>Thema: ' + esc(t.title) + '</b>' + (t.uz ? ' <span style="color:#8a93a6">(' + esc(t.uz) + ')</span>' : "") + (t.points ? '<br><span style="color:#5b6577">Punkte: ' + esc(t.points) + '</span>' + (t.pointsUz ? ' <span style="color:#8a93a6">(' + esc(t.pointsUz) + ')</span>' : "") : "") + '<br>Taqdimot ~2 daqiqa: kirish → asosiy qism (yuqoridagi punktlar bo\'yicha) → xulosa. Keyin Prüfer 1 ta savol beradi.'
        : EX && teil === 2
        ? '<b>' + esc(t.head) + '</b>' + (t.text ? '<div class="tx">' + esc(t.text) + '</div>' : "")
        : EX
        ? '<b>' + esc(t.title) + '</b><br>' + esc(t.task || "")
        : teil === 2
        ? '<b>' + esc(t.head) + '</b>' + (t.text || t.textUz ? '<details><summary>Matnni o\'qish</summary><div class="tx">' + esc(t.text || t.textUz) + '</div>' + (t.text && t.textUz ? '<details><summary>O\'zbekcha tarjima</summary><div class="tx">' + esc(t.textUz) + '</div></details>' : "") + '</details>' : "")
        : '<b>' + esc(t.title) + '</b><br>' + esc(t.task || "") + (t.taskUz ? '<details><summary>O\'zbekcha</summary><div class="tx">' + esc(t.taskUz) + '</div></details>' : "");
    }

    function chat() {
      var task = taskHtml(S.topic);
      root.innerHTML =
        '<div class="ai-top"><b>' + TN[teil] + (EX ? " · " + teil + "/3" : "") + '</b>' + (EX ? "" : '<button class="ai-x" id="aiback">✕ Chiqish</button>') + '</div>' +
        '<div class="ai-card ai-task">' + task + '</div><div class="ai-chat" id="aich"></div>';
      if (!EX) root.querySelector("#aiback").onclick = function () { if (S && S.rec) { try { Rec.stop(); } catch (e) {} } if (!S || S.hist.length < 3 || confirm("Suhbatdan chiqasizmi? Baho olinmaydi.")) home(); };
      S.hist.forEach(function (h) { bubble(h.role, h.text, true); });
      bar();
    }

    function bar() {
      removeBar();
      var b = document.createElement("div"); b.id = "ai-bar"; b.className = "ai-bar";
      b.innerHTML =
        '<div class="in"><button class="ai-sm" id="aikb" title="Yozish">⌨️</button><button class="ai-mic" id="aimic">🎙 Gapirish</button></div>' +
        '<div class="ai-txt" id="aitx" hidden><textarea id="aita" rows="2" placeholder="Nemischa yozing…"></textarea><button id="aisend">➤</button></div>' +
        '<button class="ai-fin" id="aifin">🏁 Yakunlash va baho olish</button>';
      document.body.appendChild(b);
      b.querySelector("#aimic").onclick = micTap;
      b.querySelector("#aikb").onclick = function () { S.typing = !S.typing; b.querySelector("#aitx").hidden = !S.typing; if (S.typing) b.querySelector("#aita").focus(); };
      b.querySelector("#aisend").onclick = function () { var ta = b.querySelector("#aita"), v = ta.value.trim(); if (!v || S.busy) return; ta.value = ""; bubble("me", v); S.hist.push({ role: "me", text: v }); ask({ text: v }); };
      b.querySelector("#aifin").onclick = finish;
      sync();
    }

    function sync() {
      var m = document.getElementById("aimic"); if (!m || !S) return;
      var f = document.getElementById("aifin");
      if (f) f.textContent = EX ? (S.ended ? (teil < 3 ? "➜ Keyingi qismga o'tish" : "🏁 Imtihonni yakunlash") : "🏁 Shu qismni yakunlash") : S.ended ? "🏁 Baho olish" : "🏁 Yakunlash va baho olish";
      if (S.rec) { m.className = "ai-mic rec"; m.disabled = false; m.textContent = "⏹ To'xtatish · " + mmss((Date.now() - S.t0) / 1000) + " / " + mmss(MAXSEC[teil]); return; }
      m.className = "ai-mic"; m.disabled = S.busy || S.ended;
      m.textContent = S.ended ? "✅ Suhbat tugadi" : S.busy ? "⏳ AI o'ylayapti…" : "🎙 Gapirish";
    }

    function bubble(role, text, silent) {
      var ch = root.querySelector("#aich"); if (!ch) return null;
      var d = document.createElement("div"); d.className = "ai-m " + (role === "ai" ? "ai" : role === "me" ? "me" : "ai wait");
      d.innerHTML = '<span class="who">' + (role === "ai" ? "🧑‍🏫 Prüferin" : role === "me" ? "Siz" : "") + '</span>' + esc(text) + (role === "ai" ? '<br><button class="pl">🔊 Qayta eshitish</button>' : "");
      ch.appendChild(d);
      var pl = d.querySelector(".pl"); if (pl) pl.onclick = function () { say(text, pl); };
      if (!silent) setTimeout(function () { d.scrollIntoView({ behavior: "smooth", block: "end" }); }, 30);
      return d;
    }

    function micTap() {
      if (!S || S.busy || S.ended) return;
      if (!S.rec) {
        stopPlay(); hap("medium");
        Rec.start().then(function () {
          S.rec = true; S.t0 = Date.now(); sync();
          S.tmr = setInterval(function () { if (!S || !S.rec) return; sync(); if ((Date.now() - S.t0) / 1000 >= MAXSEC[teil]) micTap(); }, 500);
        }, function () {
          var ch = root.querySelector("#aich");
          if (ch) { var e = document.createElement("div"); e.className = "ai-err"; e.innerHTML = "🎙 Mikrofonga ruxsat berilmadi. Telegram sozlamalaridan mikrofonga ruxsat bering yoki ⌨️ tugmasi orqali yozib javob bering."; ch.appendChild(e); }
          S.typing = true; var tx = document.getElementById("aitx"); if (tx) tx.hidden = false;
        });
        return;
      }
      clearInterval(S.tmr); S.rec = false; hap("medium");
      var r = Rec.stop(); sync();
      if (r.sec < 1.2) { var ch = root.querySelector("#aich"); if (ch) { var e = document.createElement("div"); e.className = "ai-err"; e.textContent = "Juda qisqa yozuv. Tugmani bosib, gapirib bo'lgach yana bosing."; ch.appendChild(e); setTimeout(function () { e.remove(); }, 4000); } return; }
      ask({ blob: r.blob, sec: r.sec });
    }

    function ask(o) {
      S.busy = true; sync();
      var mine = o.blob ? bubble("me", "🎙 " + mmss(o.sec) + " · tinglanmoqda…") : null;
      var w = bubble("wait", "Prüfer javob yozmoqda…");
      var meta = { teil: teil, topic: topicMeta(), hist: S.hist, start: !!o.start, text: o.text || "", sec: o.sec || 0 };
      var cur = S;
      post("/turn", meta, o.blob).then(function (j) {
        if (cur !== S) return;
        w && w.remove();
        if (o.blob) {
          var heard = j.heard || "(tushunarsiz)";
          if (mine) mine.innerHTML = '<span class="who">Siz · 🎙 ' + mmss(o.sec) + '</span>' + esc(heard);
          S.hist.push({ role: "me", text: heard });
        }
        if (j.reply) { S.hist.push({ role: "ai", text: j.reply }); var b = bubble("ai", j.reply); say(j.reply, b && b.querySelector(".pl")); }
        if (j.end) S.ended = true;
        S.busy = false; sync();
      }, function (e) {
        if (cur !== S) return;
        w && w.remove();
        if (mine) mine.remove();
        var ch = root.querySelector("#aich");
        if (ch) {
          var lim = e.message === "limit" || e.message === "nosession"; // limit tugagan: qayta yuborishning foydasi yo'q
          var d = document.createElement("div"); d.className = "ai-err"; d.innerHTML = "⚠️ " + esc(errText(e.message, e.msg)) + (!lim && (o.blob || o.start) ? ' <button class="ai-x" style="margin-left:6px">🔁 Qayta yuborish</button>' : "");
          ch.appendChild(d); var rb = d.querySelector("button"); if (rb) rb.onclick = function () { d.remove(); ask(o); };
          if (lim && o.start) {
            removeBar();
            if (!EX) { var hb = document.createElement("button"); hb.className = "ai-btn alt"; hb.textContent = "Mavzular"; hb.onclick = home; ch.appendChild(hb); }
          }
        }
        if (o.text) S.hist.pop();
        S.busy = false; sync();
      });
    }

    function finish() {
      if (!S || S.busy) return;
      if (S.rec) { clearInterval(S.tmr); S.rec = false; try { Rec.stop(); } catch (e) {} }
      var mineN = S.hist.filter(function (h) { return h.role === "me"; }).length;
      if (mineN < 1) {
        if (EX) {
          if (!confirm("Hali hech narsa gapirmadingiz. Bu qism 0 ball bo'ladi. Keyingisiga o'tasizmi?")) return;
          return examNext({ teil: teil, title: S.topic.title, s: { aufgabe: 0, fluss: 0, korrekt: 0, wortschatz: 0, aussprache: 0 }, tot: 0, niveau: "", summary: "Bu qismda javob berilmadi.", good: [], tips: [], fixes: [] });
        }
        if (confirm("Hali hech narsa gapirmadingiz. Chiqasizmi?")) home(); return;
      }
      stopPlay(); removeBar();
      var cur = S;
      root.innerHTML = '<div class="ai-card" style="text-align:center"><h3>⏳ AI suhbatingizni baholamoqda…</h3><p>10–20 soniya kuting.</p></div>';
      if (EX) root.innerHTML = '<div class="ai-card" style="text-align:center"><h3>⏳ Javoblaringiz saqlanmoqda…</h3><p>10–20 soniya kuting. Ilovani yopmang.</p></div>';
      post("/eval", { teil: teil, topic: topicMeta(), hist: S.hist }).then(function (j) { if (cur === S) { if (EX) examNext(examItem(j.ev || {})); else result(j.ev || {}); } }, function (e) {
        if (cur !== S) return;
        root.innerHTML = '<div class="ai-err">⚠️ ' + esc(errText(e.message, e.msg)) + '</div><button class="ai-btn" id="airt">🔁 Qayta urinish</button>' + (EX ? "" : '<button class="ai-btn alt" id="aih">Mavzular</button>');
        root.querySelector("#airt").onclick = finish; if (!EX) root.querySelector("#aih").onclick = home;
      });
    }

    function result(ev) {
      var sc = ev.scores || {}, tot = 0;
      CR.forEach(function (c) { tot += Math.max(0, Math.min(5, +sc[c[0]] || 0)); });
      var pct = Math.round(tot / 25 * 100);
      var ul = function (a) { return (a && a.length) ? '<ul class="ai-l">' + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : ""; };
      root.innerHTML =
        '<div class="ai-top"><b>' + TN[teil] + ' · ' + esc(S.topic.title) + '</b></div>' +
        '<div class="ai-card ai-big"><div>Natija</div><div class="n">' + tot + ' / 25</div><div style="color:#5b6577">' + pct + '%' + (pct >= 60 ? " — imtihon darajasiga yaqin ✅" : " — yana mashq qiling 💪") + '</div>' + (ev.niveau ? '<span class="lv">Taxminiy daraja: ' + esc(ev.niveau) + '</span>' : "") + '</div>' +
        '<div class="ai-card">' + CR.map(function (c) { var v = Math.max(0, Math.min(5, +sc[c[0]] || 0)); return '<div class="ai-sc"><span>' + c[1] + '</span><i><b style="width:' + (v * 20) + '%"></b></i><em>' + v + '/5</em></div>'; }).join("") +
        '<p style="font-size:12.5px">Talaffuz bahosi taxminiy (yozuv matni asosida).</p></div>' +
        (ev.summary ? '<div class="ai-card"><h3>📝 Umumiy xulosa</h3><p style="color:#1b2333">' + esc(ev.summary) + '</p></div>' : "") +
        (ev.good && ev.good.length ? '<div class="ai-card"><h3>👍 Yaxshi tomonlaringiz</h3>' + ul(ev.good) + '</div>' : "") +
        (ev.fixes && ev.fixes.length ? '<div class="ai-card"><h3>✏️ Xatolar va to\'g\'risi</h3>' + ev.fixes.map(function (f) { return '<div class="ai-fx"><div class="w">' + esc(f.wrong) + '</div><div class="r">✓ ' + esc(f.right) + '</div><div class="y">' + esc(f.why) + '</div></div>'; }).join("") + '</div>' : "") +
        (ev.tips && ev.tips.length ? '<div class="ai-card"><h3>🎯 Maslahatlar</h3>' + ul(ev.tips) + '</div>' : "") +
        (ev.phrases && ev.phrases.length ? '<div class="ai-card"><h3>💬 Foydali iboralar</h3>' + ul(ev.phrases) + '</div>' : "") +
        '<button class="ai-btn" id="aiag">🔁 Shu mavzuni qayta</button><button class="ai-btn alt" id="aih">Boshqa mavzu</button>';
      var t = S.topic;
      root.querySelector("#aiag").onclick = function () { begin(t); };
      root.querySelector("#aih").onclick = home;
      window.scrollTo(0, 0);
    }

    home();
  }

  function unmount() {
    try { if (prCleanup) prCleanup(); } catch (e) {}
    try { stopPlay(); } catch (e) {}
    try { if (Rec.on) Rec.stop(); } catch (e) {}
    var b = document.getElementById("ai-bar"); if (b) b.remove();
  }

  window.AISprech = { mount: mount, unmount: unmount };
  window.__aiB1Loaded = true;
})();
