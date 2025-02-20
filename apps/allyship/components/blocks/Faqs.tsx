import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion'

export const Faqs = () => {
  const faqs = [
    {
      question: 'What is A11yShip.dev?',
      answer:
        'A11yShip.dev is a platform dedicated to improving web accessibility through training, consulting, and audits based on WCAG standards.',
    },
    {
      question: 'Who can benefit from your services?',
      answer:
        'Our services are designed for developers, designers, and organizations aiming to create inclusive digital experiences.',
    },
    {
      question: 'What is accessibility compliance?',
      answer:
        'Accessibility compliance ensures your digital content meets standards like WCAG, providing equal access to users with disabilities.',
    },
    {
      question: 'Why is accessibility important?',
      answer:
        'Accessibility improves user experience, expands your audience, and ensures legal compliance in many regions.',
    },
    {
      question: 'Do you offer custom training sessions?',
      answer:
        "Yes, we provide tailored training sessions to meet your team's specific needs and skill levels.",
    },
    {
      question: 'What are WCAG standards?',
      answer:
        'WCAG (Web Content Accessibility Guidelines) are international standards for making web content more accessible to people with disabilities.',
    },
    {
      question: 'How can I get started with A11yShip.dev?',
      answer:
        'Reach out to us through our contact page to discuss your accessibility needs and goals.',
    },
  ]

  return (
    <section className="py-32" aria-labelledby="faq">
      <div className="container max-w-2xl">
        <header>
          <h2
            className="mb-4 text-3xl font-bold mx-auto md:mb-11 md:text-5xl md:text-center text-pretty font-display"
            id="faq"
          >
            Questions & Answers
          </h2>
        </header>
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="hover:text-foreground/60 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
