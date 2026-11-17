from pathlib import Path
import json, base64, itertools

ROOT = Path(__file__).parent
ASSETS = ROOT / 'assets'

article = [
 'Als Christoph und Paulina Dassler Ende des 19. Jahrhunderts in einen kleinen Ort namens Herzogenaurach zogen und dort vier Kinder bekamen, spielte Sport in ihrem Leben keine große Rolle. Das änderte sich bald, denn der jüngste Sohn Adolf, genannt Adi, interessierte sich für viele Sportarten: Leichtathletik, Fußball, Boxen oder Eislaufen. Nach dem Ersten Weltkrieg (1914–1918) machte der Junge aus seinem Interesse ein Geschäft: Er produzierte Sportschuhe in der Waschküche seiner Mutter. Drei Jahre später stieg auch Adis Bruder Rudolf in das kleine Unternehmen ein. Zusammen gründeten sie 1924 die „Gebrüder Dassler Schuhfabrik“.',
 'Adi und Rudolf waren sehr unterschiedlich, aber die Partnerschaft funktionierte am Anfang gut. Adi war eher ein Erfinder und arbeitete an der Weiterentwicklung der Schuhe, Rudolf war ein sehr guter Verkäufer. Leider verstanden sich die Ehefrauen der Brüder nicht gut, und es entstanden erste Konflikte.',
 'Die Probleme wurden noch größer, als zur Zeit des Nationalsozialismus 1936 in Berlin die Olympischen Spiele stattfanden. Rudolf wollte seine Sportschuhe nur an deutsche Athleten verkaufen, aber Adi ging einen anderen Weg. Er fuhr nach Berlin und gab seine Schuhe dem Afroamerikaner Jesse Owens – und Owens gewann in Dasslers Schuhen vier Goldmedaillen.',
 'Als der Zweite Weltkrieg (1939–1945) begann, musste Rudolf zur Armee, Adi nicht. Er führte die Firma alleine weiter. Politische Konflikte und nach dem Krieg und die privaten Probleme führten 1948 zum endgültigen Bruch.',
 'Rudolf zog mit seiner Familie aus dem gemeinsamen Haus aus und die Brüder teilten die Firma. Adi blieb in der alten Fabrik und gab seiner Firma den Namen Adidas. Der Name besteht aus seinem Vornamen Adi und den ersten drei Buchstaben von Dassler. Rudolf zog in ein Fabrikgebäude auf die andere Seite des Orts um. Er gab seiner Firma den Namen Puma. Der kleine Ort Herzogenaurach ist geteilt durch einen Fluss, die Familie war es nun auch.',
 'Schon nach kurzer Zeit machten Adidas und Puma Fortschritte und wurden zu Konkurrenten. Sie produzierten leichte Schuhe für Leichtathleten oder Fußballer. 1953 erfand Adolf Dassler den Stollenschuh, damit Fußballer sicherer laufen konnten. Mit diesen Schuhen gewann Adi auch das erste Duell der Brüder: Die deutsche Nationalmannschaft wurde 1954 Fußballweltmeister, in Adidas-Schuhen.',
 'Adidas gegen Puma, das war nicht nur ein Zweikampf zwischen den beiden Brüdern, es war auch eine Rivalität der Familien von Adi und Rudolf. Die Söhne Horst Dassler (Adidas) und Armin Dassler (Puma) sowie deren Kinder führten den Kampf weiter, später die Enkelkinder. Es kam zu Intrigen, Streit und Prozessen vor Gericht. Am Ende haben die Familienmitglieder ihre Firmenanteile verkauft. Adidas und Puma gibt es in Herzogenaurach immer noch, aber sie werden von anderen Eigentümern geleitet.'
]
mc = [
 {'q':'In dem Text geht es um', 'options':['eine Familiengeschichte.','die Erfolge einer Firma.','die Entwicklung der Sportschuhe.'], 'key':'a', 'why':'Текст охватывает несколько поколений семьи Дасслер: родителей, братьев, их детей и внуков.'},
 {'q':'Für Sport interessierte sich', 'options':['die ganze Familie Dassler.','niemand in der Familie.','der jüngste Sohn Adolf.'], 'key':'c', 'why':'В тексте: „der jüngste Sohn Adolf, genannt Adi, interessierte sich für viele Sportarten“.'},
 {'q':'Die Brüder Adolf und Rudolf', 'options':['hatten eine enge Freundschaft.','hatten unterschiedliche Talente.','wollten viel Geld verdienen.'], 'key':'b', 'why':'Ади был изобретателем и совершенствовал обувь, а Рудольф был хорошим продавцом.'},
 {'q':'Der Streit zwischen den Brüdern', 'options':['hatte viele Ursachen.','entstand 1936.','entstand nach dem Zweiten Weltkrieg.'], 'key':'a', 'why':'Сначала появились семейные конфликты, затем добавились политические разногласия и личные проблемы.'},
 {'q':'Im Jahre 1948', 'options':['zog Rudolf in einen anderen Ort.','wurde die Firma „Gebrüder Dassler Schuhfabrik“ geteilt.','verkaufte Rudolf die Schuhfabrik.'], 'key':'b', 'why':'Братья разделили фирму. Рудольф переехал на другую сторону того же города.'},
 {'q':'Heute', 'options':['führen die Enkelkinder die Firmen Adidas und Puma.','gehören die Firmen nicht mehr der Familie Dassler.','gibt es keine Firmen mehr in Herzogenaurach.'], 'key':'b', 'why':'По учебному тексту, семья продала доли, а Adidas и Puma управляются другими владельцами.'}
]
meanings = [
 {'letter':'a','text':'Auch in den nächsten Generationen gab es Rivalitäten.'},
 {'letter':'b','text':'Die Brüder arbeiteten gut zusammen.'},
 {'letter':'c','text':'Die beiden Brüder hatten immer mehr Probleme miteinander.'},
 {'letter':'d','text':'Adi interessierte sich für Sport und gründete eine Sportschuh-Firma.'},
 {'letter':'e','text':'Rudolf übernahm Aufgaben in der Firma.'}
]
matching = [
 {'q':'Die Partnerschaft funktionierte gut.','key':'b','why':'Партнёрство работало хорошо: братья успешно работали вместе.'},
 {'q':'Rudolf stieg in das Unternehmen ein.','key':'e','why':'„In ein Unternehmen einsteigen“ — присоединиться к предприятию и взять на себя работу в нём.'},
 {'q':'Die Söhne und Enkelsöhne führten den Kampf weiter.','key':'a','why':'Соперничество продолжилось и в следующих поколениях.'},
 {'q':'Das Verhältnis der beiden Brüder wurde immer schlechter.','key':'c','why':'Отношения ухудшались: проблем между братьями становилось всё больше.'}
]

def forms(subject, verb, chunks=(), tail=''):
    result=set()
    for order in itertools.permutations(chunks):
        result.add(' '.join(x for x in [subject,verb,*order,tail] if x)+'.')
    for i,front in enumerate(chunks):
        rest=chunks[:i]+chunks[i+1:]
        for order in itertools.permutations(rest):
            s=subject[0].lower()+subject[1:] if subject.split()[0] in ('Sie','Der','Die','Das','Auch') else subject
            result.add(' '.join(x for x in [front,verb,s,*order,tail] if x)+'.')
    return sorted(result)

sentences=[]
def add(prompt,model,variants,verb,hint):
    sentences.append(dict(prompt=prompt,model=model,variants=sorted(set(variants+[model])),verb=verb,hint=hint))

add('sie • vier Kinder • bekommen','Sie bekamen vier Kinder.',forms('Sie','bekamen',('vier Kinder',)),'bekamen','bekommen → bekamen: подлежащее sie во множественном числе.')
add('der jüngste Sohn Adi • für viele Sportarten • sich interessieren','Der jüngste Sohn Adi interessierte sich für viele Sportarten.',[
 'Für viele Sportarten interessierte sich der jüngste Sohn Adi.',
 'Für viele Sportarten interessierte der jüngste Sohn Adi sich.'
],'interessierte','sich interessieren → interessierte sich. Не забудьте возвратное местоимение sich.')
add('nach dem Ersten Weltkrieg • der Junge • aus seinem Interesse • ein Geschäft • machen','Nach dem Ersten Weltkrieg machte der Junge aus seinem Interesse ein Geschäft.',forms('Der Junge','machte',('nach dem Ersten Weltkrieg','aus seinem Interesse','ein Geschäft')),'machte','machen → machte. После начального обстоятельства глагол стоит на втором месте.')
add('drei Jahre später • auch Adis Bruder Rudolf • in das kleine Unternehmen • einsteigen','Drei Jahre später stieg auch Adis Bruder Rudolf in das kleine Unternehmen ein.',forms('Auch Adis Bruder Rudolf','stieg',('drei Jahre später','in das kleine Unternehmen'),'ein'),'stieg','einsteigen → stieg … ein: отделяемая приставка ein — в конце предложения.')
add('1924 • sie • zusammen • die „Gebrüder Dassler Schuhfabrik“ • gründen','1924 gründeten sie zusammen die „Gebrüder Dassler Schuhfabrik“.',forms('Sie','gründeten',('1924','zusammen','die „Gebrüder Dassler Schuhfabrik“')),'gründeten','gründen → gründeten: окончание -ten для sie во множественном числе.')
add('die Partnerschaft • am Anfang • gut • funktionieren','Die Partnerschaft funktionierte am Anfang gut.',forms('Die Partnerschaft','funktionierte',('am Anfang','gut')),'funktionierte','funktionieren → funktionierte. Подлежащее die Partnerschaft — единственное число.')
add('Adi • an der Weiterentwicklung der Schuhe • arbeiten','Adi arbeitete an der Weiterentwicklung der Schuhe.',forms('Adi','arbeitete',('an der Weiterentwicklung der Schuhe',)),'arbeitete','arbeiten → arbeitete. Сохраните сочетание an der Weiterentwicklung der Schuhe.')
add('Rudolf • sie • verkaufen','Rudolf verkaufte sie.',forms('Rudolf','verkaufte',('sie',)),'verkaufte','verkaufen → verkaufte. Местоимение sie здесь заменяет die Schuhe.')
v9=[]
for first in ['1936 fuhr Adi nach Berlin','Adi fuhr 1936 nach Berlin','Adi fuhr nach Berlin 1936','Nach Berlin fuhr Adi 1936']:
    for second in ['gab Jesse Owens seine Schuhe','gab seine Schuhe Jesse Owens','er gab Jesse Owens seine Schuhe','er gab seine Schuhe Jesse Owens','Adi gab Jesse Owens seine Schuhe','Adi gab seine Schuhe Jesse Owens']:
        v9.append(first+' und '+second+'.')
add('1936 • Adi • nach Berlin • fahren • und • seine Schuhe • Jesse Owens • geben','1936 fuhr Adi nach Berlin und gab Jesse Owens seine Schuhe.',v9,'fuhr / gab','fahren → fuhr; geben → gab. В обеих частях нужны формы Präteritum.')
add('Owens • in Dasslers Schuhen • vier Goldmedaillen • gewinnen','Owens gewann in Dasslers Schuhen vier Goldmedaillen.',forms('Owens','gewann',('in Dasslers Schuhen','vier Goldmedaillen')),'gewann','gewinnen → gewann. Проверьте также vier Goldmedaillen и in Dasslers Schuhen.')
add('nach vielen Konflikten • die Brüder • die Firma • teilen','Nach vielen Konflikten teilten die Brüder die Firma.',forms('Die Brüder','teilten',('nach vielen Konflikten','die Firma')),'teilten','teilen → teilten. Если предложение начинается с Nach vielen Konflikten, далее: teilten die Brüder.')
add('Adi und Rudolf • ihren Firmen • die Namen Adidas und Puma • geben','Adi und Rudolf gaben ihren Firmen die Namen Adidas und Puma.',forms('Adi und Rudolf','gaben',('ihren Firmen','die Namen Adidas und Puma')),'gaben','geben → gaben. Кому? ihren Firmen. Что? die Namen Adidas und Puma.')
add('die Söhne Horst und Armin Dassler • den Kampf der Väter • weiterführen','Die Söhne Horst und Armin Dassler führten den Kampf der Väter weiter.',forms('Die Söhne Horst und Armin Dassler','führten',('den Kampf der Väter',),'weiter'),'führten','weiterführen → führten … weiter. Приставка weiter стоит в конце.')
add('am Ende • die Familie Dassler • beide Firmen • verkaufen','Am Ende verkaufte die Familie Dassler beide Firmen.',forms('Die Familie Dassler','verkaufte',('am Ende','beide Firmen')),'verkaufte','verkaufen → verkaufte: Familie — единственное число, даже если речь о нескольких людях.')

glossary=[
 ['die Waschküche','помещение для стирки'],['das Unternehmen','предприятие'],['die Partnerschaft','партнёрство'],
 ['der Erfinder','изобретатель'],['die Weiterentwicklung','дальнейшее развитие, усовершенствование'],['der Verkäufer','продавец'],
 ['der Bruch','разрыв отношений'],['die Firma teilen','разделить фирму'],['umziehen','переезжать'],
 ['Fortschritte machen','добиваться прогресса'],['der Konkurrent','конкурент'],['der Stollenschuh','бутса с шипами'],
 ['die Rivalität','соперничество'],['der Firmenanteil','доля в компании'],['der Eigentümer','владелец']
]
data=dict(article=article,mc=mc,meanings=meanings,matching=matching,sentences=sentences,glossary=glossary)
template=(ROOT/'template.html').read_text(encoding='utf8')
for name,file in [('TOWN','herzogenaurach.jpg'),('STATUE','adi-dassler-skulptur.jpg'),('RUDOLF','rudolf-dassler.jpg')]:
    template=template.replace('@@'+name+'@@','data:image/jpeg;base64,'+base64.b64encode((ASSETS/file).read_bytes()).decode())
template=template.replace('@@LESSON_DATA@@',json.dumps(data,ensure_ascii=False).replace('<','\\u003c'))
(ROOT/'dist').mkdir(exist_ok=True)
(ROOT/'dist'/'index.html').write_text(template,encoding='utf8')
(ROOT/'index.html').write_text(template,encoding='utf8')
(ROOT.parent/'german_das_duell_der_brueder.html').write_text(template,encoding='utf8')
(ROOT/'lesson-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
print('Built',ROOT/'dist'/'index.html', 'bytes:',len(template.encode()),'Präteritum variants:',sum(len(s['variants']) for s in sentences))
