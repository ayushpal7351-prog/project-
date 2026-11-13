import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Plane, MapPin, CalendarDays, Wallet, Sparkles, Compass, Bookmark, Trash2, ArrowRight, Menu, X, Clock, Users, Heart, Globe2 } from 'lucide-react'
import './style.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const initialForm = { origin:'New Delhi', destination:'Jaipur', startDate:'', endDate:'', budget:'25000', travellers:'2', interests:'culture, food, history' }

function App() {
  const [form,setForm] = useState(initialForm)
  const [trip,setTrip] = useState(null)
  const [saved,setSaved] = useState(() => JSON.parse(localStorage.getItem('tripmate-saved') || '[]'))
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const [menu,setMenu] = useState(false)
  const [active,setActive] = useState('planner')

  useEffect(()=>localStorage.setItem('tripmate-saved',JSON.stringify(saved)),[saved])
  const update = e => setForm({...form,[e.target.name]:e.target.value})
  async function planTrip(e) {
    e.preventDefault(); setLoading(true); setError(''); setTrip(null)
    try {
      const res = await fetch(`${API}/api/plan`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      if (!res.ok) throw new Error((await res.json()).error || 'Could not generate itinerary')
      setTrip(await res.json())
    } catch (err) {
      setError(`${err.message}. Make sure the backend is running on port 5000.`)
    } finally { setLoading(false) }
  }
  function saveTrip() {
    if (!trip) return
    const item = {...trip, id:Date.now(), destination:form.destination, createdAt:new Date().toLocaleDateString()}
    setSaved([item,...saved]); setActive('saved')
  }
  function removeTrip(id) { setSaved(saved.filter(x=>x.id!==id)) }

  return <div className="app">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><Plane size={20}/></span><span>tripmate<span className="brand-ai">.ai</span><small>TRAVEL, REIMAGINED</small></span></a>
      <button className="mobile-menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
      <nav className={menu?'nav open':'nav'}>
        <button className={active==='planner'?'nav-link active':'nav-link'} onClick={()=>{setActive('planner');setMenu(false)}}>Plan a trip</button>
        <button className={active==='saved'?'nav-link active':'nav-link'} onClick={()=>{setActive('saved');setMenu(false)}}>My trips <span className="count">{saved.length}</span></button>
        <a className="nav-cta" href="#planner">Start exploring <ArrowRight size={16}/></a>
      </nav>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> YOUR PERSONAL AI TRAVEL COMPANION</div>
          <h1>Less planning.<br/><em>More wandering.</em></h1>
          <p>Tell us what moves you. TripMate AI turns your travel ideas into a thoughtful, day-by-day journey.</p>
          <a href="#planner" className="hero-button">Plan my getaway <ArrowRight size={17}/></a>
          <div className="hero-proof"><span className="proof-avatars">✦ ✦ ✦</span><span>Made for curious travellers</span></div>
        </div>
        <div className="hero-art">
          <div className="sun"></div><div className="mountain back"></div><div className="mountain front"></div>
          <div className="road"></div><div className="floating-card"><MapPin size={16}/><span><b>Your next story</b><small>Starts somewhere new</small></span></div>
          <div className="art-label">FIND YOUR<br/>SOMEWHERE</div>
        </div>
      </section>

      <section className="trust-row">
        <div><Compass/><span><b>Personalised plans</b><small>Built around your interests</small></span></div>
        <div><Wallet/><span><b>Budget mindful</b><small>Make every rupee count</small></span></div>
        <div><Clock/><span><b>Day-wise itineraries</b><small>More time for the good stuff</small></span></div>
      </section>

      {active==='planner' ? <section className="planner-section" id="planner">
        <div className="section-heading"><div><div className="eyebrow dark"><Sparkles size={14}/> LET'S MAKE IT HAPPEN</div><h2>Where to next?</h2><p>A few details are all we need to get you going.</p></div><div className="step-pill">01 <span>—</span> YOUR TRIP</div></div>
        <div className="planner-grid">
          <form className="form-card" onSubmit={planTrip}>
            <div className="form-title"><Globe2/><div><b>Your journey</b><small>Start with the essentials</small></div></div>
            <div className="field-row">
              <label>FROM<div className="input-wrap"><MapPin/><input name="origin" value={form.origin} onChange={update} required placeholder="Starting city"/></div></label>
              <label>DESTINATION<div className="input-wrap"><Plane/><input name="destination" value={form.destination} onChange={update} required placeholder="Where to?"/></div></label>
            </div>
            <div className="field-row">
              <label>DEPARTURE<div className="input-wrap"><CalendarDays/><input type="date" name="startDate" value={form.startDate} onChange={update}/></div></label>
              <label>RETURN<div className="input-wrap"><CalendarDays/><input type="date" name="endDate" value={form.endDate} onChange={update}/></div></label>
            </div>
            <div className="field-row">
              <label>YOUR BUDGET (INR)<div className="input-wrap"><span className="rupee">₹</span><input type="number" min="1000" name="budget" value={form.budget} onChange={update}/></div></label>
              <label>TRAVELLERS<div className="input-wrap"><Users/><input type="number" min="1" max="20" name="travellers" value={form.travellers} onChange={update}/></div></label>
            </div>
            <label>WHAT ARE YOU INTO?<div className="input-wrap full"><Heart/><input name="interests" value={form.interests} onChange={update} placeholder="Food, nature, adventure, art..."/></div></label>
            <button className="generate" disabled={loading}>{loading?<><span className="spinner"></span> Crafting your trip...</>:<><Sparkles size={18}/> Generate my itinerary <ArrowRight size={17}/></>}</button>
            {error && <p className="error">{error}</p>}
            <p className="privacy-note">✦ Your trip details stay in this demo app's browser session.</p>
          </form>
          <aside className="side-note"><div className="note-icon">✧</div><h3>Not just a trip.<br/><em>Your kind of trip.</em></h3><p>From hidden gems to must-see landmarks, get a plan shaped around the way you love to travel.</p><div className="mini-route"><span></span><div><b>Dream</b><small>Pick your destination</small></div><i></i><div><b>Discover</b><small>Get your AI itinerary</small></div><i></i><div><b>Go</b><small>Make memories</small></div></div></aside>
        </div>
        {trip && <section className="results">
          <div className="results-head"><div><div className="eyebrow dark">YOUR TRIPMATE PLAN</div><h2>{trip.title}</h2><p>{trip.summary}</p></div><button className="save-button" onClick={saveTrip}><Bookmark size={16}/> Save trip</button></div>
          <div className="stats"><div><small>ESTIMATED BUDGET</small><b>₹{Number(trip.budgetEstimate||form.budget).toLocaleString('en-IN')}</b></div><div><small>TRAVELLERS</small><b>{form.travellers}</b></div><div><small>DESTINATION</small><b>{form.destination}</b></div></div>
          <div className="days">{(trip.itinerary||[]).map((day,i)=><article className="day-card" key={i}><div className="day-number">DAY {day.day||i+1}</div><div><h3>{day.title}</h3><p>{day.description}</p><ul>{(day.activities||[]).map((a,j)=><li key={j}>{a}</li>)}</ul></div></article>)}</div>
          {trip.tips?.length>0 && <div className="tips"><b>✦ TripMate tips</b>{trip.tips.map((t,i)=><p key={i}>• {t}</p>)}</div>}
          <p className="disclaimer">Estimates and suggestions are for planning purposes only. Confirm opening times, transport, prices and local conditions before travelling.</p>
        </section>}
      </section> : <section className="planner-section saved-section"><div className="section-heading"><div><div className="eyebrow dark">YOUR TRAVEL COLLECTION</div><h2>My trips</h2><p>Your saved journeys, all in one place.</p></div></div>{saved.length===0?<div className="empty"><Compass size={34}/><h3>No saved trips yet</h3><p>Generate an itinerary and save it here for later.</p><button className="generate compact" onClick={()=>setActive('planner')}>Plan a trip <ArrowRight size={16}/></button></div>:<div className="saved-grid">{saved.map(s=><article className="saved-card" key={s.id}><div className="saved-icon"><MapPin/></div><small>SAVED {s.createdAt}</small><h3>{s.destination}</h3><p>{s.summary}</p><button onClick={()=>removeTrip(s.id)} className="remove"><Trash2 size={15}/> Remove</button></article>)}</div>}</section>}
    </main>
    <footer><a className="brand footer-brand" href="#"><span className="brand-icon"><Plane size={18}/></span><span>tripmate<span className="brand-ai">.ai</span><small>TRAVEL, REIMAGINED</small></span></a><span>Made for the journey. © 2026 TripMate AI</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
