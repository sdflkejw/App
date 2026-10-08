'use strict';
/*
 * Kursinhalt. Platzhalter (siehe widgets.js):
 *  <div class="w-staff" data-n="C4 E4 G4" data-labels="1" data-play="melody|chord|arp|rhythm|none" data-cap="…">
 *  <div class="w-piano" data-from="C4" data-to="B5" data-hl="C4 E4" data-labels="c|white|all|none">
 *  <span class="w-play" data-n="C4+E4+G4 F4+A4+C5" data-mode="prog">Text</span>
 * Notennamen in data-Attributen sind englisch (B = H, Bb = B), Oktave wissenschaftlich (C4 = c').
 */
const Course = {
  chapters: [
    // ================================================================ 1
    {
      id: 'grundlagen', icon: '🎹', title: 'Grundlagen',
      desc: 'Notennamen, Klaviatur, Notensystem, Schlüssel und Vorzeichen.',
      lessons: [
        {
          id: 'toene', title: 'Töne und Notennamen',
          html: `
<p>Musik besteht aus <b>Tönen</b>. Jeder Ton hat eine <b>Tonhöhe</b>, die physikalisch durch die Schwingungsfrequenz bestimmt ist: Je schneller etwas schwingt, desto höher klingt der Ton. Der Stimmton für Orchester, das <b>eingestrichene a (a')</b>, schwingt 440-mal pro Sekunde (440 Hz).</p>

<h2>Die sieben Stammtöne</h2>
<p>Im deutschsprachigen Raum heißen die sieben Grundtöne – die <b>Stammtöne</b> –</p>
<p style="font-size:1.4rem;font-weight:700;letter-spacing:.3em">C D E F G A H</p>
<p>Auf dem Klavier sind das die <b>weißen Tasten</b>. Nach dem H beginnt die Reihe wieder mit C – nur eben höher.</p>
<div class="w-piano" data-from="C4" data-to="B4" data-labels="white" data-hl="C4 D4 E4 F4 G4 A4 B4" data-cap="Die sieben Stammtöne auf der Klaviatur. Klicke auf die Tasten, um sie zu hören!"></div>

<h2>Orientierung auf der Klaviatur</h2>
<p>Die schwarzen Tasten sind abwechselnd in <b>Zweier- und Dreiergruppen</b> angeordnet. Daran orientiert man sich:</p>
<ul>
  <li>Das <b>C</b> liegt immer direkt <b>links von zwei schwarzen Tasten</b>.</li>
  <li>Das <b>F</b> liegt immer direkt <b>links von drei schwarzen Tasten</b>.</li>
  <li>Zwischen <b>E und F</b> sowie zwischen <b>H und C</b> gibt es keine schwarze Taste.</li>
</ul>
<div class="w-piano" data-from="C3" data-to="B5" data-labels="white" data-hl="C3 C4 C5" data-hl2="F3 F4 F5" data-cap="Alle C (lila) und alle F (gelb) – sie wiederholen sich in jeder Oktave."></div>

<h2>Die Oktave</h2>
<p>Der Abstand von einem C zum nächsthöheren C heißt <b>Oktave</b> (lat. <i>octava</i> = die Achte, weil es der achte Ton ist). Zwei Töne im Oktavabstand klingen so ähnlich, dass sie denselben Namen bekommen – der höhere schwingt genau doppelt so schnell.</p>
<p><span class="w-play" data-n="C4 C5">c' und c''</span> <span class="w-play" data-n="A3 A4 A5">a, a' und a''</span></p>

<h3>Oktavbezeichnungen</h3>
<p>Damit man weiß, <i>welches</i> C gemeint ist, unterscheidet man die Oktavlagen. In Deutschland ist die Helmholtz-Schreibweise üblich, international die wissenschaftliche mit Zahlen:</p>
<div class="table-wrap"><table>
  <tr><th>Oktave</th><th>Schreibweise</th><th>International</th></tr>
  <tr><td>Kontra-Oktave</td><td>C, D, … H,</td><td>C1 – B1</td></tr>
  <tr><td>Große Oktave</td><td>C D … H</td><td>C2 – B2</td></tr>
  <tr><td>Kleine Oktave</td><td>c d … h</td><td>C3 – B3</td></tr>
  <tr><td>Eingestrichene Oktave</td><td>c' d' … h'</td><td>C4 – B4</td></tr>
  <tr><td>Zweigestrichene Oktave</td><td>c'' d'' … h''</td><td>C5 – B5</td></tr>
  <tr><td>Dreigestrichene Oktave</td><td>c''' …</td><td>C6 – B6</td></tr>
</table></div>
<p>Das <b>c'</b> („eingestrichenes c", international C4) heißt auch <b>mittleres C</b>, weil es ungefähr in der Mitte der Klaviatur liegt.</p>
<div class="w-piano" data-from="C2" data-to="C6" data-labels="c" data-small="1" data-cap="Die C-Tasten mit Oktavbezeichnung."></div>

<div class="warn-box">Im Englischen heißt unser <b>H</b> „<b>B</b>". Unser deutsches <b>B</b> (die schwarze Taste links vom H) heißt im Englischen „B♭" (B flat). Bei englischen Noten, Akkordsymbolen und Apps also aufpassen!</div>

<div class="tip">Stammtöne: C D E F G A H. Das C liegt links von zwei schwarzen Tasten. Nach sieben Stammtönen ist eine Oktave erreicht.</div>
`,
        },
        {
          id: 'notensystem', title: 'Notensystem und Schlüssel',
          html: `
<p>Töne werden in einem <b>Notensystem</b> (Notenzeile) aus <b>fünf Linien</b> und <b>vier Zwischenräumen</b> aufgeschrieben. Gezählt wird immer <b>von unten nach oben</b>.</p>
<p>Je höher eine Note im System steht, desto höher klingt sie. Jeder Schritt von einer Linie zum nächsten Zwischenraum (oder umgekehrt) ist der nächste Stammton.</p>
<div class="w-staff" data-n="C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5" data-labels="1" data-cap="Die C-Dur-Tonleiter aufwärts im Violinschlüssel."></div>

<h2>Hilfslinien</h2>
<p>Für Töne, die über oder unter das System hinausgehen, zeichnet man kurze <b>Hilfslinien</b>. Das c' (mittleres C) steht im Violinschlüssel auf der ersten Hilfslinie unter dem System.</p>
<div class="w-staff" data-n="A3 B3 C4 D4 G5 A5 B5 C6" data-labels="1"></div>

<h2>Der Violinschlüssel (G-Schlüssel)</h2>
<p>Erst der <b>Notenschlüssel</b> am Anfang der Zeile legt fest, welcher Ton auf welcher Linie steht. Der Violinschlüssel ist aus einem verschnörkelten G entstanden: Seine Spirale umkreist die <b>2. Linie</b> – dort steht das <b>g'</b>. Er wird für hohe Instrumente verwendet (Violine, Flöte, Trompete, rechte Hand am Klavier, Gesang).</p>
<div class="w-staff" data-n="E4 G4 B4 D5 F5" data-labels="1" data-cap="Die Linien im Violinschlüssel: E – G – H – D – F. Eselsbrücke: „<b>E</b>s <b>G</b>eht <b>H</b>urtig <b>D</b>urch <b>F</b>elder“."></div>
<div class="w-staff" data-n="F4 A4 C5 E5" data-labels="1" data-cap="Die Zwischenräume ergeben von unten gelesen F – A – C – E (englisch <i>face</i> = Gesicht)."></div>

<h2>Der Bassschlüssel (F-Schlüssel)</h2>
<p>Der Bassschlüssel ist aus einem F entstanden. Seine beiden Punkte umschließen die <b>4. Linie</b> – dort steht das <b>kleine f</b>. Er wird für tiefe Instrumente verwendet (Cello, Kontrabass, Fagott, Posaune, linke Hand am Klavier).</p>
<div class="w-staff" data-clef="bass" data-n="G2 B2 D3 F3 A3" data-labels="1" data-cap="Linien im Bassschlüssel: G – H – D – F – A. Eselsbrücke: „<b>G</b>roße <b>H</b>unde <b>D</b>ürfen <b>F</b>ast <b>A</b>lles“."></div>
<div class="w-staff" data-clef="bass" data-n="A2 C3 E3 G3" data-labels="1" data-cap="Zwischenräume im Bassschlüssel: A – C – E – G. Eselsbrücke: „<b>A</b>lle <b>C</b>lowns <b>E</b>ssen <b>G</b>ern“."></div>

<h2>Das mittlere C in beiden Schlüsseln</h2>
<p>Das c' liegt genau zwischen den beiden Schlüsseln: im Violinschlüssel auf der ersten Hilfslinie <i>unten</i>, im Bassschlüssel auf der ersten Hilfslinie <i>oben</i>. Beim Klavier werden beide Systeme zum <b>Klaviersystem</b> (Akkolade) verbunden.</p>
<div class="w-staff" data-n="C4" data-labels="c' (Violinschlüssel)" data-spacing="110"></div>
<div class="w-staff" data-clef="bass" data-n="C4" data-labels="c' (Bassschlüssel)" data-spacing="110"></div>

<h2>Der Bratschenschlüssel (C-Schlüssel)</h2>
<p>Der Alt- oder Bratschenschlüssel markiert mit seiner Mitte die <b>3. Linie als c'</b>. Er wird vor allem für die Bratsche (Viola) verwendet.</p>
<div class="w-staff" data-clef="alto" data-n="C3 E3 G3 C4 E4 G4" data-labels="1"></div>

<div class="tip">Orientierungsnoten helfen beim schnellen Lesen: <b>g'</b> auf der 2. Linie (Violinschlüssel), <b>f</b> auf der 4. Linie (Bassschlüssel) und <b>c'</b> auf der Hilfslinie dazwischen. Von dort aus zählst du Schritt für Schritt weiter.</div>
`,
        },
        {
          id: 'vorzeichen', title: 'Halbtöne, Ganztöne und Vorzeichen',
          html: `
<h2>Halbton und Ganzton</h2>
<p>Der kleinste Tonabstand in unserer Musik ist der <b>Halbton</b>. Auf dem Klavier ist das der Abstand zwischen zwei direkt benachbarten Tasten (egal ob weiß oder schwarz). Zwei Halbtöne ergeben einen <b>Ganzton</b>.</p>
<div class="w-piano" data-from="C4" data-to="B4" data-labels="white" data-hl="E4 F4" data-hl2="B4" data-cap="E–F ist ein Halbton (keine schwarze Taste dazwischen). Ebenso H–C."></div>
<p>Zwischen den Stammtönen liegen also meist Ganztöne – nur <b>E–F</b> und <b>H–C</b> sind natürliche Halbtonschritte.</p>
<p><span class="w-play" data-n="E4 F4">Halbton E–F</span> <span class="w-play" data-n="C4 D4">Ganzton C–D</span></p>

<h2>Versetzungszeichen</h2>
<p>Um die schwarzen Tasten (und andere Töne zwischen den Stammtönen) zu notieren, braucht man <b>Versetzungszeichen</b>. Sie stehen <i>vor</i> der Note.</p>
<div class="table-wrap"><table>
  <tr><th>Zeichen</th><th>Name</th><th>Wirkung</th><th>Silbe</th><th>Beispiele</th></tr>
  <tr><td>♯</td><td>Kreuz</td><td>erhöht um einen Halbton</td><td>-is</td><td>Cis, Dis, Fis, Gis, Ais</td></tr>
  <tr><td>♭</td><td>B (Be)</td><td>erniedrigt um einen Halbton</td><td>-es</td><td>Des, Es, Ges, As, B</td></tr>
  <tr><td>♮</td><td>Auflösungszeichen</td><td>hebt ♯ oder ♭ wieder auf</td><td>–</td><td>C, D, E …</td></tr>
  <tr><td>𝄪</td><td>Doppelkreuz</td><td>erhöht um zwei Halbtöne</td><td>-isis</td><td>Cisis, Fisis</td></tr>
  <tr><td>𝄫</td><td>Doppel-B</td><td>erniedrigt um zwei Halbtöne</td><td>-eses</td><td>Deses, Heses</td></tr>
</table></div>
<div class="w-staff" data-n="C#4 D#4 F#4 G#4 A#4" data-labels="1" data-cap="Erhöhte Töne mit ♯"></div>
<div class="w-staff" data-n="Db4 Eb4 Gb4 Ab4 Bb4" data-labels="1" data-cap="Erniedrigte Töne mit ♭"></div>

<div class="warn-box">Ausnahmen bei den B-Namen: Es heißt nicht „Ees", sondern <b>Es</b>; aus A wird <b>As</b> (nicht „Aes"), und das erniedrigte H heißt einfach <b>B</b>. Doppelt erniedrigt: Eses, Ases, <b>Heses</b>.</div>

<h2>Enharmonische Verwechslung</h2>
<p>Jede schwarze Taste hat (mindestens) zwei Namen: Cis und Des sind auf dem Klavier dieselbe Taste. Töne, die gleich klingen, aber verschieden geschrieben werden, nennt man <b>enharmonisch gleich</b>. Welcher Name richtig ist, hängt vom musikalischen Zusammenhang (Tonart, Tonleiter, Akkord) ab.</p>
<div class="w-piano" data-from="C4" data-to="B4" data-labels="all" data-play="none" data-cap="Jede schwarze Taste hat einen ♯- und einen ♭-Namen."></div>
<p>Auch weiße Tasten können andere Namen haben: <b>Eis = F</b>, <b>His = C</b>, <b>Fes = E</b>, <b>Ces = H</b>.</p>
<div class="w-staff" data-n="C#4 Db4 E#4 F4 Cb5 B4" data-labels="1" data-cap="Enharmonische Paare: Cis/Des, Eis/F, Ces/H"></div>

<h2>Wie lange gilt ein Versetzungszeichen?</h2>
<ul>
  <li>Ein Versetzungszeichen vor einer Note gilt <b>bis zum Ende des Taktes</b> – für alle Noten auf derselben Linie bzw. im selben Zwischenraum.</li>
  <li>Mit dem nächsten Taktstrich verfällt es (außer bei einem Haltebogen über den Taktstrich).</li>
  <li><b>Generalvorzeichen</b> am Anfang jeder Zeile gelten dagegen für das ganze Stück und in allen Oktaven (dazu mehr im Kapitel „Tonarten").</li>
</ul>

<div class="tip">♯ = Kreuz = „-is" (höher), ♭ = B = „-es" (tiefer). Halbtonschritte zwischen Stammtönen gibt es nur bei E–F und H–C.</div>
`,
        },
      ],
      exercises: ['tasten', 'noten-violin', 'noten-bass', 'note-finden', 'halbton-ganzton', 'enharmonik'],
    },

    // ================================================================ 2
    {
      id: 'rhythmus', icon: '🥁', title: 'Rhythmus und Takt',
      desc: 'Notenwerte, Pausen, Punktierung, Taktarten, Tempo und Dynamik.',
      lessons: [
        {
          id: 'notenwerte', title: 'Notenwerte und Pausen',
          html: `
<p>Neben der Tonhöhe hat jeder Ton eine <b>Dauer</b>. Die Form einer Note – ob der Notenkopf hohl oder gefüllt ist, ob sie einen Hals und Fähnchen hat – bestimmt ihre Länge, den <b>Notenwert</b>.</p>

<h2>Die Notenwerte</h2>
<p>Jeder Notenwert ist genau halb so lang wie der vorige:</p>
<div class="w-staff" data-time="4/4" data-n="B4:w | B4:h B4:h | B4:q B4:q B4:q B4:q | B4:8 B4:8 B4:8 B4:8 B4:8 B4:8 B4:8 B4:8 ||" data-bpm="70" data-spacing="34" data-cap="Ganze – Halbe – Viertel – Achtel: Jeder Takt dauert gleich lang."></div>
<div class="table-wrap"><table>
  <tr><th>Notenwert</th><th>Aussehen</th><th>Dauer in Viertelschlägen</th></tr>
  <tr><td>Ganze Note</td><td>hohler Kopf, kein Hals</td><td>4</td></tr>
  <tr><td>Halbe Note</td><td>hohler Kopf mit Hals</td><td>2</td></tr>
  <tr><td>Viertelnote</td><td>gefüllter Kopf mit Hals</td><td>1</td></tr>
  <tr><td>Achtelnote</td><td>wie Viertel + 1 Fähnchen</td><td>½</td></tr>
  <tr><td>Sechzehntelnote</td><td>wie Viertel + 2 Fähnchen</td><td>¼</td></tr>
</table></div>
<p>Es gilt also: 1 Ganze = 2 Halbe = 4 Viertel = 8 Achtel = 16 Sechzehntel.</p>
<p>Mehrere Achtel- oder Sechzehntelnoten werden oft durch <b>Balken</b> statt Fähnchen verbunden – das macht das Notenbild übersichtlicher. Die Dauer ändert sich dadurch nicht.</p>

<h3>Notenhälse</h3>
<p>Noten <b>unterhalb der Mittellinie</b> bekommen einen Hals nach <b>oben</b> (rechts am Kopf), Noten <b>ab der Mittellinie</b> einen Hals nach <b>unten</b> (links am Kopf).</p>
<div class="w-staff" data-n="E4:q G4:q B4:q D5:q F5:q" data-labels="1" data-play="melody"></div>

<h2>Pausen</h2>
<p>Auch Stille wird genau notiert. Zu jedem Notenwert gibt es eine gleich lange <b>Pause</b>:</p>
<div class="w-staff" data-n="r:w r:h r:q r:8 r:16" data-labels="Ganze,Halbe,Viertel,Achtel,Sechzehntel" data-play="none" data-spacing="60"></div>
<div class="tip">Die <b>Ganze Pause hängt</b> unter der 4. Linie (sie ist „schwer"), die <b>Halbe Pause sitzt</b> auf der 3. Linie (wie ein Hut).</div>

<h2>Rhythmus hören</h2>
<p>Ein <b>Rhythmus</b> ist eine Folge von Tondauern. Höre dir die Beispiele an und klatsche mit:</p>
<div class="w-staff" data-time="4/4" data-n="G4:q G4:q G4:h | G4:8 G4:8 G4:q G4:h | G4:q r:q G4:q r:q | G4:w ||" data-bpm="90" data-spacing="36"></div>
<div class="w-staff" data-time="4/4" data-n="C5:8 C5:8 C5:16 C5:16 C5:16 C5:16 C5:q C5:q | C5:16 C5:16 C5:8 C5:q C5:h ||" data-bpm="80" data-spacing="30"></div>
`,
        },
        {
          id: 'punktierung', title: 'Punktierung, Haltebogen und Triolen',
          html: `
<h2>Der Punkt</h2>
<p>Ein <b>Punkt</b> rechts neben dem Notenkopf <b>verlängert die Note um die Hälfte ihres Wertes</b>.</p>
<div class="table-wrap"><table>
  <tr><th>Notenwert</th><th>Rechnung</th><th>Dauer in Vierteln</th></tr>
  <tr><td>Punktierte Halbe</td><td>2 + 1</td><td>3</td></tr>
  <tr><td>Punktierte Viertel</td><td>1 + ½</td><td>1½</td></tr>
  <tr><td>Punktierte Achtel</td><td>½ + ¼</td><td>¾</td></tr>
</table></div>
<div class="w-staff" data-time="3/4" data-n="A4:h. | A4:q. A4:8 A4:q | A4:8. A4:16 A4:8. A4:16 A4:q | A4:h. ||" data-bpm="90" data-spacing="34" data-cap="Punktierte Halbe füllt einen ganzen 3/4-Takt. „Punktierte Achtel + Sechzehntel“ ergibt den typischen hüpfenden Rhythmus."></div>
<p>Ein <b>Doppelpunkt</b> verlängert um die Hälfte <i>und</i> ein Viertel des Wertes: eine doppelt punktierte Halbe dauert 2 + 1 + ½ = 3½ Viertel.</p>

<h2>Der Haltebogen</h2>
<p>Ein <b>Haltebogen</b> verbindet zwei Noten <b>gleicher Tonhöhe</b>. Die zweite Note wird nicht neu angeschlagen, sondern ihre Dauer zur ersten addiert. So kann man Töne über einen Taktstrich hinweg verlängern oder Dauern notieren, für die es keinen einzelnen Notenwert gibt (z. B. 5 Viertel).</p>
<div class="warn-box">Nicht verwechseln: Ein <b>Bindebogen</b> (Legatobogen) verbindet Noten <i>verschiedener</i> Tonhöhe und bedeutet „gebunden spielen".</div>

<h2>Triolen</h2>
<p>Eine <b>Triole</b> teilt einen Notenwert in <b>drei gleiche Teile statt in zwei</b>. Sie wird mit einer kleinen „3" über oder unter den Noten gekennzeichnet. Eine Achteltriole dauert also so lange wie zwei normale Achtel (= eine Viertel).</p>
<p><span class="w-play" data-n="C5 C5 C5 C5" data-gap="0.5">Zwei Achtelpaare</span> <span class="w-play" data-n="C5 C5 C5 C5 C5 C5" data-gap="0.333">Zwei Achteltriolen</span></p>

<h2>Synkopen</h2>
<p>Eine <b>Synkope</b> entsteht, wenn ein Ton auf einer unbetonten Zählzeit beginnt und über die nächste betonte Zählzeit hinweg klingt. Die Betonung „verschiebt" sich – typisch für Pop, Jazz und lateinamerikanische Musik.</p>
<div class="w-staff" data-time="4/4" data-n="E5:8 E5:q E5:8 E5:q E5:q | E5:8 E5:q E5:q E5:q E5:8 ||" data-bpm="100" data-spacing="34" data-cap="Synkopen: die Viertelnoten beginnen „zwischen“ den Schlägen."></div>
`,
        },
        {
          id: 'takt', title: 'Takt und Taktarten',
          html: `
<h2>Grundschlag und Takt</h2>
<p>Den gleichmäßigen Puls der Musik, zu dem man mitklatschen kann, nennt man <b>Grundschlag</b> (Beat). Diese Schläge werden in Gruppen zusammengefasst – den <b>Takten</b>. Der erste Schlag jedes Taktes ist meist <b>betont</b> („schwer").</p>
<p>Takte werden durch <b>Taktstriche</b> getrennt; ein Stück endet mit einem <b>Schlussstrich</b> (dünner + dicker Strich).</p>

<h2>Die Taktangabe</h2>
<p>Am Anfang eines Stücks steht die <b>Taktangabe</b> (Taktart) als Bruch:</p>
<ul>
  <li>Die <b>obere Zahl</b> sagt, <b>wie viele</b> Schläge ein Takt hat.</li>
  <li>Die <b>untere Zahl</b> sagt, <b>welcher Notenwert</b> einen Schlag bildet (4 = Viertel, 8 = Achtel, 2 = Halbe).</li>
</ul>

<h3>4/4-Takt</h3>
<p>Der häufigste Takt (auch als 𝄴 geschrieben): vier Viertel pro Takt. Betonung: <b>EINS</b> zwei <b>drei</b> vier.</p>
<div class="w-staff" data-time="4/4" data-n="C5:q G4:q G4:q G4:q | C5:q G4:q G4:q G4:q ||" data-bpm="100"></div>

<h3>3/4-Takt</h3>
<p>Drei Viertel pro Takt: <b>EINS</b> zwei drei. Typisch für den Walzer und das Menuett.</p>
<div class="w-staff" data-time="3/4" data-n="C4:q G4:q G4:q | G3:q G4:q G4:q | C4:q E4:q G4:q | C5:h. ||" data-bpm="140"></div>

<h3>2/4-Takt</h3>
<p>Zwei Viertel pro Takt: <b>EINS</b> zwei. Typisch für Märsche und Polkas.</p>

<h3>6/8-Takt</h3>
<p>Sechs Achtel pro Takt, aber gefühlt in <b>zwei Gruppen zu je drei Achteln</b>: <b>EINS</b> zwei drei <b>VIER</b> fünf sechs. Er wirkt schwingend, wiegend (z. B. bei Wiegenliedern, irischen Jigs).</p>
<div class="w-staff" data-time="6/8" data-n="C5:8 E4:8 E4:8 G4:8 E4:8 E4:8 | C5:8 E4:8 E4:8 G4:8 E4:8 E4:8 ||" data-bpm="90"></div>

<div class="table-wrap"><table>
  <tr><th>Taktart</th><th>Schläge</th><th>Charakter</th><th>Beispiel</th></tr>
  <tr><td>2/4</td><td>2 Viertel</td><td>zweizeitig, gerade</td><td>Marsch, Polka</td></tr>
  <tr><td>3/4</td><td>3 Viertel</td><td>dreizeitig, ungerade</td><td>Walzer</td></tr>
  <tr><td>4/4</td><td>4 Viertel</td><td>vierzeitig, gerade</td><td>Pop, Rock, Choräle</td></tr>
  <tr><td>2/2 (alla breve)</td><td>2 Halbe</td><td>schnell, in Halben gezählt</td><td>Märsche, Musicals</td></tr>
  <tr><td>6/8</td><td>2 × 3 Achtel</td><td>zusammengesetzt, schwingend</td><td>Jig, Barkarole</td></tr>
  <tr><td>12/8</td><td>4 × 3 Achtel</td><td>zusammengesetzt</td><td>Blues-Balladen</td></tr>
</table></div>
<p><b>Einfache Taktarten</b> (2/4, 3/4, 4/4) teilen jeden Schlag in zwei; <b>zusammengesetzte Taktarten</b> (6/8, 9/8, 12/8) teilen jeden Schlag in drei.</p>

<h2>Der Auftakt</h2>
<p>Viele Lieder beginnen nicht auf der Eins, sondern mit einem unvollständigen Takt – dem <b>Auftakt</b>. Der letzte Takt des Stücks ist dann meist um genau diese Dauer verkürzt. Beispiel: „Happy Birthday" beginnt mit einem Auftakt im 3/4-Takt.</p>
<div class="w-staff" data-time="3/4" data-n="G4:8. G4:16 | A4:q G4:q C5:q | B4:h ||" data-bpm="100" data-cap="„Happy Birthday“: Auftakt aus punktierter Achtel und Sechzehntel."></div>

<div class="tip">Taktangabe: oben = Anzahl der Schläge, unten = Notenwert eines Schlags. Alle Noten und Pausen eines Taktes müssen zusammen genau diese Dauer ergeben.</div>
`,
        },
        {
          id: 'tempo-dynamik', title: 'Tempo, Dynamik und Artikulation',
          html: `
<h2>Tempo</h2>
<p>Das <b>Tempo</b> gibt an, wie schnell der Grundschlag ist. Genau angegeben wird es in <b>Schlägen pro Minute</b> (BPM, z. B. ♩ = 120). Traditionell verwendet man italienische Begriffe:</p>
<div class="table-wrap"><table>
  <tr><th>Bezeichnung</th><th>Bedeutung</th><th>ca. BPM</th></tr>
  <tr><td>Grave</td><td>schwer, sehr langsam</td><td>25–45</td></tr>
  <tr><td>Largo</td><td>breit, sehr langsam</td><td>40–60</td></tr>
  <tr><td>Adagio</td><td>langsam, ruhig</td><td>55–75</td></tr>
  <tr><td>Andante</td><td>gehend</td><td>75–105</td></tr>
  <tr><td>Moderato</td><td>mäßig bewegt</td><td>100–120</td></tr>
  <tr><td>Allegro</td><td>schnell, heiter</td><td>120–155</td></tr>
  <tr><td>Vivace</td><td>lebhaft</td><td>155–175</td></tr>
  <tr><td>Presto</td><td>sehr schnell</td><td>170–200</td></tr>
</table></div>
<p>Tempoveränderungen: <b>accelerando</b> (accel., schneller werdend), <b>ritardando</b> / <b>rallentando</b> (rit., rall., langsamer werdend), <b>a tempo</b> (wieder im ursprünglichen Tempo). Eine <b>Fermate</b> (𝄐) über einer Note bedeutet: beliebig lange aushalten.</p>
<p>Probiere verschiedene Tempi im <a href="#/werkzeug/metronom">Metronom</a> aus.</p>

<h2>Dynamik (Lautstärke)</h2>
<div class="table-wrap"><table>
  <tr><th>Zeichen</th><th>Name</th><th>Bedeutung</th></tr>
  <tr><td><b><i>pp</i></b></td><td>pianissimo</td><td>sehr leise</td></tr>
  <tr><td><b><i>p</i></b></td><td>piano</td><td>leise</td></tr>
  <tr><td><b><i>mp</i></b></td><td>mezzopiano</td><td>mittelleise</td></tr>
  <tr><td><b><i>mf</i></b></td><td>mezzoforte</td><td>mittellaut</td></tr>
  <tr><td><b><i>f</i></b></td><td>forte</td><td>laut</td></tr>
  <tr><td><b><i>ff</i></b></td><td>fortissimo</td><td>sehr laut</td></tr>
  <tr><td><b><i>cresc.</i></b> / 𝆒</td><td>crescendo</td><td>lauter werdend</td></tr>
  <tr><td><b><i>decresc.</i></b> / <b><i>dim.</i></b> / 𝆓</td><td>decrescendo / diminuendo</td><td>leiser werdend</td></tr>
  <tr><td><b><i>sfz</i></b></td><td>sforzato</td><td>plötzlich stark betont</td></tr>
  <tr><td><b><i>fp</i></b></td><td>fortepiano</td><td>laut, sofort danach leise</td></tr>
</table></div>

<h2>Artikulation</h2>
<p>Die <b>Artikulation</b> beschreibt, wie Töne verbunden oder getrennt werden:</p>
<div class="table-wrap"><table>
  <tr><th>Bezeichnung</th><th>Zeichen</th><th>Bedeutung</th></tr>
  <tr><td>Legato</td><td>Bogen über den Noten</td><td>gebunden, ohne Lücke</td></tr>
  <tr><td>Staccato</td><td>Punkt über/unter dem Notenkopf</td><td>kurz, abgestoßen</td></tr>
  <tr><td>Tenuto</td><td>Strich über/unter dem Kopf</td><td>voll ausgehalten, leicht betont</td></tr>
  <tr><td>Akzent</td><td>&gt;</td><td>betont</td></tr>
  <tr><td>Marcato</td><td>^</td><td>stark betont, markiert</td></tr>
  <tr><td>Portato</td><td>Punkte unter Bogen</td><td>leicht getrennt, aber getragen</td></tr>
</table></div>

<h2>Wiederholungen &amp; Sprünge</h2>
<ul>
  <li><b>Wiederholungszeichen</b> (𝄆 … 𝄇): Der eingeschlossene Teil wird wiederholt.</li>
  <li><b>1. und 2. Klammer</b> (Volta): Beim ersten Durchgang die 1. Klammer, bei der Wiederholung die 2. spielen.</li>
  <li><b>D.C. al Fine</b> (Da capo): von vorne bis zum Wort <i>Fine</i>.</li>
  <li><b>D.S. al Fine</b> (Dal segno): ab dem Zeichen 𝄋 bis <i>Fine</i>.</li>
  <li><b>Coda</b> (𝄌): Schlussteil, zu dem gesprungen wird.</li>
</ul>
`,
        },
      ],
      exercises: ['notenwerte', 'takt-rechnen', 'fachbegriffe'],
    },

    // ================================================================ 3
    {
      id: 'intervalle', icon: '📏', title: 'Intervalle',
      desc: 'Abstände zwischen Tönen bestimmen, bauen und hören.',
      lessons: [
        {
          id: 'intervall-grundlagen', title: 'Was ist ein Intervall?',
          html: `
<p>Ein <b>Intervall</b> ist der <b>Abstand zwischen zwei Tönen</b>. Erklingen die Töne nacheinander, spricht man von einem <b>melodischen</b> Intervall; erklingen sie gleichzeitig, von einem <b>harmonischen</b> Intervall.</p>
<div class="w-staff" data-n="C4 G4 C4+G4" data-labels="melodisch,,harmonisch" data-cap="Quinte c'–g' melodisch und harmonisch"></div>

<h2>Die Intervallnamen</h2>
<p>Intervalle tragen lateinische Ordnungszahlen. Man <b>zählt die Stammtöne</b> vom unteren bis zum oberen Ton – <b>beide Töne mitgezählt</b>!</p>
<p>Beispiel: C → E: <b>C</b>(1) D(2) <b>E</b>(3) → eine <b>Terz</b>.</p>
<div class="w-staff" data-n="C4+C4 C4+D4 C4+E4 C4+F4 C4+G4 C4+A4 C4+B4 C4+C5" data-labels="Prime,Sekunde,Terz,Quarte,Quinte,Sexte,Septime,Oktave" data-play="melody" data-gap="1.1" data-spacing="62" data-also="each"></div>
<div class="table-wrap"><table>
  <tr><th>Zahl</th><th>Name</th><th>lat.</th><th>Beispiel von C</th></tr>
  <tr><td>1</td><td>Prime</td><td>prima – die Erste</td><td>C–C</td></tr>
  <tr><td>2</td><td>Sekunde</td><td>secunda – die Zweite</td><td>C–D</td></tr>
  <tr><td>3</td><td>Terz</td><td>tertia – die Dritte</td><td>C–E</td></tr>
  <tr><td>4</td><td>Quarte</td><td>quarta – die Vierte</td><td>C–F</td></tr>
  <tr><td>5</td><td>Quinte</td><td>quinta – die Fünfte</td><td>C–G</td></tr>
  <tr><td>6</td><td>Sexte</td><td>sexta – die Sechste</td><td>C–A</td></tr>
  <tr><td>7</td><td>Septime</td><td>septima – die Siebte</td><td>C–H</td></tr>
  <tr><td>8</td><td>Oktave</td><td>octava – die Achte</td><td>C–C'</td></tr>
  <tr><td>9</td><td>None</td><td>nona – die Neunte</td><td>C–D'</td></tr>
  <tr><td>10</td><td>Dezime</td><td>decima – die Zehnte</td><td>C–E'</td></tr>
</table></div>
<p>Intervalle über eine Oktave hinaus (None, Dezime, Undezime …) heißen <b>zusammengesetzte Intervalle</b>: Eine None ist eine Oktave plus eine Sekunde.</p>

<h2>Ein Trick für das Notenbild</h2>
<ul>
  <li>Liegen beide Noten auf <b>Linien</b> (oder beide in <b>Zwischenräumen</b>), ist das Intervall <b>ungerade</b>: Terz, Quinte, Septime.</li>
  <li>Liegt eine auf einer Linie und die andere in einem Zwischenraum, ist es <b>gerade</b>: Sekunde, Quarte, Sexte, Oktave.</li>
  <li>Eine Terz: direkt nächste Linie bzw. nächster Zwischenraum. Eine Quinte: übernächste.</li>
</ul>
<div class="w-staff" data-n="E4+G4 G4+B4 F4+A4 E4+B4 F4+C5 E4+D5" data-labels="Terz,Terz,Terz,Quinte,Quinte,Septime" data-play="melody" data-gap="1"></div>

<div class="tip">Die <b>Zahl</b> eines Intervalls hängt nur von den Notennamen ab – nicht von Vorzeichen. C–E, C–Es und Cis–E sind alle <b>Terzen</b>. Wie <i>groß</i> die Terz genau ist, klärt die nächste Lektion.</div>
`,
        },
        {
          id: 'intervall-qualitaet', title: 'Reine, große und kleine Intervalle',
          html: `
<p>C–E und C–Es sind beide Terzen, klingen aber unterschiedlich: C–E umfasst 4 Halbtöne, C–Es nur 3. Darum braucht jedes Intervall neben der Zahl auch eine <b>Qualität</b> (Intervallgeschlecht).</p>
<p><span class="w-play" data-n="C4+E4">C–E (große Terz)</span> <span class="w-play" data-n="C4+Eb4">C–Es (kleine Terz)</span></p>

<h2>Zwei Familien</h2>
<ul>
  <li><b>Reine Intervalle</b>: Prime, Quarte, Quinte, Oktave. Sie kommen (in ihrer Grundform) nur in einer Größe vor.</li>
  <li><b>Große und kleine Intervalle</b>: Sekunde, Terz, Sexte, Septime. Das kleine Intervall ist jeweils einen Halbton kleiner als das große.</li>
</ul>

<h2>Übersicht mit Halbtönen und Merkliedern</h2>
<p>Anfangsintervalle bekannter Melodien helfen, Intervalle zu erkennen und zu singen:</p>
<div class="table-wrap"><table>
  <tr><th>Intervall</th><th>Halbtöne</th><th>von C</th><th>Merklied (Anfang)</th><th></th></tr>
  <tr><td>reine Prime</td><td>0</td><td>C–C</td><td>gleicher Ton</td><td><span class="w-play" data-n="C4 C4">hören</span></td></tr>
  <tr><td>kleine Sekunde</td><td>1</td><td>C–Des</td><td>„Der weiße Hai" (Filmmusik), „Für Elise" (e–dis)</td><td><span class="w-play" data-n="C4 Db4">hören</span></td></tr>
  <tr><td>große Sekunde</td><td>2</td><td>C–D</td><td>„Alle meine Entchen", „Frère Jacques"</td><td><span class="w-play" data-n="C4 D4">hören</span></td></tr>
  <tr><td>kleine Terz</td><td>3</td><td>C–Es</td><td>„Kuckuck, Kuckuck" (abwärts), „Smoke on the Water"</td><td><span class="w-play" data-n="C4 Eb4">hören</span></td></tr>
  <tr><td>große Terz</td><td>4</td><td>C–E</td><td>„Oh When the Saints", „Kumbaya"</td><td><span class="w-play" data-n="C4 E4">hören</span></td></tr>
  <tr><td>reine Quarte</td><td>5</td><td>C–F</td><td>„O Tannenbaum", „Auld Lang Syne"</td><td><span class="w-play" data-n="C4 F4">hören</span></td></tr>
  <tr><td>Tritonus</td><td>6</td><td>C–Fis / C–Ges</td><td>„Maria" (West Side Story), „The Simpsons"</td><td><span class="w-play" data-n="C4 F#4">hören</span></td></tr>
  <tr><td>reine Quinte</td><td>7</td><td>C–G</td><td>„Morgen kommt der Weihnachtsmann", „Star Wars"</td><td><span class="w-play" data-n="C4 G4">hören</span></td></tr>
  <tr><td>kleine Sexte</td><td>8</td><td>C–As</td><td>„The Entertainer" (e–c im Thema)</td><td><span class="w-play" data-n="C4 Ab4">hören</span></td></tr>
  <tr><td>große Sexte</td><td>9</td><td>C–A</td><td>„My Bonnie Is Over the Ocean"</td><td><span class="w-play" data-n="C4 A4">hören</span></td></tr>
  <tr><td>kleine Septime</td><td>10</td><td>C–B</td><td>„Somewhere" (West Side Story), „Star Trek" (Original)</td><td><span class="w-play" data-n="C4 Bb4">hören</span></td></tr>
  <tr><td>große Septime</td><td>11</td><td>C–H</td><td>„Take On Me" (Refrain)</td><td><span class="w-play" data-n="C4 B4">hören</span></td></tr>
  <tr><td>reine Oktave</td><td>12</td><td>C–C'</td><td>„Somewhere Over the Rainbow"</td><td><span class="w-play" data-n="C4 C5">hören</span></td></tr>
</table></div>

<h2>Intervalle bestimmen mit der Dur-Tonleiter</h2>
<p>Ein sehr praktischer Weg: Stell dir die <b>Dur-Tonleiter des unteren Tons</b> vor. Alle Töne dieser Tonleiter bilden mit dem Grundton <b>reine oder große</b> Intervalle.</p>
<div class="w-staff" data-n="D4+D4 D4+E4 D4+F#4 D4+G4 D4+A4 D4+B4 D4+C#5 D4+D5" data-labels="r1,g2,g3,r4,r5,g6,g7,r8" data-play="melody" data-gap="1" data-cap="Über D: Die Töne der D-Dur-Tonleiter ergeben reine (r) und große (g) Intervalle."></div>
<p>Liegt der obere Ton einen Halbton <b>tiefer</b> als der Tonleiterton, ist das Intervall <b>klein</b> (bei Sekunde, Terz, Sexte, Septime). Beispiel: D–F: In D-Dur steht Fis → D–Fis ist eine große Terz → D–F ist eine <b>kleine Terz</b>.</p>

<div class="tip">Reine Intervalle: 1, 4, 5, 8. Große/kleine Intervalle: 2, 3, 6, 7. Die Halbtonzahl entscheidet über die Qualität; der Notenname über die Zahl.</div>
`,
        },
        {
          id: 'intervall-alteriert', title: 'Übermäßig, vermindert und Umkehrung',
          html: `
<h2>Übermäßige und verminderte Intervalle</h2>
<p>Wird ein Intervall über die Grundformen hinaus vergrößert oder verkleinert, spricht man von übermäßigen bzw. verminderten Intervallen:</p>
<ul>
  <li><b>übermäßig</b> = reines oder großes Intervall + 1 Halbton</li>
  <li><b>vermindert</b> = reines oder kleines Intervall − 1 Halbton</li>
</ul>
<div class="table-wrap"><table>
  <tr><th></th><th>vermindert</th><th>klein</th><th>rein / groß</th><th>übermäßig</th></tr>
  <tr><td>Reine Intervalle (1, 4, 5, 8)</td><td>−1</td><td>–</td><td>rein</td><td>+1</td></tr>
  <tr><td>Große/kleine Intervalle (2, 3, 6, 7)</td><td>−2</td><td>−1</td><td>groß</td><td>+1</td></tr>
</table></div>
<div class="w-staff" data-n="C4+F4 C4+F#4 C4+G4 C4+Gb4 C4+G#4" data-labels="r4,ü4,r5,v5,ü5" data-play="melody" data-gap="1" data-spacing="56"></div>

<h2>Der Tritonus</h2>
<p>Die <b>übermäßige Quarte</b> (z. B. F–H) und die <b>verminderte Quinte</b> (z. B. H–F) umfassen beide 6 Halbtöne = drei Ganztöne. Man nennt diesen Klang <b>Tritonus</b>. Er teilt die Oktave genau in der Mitte und klingt stark spannungsgeladen – im Mittelalter galt er als „diabolus in musica".</p>
<p><span class="w-play" data-n="F4+B4">Tritonus F–H</span></p>

<h2>Enharmonische Intervalle</h2>
<p>Gleich klingende Intervalle können unterschiedlich heißen – entscheidend ist die <b>Schreibweise</b>:</p>
<div class="w-staff" data-n="C4+D#4 C4+Eb4 C4+F#4 C4+Gb4 C4+G#4 C4+Ab4" data-labels="ü2,k3,ü4,v5,ü5,k6" data-play="melody" data-gap="1" data-spacing="56" data-cap="Je zwei Intervalle klingen gleich, sind aber unterschiedlich notiert."></div>

<h2>Umkehrung von Intervallen (Komplementärintervalle)</h2>
<p>Legt man den unteren Ton eine Oktave höher (oder den oberen eine Oktave tiefer), entsteht die <b>Umkehrung</b>. Dabei gilt:</p>
<ul>
  <li>Die Zahlen ergänzen sich zu <b>9</b>: Terz ↔ Sexte, Sekunde ↔ Septime, Quarte ↔ Quinte, Prime ↔ Oktave.</li>
  <li><b>groß ↔ klein</b>, <b>übermäßig ↔ vermindert</b>, <b>rein bleibt rein</b>.</li>
  <li>Die Halbtöne ergänzen sich zu 12.</li>
</ul>
<div class="w-staff" data-n="C4+E4 E4+C5 D4+A4 A4+D5 E4+F4 F4+E5" data-labels="gr. 3,kl. 6,r5,r4,kl. 2,gr. 7" data-play="melody" data-gap="1" data-spacing="56"></div>
<p>Das ist praktisch zum Bestimmen großer Intervalle: Eine Septime erkennt man oft schneller über ihre Umkehrung (Sekunde).</p>

<h2>Konsonanz und Dissonanz</h2>
<div class="table-wrap"><table>
  <tr><th>Gruppe</th><th>Intervalle</th><th>Wirkung</th></tr>
  <tr><td>vollkommene Konsonanzen</td><td>reine Prime, Oktave, Quinte</td><td>verschmelzend, leer, sehr stabil</td></tr>
  <tr><td>unvollkommene Konsonanzen</td><td>große und kleine Terz und Sexte</td><td>wohlklingend, voll</td></tr>
  <tr><td>Sonderfall</td><td>reine Quarte</td><td>konsonant, über dem Bass aber spannungsvoll</td></tr>
  <tr><td>Dissonanzen</td><td>Sekunden, Septimen, alle übermäßigen und verminderten Intervalle</td><td>reibend, drängen nach Auflösung</td></tr>
</table></div>
<p><span class="w-play" data-n="C4+G4 C4+E4 C4+D4 C4+B4">Konsonanz → Dissonanz</span></p>

<h2>Schritt für Schritt ein Intervall bestimmen</h2>
<ol>
  <li><b>Zahl</b>: Stammtöne abzählen (Vorzeichen ignorieren).</li>
  <li><b>Referenz</b>: Welche Qualität hätte das Intervall ohne Vorzeichen bzw. in der Dur-Tonleiter des unteren Tons?</li>
  <li><b>Vorzeichen berücksichtigen</b>: Wird das Intervall durch ♯/♭ größer oder kleiner? Entsprechend groß → klein → vermindert bzw. rein → übermäßig anpassen.</li>
  <li><b>Kontrolle</b>: Halbtöne nachzählen.</li>
</ol>
`,
        },
      ],
      exercises: ['intervall-zahl', 'intervall-bestimmen', 'intervall-bauen', 'intervall-hoeren'],
    },

    // ================================================================ 4
    {
      id: 'tonleitern', icon: '🪜', title: 'Tonleitern',
      desc: 'Dur, Moll, Kirchentonarten, Pentatonik und Blues.',
      lessons: [
        {
          id: 'dur', title: 'Die Dur-Tonleiter',
          html: `
<p>Eine <b>Tonleiter</b> (Skala) ist eine geordnete Folge von Tönen innerhalb einer Oktave. Die wichtigsten Tonleitern unserer Musik sind <b>diatonisch</b>: Sie bestehen aus sieben Tönen mit Ganz- und Halbtonschritten, wobei jeder Stammtonname genau einmal vorkommt.</p>

<h2>Der Bauplan</h2>
<p>Jede Dur-Tonleiter folgt demselben Muster aus Ganztönen (GT) und Halbtönen (HT):</p>
<p style="font-size:1.2rem;font-weight:700">GT – GT – <span style="color:var(--bad)">HT</span> – GT – GT – GT – <span style="color:var(--bad)">HT</span></p>
<p>Die Halbtonschritte liegen also zwischen der <b>3. und 4.</b> sowie der <b>7. und 8. Stufe</b>.</p>
<div class="w-staff" data-n="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="1,2,3,4,5,6,7,8" data-colors="-,-,var(--bad),var(--bad),-,-,var(--bad),var(--bad)" data-cap="C-Dur: nur weiße Tasten. Die Halbtonschritte (rot) liegen bei E–F und H–C."></div>
<div class="w-piano" data-from="C4" data-to="C5" data-labels="white" data-hl="C4 D4 E4 F4 G4 A4 B4 C5"></div>

<h3>Zwei gleiche Hälften</h3>
<p>Die Dur-Tonleiter besteht aus zwei gleich gebauten Vierton-Gruppen (<b>Tetrachorden</b>) mit dem Muster GT–GT–HT, verbunden durch einen Ganzton: C D E F | G A H C.</p>

<h2>Dur-Tonleitern auf anderen Grundtönen</h2>
<p>Beginnt man auf einem anderen Ton, braucht man Vorzeichen, um den Bauplan einzuhalten.</p>
<p><b>G-Dur</b>: G A H C D E <b>F?</b> – Zwischen E und F wäre nur ein Halbton, zwischen F und G ein Ganzton. Es muss aber umgekehrt sein: Also wird F zu <b>Fis</b>.</p>
<div class="w-staff" data-n="G4 A4 B4 C5 D5 E5 F#5 G5" data-labels="1" data-cap="G-Dur hat ein Vorzeichen: Fis."></div>
<p><b>F-Dur</b>: F G A <b>H?</b> – Zwischen A und H wäre ein Ganzton, es muss aber ein Halbton sein: H wird zu <b>B</b>.</p>
<div class="w-staff" data-n="F4 G4 A4 Bb4 C5 D5 E5 F5" data-labels="1" data-cap="F-Dur hat ein Vorzeichen: B."></div>
<div class="w-staff" data-n="Eb4 F4 G4 Ab4 Bb4 C5 D5 Eb5" data-labels="1" data-cap="Es-Dur: drei ♭ (B, Es, As)."></div>
<div class="w-staff" data-n="E4 F#4 G#4 A4 B4 C#5 D#5 E5" data-labels="1" data-cap="E-Dur: vier ♯ (Fis, Cis, Gis, Dis)."></div>
<p>Alle Dur-Tonleitern kannst du im <a href="#/werkzeug/tonleitern">Tonleiter-Explorer</a> ausprobieren.</p>

<h2>Die Stufen und ihre Namen</h2>
<div class="table-wrap"><table>
  <tr><th>Stufe</th><th>Name</th><th>in C-Dur</th></tr>
  <tr><td>I</td><td>Tonika (Grundton)</td><td>C</td></tr>
  <tr><td>II</td><td>Supertonika</td><td>D</td></tr>
  <tr><td>III</td><td>Mediante</td><td>E</td></tr>
  <tr><td>IV</td><td>Subdominante</td><td>F</td></tr>
  <tr><td>V</td><td>Dominante</td><td>G</td></tr>
  <tr><td>VI</td><td>Submediante (Tonikaparallele)</td><td>A</td></tr>
  <tr><td>VII</td><td>Leitton</td><td>H</td></tr>
</table></div>
<p>Der <b>Leitton</b> (7. Stufe) liegt nur einen Halbton unter dem Grundton und „strebt" stark dorthin. <span class="w-play" data-n="C4 D4 E4 F4 G4 A4 B4" data-gap="0.4">Tonleiter ohne Schluss</span> – spürst du, wie das C fehlt?</p>

<div class="tip">Dur-Bauplan: GT GT HT GT GT GT HT. Halbtöne zwischen den Stufen 3–4 und 7–8.</div>
`,
        },
        {
          id: 'moll', title: 'Moll-Tonleitern',
          html: `
<p>Neben Dur ist <b>Moll</b> das zweite große <b>Tongeschlecht</b>. Moll klingt im Vergleich zu Dur oft dunkler, weicher oder trauriger – aber das ist nur eine grobe Faustregel.</p>

<h2>Natürliches Moll (Äolisch)</h2>
<p>Spielt man nur die weißen Tasten von A bis A, erhält man <b>a-Moll</b>. Der Bauplan lautet:</p>
<p style="font-size:1.2rem;font-weight:700">GT – <span style="color:var(--bad)">HT</span> – GT – GT – <span style="color:var(--bad)">HT</span> – GT – GT</p>
<div class="w-staff" data-n="A3 B3 C4 D4 E4 F4 G4 A4" data-labels="1,2,3,4,5,6,7,8" data-colors="-,var(--bad),var(--bad),-,var(--bad),var(--bad),-,-" data-cap="a-Moll natürlich: Halbtöne zwischen 2–3 und 5–6."></div>
<p>Verglichen mit Dur auf demselben Grundton hat natürliches Moll eine <b>kleine Terz</b>, eine <b>kleine Sexte</b> und eine <b>kleine Septime</b>:</p>
<div class="w-staff" data-n="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="1" data-cap="C-Dur"></div>
<div class="w-staff" data-n="C4 D4 Eb4 F4 G4 Ab4 Bb4 C5" data-labels="1" data-colors="-,-,var(--accent),-,-,var(--accent),var(--accent),-" data-cap="c-Moll (natürlich): 3., 6. und 7. Stufe sind erniedrigt."></div>

<h2>Harmonisches Moll</h2>
<p>Im natürlichen Moll fehlt der <b>Leitton</b> – die 7. Stufe liegt einen Ganzton unter dem Grundton. Für eine starke Schlusswirkung wird sie deshalb um einen Halbton <b>erhöht</b>. So entsteht <b>harmonisches Moll</b>.</p>
<div class="w-staff" data-n="A3 B3 C4 D4 E4 F4 G#4 A4" data-labels="1" data-colors="-,-,-,-,-,-,var(--accent),-" data-cap="a-Moll harmonisch: G wird zu Gis. Zwischen F und Gis entsteht eine übermäßige Sekunde (3 Halbtöne) – der typische „orientalische“ Klang."></div>

<h2>Melodisches Moll</h2>
<p>Um den großen Sprung F–Gis in Melodien zu vermeiden, wird <b>aufwärts</b> zusätzlich die 6. Stufe erhöht. <b>Abwärts</b> verwendet man in der klassischen Musik wieder natürliches Moll.</p>
<div class="w-staff" data-n="A3 B3 C4 D4 E4 F#4 G#4 A4 G4 F4 E4 D4 C4 B3 A3" data-labels="1" data-spacing="38" data-cap="a-Moll melodisch: aufwärts Fis und Gis, abwärts G und F."></div>
<p>Im Jazz wird melodisch Moll auch abwärts mit erhöhter 6. und 7. Stufe gespielt („Jazz-Moll").</p>

<div class="table-wrap"><table>
  <tr><th>Moll-Art</th><th>Stufen (verglichen mit Dur)</th><th>a-Moll</th></tr>
  <tr><td>natürlich</td><td>1 2 ♭3 4 5 ♭6 ♭7</td><td>A H C D E F G</td></tr>
  <tr><td>harmonisch</td><td>1 2 ♭3 4 5 ♭6 7</td><td>A H C D E F Gis</td></tr>
  <tr><td>melodisch (aufwärts)</td><td>1 2 ♭3 4 5 6 7</td><td>A H C D E Fis Gis</td></tr>
</table></div>
<p><span class="w-play" data-n="A3 B3 C4 D4 E4 F4 G4 A4" data-gap="0.35">natürlich</span> <span class="w-play" data-n="A3 B3 C4 D4 E4 F4 G#4 A4" data-gap="0.35">harmonisch</span> <span class="w-play" data-n="A3 B3 C4 D4 E4 F#4 G#4 A4" data-gap="0.35">melodisch</span></p>

<div class="tip">Moll-Tonarten schreibt man im Deutschen mit <b>kleinem</b> Anfangsbuchstaben: a-Moll, fis-Moll, es-Moll. Dur-Tonarten mit großem: A-Dur, Fis-Dur, Es-Dur.</div>
`,
        },
        {
          id: 'modi', title: 'Kirchentonarten (Modi)',
          html: `
<p>Beginnt man die Tonleiter auf den weißen Tasten nicht bei C oder A, sondern auf einem anderen Ton, entstehen weitere Tonleitern mit eigenem Charakter: die <b>Kirchentonarten</b> oder <b>Modi</b>. Sie stammen aus der mittelalterlichen Kirchenmusik und sind heute in Jazz, Rock, Folk und Filmmusik sehr beliebt.</p>
<div class="table-wrap"><table>
  <tr><th>Modus</th><th>weiße Tasten</th><th>Vergleich</th><th>Charakter / Beispiele</th></tr>
  <tr><td>Ionisch</td><td>C–C</td><td>= Dur</td><td>hell, stabil</td></tr>
  <tr><td>Dorisch</td><td>D–D</td><td>Moll mit <b>großer Sexte</b></td><td>Moll, aber hoffnungsvoll – „Scarborough Fair", „Oye Como Va", Jazz („So What")</td></tr>
  <tr><td>Phrygisch</td><td>E–E</td><td>Moll mit <b>kleiner Sekunde</b></td><td>dunkel, spanisch – Flamenco, Metal</td></tr>
  <tr><td>Lydisch</td><td>F–F</td><td>Dur mit <b>übermäßiger Quarte</b></td><td>schwebend, träumerisch – Filmmusik, „The Simpsons"-Thema</td></tr>
  <tr><td>Mixolydisch</td><td>G–G</td><td>Dur mit <b>kleiner Septime</b></td><td>rockig, bluesig – „Sweet Home Alabama", „Norwegian Wood"</td></tr>
  <tr><td>Äolisch</td><td>A–A</td><td>= natürliches Moll</td><td>traurig, ernst</td></tr>
  <tr><td>Lokrisch</td><td>H–H</td><td>Moll mit kl. Sekunde und <b>verminderter Quinte</b></td><td>instabil, selten als Grundtonart</td></tr>
</table></div>

<h2>Alle Modi auf C</h2>
<p>Am besten hört man die Unterschiede, wenn alle Modi denselben Grundton haben. Die charakteristischen Töne sind farbig markiert:</p>
<div class="w-staff" data-n="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="1" data-cap="C-Ionisch (= C-Dur)"></div>
<div class="w-staff" data-n="C4 D4 Eb4 F4 G4 A4 Bb4 C5" data-labels="1" data-colors="-,-,-,-,-,var(--accent),-,-" data-cap="C-Dorisch: wie c-Moll, aber mit großer Sexte (A)"></div>
<div class="w-staff" data-n="C4 Db4 Eb4 F4 G4 Ab4 Bb4 C5" data-labels="1" data-colors="-,var(--accent),-,-,-,-,-,-" data-cap="C-Phrygisch: wie c-Moll, aber mit kleiner Sekunde (Des)"></div>
<div class="w-staff" data-n="C4 D4 E4 F#4 G4 A4 B4 C5" data-labels="1" data-colors="-,-,-,var(--accent),-,-,-,-" data-cap="C-Lydisch: wie C-Dur, aber mit übermäßiger Quarte (Fis)"></div>
<div class="w-staff" data-n="C4 D4 E4 F4 G4 A4 Bb4 C5" data-labels="1" data-colors="-,-,-,-,-,-,var(--accent),-" data-cap="C-Mixolydisch: wie C-Dur, aber mit kleiner Septime (B)"></div>
<div class="w-staff" data-n="C4 D4 Eb4 F4 G4 Ab4 Bb4 C5" data-labels="1" data-cap="C-Äolisch (= c-Moll natürlich)"></div>
<div class="w-staff" data-n="C4 Db4 Eb4 F4 Gb4 Ab4 Bb4 C5" data-labels="1" data-colors="-,var(--accent),-,-,var(--accent),-,-,-" data-cap="C-Lokrisch: kleine Sekunde und verminderte Quinte"></div>

<h2>Von hell nach dunkel</h2>
<p>Ordnet man die Modi nach ihrer „Helligkeit", ergibt sich: <b>Lydisch – Ionisch – Mixolydisch – Dorisch – Äolisch – Phrygisch – Lokrisch</b>. Von Modus zu Modus wird jeweils genau ein Ton um einen Halbton erniedrigt.</p>

<div class="tip">Dur-artige Modi (große Terz): Ionisch, Lydisch, Mixolydisch. Moll-artige Modi (kleine Terz): Dorisch, Phrygisch, Äolisch, Lokrisch.</div>
`,
        },
        {
          id: 'weitere-skalen', title: 'Pentatonik, Blues und weitere Skalen',
          html: `
<h2>Pentatonik</h2>
<p>Die <b>Pentatonik</b> besteht aus nur <b>fünf Tönen</b> und hat <b>keine Halbtonschritte</b>. Dadurch klingt sie offen und „passt fast immer". Sie ist eine der ältesten Tonleitern der Welt und kommt in Volksmusik vieler Kulturen, im Blues, Rock und Pop vor.</p>
<div class="w-staff" data-n="C4 D4 E4 G4 A4 C5" data-labels="1,2,3,5,6,8" data-cap="C-Dur-Pentatonik: Dur-Tonleiter ohne 4. und 7. Stufe."></div>
<div class="w-staff" data-n="A3 C4 D4 E4 G4 A4" data-labels="1,♭3,4,5,♭7,8" data-cap="a-Moll-Pentatonik: dieselben Töne wie C-Dur-Pentatonik, aber von A aus."></div>
<div class="w-piano" data-from="C4" data-to="B5" data-labels="all" data-hl="C#4 D#4 F#4 G#4 A#4 C#5 D#5 F#5 G#5 A#5" data-cap="Tipp: Die schwarzen Tasten allein ergeben eine pentatonische Tonleiter (Ges-Dur- bzw. es-Moll-Pentatonik). Probiere eine Melodie nur auf schwarzen Tasten!"></div>

<h2>Die Blues-Tonleiter</h2>
<p>Ergänzt man die Moll-Pentatonik um die <b>verminderte Quinte</b> („Blue Note"), erhält man die <b>Blues-Tonleiter</b>.</p>
<div class="w-staff" data-n="C4 Eb4 F4 Gb4 G4 Bb4 C5" data-labels="1,♭3,4,♭5,5,♭7,8" data-colors="-,-,-,var(--accent),-,-,-" data-cap="C-Blues-Tonleiter"></div>

<h2>Chromatische Tonleiter</h2>
<p>Die <b>chromatische Tonleiter</b> besteht aus allen <b>zwölf Halbtönen</b> der Oktave. Aufwärts notiert man sie meist mit ♯, abwärts mit ♭.</p>
<div class="w-staff" data-n="C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5" data-spacing="34" data-gap="0.3"></div>

<h2>Ganztonleiter</h2>
<p>Die <b>Ganztonleiter</b> besteht aus sechs Tönen im Ganztonabstand. Sie hat keinen Leitton und kein klares Zentrum – sie klingt schwebend und traumartig (Debussy, Traumsequenzen im Film).</p>
<div class="w-staff" data-n="C4 D4 E4 F#4 G#4 A#4 C5" data-labels="1"></div>

<div class="table-wrap"><table>
  <tr><th>Skala</th><th>Töne</th><th>Formel</th></tr>
  <tr><td>Dur-Pentatonik</td><td>5</td><td>1 2 3 5 6</td></tr>
  <tr><td>Moll-Pentatonik</td><td>5</td><td>1 ♭3 4 5 ♭7</td></tr>
  <tr><td>Blues</td><td>6</td><td>1 ♭3 4 ♭5 5 ♭7</td></tr>
  <tr><td>Ganzton</td><td>6</td><td>1 2 3 ♯4 ♯5 ♯6</td></tr>
  <tr><td>Chromatisch</td><td>12</td><td>alle Halbtöne</td></tr>
</table></div>
`,
        },
      ],
      exercises: ['tonleiter-stufe', 'tonleiter-erkennen', 'tonleiter-hoeren'],
    },

    // ================================================================ 5
    {
      id: 'tonarten', icon: '⭕', title: 'Tonarten und Quintenzirkel',
      desc: 'Generalvorzeichen, Quintenzirkel, Parallel- und Varianttonarten.',
      lessons: [
        {
          id: 'generalvorzeichen', title: 'Tonarten und Generalvorzeichen',
          html: `
<p>Eine <b>Tonart</b> wird durch ihren <b>Grundton</b> und ihr <b>Tongeschlecht</b> (Dur oder Moll) bestimmt, z. B. G-Dur oder e-Moll. Damit man nicht vor jede Note ein Vorzeichen schreiben muss, stehen die nötigen Vorzeichen als <b>Generalvorzeichen</b> am Anfang jeder Notenzeile – direkt nach dem Schlüssel. Sie gelten für das ganze Stück und in allen Oktaven.</p>
<div class="w-staff" data-key="2" data-n="D4 E4 F4 G4 A4 B4 C5 D5" data-labels="1" data-cap="D-Dur mit Generalvorzeichen (Fis, Cis): Die Noten F und C werden automatisch als Fis und Cis gespielt."></div>

<h2>Die Reihenfolge der Vorzeichen</h2>
<p>Vorzeichen kommen immer in einer festen Reihenfolge hinzu:</p>
<ul>
  <li><b>Kreuze:</b> Fis – Cis – Gis – Dis – Ais – Eis – His</li>
  <li><b>Bes:</b> B – Es – As – Des – Ges – Ces – Fes (die Kreuz-Reihenfolge rückwärts)</li>
</ul>
<div class="w-staff" data-key="7" data-n="" data-play="none" data-cap="Alle 7 Kreuze im Violinschlüssel"></div>
<div class="w-staff" data-key="-7" data-n="" data-play="none" data-cap="Alle 7 Bes im Violinschlüssel"></div>
<div class="w-staff" data-clef="bass" data-key="4" data-n="" data-play="none" data-cap="Im Bassschlüssel stehen die Vorzeichen eine Oktave (zwei Zeilenpositionen) tiefer – hier 4 Kreuze."></div>
<div class="tip">Eselsbrücke für die Kreuz-Tonarten (Dur): „<b>G</b>eh <b>D</b>u <b>A</b>lter <b>E</b>sel, <b>H</b>ole <b>Fis</b>che" = G, D, A, E, H, Fis (1 bis 6 ♯). Für die B-Tonarten: „<b>F</b>rische <b>B</b>rötchen <b>Es</b>sen <b>As</b>se <b>Des</b> <b>Ges</b>angs" = F, B, Es, As, Des, Ges (1 bis 6 ♭).</div>

<h2>Die Tonart am Vorzeichen erkennen</h2>
<ul>
  <li><b>Bei Kreuzen:</b> Das <b>letzte Kreuz + einen Halbton</b> ergibt den Dur-Grundton. Beispiel: letztes Kreuz Gis → A-Dur.</li>
  <li><b>Bei Bes:</b> Das <b>vorletzte B</b> ist der Dur-Grundton. Beispiel: B, Es, As → vorletztes ist Es → Es-Dur. (Ausnahme: 1 ♭ = F-Dur, das muss man sich merken.)</li>
  <li><b>Keine Vorzeichen:</b> C-Dur bzw. a-Moll.</li>
</ul>

<h2>Alle Tonarten im Überblick</h2>
<div class="table-wrap"><table>
  <tr><th>Vorzeichen</th><th>Dur</th><th>Moll</th><th>Vorzeichen</th></tr>
  <tr><td>keine</td><td>C-Dur</td><td>a-Moll</td><td>–</td></tr>
  <tr><td>1 ♯</td><td>G-Dur</td><td>e-Moll</td><td>Fis</td></tr>
  <tr><td>2 ♯</td><td>D-Dur</td><td>h-Moll</td><td>Fis, Cis</td></tr>
  <tr><td>3 ♯</td><td>A-Dur</td><td>fis-Moll</td><td>+ Gis</td></tr>
  <tr><td>4 ♯</td><td>E-Dur</td><td>cis-Moll</td><td>+ Dis</td></tr>
  <tr><td>5 ♯</td><td>H-Dur</td><td>gis-Moll</td><td>+ Ais</td></tr>
  <tr><td>6 ♯</td><td>Fis-Dur</td><td>dis-Moll</td><td>+ Eis</td></tr>
  <tr><td>7 ♯</td><td>Cis-Dur</td><td>ais-Moll</td><td>+ His</td></tr>
  <tr><td>1 ♭</td><td>F-Dur</td><td>d-Moll</td><td>B</td></tr>
  <tr><td>2 ♭</td><td>B-Dur</td><td>g-Moll</td><td>B, Es</td></tr>
  <tr><td>3 ♭</td><td>Es-Dur</td><td>c-Moll</td><td>+ As</td></tr>
  <tr><td>4 ♭</td><td>As-Dur</td><td>f-Moll</td><td>+ Des</td></tr>
  <tr><td>5 ♭</td><td>Des-Dur</td><td>b-Moll</td><td>+ Ges</td></tr>
  <tr><td>6 ♭</td><td>Ges-Dur</td><td>es-Moll</td><td>+ Ces</td></tr>
  <tr><td>7 ♭</td><td>Ces-Dur</td><td>as-Moll</td><td>+ Fes</td></tr>
</table></div>
<p>Jede Vorzeichnung steht also für <b>zwei</b> Tonarten – eine Dur- und eine Moll-Tonart. Welche gemeint ist, erkennt man am Schlusston und an den Akkorden (in Moll taucht oft der erhöhte Leitton auf, z. B. Gis in a-Moll).</p>
`,
        },
        {
          id: 'quintenzirkel', title: 'Der Quintenzirkel',
          html: `
<p>Der <b>Quintenzirkel</b> ordnet alle 12 Dur- und Moll-Tonarten in einem Kreis an. Er ist eines der nützlichsten Werkzeuge der Musiktheorie.</p>
<div class="w-circle"></div>
<p class="muted small">Klicke auf eine Tonart, um Vorzeichen und Tonleiter zu sehen und zu hören. Den großen Quintenzirkel findest du unter <a href="#/werkzeug/quintenzirkel">Werkzeuge</a>.</p>

<h2>So funktioniert er</h2>
<ul>
  <li><b>Im Uhrzeigersinn</b> geht es jeweils eine <b>Quinte aufwärts</b> – und jede Tonart hat <b>ein ♯ mehr</b> (bzw. ein ♭ weniger): C → G → D → A → E → H → Fis.</li>
  <li><b>Gegen den Uhrzeigersinn</b> geht es eine <b>Quinte abwärts</b> (= Quarte aufwärts) – jede Tonart hat <b>ein ♭ mehr</b>: C → F → B → Es → As → Des → Ges.</li>
  <li>Unten treffen sich die Seiten: <b>Fis-Dur (6 ♯) und Ges-Dur (6 ♭)</b> klingen gleich – sie sind enharmonisch verwechselt.</li>
  <li>Im <b>inneren Kreis</b> stehen die <b>parallelen Moll-Tonarten</b> mit denselben Vorzeichen.</li>
</ul>

<h2>Wozu ist er gut?</h2>
<ul>
  <li><b>Vorzeichen bestimmen:</b> Die Position im Kreis zeigt sofort die Zahl der Vorzeichen.</li>
  <li><b>Verwandte Tonarten:</b> Benachbarte Tonarten unterscheiden sich nur in <b>einem einzigen Ton</b>. Darum moduliert (wechselt) Musik besonders oft in Nachbartonarten.</li>
  <li><b>Hauptakkorde finden:</b> Für jede Dur-Tonart sind der linke Nachbar die <b>Subdominante</b> (IV) und der rechte Nachbar die <b>Dominante</b> (V). Die Moll-Akkorde darunter sind die Parallelen. So liest man alle sechs wichtigsten Akkorde einer Tonart ab: z. B. für C-Dur: F, C, G und d, a, e.</li>
  <li><b>Akkordfolgen:</b> Viele Akkordfolgen bewegen sich im Quintenzirkel gegen den Uhrzeigersinn (Quintfall), z. B. E7 – A7 – D7 – G7 – C.</li>
</ul>
<p><span class="w-play" data-n="E3+G#3+D4 A3+C#4+G4 D3+F#3+C4 G3+B3+F4 C3+E4+G4+C5" data-mode="prog" data-gap="0.9">Quintfallsequenz E7–A7–D7–G7–C</span></p>

<div class="tip">„Uhrzeigersinn = Quinte hoch = ein ♯ mehr". Die Nachbarn einer Tonart sind ihre Subdominante (links) und Dominante (rechts).</div>
`,
        },
        {
          id: 'verwandte-tonarten', title: 'Parallel- und Varianttonarten',
          html: `
<h2>Paralleltonarten</h2>
<p>Zwei Tonarten mit <b>denselben Vorzeichen</b>, aber unterschiedlichem Tongeschlecht, nennt man <b>Paralleltonarten</b>. Sie bestehen aus denselben sieben Tönen, nur der Grundton ist ein anderer.</p>
<ul>
  <li>Der Grundton der <b>Moll-Parallele</b> liegt eine <b>kleine Terz unter</b> dem Dur-Grundton (= 6. Stufe der Dur-Tonleiter).</li>
  <li>Der Grundton der <b>Dur-Parallele</b> liegt eine <b>kleine Terz über</b> dem Moll-Grundton.</li>
</ul>
<div class="w-staff" data-n="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="1" data-cap="C-Dur …"></div>
<div class="w-staff" data-n="A3 B3 C4 D4 E4 F4 G4 A4" data-labels="1" data-cap="… und seine Parallele a-Moll: gleiche Töne, anderer Grundton."></div>
<div class="table-wrap"><table>
  <tr><th>Dur</th><th>C</th><th>G</th><th>D</th><th>A</th><th>E</th><th>F</th><th>B</th><th>Es</th><th>As</th></tr>
  <tr><th>Moll-Parallele</th><td>a</td><td>e</td><td>h</td><td>fis</td><td>cis</td><td>d</td><td>g</td><td>c</td><td>f</td></tr>
</table></div>

<h2>Varianttonarten</h2>
<p><b>Varianttonarten</b> haben denselben <b>Grundton</b>, aber unterschiedliches Tongeschlecht: C-Dur und c-Moll, A-Dur und a-Moll. Sie unterscheiden sich um <b>drei Vorzeichen</b> (C-Dur: keine, c-Moll: 3 ♭; A-Dur: 3 ♯, a-Moll: keine).</p>
<p><span class="w-play" data-n="C4 D4 E4 F4 G4 A4 B4 C5" data-gap="0.35">C-Dur</span> <span class="w-play" data-n="C4 D4 Eb4 F4 G4 Ab4 Bb4 C5" data-gap="0.35">c-Moll</span></p>
<p>Ein Wechsel zwischen Varianten (z. B. ein Dur-Schlussakkord in einem Moll-Stück, die sog. „picardische Terz") ist ein beliebtes Ausdrucksmittel.</p>

<h2>Weitere Verwandtschaften</h2>
<p>Am engsten verwandt mit einer Tonart sind:</p>
<ol>
  <li>ihre Parallele (gleiche Vorzeichen),</li>
  <li>die Tonarten der Dominante und Subdominante (Nachbarn im Quintenzirkel, ein Vorzeichen Unterschied),</li>
  <li>deren Parallelen.</li>
</ol>
<p>Für C-Dur sind das: a-Moll, G-Dur, F-Dur, e-Moll und d-Moll.</p>

<div class="tip">Parallele = gleiche Vorzeichen (C-Dur ↔ a-Moll). Variante = gleicher Grundton (C-Dur ↔ c-Moll).</div>
`,
        },
      ],
      exercises: ['vorzeichen-tonart', 'tonart-vorzeichen', 'parallel'],
    },

    // ================================================================ 6
    {
      id: 'akkorde', icon: '🎶', title: 'Akkorde',
      desc: 'Dreiklänge, Umkehrungen, Septakkorde und Akkordsymbole.',
      lessons: [
        {
          id: 'dreiklaenge', title: 'Dreiklänge',
          html: `
<p>Ein <b>Akkord</b> ist der Zusammenklang von mindestens drei verschiedenen Tönen. Der wichtigste Akkord ist der <b>Dreiklang</b>: Er wird aus zwei übereinander geschichteten <b>Terzen</b> gebildet.</p>
<div class="w-staff" data-n="C4+E4+G4" data-labels="1" data-play="arp" data-cap="C-Dur-Dreiklang: Grundton C, Terz E, Quinte G."></div>
<p>Die drei Töne heißen nach ihrem Abstand zum untersten Ton: <b>Grundton</b>, <b>Terz</b> und <b>Quinte</b>.</p>

<h2>Die vier Dreiklangsarten</h2>
<p>Je nachdem, ob die Terzen groß oder klein sind, entstehen vier Arten:</p>
<div class="table-wrap"><table>
  <tr><th>Dreiklang</th><th>untere Terz</th><th>obere Terz</th><th>Rahmenintervall</th><th>Symbol</th><th>Klang</th></tr>
  <tr><td><b>Dur</b></td><td>groß</td><td>klein</td><td>reine Quinte</td><td>C</td><td>hell, stabil</td></tr>
  <tr><td><b>Moll</b></td><td>klein</td><td>groß</td><td>reine Quinte</td><td>Cm</td><td>dunkler, weich</td></tr>
  <tr><td><b>vermindert</b></td><td>klein</td><td>klein</td><td>verminderte Quinte</td><td>C° / Cdim</td><td>gespannt, eng</td></tr>
  <tr><td><b>übermäßig</b></td><td>groß</td><td>groß</td><td>übermäßige Quinte</td><td>C+ / Caug</td><td>schwebend, unruhig</td></tr>
</table></div>
<div class="w-staff" data-n="C4+E4+G4 C4+Eb4+G4 C4+Eb4+Gb4 C4+E4+G#4" data-labels="Dur,Moll,vermindert,übermäßig" data-play="melody" data-gap="1.3" data-spacing="70" data-cap="Die vier Dreiklänge auf C"></div>
<p><span class="w-play" data-n="C4 E4 G4 C4+E4+G4" data-mode="prog" data-gap="0.4">Dur</span> <span class="w-play" data-n="C4 Eb4 G4 C4+Eb4+G4" data-mode="prog" data-gap="0.4">Moll</span> <span class="w-play" data-n="C4 Eb4 Gb4 C4+Eb4+Gb4" data-mode="prog" data-gap="0.4">vermindert</span> <span class="w-play" data-n="C4 E4 G#4 C4+E4+G#4" data-mode="prog" data-gap="0.4">übermäßig</span></p>

<h2>Akkordsymbole</h2>
<p>In Pop, Jazz und Rock werden Akkorde mit <b>Akkordsymbolen</b> bezeichnet: Der Buchstabe ist der Grundton, Zusätze beschreiben die Art. Ein Großbuchstabe allein bedeutet Dur.</p>
<ul>
  <li><b>D</b> = D-Dur (D, Fis, A) &nbsp; <b>Dm</b> = d-Moll (D, F, A)</li>
  <li><b>H°</b> oder <b>Hdim</b> = H vermindert (H, D, F)</li>
  <li><b>E+</b> oder <b>Eaug</b> = E übermäßig (E, Gis, His)</li>
</ul>
<p>In der klassischen deutschen Harmonielehre schreibt man Dur-Akkorde mit Großbuchstaben (C) und Moll-Akkorde mit Kleinbuchstaben (c). Achtung: Englische Akkordsymbole verwenden <b>B</b> für unser H und <b>Bb</b> für unser B.</p>

<h2>Sus-Akkorde</h2>
<p>Bei <b>sus</b>-Akkorden (von <i>suspended</i> = aufgehängt) ist die Terz durch die Sekunde (<b>sus2</b>) oder die Quarte (<b>sus4</b>) ersetzt. Sie sind weder Dur noch Moll und lösen sich oft in den normalen Dreiklang auf.</p>
<div class="w-staff" data-n="C4+D4+G4 C4+F4+G4 C4+E4+G4" data-labels="Csus2,Csus4,C" data-play="melody" data-gap="1" data-spacing="70"></div>

<h2>Einen Dreiklang bauen</h2>
<ol>
  <li>Grundton aufschreiben.</li>
  <li>Eine Terz darüber (Linie → Linie oder Zwischenraum → Zwischenraum), dann noch eine. Das Notenbild sieht aus wie ein „Schneemann".</li>
  <li>Mit Vorzeichen die richtige Terzengröße einstellen. Tipp: Für Dur die Töne 1, 3, 5 der Dur-Tonleiter nehmen; für Moll die Terz um einen Halbton erniedrigen.</li>
</ol>
<div class="w-staff" data-n="D4+F#4+A4 E4+G#4+B4 F4+A4+C5 Bb3+D4+F4 Eb4+G4+Bb4 A3+C#4+E4" data-labels="D,E,F,B,Es,A" data-play="melody" data-gap="1" data-spacing="60" data-cap="Dur-Dreiklänge auf verschiedenen Grundtönen."></div>
`,
        },
        {
          id: 'umkehrungen', title: 'Umkehrungen und Lagen',
          html: `
<p>Ein Akkord muss nicht immer mit dem Grundton unten stehen. Entscheidend für die Benennung der Stellung ist, welcher Ton <b>im Bass</b> (ganz unten) liegt.</p>

<h2>Die drei Stellungen eines Dreiklangs</h2>
<div class="w-staff" data-n="C4+E4+G4 E4+G4+C5 G4+C5+E5" data-labels="Grundstellung,Sextakkord,Quartsextakkord" data-play="melody" data-gap="1.2" data-spacing="90"></div>
<div class="table-wrap"><table>
  <tr><th>Stellung</th><th>Basston</th><th>Intervalle über dem Bass</th><th>Generalbass</th></tr>
  <tr><td>Grundstellung</td><td>Grundton</td><td>Terz + Quinte</td><td>5/3 (meist weggelassen)</td></tr>
  <tr><td>1. Umkehrung: <b>Sextakkord</b></td><td>Terz</td><td>Terz + Sexte</td><td>6</td></tr>
  <tr><td>2. Umkehrung: <b>Quartsextakkord</b></td><td>Quinte</td><td>Quarte + Sexte</td><td>6/4</td></tr>
</table></div>
<p>Die Namen „Sextakkord" und „Quartsextakkord" kommen aus dem <b>Generalbass</b> des Barock: Man notierte die Intervalle, die über dem Basston erklingen.</p>
<div class="tip">Um die Umkehrung zu bestimmen, ordne die Töne zuerst in Terzen (Grundstellung) und finde so den Grundton. Dann schau, welcher Ton im Bass liegt.</div>

<h2>Slash-Akkorde</h2>
<p>In Akkordsymbolen wird ein anderer Basston mit Schrägstrich angegeben: <b>C/E</b> bedeutet „C-Dur mit E im Bass" (Sextakkord), <b>C/G</b> ist der Quartsextakkord. Es gibt auch Akkorde mit akkordfremden Basstönen, z. B. <b>D/C</b>.</p>

<h2>Enge und weite Lage</h2>
<ul>
  <li><b>Enge Lage</b>: Die Akkordtöne liegen so dicht wie möglich beieinander (innerhalb einer Oktave).</li>
  <li><b>Weite Lage</b>: Die Töne sind über mehr als eine Oktave verteilt; zwischen den Oberstimmen könnten weitere Akkordtöne Platz finden.</li>
</ul>
<div class="w-staff" data-n="C4+E4+G4 C4+G4+E5" data-labels="eng,weit" data-play="melody" data-gap="1.3" data-spacing="80"></div>
<p>Im vierstimmigen Satz wird meist ein Ton verdoppelt – bevorzugt der Grundton.</p>
<p><span class="w-play" data-n="C3+C4+E4+G4 C3+G3+E4+C5">Gleicher Akkord, verschiedene Lagen</span></p>
`,
        },
        {
          id: 'septakkorde', title: 'Septakkorde',
          html: `
<p>Schichtet man auf einen Dreiklang eine weitere Terz, entsteht ein <b>Vierklang</b>. Da der neue Ton eine Septime über dem Grundton liegt, nennt man ihn <b>Septakkord</b>.</p>

<h2>Die wichtigsten Septakkorde</h2>
<div class="table-wrap"><table>
  <tr><th>Name</th><th>Aufbau</th><th>Symbol</th><th>Töne auf C</th></tr>
  <tr><td>großer Dur-Septakkord</td><td>Dur-Dreiklang + große Septime</td><td>Cmaj7 / CΔ7</td><td>C E G H</td></tr>
  <tr><td><b>Dominantseptakkord</b></td><td>Dur-Dreiklang + kleine Septime</td><td>C7</td><td>C E G B</td></tr>
  <tr><td>Moll-Septakkord</td><td>Moll-Dreiklang + kleine Septime</td><td>Cm7</td><td>C Es G B</td></tr>
  <tr><td>halbverminderter Septakkord</td><td>verminderter Dreiklang + kleine Septime</td><td>Cø7 / Cm7♭5</td><td>C Es Ges B</td></tr>
  <tr><td>verminderter Septakkord</td><td>verminderter Dreiklang + verminderte Septime</td><td>C°7 / Cdim7</td><td>C Es Ges Heses</td></tr>
</table></div>
<div class="w-staff" data-n="C4+E4+G4+B4 C4+E4+G4+Bb4 C4+Eb4+G4+Bb4 C4+Eb4+Gb4+Bb4 C4+Eb4+Gb4+Bbb4" data-labels="Cmaj7,C7,Cm7,Cø7,C°7" data-play="melody" data-gap="1.3" data-spacing="72"></div>

<h2>Der Dominantseptakkord</h2>
<p>Der wichtigste Septakkord steht auf der <b>V. Stufe</b> einer Dur-Tonart: In C-Dur ist das <b>G7</b> (G, H, D, F). Er enthält zwei „Spannungstöne":</p>
<ul>
  <li>den <b>Leitton H</b>, der aufwärts zum C strebt,</li>
  <li>die <b>Septime F</b>, die abwärts zum E strebt.</li>
</ul>
<p>H und F bilden zusammen einen Tritonus – darum klingt G7 so stark nach Auflösung in C-Dur.</p>
<div class="w-staff" data-n="G3+B3+D4+F4 C4+C4+E4+G4" data-labels="G7,C" data-play="melody" data-gap="1.2" data-spacing="80" data-cap="Auflösung des Dominantseptakkords: H → C, F → E."></div>

<h2>Umkehrungen von Septakkorden</h2>
<p>Ein Vierklang hat drei Umkehrungen. Auch ihre Namen stammen aus dem Generalbass:</p>
<div class="table-wrap"><table>
  <tr><th>Stellung</th><th>Basston</th><th>Name</th><th>Bezifferung</th></tr>
  <tr><td>Grundstellung</td><td>Grundton</td><td>Septakkord</td><td>7</td></tr>
  <tr><td>1. Umkehrung</td><td>Terz</td><td><b>Quintsextakkord</b></td><td>6/5</td></tr>
  <tr><td>2. Umkehrung</td><td>Quinte</td><td><b>Terzquartakkord</b></td><td>4/3</td></tr>
  <tr><td>3. Umkehrung</td><td>Septime</td><td><b>Sekundakkord</b></td><td>2</td></tr>
</table></div>
<div class="w-staff" data-n="G4+B4+D5+F5 B4+D5+F5+G5 D4+F4+G4+B4 F4+G4+B4+D5" data-labels="G7,Quintsext,Terzquart,Sekund" data-play="melody" data-gap="1.2" data-spacing="80"></div>

<h2>Erweiterte Akkorde</h2>
<p>Im Jazz und Pop werden weitere Terzen geschichtet: <b>None</b> (9), <b>Undezime</b> (11) und <b>Tredezime</b> (13). <b>add</b> fügt einen Ton ohne Septime hinzu (z. B. Cadd9 = C E G D).</p>
<p><span class="w-play" data-n="C3+E4+G4+B4+D5">Cmaj9</span> <span class="w-play" data-n="G2+F3+B3+E4">G13 (Jazz-Voicing)</span> <span class="w-play" data-n="C4+E4+G4+D5">Cadd9</span></p>
`,
        },
      ],
      exercises: ['dreiklang-bestimmen', 'akkord-toene', 'umkehrung', 'akkord-hoeren'],
    },

    // ================================================================ 7
    {
      id: 'harmonielehre', icon: '🏛️', title: 'Harmonielehre',
      desc: 'Stufen, Funktionen, Kadenzen und Stimmführung.',
      lessons: [
        {
          id: 'stufen', title: 'Leitereigene Akkorde und Stufen',
          html: `
<p>Baut man auf <b>jedem Ton einer Tonleiter</b> einen Dreiklang – nur mit Tönen dieser Tonleiter –, erhält man die <b>leitereigenen Akkorde</b> der Tonart. Sie werden mit <b>römischen Ziffern</b> (Stufen) bezeichnet.</p>
<div class="w-staff" data-n="C4+E4+G4 D4+F4+A4 E4+G4+B4 F4+A4+C5 G4+B4+D5 A4+C5+E5 B4+D5+F5 C5+E5+G5" data-labels="I,ii,iii,IV,V,vi,vii°,I" data-play="melody" data-gap="0.9" data-spacing="56" data-cap="Die Stufenakkorde in C-Dur"></div>

<h2>Das Muster in Dur</h2>
<div class="table-wrap"><table class="deg-table">
  <tr><th>Stufe</th><th>I</th><th>ii</th><th>iii</th><th>IV</th><th>V</th><th>vi</th><th>vii°</th></tr>
  <tr><th>Art</th><td>Dur</td><td>Moll</td><td>Moll</td><td>Dur</td><td>Dur</td><td>Moll</td><td>verm.</td></tr>
  <tr><th>C-Dur</th><td>C</td><td>Dm</td><td>Em</td><td>F</td><td>G</td><td>Am</td><td>H°</td></tr>
  <tr><th>G-Dur</th><td>G</td><td>Am</td><td>Hm</td><td>C</td><td>D</td><td>Em</td><td>Fis°</td></tr>
  <tr><th>F-Dur</th><td>F</td><td>Gm</td><td>Am</td><td>B</td><td>C</td><td>Dm</td><td>E°</td></tr>
</table></div>
<p>Dieses Muster ist in <b>jeder</b> Dur-Tonart gleich: <b>Dur</b> auf I, IV, V – <b>Moll</b> auf ii, iii, vi – <b>vermindert</b> auf vii. Oft schreibt man Dur-Stufen mit großen, Moll-Stufen mit kleinen römischen Ziffern.</p>

<h2>Stufen in Moll</h2>
<p>In natürlichem Moll (z. B. a-Moll) ergibt sich: <b>i – ii° – III – iv – v – VI – VII</b> (Am, H°, C, Dm, Em, F, G). Weil die v. Stufe in natürlichem Moll ein Moll-Akkord ist und keinen Leitton hat, verwendet man meist den Dur-Akkord aus <b>harmonischem Moll</b>: <b>V</b> = E-Dur (mit Gis).</p>
<p><span class="w-play" data-n="A3+C4+E4 D4+F4+A4 E4+G4+B4 A3+C4+E4" data-mode="prog">i–iv–v–i (natürlich)</span> <span class="w-play" data-n="A3+C4+E4 D4+F4+A4 E4+G#4+B4 A3+C4+E4" data-mode="prog">i–iv–V–i (harmonisch)</span></p>

<h2>Leitereigene Septakkorde</h2>
<p>Mit vier Tönen pro Stufe entstehen in Dur: <b>Imaj7 – ii7 – iii7 – IVmaj7 – V7 – vi7 – viiø7</b>. In C-Dur: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Hø7. Nur auf der V. Stufe entsteht ein Dominantseptakkord!</p>
<div class="w-staff" data-n="C4+E4+G4+B4 D4+F4+A4+C5 E4+G4+B4+D5 F4+A4+C5+E5 G4+B4+D5+F5 A4+C5+E5+G5 B4+D5+F5+A5" data-labels="Imaj7,ii7,iii7,IVmaj7,V7,vi7,viiø7" data-play="melody" data-gap="1" data-spacing="56"></div>
<p>Den <a href="#/werkzeug/akkorde">Akkord-Explorer</a> kannst du nutzen, um die Stufen in jeder Tonart zu sehen.</p>
`,
        },
        {
          id: 'funktionen', title: 'Funktionen: Tonika, Subdominante, Dominante',
          html: `
<p>Die <b>Funktionstheorie</b> (nach Hugo Riemann) beschreibt, welche <b>Rolle</b> ein Akkord in einer Tonart spielt. Es gibt drei Hauptfunktionen:</p>
<div class="table-wrap"><table>
  <tr><th>Funktion</th><th>Stufe</th><th>C-Dur</th><th>Wirkung</th></tr>
  <tr><td><b>Tonika (T)</b></td><td>I</td><td>C</td><td>Ruhe, Zuhause, Ziel</td></tr>
  <tr><td><b>Subdominante (S)</b></td><td>IV</td><td>F</td><td>Bewegung weg von der Tonika, leichte Spannung</td></tr>
  <tr><td><b>Dominante (D)</b></td><td>V</td><td>G</td><td>starke Spannung, drängt zurück zur Tonika</td></tr>
</table></div>
<p><span class="w-play" data-n="C3+C4+E4+G4 F3+C4+F4+A4 G3+B3+D4+G4 C3+C4+E4+G4" data-mode="prog">T – S – D – T</span></p>
<p>Diese drei <b>Hauptdreiklänge</b> enthalten zusammen alle sieben Töne der Tonleiter. Deshalb lassen sich viele einfache Lieder nur mit T, S und D begleiten.</p>

<h2>Warum die Dominante so stark wirkt</h2>
<p>Die Dominante enthält den <b>Leitton</b> (in C-Dur das H), der einen Halbton unter dem Grundton liegt und zur Tonika strebt. Mit hinzugefügter Septime (<b>D⁷</b> = G7) wird die Spannung noch größer.</p>
<p><span class="w-play" data-n="G3+B3+D4+F4 C4+C4+E4+G4" data-mode="prog">D⁷ → T</span></p>

<h2>Nebenfunktionen: die Parallelen</h2>
<p>Jede Hauptfunktion hat eine <b>Parallele</b> – den Moll-Akkord eine kleine Terz tiefer. Er teilt zwei Töne mit dem Hauptakkord und kann ihn vertreten:</p>
<div class="table-wrap"><table>
  <tr><th>Funktion</th><th>Zeichen</th><th>Stufe</th><th>C-Dur</th><th>vertritt</th></tr>
  <tr><td>Tonikaparallele</td><td>Tp</td><td>vi</td><td>Am</td><td>Tonika</td></tr>
  <tr><td>Subdominantparallele</td><td>Sp</td><td>ii</td><td>Dm</td><td>Subdominante</td></tr>
  <tr><td>Dominantparallele</td><td>Dp</td><td>iii</td><td>Em</td><td>Dominante (auch Tonikagegenklang Tg)</td></tr>
  <tr><td>verkürzter Dominantseptakkord</td><td>D̸⁷</td><td>vii°</td><td>H°</td><td>Dominante (G7 ohne Grundton)</td></tr>
</table></div>
<div class="w-staff" data-n="C4+E4+G4 D4+F4+A4 E4+G4+B4 F4+A4+C5 G4+B4+D5 A4+C5+E5 B4+D5+F5" data-labels="T,Sp,Dp,S,D,Tp,D̸⁷" data-play="melody" data-gap="0.9" data-spacing="56"></div>

<h2>Funktionen in Moll</h2>
<p>In Moll schreibt man Moll-Funktionen mit Kleinbuchstaben: <b>t</b> (Moll-Tonika), <b>s</b> (Moll-Subdominante). Die Dominante ist meist ein Dur-Akkord (<b>D</b>, aus harmonisch Moll). Die Parallelen in Moll liegen eine kleine Terz <i>höher</i> und sind Dur-Akkorde: <b>tP</b> (III), <b>sP</b> (VI), <b>dP</b> (VII).</p>
<p>In a-Moll: t = Am, s = Dm, D = E, tP = C, sP = F, dP = G.</p>

<div class="tip">T = Ruhe, S = Aufbruch, D = Spannung. Die Parallele liegt in Dur eine kleine Terz tiefer und ist ein Moll-Akkord.</div>
`,
        },
        {
          id: 'kadenzen', title: 'Kadenzen und Akkordfolgen',
          html: `
<p>Eine <b>Kadenz</b> (lat. <i>cadere</i> = fallen) ist eine Akkordfolge, die eine Tonart festigt oder einen musikalischen Abschnitt beendet. Wie Satzzeichen in der Sprache gliedern Schlusswendungen die Musik.</p>

<h2>Die vollständige Kadenz</h2>
<p>Die klassische <b>Kadenz</b> durchläuft alle Hauptfunktionen: <b>T – S – D – T</b> (I – IV – V – I). Häufig erweitert mit Quartsextvorhalt oder D⁷:</p>
<div class="w-staff" data-n="E4+G4+C5 F4+A4+C5 D4+G4+B4 E4+G4+C5" data-labels="T,S,D,T" data-play="none" data-spacing="70" data-cap="Oberstimmen; der Bass spielt dazu die Grundtöne C – F – G – C."></div>
<p><span class="w-play" data-n="C3+E4+G4+C5 F3+F4+A4+C5 G3+D4+G4+B4 C3+E4+G4+C5" data-mode="prog">T – S – D – T (mit Bass)</span></p>
<p><span class="w-play" data-n="C3+E4+G4+C5 F3+F4+A4+C5 G3+E4+G4+C5 G3+D4+F4+B4 C3+E4+G4+C5" data-mode="prog">T – S – D⁶₄ – D⁷ – T (mit Quartsextvorhalt)</span></p>

<h2>Schlussformen</h2>
<div class="table-wrap"><table>
  <tr><th>Name</th><th>Folge</th><th>Wirkung</th><th></th></tr>
  <tr><td><b>Ganzschluss</b> (authentischer Schluss)</td><td>D → T (V → I)</td><td>endgültig, „Punkt"</td><td><span class="w-play" data-n="F3+F4+A4+C5 G3+D4+G4+B4 C3+E4+G4+C5" data-mode="prog">hören</span></td></tr>
  <tr><td><b>Plagalschluss</b></td><td>S → T (IV → I)</td><td>weich, feierlich – das „Amen" in Kirchenliedern</td><td><span class="w-play" data-n="C3+E4+G4+C5 F3+F4+A4+C5 C3+E4+G4+C5" data-mode="prog">hören</span></td></tr>
  <tr><td><b>Halbschluss</b></td><td>… → D (endet auf V)</td><td>offen, „Komma" oder „Fragezeichen"</td><td><span class="w-play" data-n="C3+E4+G4+C5 F3+F4+A4+C5 G3+D4+G4+B4" data-mode="prog">hören</span></td></tr>
  <tr><td><b>Trugschluss</b></td><td>D → Tp (V → vi)</td><td>überraschend – die erwartete Tonika wird „vorgetäuscht"</td><td><span class="w-play" data-n="F3+F4+A4+C5 G3+D4+G4+B4 A3+C4+E4+C5" data-mode="prog">hören</span></td></tr>
</table></div>

<h2>Beliebte Akkordfolgen</h2>
<div class="table-wrap"><table>
  <tr><th>Folge</th><th>in C-Dur</th><th>bekannt aus</th><th></th></tr>
  <tr><td>I – V – vi – IV</td><td>C – G – Am – F</td><td>„Let It Be", unzählige Pop-Songs („Axis of Awesome")</td><td><span class="w-play" data-n="C3+E4+G4+C5 G2+D4+G4+B4 A2+C4+E4+A4 F2+C4+F4+A4" data-mode="prog">hören</span></td></tr>
  <tr><td>vi – IV – I – V</td><td>Am – F – C – G</td><td>Pop-Balladen</td><td><span class="w-play" data-n="A2+C4+E4+A4 F2+C4+F4+A4 C3+E4+G4+C5 G2+D4+G4+B4" data-mode="prog">hören</span></td></tr>
  <tr><td>I – vi – IV – V</td><td>C – Am – F – G</td><td>„Stand by Me", 50er-Jahre-Doo-Wop</td><td><span class="w-play" data-n="C3+E4+G4+C5 A2+E4+A4+C5 F2+F4+A4+C5 G2+D4+G4+B4" data-mode="prog">hören</span></td></tr>
  <tr><td>ii – V – I</td><td>Dm7 – G7 – Cmaj7</td><td>die Grundformel des Jazz</td><td><span class="w-play" data-n="D3+F4+A4+C5 G2+F4+B4+D5 C3+E4+G4+B4" data-mode="prog">hören</span></td></tr>
  <tr><td>Pachelbel-Kanon</td><td>C – G – Am – Em – F – C – F – G</td><td>Kanon in D (Pachelbel)</td><td><span class="w-play" data-n="C3+E4+G4+C5 G2+D4+G4+B4 A2+C4+E4+A4 E2+B3+E4+G4 F2+A3+C4+F4 C3+G3+C4+E4 F2+A3+C4+F4 G2+B3+D4+G4" data-mode="prog" data-gap="0.8">hören</span></td></tr>
</table></div>

<h2>Das 12-taktige Blues-Schema</h2>
<p>Der Blues basiert auf einem festen Ablauf von 12 Takten mit den drei Hauptfunktionen (oft alle als Dominantseptakkorde):</p>
<div class="table-wrap"><table class="deg-table">
  <tr><td>I</td><td>I</td><td>I</td><td>I</td></tr>
  <tr><td>IV</td><td>IV</td><td>I</td><td>I</td></tr>
  <tr><td>V</td><td>IV</td><td>I</td><td>V</td></tr>
</table></div>
<p><span class="w-play" data-n="C3+E3+G3+Bb3 C3+E3+G3+Bb3 C3+E3+G3+Bb3 C3+E3+G3+Bb3 F3+A3+C4+Eb4 F3+A3+C4+Eb4 C3+E3+G3+Bb3 C3+E3+G3+Bb3 G3+B3+D4+F4 F3+A3+C4+Eb4 C3+E3+G3+Bb3 G3+B3+D4+F4" data-mode="prog" data-gap="0.7">Blues in C</span></p>
`,
        },
        {
          id: 'stimmfuehrung', title: 'Grundregeln der Stimmführung',
          html: `
<p>In der klassischen Harmonielehre werden Akkorde meist <b>vierstimmig</b> gesetzt – wie in einem Chor. Die <b>Stimmführung</b> regelt, wie sich die einzelnen Stimmen von Akkord zu Akkord bewegen.</p>

<h2>Die vier Stimmen</h2>
<div class="table-wrap"><table>
  <tr><th>Stimme</th><th>ungefährer Umfang</th></tr>
  <tr><td>Sopran</td><td>c' – a''</td></tr>
  <tr><td>Alt</td><td>g – d''</td></tr>
  <tr><td>Tenor</td><td>c – g'</td></tr>
  <tr><td>Bass</td><td>E – c'</td></tr>
</table></div>
<p>Da ein Dreiklang nur drei Töne hat, muss im vierstimmigen Satz ein Ton <b>verdoppelt</b> werden – am besten der <b>Grundton</b>, bei Sextakkorden oft auch Sopran- oder Basston. Der <b>Leitton wird nie verdoppelt</b>.</p>

<h2>Die wichtigsten Regeln</h2>
<ol>
  <li><b>Gemeinsame Töne liegen lassen:</b> Haben zwei Akkorde einen Ton gemeinsam, bleibt er in derselben Stimme.</li>
  <li><b>Kleine Schritte bevorzugen:</b> Die Oberstimmen bewegen sich möglichst schrittweise (Sekunden, Terzen). Nur der Bass springt häufiger.</li>
  <li><b>Gegenbewegung:</b> Bewegt sich der Bass aufwärts, sollten sich die Oberstimmen eher abwärts bewegen (und umgekehrt).</li>
  <li><b>Keine Quint- und Oktavparallelen:</b> Zwei Stimmen dürfen nicht im Abstand einer reinen Quinte oder Oktave parallel fortschreiten – sie würden ihre Eigenständigkeit verlieren.</li>
  <li><b>Leitton aufwärts:</b> Der Leitton der Dominante löst sich in den Grundton auf.</li>
  <li><b>Septime abwärts:</b> Die Septime eines Septakkords löst sich schrittweise abwärts auf.</li>
  <li><b>Keine Stimmkreuzungen</b> und nicht mehr als eine Oktave Abstand zwischen benachbarten Oberstimmen.</li>
</ol>

<h2>Beispiel: Kadenz in C-Dur</h2>
<div class="w-staff" data-n="E4+G4+C5 F4+A4+C5 D4+G4+B4 E4+G4+C5" data-labels="T,S,D,T" data-play="melody" data-gap="1.1" data-spacing="70" data-cap="Oberstimmen (der Bass spielt C – F – G – C): Das C bleibt liegen (T → S), sonst kleine Schritte. Der Leitton H geht zum C."></div>
<p><span class="w-play" data-n="C3+E4+G4+C5 F3+F4+A4+C5 G3+D4+G4+B4 C3+E4+G4+C5" data-mode="prog">gute Stimmführung</span> <span class="w-play" data-n="C3+G3+C4+E4 D3+A3+D4+F4" data-mode="prog">Quint- und Oktavparallelen (C→Dm parallel verschoben)</span></p>

<div class="tip">Gemeinsame Töne halten, Oberstimmen in kleinen Schritten führen, Leitton nach oben, Septime nach unten – und keine parallelen Quinten oder Oktaven.</div>
`,
        },
      ],
      exercises: ['stufen', 'funktionen', 'kadenz-hoeren'],
    },

    // ================================================================ 8
    {
      id: 'gehoer', icon: '👂', title: 'Gehörbildung',
      desc: 'Tonhöhen, Intervalle, Akkorde, Tonleitern und Kadenzen hören.',
      lessons: [
        {
          id: 'gehoer-tipps', title: 'So trainierst du dein Gehör',
          html: `
<p><b>Gehörbildung</b> ist das Training, Musik bewusst zu hören und zu verstehen: Welche Intervalle, Akkorde und Rhythmen erklingen? Ein gutes Gehör hilft beim Musizieren nach Gehör, beim Improvisieren, Komponieren, Stimmen und Singen.</p>

<h2>Relatives und absolutes Gehör</h2>
<ul>
  <li><b>Absolutes Gehör</b>: Die seltene Fähigkeit, einen Ton ohne Bezugston zu benennen.</li>
  <li><b>Relatives Gehör</b>: Die Fähigkeit, Töne <i>im Verhältnis</i> zueinander zu erkennen (Intervalle, Akkorde, Stufen). Das kann <b>jeder</b> lernen – und es ist für Musiker wichtiger!</li>
</ul>

<h2>Tipps für das Training</h2>
<ol>
  <li><b>Regelmäßig und kurz:</b> Täglich 10–15 Minuten bringen mehr als einmal pro Woche zwei Stunden.</li>
  <li><b>Mitsingen:</b> Singe Intervalle und Tonleitern nach. Was du singen kannst, erkennst du auch.</li>
  <li><b>Merklieder verwenden:</b> Verknüpfe jedes Intervall mit dem Anfang eines bekannten Liedes (siehe Lektion „Reine, große und kleine Intervalle").</li>
  <li><b>Vom Einfachen zum Schweren:</b> Beginne mit wenigen, sehr unterschiedlichen Intervallen (z. B. große Terz, Quinte, Oktave) und nimm nach und nach weitere dazu.</li>
  <li><b>Auf den Charakter achten:</b> Dur klingt hell und stabil, Moll weicher und dunkler, vermindert eng und gespannt, übermäßig schwebend.</li>
  <li><b>Bezug zum Grundton:</b> Bei Kadenzen hilft es, den Grundton der Tonart im Kopf mitzusingen und zu spüren, ob die Musik „zu Hause" ankommt.</li>
</ol>

<h2>Was die Übungen trainieren</h2>
<ul>
  <li><a href="#/uebung/tonhoehe">Tonhöhen vergleichen</a> – höher, tiefer oder gleich?</li>
  <li><a href="#/uebung/intervall-hoeren">Intervalle hören</a> – melodisch und harmonisch</li>
  <li><a href="#/uebung/akkord-hoeren">Akkorde hören</a> – Dur, Moll, vermindert, übermäßig, Septakkorde</li>
  <li><a href="#/uebung/tonleiter-hoeren">Tonleitern hören</a> – Dur, Moll-Varianten, Modi</li>
  <li><a href="#/uebung/kadenz-hoeren">Kadenzen hören</a> – Ganz-, Halb-, Plagal- und Trugschluss</li>
  <li><a href="#/uebung/melodie-nachspielen">Melodien nachspielen</a> – kurze Tonfolgen nach Gehör auf der Klaviatur</li>
</ul>
<div class="tip">Benutze Kopfhörer und spiele jede Aufgabe ruhig mehrmals ab. Fehler sind beim Gehörtraining völlig normal – das Gehör lernt durch Wiederholung.</div>
`,
        },
      ],
      exercises: ['tonhoehe', 'intervall-hoeren', 'akkord-hoeren', 'tonleiter-hoeren', 'kadenz-hoeren', 'melodie-nachspielen'],
    },
  ],
};
