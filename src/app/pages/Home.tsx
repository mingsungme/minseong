import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function Home() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const FALLBACK = [
      { id: '1', title: 'Digital Platform Redesign', category: 'UI/UX Design', year: '2025' },
      { id: '2', title: 'Brand Identity System', category: 'Branding', year: '2025' },
      { id: '3', title: 'E-commerce Experience', category: 'Product Design', year: '2024' },
      { id: '4', title: 'Mobile App Interface', category: 'Mobile Design', year: '2024' },
      { id: '5', title: 'Design System', category: 'Systems', year: '2024' },
      { id: '6', title: 'Marketing Campaign', category: 'Creative Direction', year: '2023' },
    ];

    const fetchFeaturedProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'records'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        data.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        const top = data.slice(0, 6);

        if (top.length === 0) {
          setProjects(FALLBACK);
        } else {
          setProjects(top.map(p => ({
            id: p.id,
            title: p.title || 'Untitled Project',
            category: p.subjects?.[0] || (p.teamType === 'team' ? 'Team Project' : 'Solo Project'),
            year: (p.date || '').slice(0, 4) || '2025',
            thumbnail: p.thumbnail,
          })));
        }
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
        setProjects(FALLBACK);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const achievements = [
    { number: '50+', label: 'Projects Completed', description: 'Across various industries' },
    { number: '12', label: 'Awards Won', description: 'Design excellence recognized' },
    { number: '8+', label: 'Years Experience', description: 'In digital design' },
    { number: '95%', label: 'Client Satisfaction', description: 'Repeated collaborations' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#f5f5f0 1px, transparent 1px), linear-gradient(90deg, #f5f5f0 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative max-w-[1280px] w-full">
          <div
            className="space-y-6"
            style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}
          >
            <div className="font-['Space_Mono'] text-xs tracking-[0.3em] text-[#ff6b35] mb-4">
              CREATIVE DESIGNER & PRODUCT MANAGER
            </div>
            <h1
              className="font-['Archivo_Black'] text-[clamp(4rem,12vw,10rem)] leading-[0.9] tracking-tight"
              style={{ animation: 'scaleIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both' }}
            >
              김민성
              <br />
              <span className="text-[#ff6b35]">KIM MINSEONG</span>
            </h1>
            <p
              className="font-['Crimson_Pro'] text-xl max-w-[600px] leading-relaxed text-[#b8b8a8]"
              style={{ animation: 'fadeInUp 1s ease-out 0.8s both' }}
            >
              디지털 경험을 재정의하는 프로덕트 매니저.
              사용자 중심의 기획으로 비즈니스 가치를 창출합니다.
            </p>

            <div
              className="flex gap-4 pt-8"
              style={{ animation: 'fadeInUp 1s ease-out 1s both' }}
            >
              <Link to="/pm-portfolio" className="group relative px-8 py-4 bg-[#ff6b35] text-[#0a0a0a] font-['Space_Mono'] text-sm tracking-wider overflow-hidden transition-all duration-300 hover:scale-105 inline-block text-center min-w-[160px]">
                <span className="relative z-10">View Projects</span>
                <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <button className="px-8 py-4 border border-[#f5f5f0]/20 font-['Space_Mono'] text-sm tracking-wider hover:border-[#ff6b35] hover:text-[#ff6b35] transition-all duration-300">
                Contact Me
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div
            className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#ff6b35]/10 rotate-45"
            style={{ animation: 'rotateIn 2s ease-out 1.2s both' }}
          />
          <div
            className="absolute -left-20 bottom-20 w-[300px] h-[300px] bg-[#ff6b35]/5 blur-[100px]"
            style={{ animation: 'fadeIn 2s ease-out 1.5s both' }}
          />
        </div>
      </section>

      {/* Featured Project Section */}
      <section id="project" className="relative py-32 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-16">
            <div className="font-['Space_Mono'] text-xs tracking-[0.3em] text-[#ff6b35] mb-4">
              FEATURED WORK
            </div>
            <h2 className="font-['Archivo_Black'] text-6xl mb-4">
              Selected Projects
            </h2>
            <p className="font-['Crimson_Pro'] text-lg text-[#b8b8a8] max-w-[600px]">
              각 프로젝트는 독특한 도전과 창의적 해결책의 결과물입니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group relative aspect-[4/5] bg-[#1a1a1a] border border-[#f5f5f0]/10 overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {/* Project Number */}
                <div className="absolute top-6 left-6 font-['Space_Mono'] text-xs text-[#ff6b35] z-10">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Placeholder Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                  ) : (
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-[#f5f5f0]/10 group-hover:text-[#ff6b35]/20 transition-colors duration-500"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>

                {/* Overlay Effect */}
                <div
                  className={`absolute inset-0 bg-[#ff6b35] transition-opacity duration-500 ${
                    hoveredProject === project.id ? 'opacity-10' : 'opacity-0'
                  }`}
                />

                {/* Project Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] to-transparent">
                  <div className="font-['Space_Mono'] text-xs text-[#b8b8a8] mb-2">
                    {project.category} — {project.year}
                  </div>
                  <h3 className="font-['Crimson_Pro'] font-semibold text-lg">
                    {project.title}
                  </h3>
                </div>

                {/* Hover Border */}
                <div
                  className={`absolute inset-0 border-2 border-[#ff6b35] transition-opacity duration-300 ${
                    hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career & Achievements Section */}
      <section id="experience" className="relative py-32 px-8 bg-[#0f0f0f]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-16">
            <div className="font-['Space_Mono'] text-xs tracking-[0.3em] text-[#ff6b35] mb-4">
              ACHIEVEMENTS
            </div>
            <h2 className="font-['Archivo_Black'] text-6xl mb-4">
              By the Numbers
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="group p-8 bg-[#1a1a1a] border border-[#f5f5f0]/10 hover:border-[#ff6b35]/50 transition-all duration-300"
                style={{ animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both` }}
              >
                <div className="font-['Archivo_Black'] text-5xl text-[#ff6b35] mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {achievement.number}
                </div>
                <div className="font-['Space_Mono'] text-xs tracking-wider mb-2">
                  {achievement.label}
                </div>
                <div className="font-['Crimson_Pro'] text-sm text-[#b8b8a8]">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>

          {/* Career Summary */}
          <div className="mt-16 p-12 bg-gradient-to-r from-[#ff6b35]/10 to-transparent border-l-4 border-[#ff6b35]">
            <div className="font-['Space_Mono'] text-xs tracking-[0.3em] text-[#ff6b35] mb-4">
              EXPERIENCE
            </div>
            <p className="font-['Crimson_Pro'] text-2xl leading-relaxed max-w-[900px]">
              글로벌 기업부터 스타트업까지, 다양한 산업군에서 프로덕트 리더십을 발휘했습니다.
              데이터 기반의 의사결정과 사용자 중심 기획으로 비즈니스 목표를 달성하는 솔루션을 제공합니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
