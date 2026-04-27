import dotenvFlow from 'dotenv-flow'
dotenvFlow.config() // Load env variables (API keys, etc.)
import fs from 'fs'
import {generateText} from 'ai' // AI SDK's core text generation function

// Read the essay file from which names will be extracted from
const essay = fs.readFileSync('app/(1-extraction)/essay.txt', 'utf-8');

// Few-shot prompt with examples
const fewShotPrompt = `Extract all person names from text, including their roles if mentioned.
 
Example 1:
Text: "CEO Sarah Chen met with investor Mark Johnson at the conference."
Output:
- Sarah Chen (CEO)
- Mark Johnson (investor)
 
Example 2:
Text: "The founders, Alex and Jamie, hired consultant Dr. Lisa Wang."
Output:
- Alex (founder)
- Jamie (founder)
- Dr. Lisa Wang (consultant)
 
Now extract from this text:
${essay}
 
Output:`;
 
// Structured JSON extraction
const structuredPrompt = `Extract names and relationships from this essay.
Format as JSON with this structure:
 
{
  "people": [
    {
      "name": "Full Name",
      "role": "their role/title if mentioned",
      "relationships": ["list of people they're connected to"]
    }
  ]
}
 
Essay: ${essay}`;

// Consistency testing function
async function testConsistency(prompt:string, iterations: number = 3){
  const results = []
  for (let i = 0; i < iterations; i++){
    const result = await generateText({
      model: 'mistral/devstral-small-2',
      prompt: prompt
    })
    results.push(result.text)

    console.log('Consistency Test Results:')
    results.forEach((result, i) => {
      console.log(`Run ${i + 1}:`, result)
    })
  }
}
 
async function main(){
  testConsistency(fewShotPrompt)
}




main().catch((error) => {
  console.error('❌ Extraction failed:', error.message)
  console.log('\n Common issues:')
  console.log('  - Check your .env.local file has valid API keys');
  console.log('  - Verify essay.txt exists at app/(1-extraction)/essay.txt');
  console.log('  - Ensure you have internet connectivity for API calls');
  process.exit(1)
})