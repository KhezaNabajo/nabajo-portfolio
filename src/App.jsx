import { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useReveal } from "./script.js";
import { PROJECTS } from "./projects.js";
import MoreProjects, { Meta, Links } from "./moreprojects.jsx";

const EMAIL = "khezamnabajo@gmail.com";
const RESUME_URL = "/assets/CV_Kheza_Nabajo.pdf";

const FEATURED_IDS = ["pawloc", "tradetime", "audio-player"];
const SKILLS_LIST = [
  "VISUAL IDENTITY", 
  "BRANDING", 
  "UI / UX DESIGN", 
  "ACCESSIBILITY", 
  "FIGMA", 
  "NETWORK PLANNING", 
  "CISCO PACKET TRACER", 
  "HARDWARE & PROTOCOLS"
];

// CursorGrid Canvas Background Component
function CursorGrid({
  cellSize = 60,
  color = "#CD99DB",
  radius = 160,
  falloff = "smooth",
  holdTime = 300,
  fadeDuration = 700,
  lineWidth = 1.2,
  maxOpacity = 0.8,
  fillOpacity = 0.08,
  gridOpacity = 0.05,
  clickPulse = true,
  pulseSpeed = 500,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = { x: -1000, y: -1000, lastMove: 0 };
    const pulses = [];

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.lastMove = performance.now();
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e) => {
      if (!clickPulse) return;
      const rect = canvas.getBoundingClientRect();
      pulses.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        startTime: performance.now(),
      });
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    const draw = (now) => {
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      // Base Static Grid
      ctx.strokeStyle = color;
      ctx.globalAlpha = gridOpacity;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= cols; i++) {
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
      }
      for (let j = 0; j <= rows; j++) {
        ctx.moveTo(0, j * cellSize);
        ctx.lineTo(width, j * cellSize);
      }
      ctx.stroke();

      // Mouse Hover Interaction Logic
      const timeSinceMove = now - mouse.lastMove;
      let mouseAlpha = 1;

      if (timeSinceMove > holdTime) {
        const fadeProgress = (timeSinceMove - holdTime) / fadeDuration;
        mouseAlpha = Math.max(0, 1 - fadeProgress);
      }

      // Draw Grid Cells & Highlights
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const cellX = i * cellSize + cellSize / 2;
          const cellY = j * cellSize + cellSize / 2;

          const distMouse = Math.hypot(cellX - mouse.x, cellY - mouse.y);
          let intensity = 0;

          if (distMouse < radius && mouseAlpha > 0) {
            const norm = distMouse / radius;
            intensity = falloff === "smooth" 
              ? (1 - norm) * (1 - norm) 
              : 1 - norm;
            intensity *= mouseAlpha;
          }

          // Pulse Effect on Click
          for (let p = pulses.length - 1; p >= 0; p--) {
            const pulse = pulses[p];
            const pulseAge = now - pulse.startTime;
            if (pulseAge > pulseSpeed) {
              if (i === 0 && j === 0) pulses.splice(p, 1);
              continue;
            }
            const currentPulseRadius = (pulseAge / pulseSpeed) * (radius * 1.5);
            const distPulse = Math.hypot(cellX - pulse.x, cellY - pulse.y);
            const pulseDiff = Math.abs(distPulse - currentPulseRadius);
            if (pulseDiff < cellSize) {
              const pulseIntensity = (1 - pulseDiff / cellSize) * (1 - pulseAge / pulseSpeed);
              intensity = Math.max(intensity, pulseIntensity);
            }
          }

          if (intensity > 0) {
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.min(maxOpacity, intensity * fillOpacity);
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);

            ctx.strokeStyle = color;
            ctx.globalAlpha = Math.min(maxOpacity, intensity);
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cellSize, color, radius, falloff, holdTime, fadeDuration, lineWidth, maxOpacity, fillOpacity, gridOpacity, clickPulse, pulseSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

function Reveal({ id, className = "", children }) {
  const isVisible = useReveal(id);
  return (
    <div id={id} className={className + (isVisible ? " visible" : "")}>
      {children}
    </div>
  );
}

function SocialIcons({ showInstagram }) {
  return (
    <div className="social-icons">
      <a href="https://www.linkedin.com/in/kheza-nabajo-514a45372/" aria-label="LinkedIn">
        <i className="fab fa-linkedin-in"></i>
      </a>
      <a href="https://github.com/KhezaNabajo" aria-label="GitHub">
        <i className="fab fa-github"></i>
      </a>
      {showInstagram && (
        <a href="https://www.instagram.com/kxzy_30/" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
      )}
    </div>
  );
}

function Navbar({ isMenuOpen, toggleMenu, scrollToSection }) {
  function handleNavigate(targetSection) {
    if (isMenuOpen) toggleMenu();
    scrollToSection(targetSection);
  }

  const navItems = [
    ["home", "Home"], 
    ["projects", "Projects"], 
    ["about", "About"], 
    ["contact", "Contact"]
  ];

  return (
    <nav>
      <a 
        className="logo" 
        href="#home" 
        onClick={(e) => { e.preventDefault(); handleNavigate("home"); }}
      >
        KHEZA NABAJO
      </a>
      <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <ul className={isMenuOpen ? "nav-links open" : "nav-links"}>
        {navItems.map(([sectionId, label]) => (
          <li key={sectionId}>
            <a 
              href={"#" + sectionId} 
              onClick={(e) => { e.preventDefault(); handleNavigate(sectionId); }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="hero-greeting">HI, I AM</p>
        <h1>KHEZA NABAJO.</h1>
        <p className="hero-title">Information Technology Student | Visual Designer &amp; Network Designer</p>
        <div className="hero-actions">
          <a href="#contact" className="btn">CONTACT ME <span className="dot"></span></a>
          <SocialIcons />
        </div>
      </div>
      <div className="hero-image">
        <img src="/assets/personalpic.png" alt="Kheza Nabajo" />
      </div>
    </section>
  );
}

function Featured({ openAllProjects }) {
  const featuredItems = FEATURED_IDS.map((id) => PROJECTS.find((project) => project.id === id));

  return (
    <section className="featured" id="projects">
      <div className="section-head">
        <h2>FEATURED PROJECTS</h2>
        <a 
          href="#all-projects" 
          className="more-link" 
          onClick={(e) => { e.preventDefault(); openAllProjects(); }}
        >
          MORE PROJECTS
        </a>
      </div>
      {featuredItems.map((project) => (
        <Reveal key={project.id} id={"feat-" + project.id} className="project">
          <div className="project-image">
            {project.badge && <span className="badge">{project.badge}</span>}
            <img src={project.img} alt={project.title} />
          </div>
          <div className="project-info">
            <h3>{project.title.replace(" Platform", "")}</h3>
            <p>{project.desc}</p>
            <Meta year={project.year} role={project.role} />
            <Links links={project.links} />
          </div>
        </Reveal>
      ))}
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <h2>ABOUT ME</h2>
      <Reveal id="about-content" className="about-content">
        <h3>Information Technology Student | Visual Designer &amp; Network Designer</h3>
        <p>I am an Information Technology student at Western Institute of Technology with a deep passion for accessible design and network design. I am curious about solving problems. Currently, I am also developing my technical skills in networking by designing and optimizing network infrastructures using tools like Cisco Packet Tracer.</p>
        <div className="line-link"></div>
      </Reveal>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="capabilities">
      <h2>MY CAPABILITIES</h2>
      <Reveal id="skills-content" className="skills-content">
        <p>I am always looking to add more skills. Challenges help me grow and improve. I stay focused and keep developing my abilities.</p>
        <div className="skills">
          {SKILLS_LIST.map((skill) => (
            <span key={skill} className="skill">{skill}</span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <h2>LET'S GET IN TOUCH.</h2>
      <p>Say hello at <a href={"mailto:" + EMAIL}>{EMAIL}</a></p>
      <p>For more info, here's my <a href={RESUME_URL} download="KhezaNabajo-CV.pdf">CV</a></p>
      <SocialIcons showInstagram />
    </section>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(window.location.hash === "#all-projects" ? "all" : "home");
  const pendingSection = useRef(null);

  function toggleMenu() { 
    setIsMenuOpen(!isMenuOpen); 
  }

  function openAllProjects() { 
    setCurrentPage("all"); 
    window.location.hash = "all-projects"; 
    window.scrollTo(0, 0); 
  }

  function scrollToSection(targetSection) {
    if (currentPage !== "home") { 
      pendingSection.current = targetSection; 
      setCurrentPage("home"); 
    } else {
      document.getElementById(targetSection)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    if (currentPage === "home" && pendingSection.current) {
      document.getElementById(pendingSection.current)?.scrollIntoView();
      pendingSection.current = null;
    }
  }, [currentPage]);

  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* Fixed CursorGrid background layer */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "auto",
        }}
      >
        <CursorGrid
          cellSize={60}
          color="#CD99DB"
          radius={160}
          falloff="smooth"
          holdTime={300}
          fadeDuration={700}
          lineWidth={1.2}
          maxOpacity={0.8}
          fillOpacity={0.08}
          gridOpacity={0.05}
          clickPulse={true}
          pulseSpeed={500}
        />
      </div>

      {/* Foreground Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <link rel="stylesheet" href="styles.css" />
        <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} scrollToSection={scrollToSection} />
        {currentPage === "home" ? (
          <>
            <Hero />
            <Featured openAllProjects={openAllProjects} />
            <About />
            <Capabilities />
          </>
        ) : (
          <MoreProjects />
        )}
        <Contact />
        <footer><p>&copy; 2026 Kheza Nabajo</p></footer>
      </div>
    </div>
  );
}