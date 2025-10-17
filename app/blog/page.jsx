import './blog.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: 'Zhang Teslendia — Research & Systems Engineering',
  description:
    'A living portfolio highlighting the research, engineering practice, and writing of Zhang Teslendia.'
};

const heroStats = [
  {
    value: '6+',
    description: 'research programs led across programming languages, crypto, and HCI.'
  },
  {
    value: '503',
    description: 'subscribers actively discussing future-of-tech in QLBF 生活杂谈.'
  },
  {
    value: '20+',
    description: 'production-grade prototypes shipped with formal guarantees.'
  }
];

const impactAreas = [
  {
    title: 'Formal methods at human speed',
    description:
      'I lead research that blends dependent type theory with usable developer workflows. From higher-inductive type DSLs to proof-carrying API boundaries, I make safety guarantees feel effortless.',
    link: {
      href: '/blog/2024/06/07/research-paper-collection/',
      label: 'Read my latest research collection →'
    }
  },
  {
    title: 'Systems prototyping that ships',
    description:
      "Whether it's a convex-optimized CTC engine or a time-crystal simulator, I build rigorous prototypes that stakeholders can touch. Each project ships with documentation, automated validation, and real user feedback.",
    link: {
      href: '/demo/ctc-optimizer/',
      label: 'Explore a live optimization demo →'
    }
  },
  {
    title: 'Communities with intellectual gravity',
    description:
      'My Telegram channel QLBF 生活杂谈 curates technical essays, AMAs, and office hours for 500+ engaged peers. I invest in mentorship loops that keep ambitious builders accountable.',
    link: {
      href: 'https://t.me/qlbf_channel',
      label: 'Join the conversation →',
      external: true
    }
  }
];

const projects = [
  {
    tag: 'Adaptive Knowledge Systems',
    title: 'Science of Updating',
    description:
      'Codified a repeatable process for steering self-correcting knowledge bases, blending type theory and organizational design to keep collective intelligence reliable.',
    bullets: [
      'Mapped epistemic states into executable schemas for live auditing.',
      'Built facilitator prompts that accelerate convergence during debates.',
      'Delivered a field guide teams now apply to post-mortems and research sprints.'
    ],
    link: {
      href: '/blog/2024/06/16/science-of-updating/',
      label: 'Read the research notes →'
    }
  },
  {
    tag: 'Distributed Systems',
    title: 'Blockchain Synchrony Experiments',
    description:
      'Prototyped adversarial block propagation scenarios, validating synchrony thresholds that now inform protocol tuning for several Web3 infrastructure teams.',
    bullets: [
      'Built reproducible simulation harness in Rust + TypeScript.',
      'Derived tight bounds for leader election fairness under churn.',
      'Delivered observability dashboard for incident response teams.'
    ],
    link: {
      href: '/demo/bchan-pchan-synchrony/',
      label: 'Run the experiment →'
    }
  },
  {
    tag: 'Human Computer Interaction',
    title: 'Ambient Programming Basics',
    description:
      'Created an interactive writing environment that turns type-theoretic intuition into visual motifs, helping students and collaborators internalize dense ideas faster.',
    bullets: [
      'Introduced ambient scaffolds that connect formal systems to everyday practice.',
      'Implemented multi-device sync with CRDT-backed conflict resolution.',
      'Captured qualitative insights that now drive curriculum improvements.'
    ],
    link: {
      href: '/blog/2024/06/03/ambient-programming-basics/',
      label: 'Try the studio →'
    }
  }
];

const timeline = [
  {
    year: '2024',
    title: 'Independent Research Partner',
    description:
      'Embedded with AI safety labs to translate theoretical desiderata into verifiable protocols and support production launches with formal tooling.'
  },
  {
    year: '2022',
    title: 'Lead Systems Engineer · Emerging Tech Collective',
    description:
      'Scaled a distributed research team, codified engineering standards, and shipped 12 cross-disciplinary experiments spanning crypto-economics, edtech, and interactive media.'
  },
  {
    year: '2019',
    title: 'Research Scientist · University Lab',
    description:
      'Published foundational work on homotopy-inspired programming models while mentoring graduate cohorts on proof engineering and applied category theory.'
  }
];

const writingHighlights = [
  {
    title: '《突破工作记忆的限制》',
    description:
      '构建多通道记忆编排、情境缓存与认知外骨骼，让高负荷任务依然保持清晰节奏与可恢复的上下文。',
    link: {
      href: '/blog/2024/07/10/break-working-memory-limits/',
      label: 'Build the cognitive exoskeleton →'
    }
  },
  {
    title: '《实现手机与电脑的手性结合》',
    description:
      '提出“手性结合”框架，通过镜像硬件、姿态映射与语义协议，让手机与电脑像左右手般协同。',
    link: {
      href: '/blog/2024/07/08/phone-computer-chiral-symbiosis/',
      label: 'Explore the chiral workflow →'
    }
  },
  {
    title: '《雨与风水耦合系统中的不动点一致性实验》',
    description:
      '从传感器布设到迭代算子验证，完整展示雨场动力与风水水脉协同的收敛实验与策略应用。',
    link: {
      href: '/blog/2024/07/01/rain-fengshui-fixed-point-consistency/',
      label: 'Read the field experiment →'
    }
  },
  {
    title: '《d 风水堆的设计与实现》',
    description:
      '讲透 d 叉堆的索引公式、堆化算法与工程调优，让优先级队列在调度与图搜索中跑得更稳。',
    link: {
      href: '/blog/2024/06/30/d-ary-heap-design-implementation/',
      label: 'Dive into the heap design →'
    }
  },
  {
    title: '《我的论文汇总》',
    description:
      'Annotated overview of recent publications, highlighting open questions and collaboration hooks for each strand of work.',
    link: {
      href: '/blog/2024/06/07/research-paper-collection/',
      label: 'Read the article →'
    }
  },
  {
    title: '《互联网万物设计札记》',
    description:
      'Design principles for resilient digital ecosystems, merging systems thinking with playful UX experiments.',
    link: {
      href: '/blog/internet-of-everything-design.html',
      label: 'Open the field notes →'
    }
  },
  {
    title: '《CTC 凸优化实践》',
    description:
      'Deep dive into convex optimization for CTC models, complete with reproducible notebooks and deployment tips.',
    link: {
      href: '/blog/ctc-convex-optimization.html',
      label: 'Study the technique →'
    }
  }
];

export default function BlogPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`${plusJakarta.className} blog-theme`}>
      <div className="page">
        <header className="topbar">
          <a className="topbar__logo" href="/">
            ZT
          </a>
          <nav className="topbar__nav" aria-label="Primary navigation">
            <a href="#impact">Impact</a>
            <a href="#projects">Signature Work</a>
            <a href="#writing">Writing</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="topbar__cta" href="/resume/index.html" target="_blank" rel="noopener">
            Résumé
          </a>
        </header>

        <main>
          <section className="hero">
            <div className="hero__content">
              <p className="hero__eyebrow">张特斯兰迪亚 · @typetheory114514</p>
              <h1>Turning abstract math into resilient, human-centered systems.</h1>
              <p className="hero__summary">
                I'm a type theorist and full-stack researcher who moves effortlessly between proof assistants, distributed systems, and the communities who rely on them. I architect end-to-end solutions—rigorous models, production-grade prototypes, and crystal-clear storytelling—to make ambitious ideas real.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="/resume/index.html" target="_blank" rel="noopener">
                  View résumé
                </a>
                <a className="button button--ghost" href="#contact">
                  Invite me to collaborate
                </a>
              </div>
              <dl className="hero__stats" aria-label="Impact metrics">
                {heroStats.map((stat) => (
                  <div key={stat.value}>
                    <dt>{stat.value}</dt>
                    <dd>{stat.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <aside className="hero__card" aria-label="Telegram profile snapshot">
              <header>
                <div className="avatar" aria-hidden="true">
                  🐰
                </div>
                <div>
                  <p className="hero__card-name">Zhang Teslendia</p>
                  <p className="hero__card-status">last seen today · open to deep technical conversations</p>
                </div>
              </header>
              <dl>
                <div>
                  <dt>ID</dt>
                  <dd>275426214</dd>
                </div>
                <div>
                  <dt>Registered</dt>
                  <dd>September 2016</dd>
                </div>
                <div>
                  <dt>Channel</dt>
                  <dd>
                    <a href="https://t.me/qlbf_channel" target="_blank" rel="noopener">
                      QLBF 生活杂谈
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Bio</dt>
                  <dd>Type theorist</dd>
                </div>
              </dl>
            </aside>
          </section>

          <section className="impact" id="impact">
            <h2>Impact across research, engineering, and community</h2>
            <div className="impact__grid">
              {impactAreas.map((area) => (
                <article key={area.title}>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  {area.link ? (
                    <a
                      href={area.link.href}
                      className="impact__link"
                      target={area.link.external ? '_blank' : undefined}
                      rel={area.link.external ? 'noopener' : undefined}
                    >
                      {area.link.label}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="projects" id="projects">
            <div className="section-heading">
              <h2>Signature work</h2>
              <p>Selected experiments that show how I translate theory into leverage.</p>
            </div>
            <div className="projects__grid">
              {projects.map((project) => (
                <article key={project.title}>
                  <div className="tag">{project.tag}</div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul>
                    {project.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <a href={project.link.href} className="projects__link">
                    {project.link.label}
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="timeline" aria-label="Career timeline">
            <h2>Trajectory</h2>
            <ol>
              {timeline.map((item) => (
                <li key={item.year}>
                  <div className="timeline__year">{item.year}</div>
                  <div className="timeline__content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="writing" id="writing">
            <div className="section-heading">
              <h2>Writing that doubles as documentation</h2>
              <p>Every piece balances conceptual clarity with implementation detail so collaborators can execute immediately.</p>
            </div>
            <div className="writing__grid">
              {writingHighlights.map((entry) => (
                <article key={entry.title}>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  <a href={entry.link.href} className="writing__link">
                    {entry.link.label}
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="cta" id="contact">
            <div>
              <h2>Let’s build something audacious</h2>
              <p>
                If you're exploring new protocol designs, formal verification for emerging products, or community programs that demand intellectual rigor, I'm ready to jump in. Reach out directly on Telegram or drop a line via email.
              </p>
            </div>
            <div className="cta__actions">
              <a className="button button--primary" href="https://t.me/typetheory114514" target="_blank" rel="noopener">
                Message me on Telegram
              </a>
              <a className="button button--ghost" href="mailto:teslendia@pm.me">
                teslendia@pm.me
              </a>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>© {currentYear} Zhang Teslendia. Crafted with care and a type theorist's precision.</p>
        </footer>
      </div>
    </div>
  );
}
