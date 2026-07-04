const { useState, useEffect, useRef } = React;

/* ---------------- Network animation (signature element) ---------------- */
function NetworkCanvas(){
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let w, h;

    const nodes = [
      { key: 'client',  label: 'CLIENT',   xr: 0.18, yr: 0.30 },
      { key: 'server',  label: 'SERVER',   xr: 0.52, yr: 0.72 },
      { key: 'db',      label: 'DATABASE', xr: 0.84, yr: 0.28 },
    ];

    const links = [
      { a: 'client', b: 'server', color: '#00d9a3' },
      { a: 'server', b: 'db',     color: '#7c6fff' },
      { a: 'client', b: 'db',     color: '#2c3550' },
    ];

    let packets = links.map((l, i) => ({ link: i, t: Math.random(), speed: 0.0032 + Math.random()*0.002, dir: 1 }));

    function resize(){
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = rect.width * devicePixelRatio;
      h = canvas.height = rect.height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    }
    resize();
    window.addEventListener('resize', resize);

    function pos(node){
      const rect = canvas.getBoundingClientRect();
      return { x: node.xr * rect.width, y: node.yr * rect.height };
    }

    function draw(){
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0,0,rect.width,rect.height);

      // links
      links.forEach(l => {
        const a = pos(nodes.find(n=>n.key===l.a));
        const b = pos(nodes.find(n=>n.key===l.b));
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // packets
      packets.forEach(p => {
        const l = links[p.link];
        const a = pos(nodes.find(n=>n.key===l.a));
        const b = pos(nodes.find(n=>n.key===l.b));
        p.t += p.speed;
        if(p.t > 1){ p.t = 0; }
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.arc(x,y,3.2,0,Math.PI*2);
        ctx.fillStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // nodes
      nodes.forEach(n => {
        const p = pos(n);
        ctx.beginPath();
        ctx.arc(p.x,p.y,5,0,Math.PI*2);
        ctx.fillStyle = '#e7eaf1';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x,p.y,10,0,Math.PI*2);
        ctx.strokeStyle = 'rgba(231,234,241,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '600 10.5px JetBrains Mono, monospace';
        ctx.fillStyle = '#8b93a7';
        ctx.textAlign = n.xr < 0.3 ? 'left' : (n.xr > 0.7 ? 'right' : 'center');
        const labelY = n.yr < 0.5 ? p.y - 18 : p.y + 24;
        ctx.fillText(n.label, p.x, labelY);
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{width:'100%', height:'100%', display:'block'}} />;
}

/* ---------------- Hero typing terminal ---------------- */
function HeroTerminal(){
  const fullText = "role: 'Full Stack Developer'";
  const [typed, setTyped] = useState('');

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if(i >= fullText.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="tdot r"></span>
        <span className="tdot y"></span>
        <span className="tdot g"></span>
        <span className="tname">whoami.js</span>
      </div>
      <div className="terminal-body">
        <div><span className="ln-num">1</span><span className="tk-key">const</span> developer <span className="tk-punc">=</span> {'{'}</div>
        <div><span className="ln-num">2</span>&nbsp;&nbsp;name: <span className="tk-str">'Shreyansh Mishra'</span>,</div>
        <div><span className="ln-num">3</span>&nbsp;&nbsp;{typed}<span className="caret"></span></div>
        <div><span className="ln-num">4</span>&nbsp;&nbsp;<span className="tk-com">// MERN stack, real-time systems</span></div>
        <div><span className="ln-num">5</span>{'}'}</div>
      </div>
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav(){
  const [open, setOpen] = useState(false);
  const links = [
    ['01','About','#about'],
    ['02','Skills','#skills'],
    ['03','Projects','#projects'],
    ['04','Education','#education'],
    ['05','Contact','#contact'],
  ];
  return (
    <div className="nav">
      <div className="wrap nav-inner">
        <div className="nav-brand"><span className="dot"></span>Shreyansh.dev</div>
        <button className="nav-toggle" onClick={() => setOpen(o=>!o)} aria-label="Toggle menu">{open ? '✕' : '☰'}</button>
        <div className={"nav-links" + (open ? " open" : "")}>
          {links.map(([idx,label,href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              <span className="idx">{idx}</span>{label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero(){
  return (
    <section style={{borderTop:'none'}}>
      <div className="wrap hero">
        <div>
          <HeroTerminal />
          <div className="status-row">
            <span><span className="sdot"></span>Frontend — connected</span>
            <span><span className="sdot"></span>Backend — connected</span>
            <span><span className="sdot"></span>Database — connected</span>
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">View projects →</a>
            <a className="btn btn-ghost" href="https://github.com/mshreyansh711-ui" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="btn btn-ghost" href="https://linkedin.com/in/shreyansh-mishra-66615437b" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="net-canvas-wrap">
          <NetworkCanvas />
          <div className="net-caption">client ↔ server ↔ database, kept in sync in real time</div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */
function About(){
  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-tag">01</span>
          <h2 className="sec-title">About</h2>
        </div>
        <div className="about-block">
          <p className="com">/* about.md */</p>
          <p className="prose">
            I build full stack web applications end to end — from REST APIs and database schemas
            to the interfaces people actually click on. My focus sits on the MERN stack
            (MongoDB, Express.js, React.js, Node.js), with a particular interest in the parts
            of the web that happen in real time: sockets, WebRTC, and anything where the client
            and server need to stay in sync without a page refresh.
          </p>
          <p className="prose">
            I like taking a feature from a rough idea to a working, responsive product —
            authentication, cart logic, live chat, whatever the app needs — and keeping the
            code straightforward enough that the next person (often future me) can follow it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Skills ---------------- */
function Skills(){
  const groups = [
    { key: 'languages', items: ['JavaScript (ES6+)', 'HTML5', 'CSS3'] },
    { key: 'frontend',  items: ['React.js', 'Bootstrap', 'Responsive Design'] },
    { key: 'backend',   items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth'] },
    { key: 'database',  items: ['MongoDB', 'MySQL'] },
    { key: 'tools',     items: ['Git', 'GitHub', 'VS Code', 'Postman'] },
    { key: 'realtime',  items: ['WebRTC', 'Socket.io', 'API Integration', 'MVC'] },
  ];
  return (
    <section id="skills">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-tag">02</span>
          <h2 className="sec-title">Skills</h2>
        </div>
        <div className="skills-file">
          <div className="skills-file-bar">package.json</div>
          <div className="skills-grid">
            {groups.map(g => (
              <div className="skill-group" key={g.key}>
                <span className="skill-key">"{g.key}":</span>
                <div className="chip-row">
                  {g.items.map(item => <span className="chip" key={item}>{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */
function Projects(){
  const projects = [
    {
      file: 'ShopNow.jsx',
      name: 'Shop-Now',
      sub: 'MERN E-Commerce Platform',
      points: [
        'Built a full stack e-commerce platform with React.js, Node.js, Express.js, and MongoDB.',
        'Implemented JWT authentication and REST APIs for secure, stateless sessions.',
        'Developed the shopping cart, order processing flow, and a responsive UI across devices.',
      ],
      tags: ['React.js','Node.js','Express.js','MongoDB','JWT'],
      <a href="https://shop-now-a340.onrender.com" target="_blank">Live Demo</a>
      href: 'https://github.com/mshreyansh711-ui',
    },
    {
      file: 'RealTimeApp.jsx',
      name: 'Real-Time Communication App',
      sub: 'Multi-user Video Conferencing',
      points: [
        'Built a multi-user video conferencing platform using WebRTC and Socket.io.',
        'Added screen sharing, file sharing, live chat, and a collaborative whiteboard.',
        'Implemented secure authentication and a responsive interface for all participants.',
      ],
      tags: ['WebRTC','Socket.io','Node.js','Express.js'],
      href: 'https://github.com/mshreyansh711-ui',
    },
  ];
  const [active, setActive] = useState(0);
  const p = projects[active];

  return (
    <section id="projects">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-tag">03</span>
          <h2 className="sec-title">Projects</h2>
        </div>
        <div className="proj-tabs">
          {projects.map((pr, i) => (
            <button
              key={pr.file}
              className={"proj-tab" + (i === active ? " active" : "")}
              onClick={() => setActive(i)}
            >{pr.file}</button>
          ))}
        </div>
        <div className="proj-panel">
          <h3>{p.name}</h3>
          <div className="proj-sub">{p.sub}</div>
          <ul>
            {p.points.map((pt,i) => <li key={i}>{pt}</li>)}
          </ul>
          <div className="chip-row" style={{marginBottom:'20px'}}>
            {p.tags.map(t => <span className="chip" key={t}>{t}</span>)}
          </div>
          <div className="proj-links">
            <a className="btn btn-ghost" href={p.href} target="_blank" rel="noopener noreferrer">View repository →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Education / Certifications ---------------- */
function Education(){
  return (
    <section id="education">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-tag">04</span>
          <h2 className="sec-title">Education &amp; Certifications</h2>
        </div>
        <div className="log">
          <div className="log-line">
            <span className="arrow">&gt;</span>
            <span className="log-label">Graduation</span>
            <span className="log-val">Bachelor in Computer Science</span>
            <span className="log-note">— Mahatma Gandhi Kashi Vidyapeeth &amp; 2025</span>
          </div>
          <div className="log-line">
            <span className="arrow">&gt;</span>
            <span className="log-label">Post Graduation</span>
            <span className="log-val">Master in Computer Science</span>
            <span className="log-note">— Accurate Institute of Management & Technology &amp; 2027</span>
          </div>
          <div className="log-line">
            <span className="arrow">&gt;</span>
            <span className="log-label">cert</span>
            <span className="log-val">Full Stack Web Development</span>
          </div>
          <div className="log-line">
            <span className="arrow">&gt;</span>
            <span className="log-label">cert</span>
            <span className="log-val">React.js</span>
          </div>
          <div className="log-line">
            <span className="arrow">&gt;</span>
            <span className="log-label">cert</span>
            <span className="log-val">Node.js &amp; Express.js</span>
          </div>
          <div className="log-line">
            <span className="arrow">&gt;</span>
            <span className="log-label">cert</span>
            <span className="log-val">MongoDB</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact(){
  return (
    <section id="contact">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-tag">05</span>
          <h2 className="sec-title">Contact</h2>
        </div>
        <div className="contact-panel">
          <h2>Let's build something.</h2>
          <p>Open to full stack and MERN developer roles — reach out any time.</p>
          <div className="contact-links">
            <a className="icon-link" href="mailto:mshreyansh711@gmail.com">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
              Email
            </a>
            <a className="icon-link" href="https://github.com/mshreyansh711-ui" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.9 3.18 9.05 7.59 10.52.55.1.75-.24.75-.53v-1.86c-3.09.67-3.74-1.49-3.74-1.49-.5-1.28-1.23-1.62-1.23-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.7-1.46-2.47-.28-5.06-1.23-5.06-5.48 0-1.21.43-2.2 1.13-2.98-.11-.28-.49-1.4.11-2.92 0 0 .93-.3 3.04 1.14a10.6 10.6 0 0 1 5.54 0c2.11-1.44 3.04-1.14 3.04-1.14.6 1.52.22 2.64.11 2.92.7.78 1.13 1.77 1.13 2.98 0 4.26-2.6 5.19-5.08 5.47.39.34.74 1.01.74 2.04v3.02c0 .29.2.64.76.53 4.4-1.47 7.58-5.62 7.58-10.52C23.02 5.24 18.27.5 12 .5z"/></svg>
              GitHub
            </a>
            <a className="icon-link" href="https://linkedin.com/in/shreyansh-mishra-66615437b" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.25h4V23h-4V8.25zM8.5 8.25h3.83v2.01h.05c.53-1 1.84-2.06 3.79-2.06 4.06 0 4.81 2.67 4.81 6.14V23h-4v-6.93c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.66 1.8-2.66 3.65V23h-4V8.25z"/></svg>
              LinkedIn
            </a>
          </div>
          <p className="note">Email and phone number in the resume are placeholders — swap in real contact details before sharing this live.</p>
        </div>
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer>
      built with React · designed as a live connection between client, server &amp; database
    </footer>
  );
}

function App(){
  return (
    <React.Fragment>
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
