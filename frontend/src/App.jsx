import { useEffect, useState } from 'react'
import {
  Activity,
  Accessibility,
  ArrowDownRight,
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileHeart,
  Heart,
  HeartPulse,
  Home,
  Hospital,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UploadCloud,
  X,
  Footprints,
  ClipboardList,
  Pill,
  PackageCheck,
  ExternalLink,
  AlertTriangle,
  LoaderCircle
} from 'lucide-react'

import { api } from './api'

const equipmentSeed = [
  {
    id: 1,
    name: 'Lightweight wheelchair',
    category: 'Mobility',
    description: 'Foldable, comfortable mobility support for everyday use.',
    location: 'Tambaram, Chennai',
    daily_rate: 0,
    available: true,
    image_url:
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 2,
    name: 'Folding walker',
    category: 'Mobility',
    description: 'Stable walking support with an easy-fold frame.',
    location: 'Chromepet, Chennai',
    daily_rate: 50,
    available: true,
    image_url:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 3,
    name: 'Oxygen concentrator',
    category: 'Respiratory',
    description:
      'Home-use respiratory equipment. Confirm suitability with a clinician.',
    location: 'Pallavaram, Chennai',
    daily_rate: 350,
    available: true,
    image_url:
      'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=85'
  }
]

const resourceSeed = [
  {
    id: 1,
    name: 'Community Care Clinic',
    kind: 'Clinic',
    address: 'Tambaram, Chennai',
    phone: 'Call to verify',
    opening_hours: 'Call to confirm'
  },
  {
    id: 2,
    name: 'City Pharmacy',
    kind: 'Pharmacy',
    address: 'Chromepet, Chennai',
    phone: 'Call to verify',
    opening_hours: 'Call to confirm'
  },
  {
    id: 3,
    name: 'General Hospital',
    kind: 'Hospital',
    address: 'Pallavaram, Chennai',
    phone: 'Call to verify',
    opening_hours: 'Call to confirm'
  }
]

const initialReminders = [
  {
    id: 'demo1',
    title: 'Morning medication',
    reminder_type: 'Medication',
    due_at: 'Today · 8:00 AM',
    notes: 'As prescribed by your clinician',
    completed: false
  },
  {
    id: 'demo2',
    title: 'Return walker',
    reminder_type: 'Equipment',
    due_at: 'Tomorrow · 5:00 PM',
    notes: 'Confirm pickup with lender',
    completed: false
  },
  {
    id: 'demo3',
    title: 'Follow-up appointment',
    reminder_type: 'Appointment',
    due_at: 'Fri · 10:30 AM',
    notes: 'Bring recent reports',
    completed: true
  }
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Equipment sharing', icon: Accessibility },
  { label: 'Symptom checker', icon: HeartPulse },
  { label: 'Find care', icon: MapPin },
  { label: 'Health records', icon: FileHeart },
  { label: 'Reminders', icon: CalendarClock }
]

const imageFallback =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80'

function App() {
  const [active, setActive] = useState('Overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [equipment, setEquipment] = useState(equipmentSeed)
  const [resources, setResources] = useState(resourceSeed)
  const [reminders, setReminders] = useState(initialReminders)
  const [apiOnline, setApiOnline] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [modal, setModal] = useState(null)

  useEffect(() => {
    api
      .equipment()
      .then(data => {
        setEquipment(data)
        setApiOnline(true)
      })
      .catch(() => {})

    api.resources().then(setResources).catch(() => {})

    api
      .reminders()
      .then(data => {
        if (data.length) setReminders(data)
      })
      .catch(() => {})
  }, [])

  function notify(message) {
    setToast(message)

    window.setTimeout(() => {
      setToast('')
    }, 3200)
  }

  function navigate(label) {
    setActive(label)
    setSearch('')
    setMobileNav(false)
  }

  const pageTitle =
    active === 'Overview' ? 'Your health, connected.' : active

  const pageSubtitle = {
    Overview:
      'A little more support for every step of your health journey.',
    'Equipment sharing':
      'Borrow, lend, and share the equipment that helps people recover.',
    'Symptom checker':
      'Understand possible next steps — not a diagnosis.',
    'Find care':
      'Explore care options and community health resources.',
    'Health records':
      'Keep your important health documents organized.',
    Reminders:
      'Small reminders can make caring for yourself easier.'
  }[active]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark">
            <HeartPulse size={23} strokeWidth={2.5} />
          </div>

          <div>
            <div className="brand-name">
              curelink<span>.</span>
            </div>
            <div className="brand-caption">CARE, CONNECTED</div>
          </div>

          <button
            className="icon-button mobile-close"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="workspace-label">YOUR SPACE</div>

        <nav className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  active === item.label ? 'active' : ''
                }`}
                onClick={() => navigate(item.label)}
              >
                <Icon size={19} strokeWidth={1.9} />

                <span>{item.label}</span>

                {item.label === 'Reminders' && (
                  <span className="nav-count">
                    {reminders.filter(r => !r.completed).length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-spacer" />

        <div className="support-card">
          <div className="support-icon">
            <ShieldCheck size={20} />
          </div>

          <div className="support-title">Your care matters</div>

          <p>
            Need urgent medical help? Contact local emergency services.
          </p>

          <button
            onClick={() =>
              notify(
                'For an emergency, contact your local emergency number now.'
              )
            }
            className="support-link"
          >
            Get help <ArrowRight size={14} />
          </button>
        </div>

        <div className="profile-row">
          <div className="avatar">AS</div>

          <div className="profile-copy">
            <strong>Welcome back</strong>
            <span>Your personal space</span>
          </div>

          <ChevronDown size={16} className="muted-icon" />
        </div>
      </aside>

      {mobileNav && (
        <button
          className="scrim"
          onClick={() => setMobileNav(false)}
          aria-label="Close menu"
        />
      )}

      <main className="main-panel">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="crumb-slash">/</span>
            <strong>{active}</strong>
          </div>

          <div className="topbar-right">
            <div
              className={`connection-pill ${
                apiOnline ? 'online' : ''
              }`}
            >
              <span className="status-dot" />

              {apiOnline ? 'Connected' : 'Preview mode'}
            </div>

            <button
              className="notification-button"
              aria-label="Notifications"
              onClick={() => navigate('Reminders')}
            >
              <Bell size={19} />
              <i />
            </button>

            <div className="top-avatar">AS</div>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                YOUR HEALTH COMPANION
              </div>

              <h1>{pageTitle}</h1>

              <p className="page-subtitle">{pageSubtitle}</p>
            </div>

            {active !== 'Overview' && (
              <button
                className="secondary-button"
                onClick={() => navigate('Overview')}
              >
                <Home size={16} />
                Back to overview
              </button>
            )}
          </div>

          {active === 'Overview' && (
            <Overview
              equipment={equipment}
              reminders={reminders}
              resources={resources}
              onNavigate={navigate}
              onModal={setModal}
            />
          )}

          {active === 'Equipment sharing' && (
            <EquipmentPage
              equipment={equipment}
              search={search}
              setSearch={setSearch}
              onBorrow={item =>
                setModal({
                  type: 'borrow',
                  item
                })
              }
              onAdd={() =>
                setModal({
                  type: 'listEquipment'
                })
              }
            />
          )}

          {active === 'Symptom checker' && (
            <SymptomPage notify={notify} />
          )}

          {active === 'Find care' && (
            <ResourcesPage
              resources={resources}
              search={search}
              setSearch={setSearch}
            />
          )}

          {active === 'Health records' && (
            <RecordsPage notify={notify} />
          )}

          {active === 'Reminders' && (
            <RemindersPage
              reminders={reminders}
              setReminders={setReminders}
              onAdd={() =>
                setModal({
                  type: 'reminder'
                })
              }
              notify={notify}
            />
          )}

          <footer className="footer">
            <div>
              <Heart size={13} fill="currentColor" />
              Made for more accessible care.
            </div>

            <span>CURELINK · HEALTHCARE, WITH HEART</span>
          </footer>
        </div>
      </main>

      {modal && (
        <Modal
          modal={modal}
          onClose={() => setModal(null)}
          equipment={equipment}
          setEquipment={setEquipment}
          setReminders={setReminders}
          notify={notify}
        />
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  )
}

function Overview({
  equipment,
  reminders,
  resources,
  onNavigate,
  onModal
}) {
  const openReminders = reminders.filter(r => !r.completed)

  return (
    <div className="dashboard-grid">
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-tag">
            <Sparkles size={14} />
            A COMMUNITY THAT CARES
          </div>

          <h2>
            Better care starts
            <br />
            with <em>being connected.</em>
          </h2>

          <p>
            Find the support you need, share what you can, and make your
            health journey a little easier.
          </p>

          <button
            className="hero-button"
            onClick={() => onNavigate('Equipment sharing')}
          >
            Explore equipment
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="hero-art">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="hero-circle">
            <HeartPulse size={65} strokeWidth={1.4} />
          </div>

          <div className="float-chip chip-one">
            <span className="chip-icon mint">
              <Accessibility size={17} />
            </span>

            <span>
              <b>Shared with care</b>
              <small>Equipment access</small>
            </span>
          </div>

          <div className="float-chip chip-two">
            <span className="chip-icon lilac">
              <ShieldCheck size={17} />
            </span>

            <span>
              <b>Care, made simpler</b>
              <small>One connected place</small>
            </span>
          </div>

          <div className="sparkle sparkle-a">✳</div>
          <div className="sparkle sparkle-b">✦</div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          icon={PackageCheck}
          label="Equipment available"
          value={equipment
            .filter(e => e.available)
            .length.toString()
            .padStart(2, '0')}
          detail="Ready to be shared"
          tone="mint"
        />

        <StatCard
          icon={Hospital}
          label="Care resources"
          value={resources.length
            .toString()
            .padStart(2, '0')}
          detail="Clinics & more"
          tone="blue"
        />

        <StatCard
          icon={CalendarClock}
          label="Your reminders"
          value={openReminders.length
            .toString()
            .padStart(2, '0')}
          detail="Coming up next"
          tone="peach"
        />
      </section>

      <section className="section-block equipment-section">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              COMMUNITY SUPPORT
            </div>

            <h3>Equipment to help you heal</h3>

            <p>
              Useful things, shared when they matter most.
            </p>
          </div>

          <button
            className="text-button"
            onClick={() => onNavigate('Equipment sharing')}
          >
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="equipment-grid">
          {equipment
            .slice(0, 3)
            .map(item => (
              <EquipmentCard
                key={item.id}
                item={item}
                onBorrow={() =>
                  onModal({
                    type: 'borrow',
                    item
                  })
                }
              />
            ))}
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel-card quick-panel">
          <div className="panel-heading">
            <div>
              <h3>How can we help?</h3>
              <p>Choose what you need today.</p>
            </div>

            <div className="heading-icon">
              <Sparkles size={17} />
            </div>
          </div>

          <div className="quick-actions">
            <QuickAction
              icon={MessageCircle}
              title="Check symptoms"
              sub="Find a next step"
              tone="mint"
              onClick={() => onNavigate('Symptom checker')}
            />

            <QuickAction
              icon={MapPin}
              title="Find nearby care"
              sub="Explore resources"
              tone="blue"
              onClick={() => onNavigate('Find care')}
            />

            <QuickAction
              icon={FileHeart}
              title="Health records"
              sub="Your documents"
              tone="lilac"
              onClick={() => onNavigate('Health records')}
            />

            <QuickAction
              icon={CalendarClock}
              title="Set a reminder"
              sub="Stay on track"
              tone="peach"
              onClick={() =>
                onModal({
                  type: 'reminder'
                })
              }
            />
          </div>
        </div>

        <div className="panel-card reminders-panel">
          <div className="panel-heading">
            <div>
              <h3>Coming up</h3>
              <p>A gentle nudge for your day.</p>
            </div>

            <button
              className="round-arrow"
              onClick={() => onNavigate('Reminders')}
              aria-label="View reminders"
            >
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="mini-reminders">
            {openReminders
              .slice(0, 3)
              .map((r, i) => (
                <div
                  className="mini-reminder"
                  key={r.id}
                >
                  <div
                    className={`reminder-marker marker-${i}`}
                  >
                    <Clock3 size={16} />
                  </div>

                  <div className="mini-reminder-copy">
                    <strong>{r.title}</strong>
                    <span>{r.due_at}</span>
                  </div>

                  <ArrowDownRight
                    size={16}
                    className="muted-icon"
                  />
                </div>
              ))}

            {openReminders.length === 0 && (
              <div className="empty-state">
                You're all caught up. Take a breath.
              </div>
            )}
          </div>

          <button
            className="all-reminders"
            onClick={() => onNavigate('Reminders')}
          >
            Manage reminders
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>

      <div className="stat-label">{label}</div>

      <div className="stat-value">{value}</div>

      <div className="stat-detail">
        <span className="stat-dot" />
        {detail}
      </div>
    </div>
  )
}

function QuickAction({
  icon: Icon,
  title,
  sub,
  tone,
  onClick
}) {
  return (
    <button
      className="quick-action"
      onClick={onClick}
    >
      <span className={`quick-icon ${tone}`}>
        <Icon size={19} />
      </span>

      <span className="quick-copy">
        <b>{title}</b>
        <small>{sub}</small>
      </span>

      <ArrowRight
        size={15}
        className="quick-arrow"
      />
    </button>
  )
}

function EquipmentCard({ item, onBorrow }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article className="equipment-card">
      <div className="equipment-image-wrap">
        <img
          src={
            imgError
              ? imageFallback
              : item.image_url || imageFallback
          }
          onError={() => setImgError(true)}
          alt={item.name}
        />

        <span className="available-tag">
          <span />
          Available
        </span>

        <button
          className="save-button"
          onClick={onBorrow}
          aria-label={`Request ${item.name}`}
        >
          <Heart size={17} />
        </button>
      </div>

      <div className="equipment-info">
        <div className="equipment-category">
          {item.category}
        </div>

        <h4>{item.name}</h4>

        <p>{item.description}</p>

        <div className="equipment-meta">
          <span>
            <MapPin size={13} />
            {item.location}
          </span>

          <strong>
            {item.daily_rate === 0
              ? 'Free to borrow'
              : `₹${item.daily_rate}`}

            <small>
              {item.daily_rate === 0 ? '' : ' / day'}
            </small>
          </strong>
        </div>

        <button
          className="card-action"
          onClick={onBorrow}
        >
          Request equipment
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  )
}

function EquipmentPage({
  equipment,
  search,
  setSearch,
  onBorrow,
  onAdd
}) {
  const [category, setCategory] = useState('All')

  const filtered = equipment.filter(
    e =>
      (category === 'All' ||
        e.category.toLowerCase() ===
          category.toLowerCase()) &&
      `${e.name} ${e.description} ${e.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
  )

  return (
    <div className="content-stack">
      <div className="feature-banner equipment-banner">
        <div>
          <span className="banner-eyebrow">
            SHARING IS CARING
          </span>

          <h2>
            Good support should be
            <br />
            within everyone's reach.
          </h2>

          <p>
            Find equipment shared by people and community
            partners.
          </p>
        </div>

        <div className="banner-illustration">
          <Accessibility
            size={70}
            strokeWidth={1.2}
          />

          <Heart
            size={25}
            className="banner-heart"
          />
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
            placeholder="Search wheelchairs, walkers..."
          />
        </div>

        <div className="filter-pills">
          {[
            'All',
            'Mobility',
            'Respiratory'
          ].map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                category === c
                  ? 'selected'
                  : ''
              }
            >
              {c}
            </button>
          ))}
        </div>

        <button
          className="primary-button"
          onClick={onAdd}
        >
          <Plus size={17} />
          List equipment
        </button>
      </div>

      <div className="section-heading compact">
        <div>
          <h3>Available to borrow</h3>

          <p>
            {filtered.length} items to help make everyday
            life easier.
          </p>
        </div>
      </div>

      <div className="equipment-grid large-grid">
        {filtered.map(item => (
          <EquipmentCard
            key={item.id}
            item={item}
            onBorrow={() => onBorrow(item)}
          />
        ))}
      </div>

      {!filtered.length && (
        <div className="empty-card">
          No equipment matches that search. Try a different
          keyword.
        </div>
      )}

      <div className="notice-strip">
        <ShieldCheck size={19} />

        <div>
          <b>A quick note about safety</b>

          <p>
            Always confirm equipment condition, hygiene,
            fit, and medical suitability with the provider
            or a qualified professional before use.
          </p>
        </div>
      </div>
    </div>
  )
}

function SymptomPage({ notify }) {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function check(e) {
    e.preventDefault()

    if (!symptoms.trim()) return

    setLoading(true)

    try {
      setResult(
        await api.symptomGuidance(symptoms)
      )
    } catch {
      const urgent =
        /chest pain|can't breathe|cannot breathe|severe bleeding|unconscious|stroke/i.test(
          symptoms
        )

      setResult({
        urgency: urgent ? 'urgent' : 'routine',

        message: urgent
          ? 'These symptoms may indicate an emergency. Contact your local emergency number or go to the nearest emergency department now. Do not wait for chatbot guidance.'
          : "I can't diagnose the cause from a text description. Consider contacting a qualified healthcare professional, especially if symptoms are new, worsening, persistent, or worrying. I can help you prepare questions for your appointment.",

        disclaimer:
          'This is general guidance, not a diagnosis.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-stack">
      <div className="feature-banner symptom-banner">
        <div>
          <span className="banner-eyebrow">
            A CALMER FIRST STEP
          </span>

          <h2>
            Tell us how you're
            <br />
            feeling today.
          </h2>

          <p>
            Get general guidance on possible next steps and
            when to seek care.
          </p>
        </div>

        <div className="banner-illustration">
          <MessageCircle
            size={66}
            strokeWidth={1.3}
          />

          <Sparkles
            size={25}
            className="banner-heart"
          />
        </div>
      </div>

      <div className="symptom-layout">
        <form
          className="panel-card symptom-form"
          onSubmit={check}
        >
          <div className="panel-heading">
            <div>
              <h3>What's bothering you?</h3>

              <p>
                Describe your symptoms in your own words.
              </p>
            </div>

            <div className="heading-icon">
              <Stethoscope size={18} />
            </div>
          </div>

          <label
            className="field-label"
            htmlFor="symptoms"
          >
            Your symptoms
          </label>

          <textarea
            id="symptoms"
            rows="5"
            value={symptoms}
            onChange={e =>
              setSymptoms(e.target.value)
            }
            placeholder="For example: I've had a mild headache since this morning..."
          />

          <div className="privacy-note">
            <ShieldCheck size={15} />
            Please avoid sharing names or identifying details.
          </div>

          <button
            className="primary-button full-button"
            disabled={
              loading || !symptoms.trim()
            }
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={17}
                  className="spin"
                />
                Checking...
              </>
            ) : (
              <>
                Get general guidance
                <ArrowRight size={17} />
              </>
            )}
          </button>

          {result && (
            <div
              className={`guidance-result ${
                result.urgency === 'urgent'
                  ? 'urgent'
                  : ''
              }`}
            >
              <div className="result-title">
                {result.urgency === 'urgent' ? (
                  <AlertTriangle size={19} />
                ) : (
                  <HeartPulse size={19} />
                )}

                {result.urgency === 'urgent'
                  ? 'Seek urgent help'
                  : 'Suggested next step'}
              </div>

              <p>{result.assessment_summary || result.message}</p>

              {result.key_factors?.length > 0 && (
                <div className="ai-section"><b>Key factors</b><ul>{result.key_factors.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              )}
              {result.why_this_guidance && <div className="ai-section"><b>Why this guidance</b><p>{result.why_this_guidance}</p></div>}
              {result.recommended_actions?.length > 0 && (
                <div className="ai-section"><b>Recommended actions</b><ul>{result.recommended_actions.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              )}
              {result.red_flags?.length > 0 && (
                <div className="ai-section"><b>Warning signs</b><ul>{result.red_flags.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              )}
              {result.when_to_seek_care && <div className="ai-section"><b>When to seek care</b><p>{result.when_to_seek_care}</p></div>}
              <small>{result.disclaimer || 'This is general guidance, not a diagnosis.'}</small>
            </div>
          )}
        </form>

        <aside className="panel-card safety-panel">
          <div className="safety-icon">
            <ShieldCheck size={22} />
          </div>

          <h3>Your safety comes first.</h3>

          <p>
            This tool offers general information only. It
            cannot diagnose a condition or assess emergencies
            reliably.
          </p>

          <div className="safety-divider" />

          <div className="safety-point">
            <CheckCircle2 size={17} />

            <span>
              Speak with a qualified healthcare professional
              for personal advice.
            </span>
          </div>

          <div className="safety-point">
            <CheckCircle2 size={17} />

            <span>
              Seek urgent help for severe, sudden, or rapidly
              worsening symptoms.
            </span>
          </div>

          <div className="emergency-note">
            <AlertTriangle size={17} />

            <span>
              <b>Medical emergency?</b> Contact your local
              emergency number immediately.
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}

function ResourcesPage({
  resources,
  search,
  setSearch
}) {
  const [kind, setKind] = useState('All')

  const filtered = resources.filter(
    r =>
      (kind === 'All' ||
        r.kind.toLowerCase() ===
          kind.toLowerCase()) &&
      `${r.name} ${r.address}`
        .toLowerCase()
        .includes(search.toLowerCase())
  )

  const icons = {
    Clinic: Stethoscope,
    Hospital: Hospital,
    Pharmacy: Pill
  }

  return (
    <div className="content-stack">
      <div className="feature-banner resources-banner">
        <div>
          <span className="banner-eyebrow">
            CARE IN YOUR COMMUNITY
          </span>

          <h2>
            The right support,
            <br />
            closer to home.
          </h2>

          <p>
            Search healthcare resources and confirm details
            before visiting.
          </p>
        </div>

        <div className="banner-illustration">
          <MapPin
            size={70}
            strokeWidth={1.3}
          />

          <Heart
            size={25}
            className="banner-heart"
          />
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
            placeholder="Search by facility or area..."
          />
        </div>

        <div className="filter-pills">
          {[
            'All',
            'Clinic',
            'Hospital',
            'Pharmacy'
          ].map(c => (
            <button
              key={c}
              onClick={() => setKind(c)}
              className={
                kind === c
                  ? 'selected'
                  : ''
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="resource-grid">
        {filtered.map(r => {
          const Icon =
            icons[r.kind] || Hospital

          return (
            <article
              className="resource-card"
              key={r.id}
            >
              <div
                className={`resource-icon ${
                  r.kind === 'Pharmacy'
                    ? 'peach'
                    : ''
                }`}
              >
                <Icon size={22} />
              </div>

              <span className="resource-kind">
                {r.kind}
              </span>

              <h3>{r.name}</h3>

              <div className="resource-detail">
                <MapPin size={15} />
                {r.address}
              </div>

              <div className="resource-detail">
                <Clock3 size={15} />
                {r.opening_hours ||
                  'Call to confirm hours'}
              </div>

              <div className="unverified-note">
                <AlertTriangle size={14} />
                Confirm address, availability, and hours
                before travelling.
              </div>

              <a
                className="resource-action"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  r.name + ' ' + r.address
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Open map
                <ExternalLink size={14} />
              </a>
            </article>
          )
        })}
      </div>

      {!filtered.length && (
        <div className="empty-card">
          No resources found. Try searching a nearby area or
          another facility type.
        </div>
      )}

      <p className="helper-copy">
        Demo listings are illustrative and not verified
        medical-provider recommendations. Replace them with
        verified facility data before launch.
      </p>
    </div>
  )
}

function RecordsPage({ notify }) {
  const [docs, setDocs] = useState([])

  function addFiles(files) {
    const list = Array.from(files || [])

    if (list.length) {
      setDocs(old => [
        ...old,
        ...list.map((f, i) => ({
          id: Date.now() + i,
          name: f.name,
          size: `${(f.size / 1024).toFixed(0)} KB`,
          date: 'Just added',
          file: f
        }))
      ])

      notify(
        'Document added to this session preview.'
      )
    }
  }

  return (
    <div className="content-stack">
      <div className="records-intro">
        <div className="records-icon">
          <FileHeart size={27} />
        </div>

        <div>
          <h2>Your health, in one place.</h2>

          <p>
            Organize reports, prescriptions, and test results
            for easier access.
          </p>
        </div>
      </div>

      <label className="upload-zone">
        <input
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={e =>
            addFiles(e.target.files)
          }
        />

        <div className="upload-icon">
          <UploadCloud size={26} />
        </div>

        <h3>Drop your documents here</h3>

        <p>
          or <span>browse files</span> from your device
        </p>

        <small>
          PDF or images · Keep files private on your trusted
          device
        </small>
      </label>

      <div className="notice-strip">
        <ShieldCheck size={19} />

        <div>
          <b>Privacy matters</b>

          <p>
            This starter only keeps selected files in the
            current browser session; it does not upload them
            to the server. Secure accounts, access controls,
            encryption, and private file storage are required
            before storing real medical records.
          </p>
        </div>
      </div>

      <div className="section-heading compact">
        <div>
          <h3>Recently added</h3>

          <p>
            {docs.length} document
            {docs.length === 1 ? '' : 's'} in this session
          </p>
        </div>
      </div>

      {docs.length ? (
        <div className="document-list">
          {docs.map(d => (
            <div
              className="document-row"
              key={d.id}
            >
              <div className="document-file">
                <FileHeart size={20} />
              </div>

              <div className="document-copy">
                <b>{d.name}</b>
                <span>
                  {d.size} · {d.date}
                </span>
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  setDocs(old =>
                    old.filter(
                      x => x.id !== d.id
                    )
                  )
                }
                aria-label="Remove document"
              >
                <X size={17} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-card">
          Your documents will appear here after you select
          them. Nothing is uploaded yet.
        </div>
      )}
    </div>
  )
}

function RemindersPage({
  reminders,
  setReminders,
  onAdd
}) {
  async function toggle(r) {
    if (typeof r.id === 'number') {
      try {
        const updated =
          await api.completeReminder(r.id)

        setReminders(old =>
          old.map(x =>
            x.id === r.id ? updated : x
          )
        )

        return
      } catch {}
    }

    setReminders(old =>
      old.map(x =>
        x.id === r.id
          ? {
              ...x,
              completed: !x.completed
            }
          : x
      )
    )
  }

  const pending = reminders.filter(
    r => !r.completed
  )

  const done = reminders.filter(
    r => r.completed
  )

  return (
    <div className="content-stack">
      <div className="reminder-hero">
        <div>
          <span className="banner-eyebrow">
            A LITTLE CARE, RIGHT ON TIME
          </span>

          <h2>You've got this.</h2>

          <p>
            Keep track of medication, appointments, and
            equipment returns.
          </p>
        </div>

        <div className="reminder-big-icon">
          <CalendarClock size={45} />
        </div>
      </div>

      <div className="reminder-summary">
        <div>
          <span>TO DO</span>
          <b>{pending.length}</b>
        </div>

        <div>
          <span>COMPLETED</span>
          <b>{done.length}</b>
        </div>

        <button
          className="primary-button"
          onClick={onAdd}
        >
          <Plus size={17} />
          Add reminder
        </button>
      </div>

      <div className="panel-card full-reminders">
        <div className="panel-heading">
          <div>
            <h3>Upcoming reminders</h3>
            <p>Check them off as you go.</p>
          </div>

          <div className="heading-icon">
            <Bell size={17} />
          </div>
        </div>

        {pending.map(r => (
          <ReminderRow
            key={r.id}
            reminder={r}
            onToggle={() => toggle(r)}
          />
        ))}

        {!pending.length && (
          <div className="empty-state">
            Nothing pending. You're all caught up!
          </div>
        )}

        {done.length > 0 && (
          <>
            <div className="completed-heading">
              COMPLETED
            </div>

            {done.map(r => (
              <ReminderRow
                key={r.id}
                reminder={r}
                onToggle={() => toggle(r)}
              />
            ))}
          </>
        )}
      </div>

      <p className="helper-copy">
        Reminders are stored in the CureLink database when the backend
        is connected. This starter does not send push
        notifications, SMS, or emails yet.
      </p>
    </div>
  )
}

function ReminderRow({
  reminder: r,
  onToggle
}) {
  return (
    <div
      className={`reminder-row ${
        r.completed ? 'is-complete' : ''
      }`}
    >
      <button
        className={`check-circle ${
          r.completed ? 'checked' : ''
        }`}
        onClick={onToggle}
        aria-label={
          r.completed
            ? 'Mark incomplete'
            : 'Mark complete'
        }
      >
        {r.completed && <Check size={15} />}
      </button>

      <div className="reminder-type-icon">
        <CalendarClock size={18} />
      </div>

      <div className="reminder-row-copy">
        <b>{r.title}</b>
        <span>
          {r.notes || r.reminder_type}
        </span>
      </div>

      <div className="reminder-date">
        <Clock3 size={14} />
        {r.due_at}
      </div>
    </div>
  )
}

function Modal({
  modal,
  onClose,
  equipment,
  setEquipment,
  setReminders,
  notify
}) {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    start_date: '',
    return_date: '',
    notes: '',
    category: 'Mobility',
    location: '',
    daily_rate: '0',
    title: '',
    reminder_type: 'Medication',
    due_at: ''
  })

  const [saving, setSaving] = useState(false)

  const update = (key, value) =>
    setForm(old => ({
      ...old,
      [key]: value
    }))

  async function submit(e) {
    e.preventDefault()

    setSaving(true)

    try {
      if (modal.type === 'borrow') {
        const payload = {
          equipment_id: modal.item.id,
          requester_name: form.name,
          requester_contact: form.contact,
          start_date: form.start_date,
          return_date: form.return_date,
          notes: form.notes
        }

        await api
          .borrow(payload)
          .catch(err => {
            if (err.message !== 'Failed to fetch') {
              throw err
            }
          })

        notify(
          'Borrowing request submitted. The provider should confirm availability.'
        )
      }

      if (modal.type === 'listEquipment') {
        const item = {
          id: Date.now(),
          name: form.title,
          category: form.category,
          description: form.notes,
          location: form.location,
          daily_rate:
            Number(form.daily_rate) || 0,
          available: true,
          image_url: imageFallback
        }

        setEquipment(old => [
          item,
          ...old
        ])

        notify(
          'Equipment added to the current preview. Connect the API to save it permanently.'
        )
      }

      if (modal.type === 'reminder') {
        const payload = {
          title: form.title,
          reminder_type: form.reminder_type,
          due_at: form.due_at,
          notes: form.notes
        }

        let item

        try {
          item = await api.addReminder(
            payload
          )
        } catch {
          item = {
            ...payload,
            id: Date.now(),
            completed: false
          }
        }

        setReminders(old => [
          item,
          ...old
        ])

        notify('Reminder added.')
      }

      onClose()
    } catch (err) {
      notify(
        err.message ||
          'Could not save. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const title =
    modal.type === 'borrow'
      ? 'Request to borrow'
      : modal.type === 'listEquipment'
      ? 'Share equipment'
      : 'Create a reminder'

  return (
    <div
      className="modal-backdrop"
      onMouseDown={e =>
        e.target === e.currentTarget &&
        onClose()
      }
    >
      <form
        className="modal-card"
        onSubmit={submit}
      >
        <div className="modal-header">
          <div>
            <div className="section-kicker">
              CURELINK
            </div>

            <h2>{title}</h2>

            <p>
              {modal.type === 'borrow'
                ? modal.item.name
                : modal.type === 'listEquipment'
                ? 'Help someone in your community.'
                : 'Make space for a little self-care.'}
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {modal.type === 'borrow' && (
          <>
            <Field
              label="Your name"
              value={form.name}
              onChange={v =>
                update('name', v)
              }
              required
            />

            <Field
              label="Email or phone"
              value={form.contact}
              onChange={v =>
                update('contact', v)
              }
              required
            />

            <div className="form-two">
              <Field
                label="Start date"
                type="date"
                value={form.start_date}
                onChange={v =>
                  update(
                    'start_date',
                    v
                  )
                }
                required
              />

              <Field
                label="Return date"
                type="date"
                value={form.return_date}
                onChange={v =>
                  update(
                    'return_date',
                    v
                  )
                }
                required
              />
            </div>

            <Field
              label="Note to the lender (optional)"
              value={form.notes}
              onChange={v =>
                update('notes', v)
              }
            />
          </>
        )}

        {modal.type === 'listEquipment' && (
          <>
            <Field
              label="Equipment name"
              value={form.title}
              onChange={v =>
                update('title', v)
              }
              required
            />

            <label className="field-label">
              Category
            </label>

            <select
              className="form-input"
              value={form.category}
              onChange={e =>
                update(
                  'category',
                  e.target.value
                )
              }
            >
              <option>Mobility</option>
              <option>Respiratory</option>
              <option>Daily living</option>
              <option>Other</option>
            </select>

            <Field
              label="Area / location"
              value={form.location}
              onChange={v =>
                update('location', v)
              }
              required
            />

            <Field
              label="Daily rate (₹; enter 0 to lend free)"
              type="number"
              value={form.daily_rate}
              onChange={v =>
                update(
                  'daily_rate',
                  v
                )
              }
            />

            <Field
              label="Description and condition"
              value={form.notes}
              onChange={v =>
                update('notes', v)
              }
              required
            />
          </>
        )}

        {modal.type === 'reminder' && (
          <>
            <Field
              label="Reminder title"
              value={form.title}
              onChange={v =>
                update('title', v)
              }
              required
            />

            <label className="field-label">
              Reminder type
            </label>

            <select
              className="form-input"
              value={form.reminder_type}
              onChange={e =>
                update(
                  'reminder_type',
                  e.target.value
                )
              }
            >
              <option>Medication</option>
              <option>Appointment</option>
              <option>Equipment return</option>
              <option>Other</option>
            </select>

            <Field
              label="Date and time"
              type="datetime-local"
              value={form.due_at}
              onChange={v =>
                update('due_at', v)
              }
              required
            />

            <Field
              label="Notes (optional)"
              value={form.notes}
              onChange={v =>
                update('notes', v)
              }
            />
          </>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle
                size={17}
                className="spin"
              />
            ) : (
              <Check size={17} />
            )}

            {saving
              ? 'Saving...'
              : modal.type === 'borrow'
              ? 'Send request'
              : modal.type === 'listEquipment'
              ? 'Add equipment'
              : 'Save reminder'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false
}) {
  return (
    <label className="field-wrap">
      <span className="field-label">
        {label}
      </span>

      <input
        className="form-input"
        type={type}
        value={value}
        onChange={e =>
          onChange(e.target.value)
        }
        required={required}
      />
    </label>
  )
}

export default Apps