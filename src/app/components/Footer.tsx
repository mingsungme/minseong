export function Footer() {
  return (
    <footer id="contact" className="relative py-24 px-8 border-t border-[#f5f5f0]/10">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 gap-16 mb-16">
          <div>
            <div className="font-['Archivo_Black'] text-4xl mb-8">
              Let's Work
              <br />
              <span className="text-[#ff6b35]">Together</span>
            </div>
            <p className="font-['Crimson_Pro'] text-lg text-[#b8b8a8] leading-relaxed">
              새로운 프로젝트나 협업 기회에 대해 이야기 나누고 싶으시다면,
              언제든지 연락 주세요.
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <div className="font-['Space_Mono'] text-xs tracking-wider text-[#b8b8a8] mb-2">
                EMAIL
              </div>
              <a
                href="mailto:minseong.kim@example.com"
                className="font-['Crimson_Pro'] text-2xl hover:text-[#ff6b35] transition-colors duration-300"
              >
                minseong.kim@example.com
              </a>
            </div>
            <div>
              <div className="font-['Space_Mono'] text-xs tracking-wider text-[#b8b8a8] mb-2">
                PHONE
              </div>
              <a
                href="tel:+821012345678"
                className="font-['Crimson_Pro'] text-2xl hover:text-[#ff6b35] transition-colors duration-300"
              >
                +82 10-1234-5678
              </a>
            </div>
            <div className="flex gap-4 pt-4">
              {['LinkedIn', 'Behance', 'Notion', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-['Space_Mono'] text-xs tracking-wider text-[#b8b8a8] hover:text-[#ff6b35] transition-colors duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-[#f5f5f0]/10">
          <div className="font-['Space_Mono'] text-xs text-[#b8b8a8]">
            © 2026 Kim Minseong. All rights reserved.
          </div>
          <div className="font-['Space_Mono'] text-xs text-[#b8b8a8]">
            Designed & Developed with passion
          </div>
        </div>
      </div>
    </footer>
  );
}
