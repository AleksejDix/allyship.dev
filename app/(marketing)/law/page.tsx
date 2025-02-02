import Image from "next/image"
import { Check, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CountryData {
  Country: string
  Law: string | undefined
  Link: string | undefined
  canFix: boolean
  Flag_SVG: string
}

const list: CountryData[] = [
  {
    Country: "Albania",
    Law: "Law on Inclusion of and Accessibility for Persons with Disabilities",
    Link: "https://qbz.gov.al/share/GEt_JG4gSaSRFonEjzPMCw",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/al.svg",
  },
  {
    Country: "Andorra",
    Law: undefined,
    Link: undefined,
    canFix: false,
    Flag_SVG: "https://flagcdn.com/ad.svg",
  },
  {
    Country: "Armenia",
    Law: "Law on Social Protection of Persons with Disabilities in the Republic of Armenia",
    Link: "https://www.arlis.am/DocumentView.aspx?DocID=103510",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/am.svg",
  },
  {
    Country: "Austria",
    Law: "Federal Disability Equality Act (BGStG)",
    Link: "https://www.ris.bka.gv.at/Dokumente/Erv/ERV_2005_1_82/ERV_2005_1_82.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/at.svg",
  },
  {
    Country: "Azerbaijan",
    Law: "Law on the Rights of Persons with Disabilities",
    Link: "http://www.e-qanun.az/framework/39212",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/az.svg",
  },
  {
    Country: "Belarus",
    Law: "Law on Social Protection of Disabled Persons in the Republic of Belarus",
    Link: "https://pravo.by/document/?guid=3871&p0=H10800239",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/by.svg",
  },
  {
    Country: "Belgium",
    Law: "Anti-Discrimination Law",
    Link: "http://www.diversite.be/sites/default/files/documents/01_anti-discrimination_law.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/be.svg",
  },
  {
    Country: "Bosnia and Herzegovina",
    Law: "Law on Prohibition of Discrimination",
    Link: "https://www.legislationline.org/download/id/7575/file/Bosnia_and_Herzegovina_Law_on_Prohibition_of_Discrimination_2009_en.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/ba.svg",
  },
  {
    Country: "Bulgaria",
    Law: "Law on Integration of People with Disabilities",
    Link: "https://www.mlsp.government.bg/ckfinder/userfiles/files/eng/law/Law%20for%20integration%20of%20people%20with%20disabilities.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/bg.svg",
  },
  {
    Country: "Croatia",
    Law: "Act on the Use of Croatian Sign Language and Other Forms of Communication of Deaf and Deafblind Persons in the Republic of Croatia",
    Link: "https://narodne-novine.nn.hr/clanci/sluzbeni/2015_07_82_1571.html",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/hr.svg",
  },
  {
    Country: "Cyprus",
    Law: "The Persons with Disabilities Law",
    Link: "http://www.cylaw.org/nomoi/enop/non-ind/2000_1_127/full.html",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/cy.svg",
  },
  {
    Country: "Czech Republic",
    Law: "Act on Equal Treatment and Legal Means of Protection against Discrimination",
    Link: "https://www.ochrance.cz/uploads-import/ESO/Antidiscrimination_Act.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/cz.svg",
  },
  {
    Country: "Denmark",
    Law: "Act on Prohibition of Discrimination on the Labour Market",
    Link: "https://www.retsinformation.dk/eli/lta/2019/1002",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/dk.svg",
  },
  {
    Country: "Estonia",
    Law: "Equal Treatment Act",
    Link: "https://www.riigiteataja.ee/en/eli/530102013003/consolide",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/ee.svg",
  },
  {
    Country: "Finland",
    Law: "Non-Discrimination Act",
    Link: "https://www.finlex.fi/en/laki/kaannokset/2014/en20141325.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/fi.svg",
  },
  {
    Country: "France",
    Law: "Law No. 2005-102 of 11 February 2005 for Equal Rights and Opportunities, Participation and Citizenship of Persons with Disabilities",
    Link: "https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000809647",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/fr.svg",
  },
  {
    Country: "Georgia",
    Law: "Law of Georgia on the Rights of Persons with Disabilities",
    Link: "https://matsne.gov.ge/en/document/view/4655502?publication=0",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/ge.svg",
  },
  {
    Country: "Germany",
    Law: "Act on Equal Opportunities for Persons with Disabilities",
    Link: "https://www.gesetze-im-internet.de/behindertengleichstellungsgesetz/BGG.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/de.svg",
  },
  {
    Country: "Greece",
    Law: "Law 4488/2017 on the Rights of Persons with Disabilities",
    Link: "https://www.efka.gov.gr/sites/default/files/2020-05/law_4488_2017_en.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/gr.svg",
  },
  {
    Country: "Hungary",
    Law: "Act on the Rights of Persons with Disabilities",
    Link: "https://net.jogtar.hu/jogszabaly?docid=a1400042.tv",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/hu.svg",
  },
  {
    Country: "Iceland",
    Law: "Act on the Affairs of Persons with Disabilities",
    Link: "https://www.althingi.is/lagas/nuna/1992081.html",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/is.svg",
  },
  {
    Country: "Ireland",
    Law: "Disability Act 2005",
    Link: "http://www.irishstatutebook.ie/eli/2005/act/14/enacted/en/html",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/ie.svg",
  },
  {
    Country: "Italy",
    Law: "Law No. 18/2009 on the Rights of Persons with Disabilities",
    Link: "https://www.gazzettaufficiale.it/eli/id/2009/02/03/009G0014/sg",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/it.svg",
  },
  {
    Country: "Kazakhstan",
    Law: "Law on the Rights of Persons with Disabilities",
    Link: "https://adilet.zan.kz/eng/docs/Z1500000158",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/kz.svg",
  },
  {
    Country: "Latvia",
    Law: "Law on the Rights of Persons with Disabilities",
    Link: "https://likumi.lv/doc.php?id=257039",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/lv.svg",
  },
  {
    Country: "Liechtenstein",
    Law: undefined,
    Link: undefined,
    canFix: false,
    Flag_SVG: "https://flagcdn.com/li.svg",
  },
  {
    Country: "Lithuania",
    Law: "Law on Equal Opportunities",
    Link: "https://e-seimas.lrs.lt/portal/legalAct/lt/TAD/TAIS.384968",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/lt.svg",
  },
  {
    Country: "Luxembourg",
    Law: "Law on the Rights of Persons with Disabilities",
    Link: "https://legilux.public.lu/eli/etat/leg/loi/2011/07/28/n1/jo",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/lu.svg",
  },
  {
    Country: "Malta",
    Law: "Equal Opportunities (Persons with Disability) Act",
    Link: "https://legislation.mt/eli/cap/413/eng/pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/mt.svg",
  },
  {
    Country: "Moldova",
    Law: "Law on the Social Inclusion of Persons with Disabilities",
    Link: "https://www.legis.md/cautare/getResults?doc_id=115633&lang=ro",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/md.svg",
  },
  {
    Country: "Monaco",
    Law: undefined,
    Link: undefined,
    canFix: false,
    Flag_SVG: "https://flagcdn.com/mc.svg",
  },
  {
    Country: "Montenegro",
    Law: "Law on Prohibition of Discrimination",
    Link: "https://www.legislationline.org/download/id/7575/file/Bosnia_and_Herzegovina_Law_on_Prohibition_of_Discrimination_2009_en.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/me.svg",
  },
  {
    Country: "Netherlands",
    Law: "Equal Treatment on the Grounds of Disability or Chronic Illness Act",
    Link: "https://wetten.overheid.nl/BWBR0009622/2021-01-01",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/nl.svg",
  },
  {
    Country: "North Macedonia",
    Law: "Law on Prevention and Protection against Discrimination",
    Link: "https://www.legislationline.org/download/id/7575/file/Bosnia_and_Herzegovina_Law_on_Prohibition_of_Discrimination_2009_en.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/mk.svg",
  },
  {
    Country: "Norway",
    Law: "Anti-Discrimination and Accessibility Act",
    Link: "https://lovdata.no/dokument/NL/lov/2017-06-16-51",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/no.svg",
  },
  {
    Country: "Poland",
    Law: "Act on Vocational and Social Rehabilitation and Employment of Persons with Disabilities",
    Link: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19971250776",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/pl.svg",
  },
  {
    Country: "Portugal",
    Law: "Law on the Rights of Persons with Disabilities",
    Link: "https://dre.pt/application/conteudo/243961",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/pt.svg",
  },
  {
    Country: "Romania",
    Law: "Law on the Rights of Persons with Disabilities",
    Link: "https://legislatie.just.ro/Public/DetaliiDocument/165546",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/ro.svg",
  },
  {
    Country: "Russia",
    Law: "Federal Law on Social Protection of Disabled Persons in the Russian Federation",
    Link: "http://www.consultant.ru/document/cons_doc_LAW_8559/",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/ru.svg",
  },
  {
    Country: "San Marino",
    Law: undefined,
    Link: undefined,
    canFix: false,
    Flag_SVG: "https://flagcdn.com/sm.svg",
  },
  {
    Country: "Serbia",
    Law: "Law on Prohibition of Discrimination",
    Link: "https://www.legislationline.org/download/id/7575/file/Bosnia_and_Herzegovina_Law_on_Prohibition_of_Discrimination_2009_en.pdf",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/rs.svg",
  },
  {
    Country: "Slovakia",
    Law: "Anti-Discrimination Act",
    Link: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2004/365/",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/sk.svg",
  },
  {
    Country: "Slovenia",
    Law: "Act on Equal Opportunities for Persons with Disabilities",
    Link: "https://www.uradni-list.si/1/content?id=111648",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/si.svg",
  },
  {
    Country: "Spain",
    Law: "General Law on the Rights of Persons with Disabilities",
    Link: "https://www.boe.es/buscar/act.php?id=BOE-A-2013-12632",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/es.svg",
  },
  {
    Country: "Sweden",
    Law: "Discrimination Act",
    Link: "https://www.government.se/information-material/2018/03/the-discrimination-act/",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/se.svg",
  },
  {
    Country: "Switzerland",
    Law: "Federal Act on the Elimination of Discrimination against Persons with Disabilities",
    Link: "https://www.fedlex.admin.ch/eli/cc/2004/751/en",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/ch.svg",
  },
  {
    Country: "Ukraine",
    Law: "Law on the Basics of Protection of the Rights of Persons with Disabilities",
    Link: "https://zakon.rada.gov.ua/laws/show/383-14",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/ua.svg",
  },
  {
    Country: "United Kingdom",
    Law: "Equality Act 2010",
    Link: "https://www.legislation.gov.uk/ukpga/2010/15/contents",
    canFix: true,
    Flag_SVG: "https://flagcdn.com/gb.svg",
  },
  {
    Country: "Vatican City",
    Law: undefined,
    Link: undefined,
    canFix: false,
    Flag_SVG: "https://flagcdn.com/va.svg",
  },
]

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">
        Web Accessibility Laws by Country
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flag</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Law</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="rounded border border-border p-1 aspect-square flex items-center justify-center bg-popover shadow">
                  <Image
                    src={item.Flag_SVG}
                    alt={`${item.Country} flag`}
                    width="24"
                    height="16"
                  />
                </div>
              </TableCell>
              <TableCell>{item.Country}</TableCell>
              <TableCell>
                {item.Law ? (
                  <a
                    href={item.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
                  >
                    {item.Law}
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                {item.canFix ? (
                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1"
                  >
                    <Check size={16} />
                    Yes
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
