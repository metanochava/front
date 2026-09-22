<script setup>
import { tdc } from 'quasar_resaas'

// Real facts from Metano's own CV. Dates, institutions and employers are kept exactly as
// given; only the phrasing was tightened for the page. Institution names are proper
// nouns and are deliberately not wrapped in tdc() (same convention as amal/DoctorsPage's
// university names).
const summary = 'REST-focused developer with a degree in systems development engineering, comfortable across Linux, Windows and macOS. Six years teaching information systems and seven years as a computer technician led to two personal projects — an electronic patient record and a school management system with an entity/reference payment module — both built with Laravel. I am currently building an academic management system on the REST philosophy: Vue 3, Quasar and Vuex on the front end, Django on the back end.'

const objective = ['Information systems analysis', 'Project management', 'Digital forensics']

const education = [
  {
    period: 'In progress',
    title: 'PhD in Computer Science and Digital Forensics',
    place: 'National Forensic Sciences University'
  },
  {
    period: '2020 – 2022',
    title: 'Master in Digital Forensics and Information Security',
    place: 'Gujarat Forensic Sciences University'
  },
  {
    period: '2017 – 2019',
    title: 'Master in Information Systems for Environmental Management',
    place: 'Universidade Pedagógica'
  },
  {
    period: '2012 – 2017',
    title: "Bachelor's degree in Systems Development Engineering",
    place: 'Universidade Pedagógica'
  }
]

const experience = [
  {
    period: '2017 – 2020',
    title: 'Information systems lecturer',
    place: 'Universidade São Tomás',
    text: 'Helped students build web and desktop applications in Java, C++, PHP, HTML, CSS and JavaScript, set assignments after each module and reported on student performance.'
  },
  {
    period: '2015 – 2017',
    title: 'Project manager',
    place: 'Setma Tic',
    text: 'Analysed and developed information systems, organised development teams per project, and reported weekly progress and results at each development phase.'
  },
  {
    period: '2013 – 2015',
    title: 'Web designer',
    place: 'Universidade Pedagógica',
    text: "Built web applications and helped manage information across the institution's departments, producing weekly reports with suggestions to overcome development issues."
  }
]

const skillGroups = [
  { group: 'Programming languages', items: ['Java', 'Python', 'C#', 'C++', 'PHP', 'TypeScript'] },
  { group: 'Frameworks and libraries', items: ['Django', 'Laravel', 'Angular', 'Vue', 'jQuery', 'Bootstrap', 'Quasar'] },
  { group: 'Databases', items: ['MySQL', 'SQL Server', 'PostgreSQL'] },
  { group: 'Version control', items: ['Git', 'Gitflow'] }
]

const certifications = [
  'Cyber Security Expert',
  'AWS Academy – Introduction to Cloud',
  'CEH',
  'CISM',
  'CISSP',
  'CCSP – Certified Cloud Security Professional'
]

const personalSkills = [
  'Adapts easily to different environments',
  'Works well in a team, leads a team, works under pressure and manages conflict',
  'Learns quickly and is available to work inside or outside the country'
]

const languages = [
  { name: 'Portuguese', level: 'Fluent' },
  { name: 'English', level: 'Good' }
]
</script>

<template>
  <section id="resume" class="pf-section resume" aria-labelledby="resume-title">
    <div class="pf-wrap">
      <p class="pf-path pf-reveal">~/resume</p>
      <h2 id="resume-title" class="pf-title pf-reveal">{{ tdc('Full resume') }}</h2>
      <p class="pf-lead pf-reveal">{{ tdc(summary) }}</p>

      <p class="resume__objective pf-reveal">
        <span class="resume__label">{{ tdc('Objective') }}</span>
        <span>{{ objective.map(item => tdc(item)).join(' · ') }}</span>
      </p>

      <div class="resume__grid">
        <div class="resume__col pf-reveal">
          <h3 class="resume__col-title">{{ tdc('Education') }}</h3>
          <ol class="resume__timeline">
            <li v-for="item in education" :key="item.title">
              <span class="resume__period">{{ tdc(item.period) }}</span>
              <h4>{{ tdc(item.title) }}</h4>
              <p class="resume__place">{{ item.place }}</p>
            </li>
          </ol>
        </div>

        <div class="resume__col pf-reveal">
          <h3 class="resume__col-title">{{ tdc('Professional experience') }}</h3>
          <ol class="resume__timeline">
            <li v-for="item in experience" :key="item.title">
              <span class="resume__period">{{ item.period }}</span>
              <h4>{{ tdc(item.title) }}</h4>
              <p class="resume__place">{{ item.place }}</p>
              <p class="resume__desc">{{ tdc(item.text) }}</p>
            </li>
          </ol>
        </div>
      </div>

      <div class="resume__panels">
        <article v-for="group in skillGroups" :key="group.group" class="pf-card pf-reveal">
          <h3>{{ tdc(group.group) }}</h3>
          <ul class="resume__chips">
            <li v-for="item in group.items" :key="item" class="pf-chip">{{ tdc(item) }}</li>
          </ul>
        </article>

        <article class="pf-card pf-reveal">
          <h3>{{ tdc('Certifications') }}</h3>
          <ul class="resume__chips">
            <li v-for="item in certifications" :key="item" class="pf-chip">{{ tdc(item) }}</li>
          </ul>
        </article>

        <article class="pf-card pf-reveal">
          <h3>{{ tdc('Personal skills') }}</h3>
          <ul class="resume__list">
            <li v-for="item in personalSkills" :key="item">{{ tdc(item) }}</li>
          </ul>
        </article>

        <article class="pf-card pf-reveal">
          <h3>{{ tdc('Languages') }}</h3>
          <ul class="resume__lang">
            <li v-for="item in languages" :key="item.name">
              <span>{{ tdc(item.name) }}</span>
              <span class="resume__level">{{ tdc(item.level) }}</span>
            </li>
          </ul>
          <p class="resume__other"><strong>{{ tdc('Other') }}:</strong> {{ tdc('Category "C1" driving licence') }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resume { background: var(--pf-surface); border-block: 1px solid var(--pf-line); }

.resume__objective { display: flex; flex-wrap: wrap; gap: 8px 10px; margin-top: 22px; font-size: 15px; color: var(--pf-muted); }
.resume__label { font-family: var(--pf-font-mono); font-size: 13px; letter-spacing: .04em; text-transform: uppercase; color: var(--pf-accent); }

.resume__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 48px; margin-top: 52px; }
.resume__col-title { font-size: 22px; margin-bottom: 26px; }

.resume__timeline { list-style: none; margin: 0; padding: 0; border-left: 1px solid var(--pf-line); }
.resume__timeline li { position: relative; padding: 0 0 30px 26px; }
.resume__timeline li:last-child { padding-bottom: 0; }
.resume__timeline li::before {
  content: ''; position: absolute; left: -5px; top: 6px; width: 9px; height: 9px;
  border-radius: 50%; background: var(--pf-accent); box-shadow: 0 0 0 3px var(--pf-surface);
}
.resume__period { font-family: var(--pf-font-mono); font-size: 13px; color: var(--pf-accent); }
.resume__timeline h4 { font-size: 18px; margin: 6px 0 2px; }
.resume__place { color: var(--pf-muted); font-size: 14.5px; }
.resume__desc { color: var(--pf-muted); font-size: 15px; margin-top: 8px; }

.resume__panels { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 56px; }
.resume__panels .pf-card h3 { font-size: 18px; margin-bottom: 16px; }
.resume__chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.resume__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; color: var(--pf-muted); font-size: 14.5px; }
.resume__lang { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.resume__lang li { display: flex; justify-content: space-between; align-items: baseline; font-size: 15px; }
.resume__level { font-family: var(--pf-font-mono); font-size: 13px; color: var(--pf-cool); }
.resume__other { margin: 18px 0 0; padding-top: 16px; border-top: 1px solid var(--pf-line); color: var(--pf-muted); font-size: 14px; }

@media (max-width: 900px) {
  .resume__grid { grid-template-columns: 1fr; gap: 40px; }
  .resume__panels { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .resume__panels { grid-template-columns: 1fr; }
}
</style>
