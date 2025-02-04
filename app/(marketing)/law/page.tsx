import Image from "next/image"
import { Check, Link, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Law = {
  name: string
  link: string
}

type CountryData = {
  country_flag: string
  country: string
  laws: Law[]
  canFix: boolean
}

const list: CountryData[] = [
  {
    country_flag: "https://flagcdn.com/al.svg",
    country: "Albania",
    laws: [
      {
        name: "Law on Inclusion of and Accessibility for Persons with Disabilities",
        link: "https://qbz.gov.al/share/GEt_JG4gSaSRFonEjzPMCw",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ad.svg",
    country: "Andorra",
    laws: [],
    canFix: false,
  },
  {
    country_flag: "https://flagcdn.com/am.svg",
    country: "Armenia",
    laws: [
      {
        name: "Law on Social Protection of Persons with Disabilities in the Republic of Armenia",
        link: "https://www.arlis.am/DocumentView.aspx?DocID=103510",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/at.svg",
    country: "Austria",
    laws: [
      {
        name: "Federal Disability Equality Act (BGStG)",
        link: "https://www.ris.bka.gv.at/Dokumente/Erv/ERV_2005_1_82/ERV_2005_1_82.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/az.svg",
    country: "Azerbaijan",
    laws: [
      {
        name: "Law on the Rights of Persons with Disabilities",
        link: "http://www.e-qanun.az/framework/39212",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/by.svg",
    country: "Belarus",
    laws: [
      {
        name: "Law on Social Protection of Disabled Persons in the Republic of Belarus",
        link: "https://pravo.by/document/?guid=3871&p0=H10800239",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/be.svg",
    country: "Belgium",
    laws: [
      {
        name: "Anti-Discrimination Law",
        link: "http://www.diversite.be/sites/default/files/documents/01_anti-discrimination_law.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ba.svg",
    country: "Bosnia and Herzegovina",
    laws: [
      {
        name: "Law on Prohibition of Discrimination",
        link: "https://www.legislationline.org/download/id/7575/file/Bosnia_and_Herzegovina_Law_on_Prohibition_of_Discrimination_2009_en.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/bg.svg",
    country: "Bulgaria",
    laws: [
      {
        name: "Law on Integration of People with Disabilities",
        link: "https://www.mlsp.government.bg/ckfinder/userfiles/files/eng/law/Law%20for%20integration%20of%20people%20with%20disabilities.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/hr.svg",
    country: "Croatia",
    laws: [
      {
        name: "Act on the Use of Croatian Sign Language and Other Forms of Communication of Deaf and Deafblind Persons in the Republic of Croatia",
        link: "https://narodne-novine.nn.hr/clanci/sluzbeni/2015_07_82_1571.html",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/cy.svg",
    country: "Cyprus",
    laws: [
      {
        name: "The Persons with Disabilities Law",
        link: "http://www.cylaw.org/nomoi/enop/non-ind/2000_1_127/full.html",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/cz.svg",
    country: "Czech Republic",
    laws: [
      {
        name: "Act on Equal Treatment and Legal Means of Protection against Discrimination",
        link: "https://www.ochrance.cz/uploads-import/ESO/Antidiscrimination_Act.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/dk.svg",
    country: "Denmark",
    laws: [
      {
        name: "Act on Prohibition of Discrimination on the Labour Market",
        link: "https://www.retsinformation.dk/eli/lta/2019/1002",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ee.svg",
    country: "Estonia",
    laws: [
      {
        name: "Equal Treatment Act",
        link: "https://www.riigiteataja.ee/en/eli/530102013003/consolide",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/fi.svg",
    country: "Finland",
    laws: [
      {
        name: "Non-Discrimination Act",
        link: "https://www.finlex.fi/en/laki/kaannokset/2014/en20141325.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/fr.svg",
    country: "France",
    laws: [
      {
        name: "Law No. 2005-102 of 11 February 2005 for Equal Rights and Opportunities, Participation and Citizenship of Persons with Disabilities",
        link: "https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000809647",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ge.svg",
    country: "Georgia",
    laws: [
      {
        name: "Law of Georgia on the Rights of Persons with Disabilities",
        link: "https://matsne.gov.ge/en/document/view/4655502?publication=0",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/de.svg",
    country: "Germany",
    laws: [
      {
        name: "Barrierefreiheitsstärkungsgesetz (BFSG)",
        link: "https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/barrierefreiheitsstaerkungsgesetz.html",
      },
      {
        name: "Barrierefreie-Informationstechnik-Verordnung - BITV 2.0",
        link: "https://www.barrierefreiheit-dienstekonsolidierung.bund.de/Webs/PB/DE/gesetze-und-richtlinien/bitv2-0/bitv2-0-node.html",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/gr.svg",
    country: "Greece",
    laws: [
      {
        name: "Law 4488/2017 on the Rights of Persons with Disabilities",
        link: "https://www.efka.gov.gr/sites/default/files/2020-05/law_4488_2017_en.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/hu.svg",
    country: "Hungary",
    laws: [
      {
        name: "Act on the Rights of Persons with Disabilities",
        link: "https://net.jogtar.hu/jogszabaly?docid=a1400042.tv",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/is.svg",
    country: "Iceland",
    laws: [
      {
        name: "Act on the Affairs of Persons with Disabilities",
        link: "https://www.althingi.is/lagas/nuna/1992081.html",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ie.svg",
    country: "Ireland",
    laws: [
      {
        name: "Disability Act 2005",
        link: "http://www.irishstatutebook.ie/eli/2005/act/14/enacted/en/html",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/it.svg",
    country: "Italy",
    laws: [
      {
        name: "Law No. 18/2009 on the Rights of Persons with Disabilities",
        link: "https://www.gazzettaufficiale.it/eli/id/2009/02/03/009G0014/sg",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/kz.svg",
    country: "Kazakhstan",
    laws: [
      {
        name: "Law on the Rights of Persons with Disabilities",
        link: "https://adilet.zan.kz/eng/docs/Z1500000158",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/lv.svg",
    country: "Latvia",
    laws: [
      {
        name: "Law on the Rights of Persons with Disabilities",
        link: "https://likumi.lv/doc.php?id=257039",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/li.svg",
    country: "Liechtenstein",
    laws: [],
    canFix: false,
  },
  {
    country_flag: "https://flagcdn.com/lt.svg",
    country: "Lithuania",
    laws: [
      {
        name: "Law on Equal Opportunities",
        link: "https://e-seimas.lrs.lt/portal/legalAct/lt/TAD/TAIS.384968",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/lu.svg",
    country: "Luxembourg",
    laws: [
      {
        name: "Law on the Rights of Persons with Disabilities",
        link: "https://legilux.public.lu/eli/etat/leg/loi/2011/07/28/n1/jo",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/mt.svg",
    country: "Malta",
    laws: [
      {
        name: "Equal Opportunities (Persons with Disability) Act",
        link: "https://legislation.mt/eli/cap/413/eng/pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/md.svg",
    country: "Moldova",
    laws: [
      {
        name: "Law on the Social Inclusion of Persons with Disabilities",
        link: "https://www.legis.md/cautare/getResults?doc_id=115633&lang=ro",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/mc.svg",
    country: "Monaco",
    laws: [],
    canFix: false,
  },
  {
    country_flag: "https://flagcdn.com/me.svg",
    country: "Montenegro",
    laws: [
      {
        name: "Law on Prohibition of Discrimination",
        link: "https://www.legislationline.org/download/id/7575/file/Bosnia_and_Herzegovina_Law_on_Prohibition_of_Discrimination_2009_en.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/nl.svg",
    country: "Netherlands",
    laws: [
      {
        name: "Equal Treatment on the Grounds of Disability or Chronic Illness Act",
        link: "https://wetten.overheid.nl/BWBR0009622/2021-01-01",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/mk.svg",
    country: "North Macedonia",
    laws: [
      {
        name: "Law on Prevention and Protection against Discrimination",
        link: "https://www.legislationline.org/download/id/7575/file/Bosnia_and_Herzegovina_Law_on_Prohibition_of_Discrimination_2009_en.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/no.svg",
    country: "Norway",
    laws: [
      {
        name: "Anti-Discrimination and Accessibility Act",
        link: "https://lovdata.no/dokument/NL/lov/2017-06-16-51",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/pl.svg",
    country: "Poland",
    laws: [
      {
        name: "Act on Vocational and Social Rehabilitation and Employment of Persons with Disabilities",
        link: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19971250776",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/pt.svg",
    country: "Portugal",
    laws: [
      {
        name: "Law on the Rights of Persons with Disabilities",
        link: "https://dre.pt/application/conteudo/243961",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ro.svg",
    country: "Romania",
    laws: [
      {
        name: "Law on the Rights of Persons with Disabilities",
        link: "https://legislatie.just.ro/Public/DetaliiDocument/165546",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ru.svg",
    country: "Russia",
    laws: [
      {
        name: "Federal Law on Social Protection of Disabled Persons in the Russian Federation",
        link: "http://www.consultant.ru/document/cons_doc_LAW_8559/",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/sm.svg",
    country: "San Marino",
    laws: [],
    canFix: false,
  },
  {
    country_flag: "https://flagcdn.com/rs.svg",
    country: "Serbia",
    laws: [
      {
        name: "Law on Prohibition of Discrimination",
        link: "https://www.legislationline.org/download/id/7575/file/Bosnia_and_Herzegovina_Law_on_Prohibition_of_Discrimination_2009_en.pdf",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/sk.svg",
    country: "Slovakia",
    laws: [
      {
        name: "Anti-Discrimination Act",
        link: "https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2004/365/",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/si.svg",
    country: "Slovenia",
    laws: [
      {
        name: "Act on Equal Opportunities for Persons with Disabilities",
        link: "https://www.uradni-list.si/1/content?id=111648",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/es.svg",
    country: "Spain",
    laws: [
      {
        name: "General Law on the Rights of Persons with Disabilities",
        link: "https://www.boe.es/buscar/act.php?id=BOE-A-2013-12632",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/se.svg",
    country: "Sweden",
    laws: [
      {
        name: "Discrimination Act",
        link: "https://www.government.se/information-material/2018/03/the-discrimination-act/",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ch.svg",
    country: "Switzerland",
    laws: [
      {
        name: "Federal Act on the Elimination of Discrimination against Persons with Disabilities",
        link: "https://www.fedlex.admin.ch/eli/cc/2003/667/en",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/ua.svg",
    country: "Ukraine",
    laws: [
      {
        name: "Law on the Basics of Protection of the Rights of Persons with Disabilities",
        link: "https://zakon.rada.gov.ua/laws/show/383-14",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/gb.svg",
    country: "United Kingdom",
    laws: [
      {
        name: "Equality Act 2010",
        link: "https://www.legislation.gov.uk/ukpga/2010/15/contents",
      },
    ],
    canFix: true,
  },
  {
    country_flag: "https://flagcdn.com/va.svg",
    country: "Vatican City",
    laws: [],
    canFix: false,
  },
]

export default function Page() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">
        Web Accessibility Laws by Country
      </h1>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flag</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Laws</TableHead>
              <TableHead>Actions Needed?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="align-top">
                  <div className="rounded border border-border p-1 aspect-square flex items-center justify-center bg-popover shadow">
                    <Image
                      src={item.country_flag}
                      alt={`${item.country} flag`}
                      width="24"
                      height="16"
                    />
                  </div>
                </TableCell>
                <TableCell>{item.country}</TableCell>
                <TableCell>
                  {item.laws.length > 0 ? (
                    <ul>
                      {item.laws.map((law, lawIndex) => (
                        <li key={lawIndex}>
                          <a
                            href={law.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600"
                          >
                            {law.name}
                          </a>
                        </li>
                      ))}
                    </ul>
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
    </div>
  )
}
