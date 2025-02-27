import { ReadabilityButton } from '@/components/tools/readability-button'

export default function ReadabilityExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Readability Analysis Example</h1>
        <ReadabilityButton />
      </div>

      <div className="prose max-w-none">
        <p>
          Click the readability button above to analyze the text on this page.
          The tool will highlight paragraphs and show readability scores.
        </p>

        <h2>Simple Text (Basic Level)</h2>
        <p>
          This is a simple paragraph. It uses short words. The sentences are not
          long. Most people can read this text. It is at a basic level. Children
          in elementary school can understand this. There are no complex terms
          here.
        </p>

        <h2>Medium Complexity Text (Average Level)</h2>
        <p>
          This paragraph demonstrates a medium level of complexity in its
          language and structure. It contains some longer sentences with
          multiple clauses, which increases the cognitive load required for
          comprehension. The vocabulary includes moderately sophisticated terms
          that would typically be familiar to high school graduates. Concepts
          are presented with some supporting details and explanations.
        </p>

        <h2>Complex Text (Advanced Level)</h2>
        <p>
          The intricate interplay between socioeconomic factors and educational
          outcomes necessitates a multifaceted analytical approach that
          transcends simplistic correlational studies. Empirical evidence
          suggests that the implementation of pedagogical methodologies
          predicated on constructivist epistemologies may ameliorate cognitive
          disparities among demographically heterogeneous student populations.
          Furthermore, the extrapolation of longitudinal data indicates that
          metacognitive interventions, when systematically integrated into
          curricular frameworks, can significantly enhance academic performance
          metrics across diverse assessment paradigms.
        </p>

        <h2>Technical Documentation</h2>
        <p>
          React Server Components allow developers to build applications that
          span the server and client, combining the rich interactivity of
          client-side apps with the improved performance of traditional server
          rendering. In the RSC architecture, components on the server can
          access server-side resources like databases, file systems, and
          internal services directly, without the need for an API layer. These
          server components can then seamlessly integrate with client components
          that handle interactivity on the browser.
        </p>

        <h2>Legal Text</h2>
        <p>
          Notwithstanding anything to the contrary herein, the licensee shall
          indemnify and hold harmless the licensor, its affiliates, officers,
          directors, employees, agents, and representatives from and against any
          and all claims, damages, liabilities, costs, and expenses, including
          reasonable attorney's fees and expenses, arising out of or related to
          licensee's use of the licensed materials in violation of the terms and
          conditions set forth in this agreement. The aforementioned
          indemnification obligations shall survive the termination of this
          agreement.
        </p>
      </div>
    </div>
  )
}
