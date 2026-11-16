import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
dotenv.config()

const app = express()
app.use(cors({origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true}))
app.use(express.json({limit:'1mb'}))
app.get('/api/health', (_,res)=>res.json({ok:true,service:'TripMate AI API'}))

function demoPlan(data) {
  const destination = data.destination || 'your destination'
  const days = 3
  const interest = (data.interests || 'local culture, food and sightseeing').split(',').map(x=>x.trim()).filter(Boolean)
  return {
    title:`A ${days}-day escape to ${destination}`,
    summary:`A balanced starter itinerary from ${data.origin || 'your city'} to ${destination}, shaped around ${interest.slice(0,3).join(', ') || 'exploration'}.`,
    budgetEstimate:Number(data.budget)||25000,
    itinerary:[
      {day:1,title:'Arrive & get your bearings',description:`Settle in and explore the heart of ${destination}.`,activities:[`Check in and enjoy a relaxed local breakfast`,`Visit a well-known landmark or historic neighbourhood`,`Try a popular local dinner spot`]},
      {day:2,title:'Discover the local highlights',description:'A full day for memorable sights and experiences.',activities:[`Start early with a major attraction`,`Explore experiences related to ${interest[0] || 'local culture'}`,`Leave time for a market, cafe or sunset viewpoint`]},
      {day:3,title:'Slow morning & farewell',description:'Enjoy a final taste of the destination before heading home.',activities:['Have a relaxed breakfast and revisit a favourite area','Pick up locally made souvenirs','Check out and begin your return journey']}
    ],
    tips:['Check attraction opening days and book popular activities in advance.','Keep a small buffer for local transport and unexpected expenses.','Carry a valid ID and check local weather before departure.'],
    source:'demo'
  }
}

app.post('/api/plan', async (req,res)=>{
  const data=req.body || {}
  if(!data.destination) return res.status(400).json({error:'Please enter a destination.'})
  if(!process.env.GEMINI_API_KEY) return res.json(demoPlan(data))
  try {
    const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model=genAI.getGenerativeModel({model:process.env.GEMINI_MODEL || 'gemini-2.5-flash'})
    const prompt=`You are TripMate AI, a practical travel planner. Create a realistic illustrative trip plan using these details: ${JSON.stringify(data)}.
Return ONLY valid JSON with this schema:
{"title":"...","summary":"...","budgetEstimate":25000,"itinerary":[{"day":1,"title":"...","description":"...","activities":["..."]}],"tips":["..."]}
Create 2 to 5 days based on date range if supplied, otherwise 3 days. Keep suggestions sensible and do not claim live availability, live prices, bookings, or verified opening hours. Budget estimate must be in INR and within or near the user's budget.`
    const result=await model.generateContent(prompt)
    let raw=result.response.text().trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'')
    const parsed=JSON.parse(raw)
    res.json({...parsed,source:'gemini'})
  } catch(err) {
    console.error('Gemini error:',err.message)
    res.json({...demoPlan(data),aiNote:'AI service was unavailable; showing a sample itinerary.'})
  }
})

const port=process.env.PORT || 5000
app.listen(port,()=>console.log(`TripMate AI API running on http://localhost:${port}`))
