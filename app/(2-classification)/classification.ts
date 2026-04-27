import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

import supportRequests from "./support_requests_multilanguage.json";
import { z } from "zod";
import { generateText, Output } from "ai";

async function main() {
  console.log("Asking AI to classify support requests...");

  // Defining the schem for a single classified request
  const classificationSchema = z.object({
    request: z.string().describe('The original support request text'),
    category: z
      .enum([
        'billing',
        'product_issues',
        'enterprise_sales',
        'account_issues',
        'product_feedback'
      ])
      .describe('The most relevant category for the support request'),
    urgency: z  
      .enum(['low', 'medium', 'high'])
      .describe('The probable urgency of the support request'),
    language: z.string().describe('The full name of the language the support request is in (e.g., English, Spanish, German). '),
    englishTranslation: z.string().describe("The support request text transcribed into english")
  })


  // Use generateText with Output.array() to get structured output
  const {output: classifiedRequests} = await generateText({
    model: 'mistral/devstral-small-2',
    prompt: `
      Classify the following support requests based on the defined categories.\n\n${JSON.stringify(supportRequests)} 
    `,
    output: Output.array({
      element: classificationSchema
    })
  })

  console.log('\n--- AI Response (Structured JSON) ---')
  // Output the validated structured array
  console.log(JSON.stringify(classifiedRequests, null, 2))
  console.log('-----------------------------------------------')
}

main().catch(console.error);
