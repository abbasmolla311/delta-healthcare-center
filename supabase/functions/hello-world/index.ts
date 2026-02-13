
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

console.log('Hello from the updated function!')

serve(async (req) => {
  const { name } = await req.json()

  // 1. Securely access the secret from the backend environment
  const mySecret = Deno.env.get('SMTP_PASS')

  // 2. Prepare the response data
  const data = {
    message: `Hello, ${name}! Welcome to the backend.`,
    timestamp: new Date().toISOString(),
    // 3. Add a new property to confirm if the secret was found
    secretStatus: mySecret ? 'SUCCESS: The SMTP_PASS secret was found by the backend function.' : 'FAIL: The backend function could not find the SMTP_PASS secret.'
  }

  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
