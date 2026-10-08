import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Lock,
  Volume2,
  Smartphone,
  ChevronDown,
  Check,
  X,
  Play,
  CheckCircle2,
  Wifi,
  Battery,
  ListTodo,
  Settings,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: 'Porque é que o Skipless não tem streaks ou gamificação?',
    a: 'Porque o nosso foco é ajudar-te a concluir tarefas reais, não a colecionar pontos. Em vez de te prender a streaks, o Skipless mantém a tua atenção no próximo passo importante e reduz a culpa digital.',
  },
  {
    q: 'O que acontece quando ignoro repetidamente uma tarefa?',
    a: 'O alerta fica mais visível e mais insistente para te trazer de volta ao que é importante. Assim evitas o ciclo de “depois faço” que transforma pequenas tarefas em atrasos maiores.',
  },
  {
    q: 'Os meus dados ou tarefas são enviados para algum servidor?',
    a: 'Não. O Skipless foi criado para privacidade total: os teus dados ficam no teu iPhone, sem conta obrigatória e sem rastreamento para anúncios.',
  },
  {
    q: 'Como funciona o acesso antecipado ao TestFlight?',
    a: 'Ao entrares na lista de espera, recebes o convite por email assim que abrirmos novas vagas. A ativação é feita por ordem para garantir uma experiência estável para todos.',
  },
  {
    q: 'A aplicação vai estar disponível para Android?',
    a: 'O lançamento inicial é exclusivo para iOS de modo a tirar total partido do sistema de Notificações Críticas e da arquitetura do ecossistema Apple. O suporte para Android está planeado para a fase seguinte, mantendo rigorosamente a mesma filosofia local-first e sem compromissos.',
  },
];

export default function App() {
  // Waitlist State
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState(148);

  // Bottom CTA waitlist state
  const [bottomEmail, setBottomEmail] = useState('');
  const [bottomSubmitted, setBottomSubmitted] = useState(false);

  // Simulator State
  const [escalationLevel, setEscalationLevel] = useState(0);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes default
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Focus Timer Countdown Effect
  useEffect(() => {
    if (!isFocusActive) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFocusActive(false);
          setFeedbackToast('Bloco de foco concluído com sucesso!');
          setEscalationLevel(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocusActive]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (feedbackToast) {
      const timer = setTimeout(() => setFeedbackToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedbackToast]);

  const handleWaitlistSubmit = (e: React.FormEvent, isBottom = false) => {
    e.preventDefault();
    const targetEmail = isBottom ? bottomEmail : email;
    if (!targetEmail || !targetEmail.includes('@')) return;

    if (isBottom) {
      setBottomSubmitted(true);
    } else {
      setIsSubmitted(true);
    }
    // Randomize a realistic next queue number
    setQueueNumber((prev) => prev + 1);
  };

  const handleStartFocus = () => {
    setIsFocusActive(true);
    setTimerSeconds(600);
    setFeedbackToast('Modo Foco Ativado: 10 minutos de imersão total.');
  };

  const handleIgnore = () => {
    const nextLevel = (escalationLevel + 1) % 5;
    setEscalationLevel(nextLevel);
    if (nextLevel >= 3) {
      setFeedbackToast(`Alerta Escalado! ${nextLevel}x silenciado — Urgência Sonora Máxima.`);
    } else {
      setFeedbackToast(`Notificação ignorada (${nextLevel}x). Nível de pressão aumentado.`);
    }
  };

  const handleSnooze = () => {
    const [h, m] = scheduledTime.split(':').map(Number);
    let nextMinutes = m + 30;
    let nextHour = h;
    if (nextMinutes >= 60) {
      nextHour = (nextHour + 1) % 24;
      nextMinutes = nextMinutes - 60;
    }
    const formatted = `${String(nextHour).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
    setScheduledTime(formatted);
    setFeedbackToast(`Adiado para as ${formatted}. O prazo foi recalculado.`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getEscalationBadge = () => {
    switch (escalationLevel) {
      case 0:
        return <span className="mockup-badge">AGENDADO</span>;
      case 1:
        return <span className="mockup-badge badge-amber">1X IGNORADO</span>;
      case 2:
        return <span className="mockup-badge badge-amber">URGENTE • 2X IGNORADO</span>;
      case 3:
        return <span className="mockup-badge badge-red">CRÍTICO • 3X IGNORADO</span>;
      case 4:
      default:
        return <span className="mockup-badge badge-red">PRESSÃO MÁXIMA (4X)</span>;
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background glows */}
      <div className="ambient-glow" />
      <div className="ambient-grid" />

      {/* Navigation */}
      <header className="navbar">
        <div className="container nav-content">
          <a href="#" className="nav-brand">
            <img src="./logo-symbol.png" alt="Skipless Logo" className="nav-logo" />
            <span className="nav-title">SKIPLESS</span>
            <span className="nav-badge">TESTFLIGHT V1.0</span>
          </a>

          <nav className="nav-links">
            <a href="#manifesto" className="nav-link">Como Funciona</a>
            <a href="#features" className="nav-link">Benefícios</a>
            <a href="#simulator" className="nav-link">Simulador</a>
            <a href="#stats" className="nav-link">Resultados</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>

          <a href="#waitlist" className="btn-nav-cta">
            Pedir Acesso Beta
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="waitlist">
        <div className="container">
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            <span>A APP DE FOCO E RESPONSABILIDADE PARA IPHONE</span>
          </div>

          <h1 className="hero-title">
            O fim da negociação contigo próprio.
          </h1>

          <p className="hero-subtitle">
            Para de adiar as tarefas que mudam o teu dia.
            O Skipless transforma intenção em ação com foco imediato, lembretes inteligentes e compromisso real.
          </p>

          {/* Waitlist Form */}
          <div className="hero-form-box">
            {!isSubmitted ? (
              <form onSubmit={(e) => handleWaitlistSubmit(e, false)} className="waitlist-form">
                <input
                  type="email"
                  className="waitlist-input"
                  placeholder="Escreve o teu email para o TestFlight..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="waitlist-btn">
                  Garantir Vaga
                </button>
              </form>
            ) : (
              <div className="waitlist-success">
                <CheckCircle2 size={18} color="#30d158" />
                <span>Vaga #{queueNumber} reservada. Convite TestFlight a caminho!</span>
              </div>
            )}
          </div>

          {/* Trust badges row */}
          <div className="hero-trust-row">
            <div className="hero-trust-item">
              <Lock size={14} color="#ff9f0a" />
              <span>100% Local (Zero Nuvem)</span>
            </div>
            <div className="hero-trust-item">
              <Volume2 size={14} color="#ff9f0a" />
              <span>Alertas Progressivos Ineludíveis</span>
            </div>
            <div className="hero-trust-item">
              <Smartphone size={14} color="#ff9f0a" />
              <span>Feito para rotina real</span>
            </div>
          </div>

          {/* Interactive iPhone Mockup Section */}
          <div className="mockup-wrapper" id="simulator">
            <div className="mockup-glow" />

            <div className="iphone-stage">
              <div className="iphone-scaler">
                <div className="iphone-frame">
                  {/* iOS Status Bar */}
                  <div className="iphone-status-bar">
                    <span className="status-time">09:41</span>
                    <div className="dynamic-island">
                      <div className="island-camera" />
                    </div>
                    <div className="status-icons">
                      <Wifi size={13} strokeWidth={2.5} />
                      <Battery size={15} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* In-app Simulator Header with Logo */}
                  <div className="mockup-app-header">
                    <div className="mockup-brand-row">
                      <img
                        src="./logo-symbol.png"
                        alt="Skipless"
                        className="mockup-logo-img"
                      />
                      <div>
                        <div className="mockup-app-title">SKIPLESS</div>
                        <div className="mockup-app-subtitle">Sessão Ativa • Protocolo 01</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#8e8e93', fontFamily: 'monospace', fontWeight: 600 }}>
                        {scheduledTime}
                      </span>
                      <div
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: escalationLevel > 2 ? '#ff453a' : '#ff9f0a',
                          boxShadow: escalationLevel > 2 ? '0 0 8px #ff453a' : '0 0 6px #ff9f0a',
                        }}
                      />
                    </div>
                  </div>

                  {/* Simulator Screen Body */}
                  <div className="mockup-screen-body">
                    {!isFocusActive ? (
                      <>
                        <div className="mockup-section-label">Execução Imediata</div>
                        <div
                          className={`mockup-card ${
                            escalationLevel >= 3 ? 'card-silenced' : escalationLevel >= 1 ? 'card-important' : ''
                          }`}
                        >
                          <div className="mockup-card-header">
                            {getEscalationBadge()}
                            <span className="mockup-time-text">{scheduledTime}</span>
                          </div>

                          <h3 className="mockup-card-title">
                            Submeter relatório de contas à administração
                          </h3>

                          <div
                            className={`mockup-card-outcome ${
                              escalationLevel >= 3 ? 'outcome-red' : ''
                            }`}
                          >
                            {escalationLevel >= 3
                              ? '⚠️ CONSEQ.: Chamada de emergência com CEO às 09h30'
                              : 'Se falhar: Reunião de emergência com CEO às 09h30'}
                          </div>

                          {/* Actions inside Mockup */}
                          <div className="mockup-actions-row">
                            <button
                              type="button"
                              className="mockup-btn mockup-btn-start"
                              onClick={handleStartFocus}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <Play size={12} fill="#000000" />
                                <span>COMEÇAR (10m)</span>
                              </div>
                            </button>

                            <button
                              type="button"
                              className="mockup-btn mockup-btn-snooze"
                              onClick={handleSnooze}
                              title="Adiar prazo 30 minutos"
                            >
                              ADIAR (+30m)
                            </button>

                            <button
                              type="button"
                              className="mockup-btn mockup-btn-ignore"
                              onClick={handleIgnore}
                              title="Simula ignorar o alerta"
                            >
                              IGNORAR
                            </button>
                          </div>
                        </div>

                        {/* Secondary protocol preview */}
                        <div className="mockup-section-label">A Seguir Hoje</div>
                        <div className="mockup-card-secondary">
                          <div className="mockup-card-header">
                            <span className="mockup-badge">AGENDADO</span>
                            <span className="mockup-time-text">18:30</span>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f5f5f7', marginBottom: '3px' }}>
                            Corrida e mobilidade (5km)
                          </div>
                          <div style={{ fontSize: '11px', color: '#8e8e93' }}>
                            Se falhar: Sem ecrãs após as 21h00
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Focus mode screen */
                      <div className="mockup-focus-box">
                        <div className="mockup-focus-tag">BLOCO DE IMERSÃO ATIVO</div>
                        <div className="mockup-focus-timer">{formatTimer(timerSeconds)}</div>

                        <div className="mockup-progress-track">
                          <div
                            className="mockup-progress-fill"
                            style={{ width: `${((600 - timerSeconds) / 600) * 100}%` }}
                          />
                        </div>

                        <p style={{ fontSize: '12px', color: '#8e8e93', marginBottom: '18px', lineHeight: 1.5 }}>
                          Sem alternância de ecrãs. Mantém o foco até o alarme disparar.
                        </p>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="mockup-focus-stop"
                            onClick={() => {
                              setIsFocusActive(false);
                              setFeedbackToast('Sessão terminada antes do tempo.');
                            }}
                          >
                            Desistir
                          </button>
                          <button
                            type="button"
                            className="mockup-btn mockup-btn-start"
                            style={{ padding: '8px 16px', fontSize: '12px' }}
                            onClick={() => {
                              setIsFocusActive(false);
                              setEscalationLevel(0);
                              setFeedbackToast('Tarefa concluída! Registo arquivado com sucesso.');
                            }}
                          >
                            Concluir Agora
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Toast inside Simulator */}
                    {feedbackToast && (
                      <div
                        style={{
                          marginTop: 'auto',
                          marginBottom: '4px',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          background: '#1f1f28',
                          fontSize: '11px',
                          color: '#ff9f0a',
                          fontWeight: 700,
                          textAlign: 'center',
                          border: '1px solid #353545',
                        }}
                      >
                        {feedbackToast}
                      </div>
                    )}
                  </div>

                  {/* Tab Bar inside Mockup */}
                  <div className="mockup-tab-bar">
                    <div className="mockup-tab-item active">
                      <ListTodo size={17} />
                      <span>Tarefas</span>
                    </div>
                    <div className="mockup-tab-item">
                      <Clock size={17} />
                      <span>Foco</span>
                    </div>
                    <div className="mockup-tab-item">
                      <Settings size={17} />
                      <span>Definições</span>
                    </div>
                  </div>

                  {/* iOS Home Indicator */}
                  <div className="iphone-home-indicator" />
                </div>
              </div>
            </div>

            <div className="mockup-hint">
              ⚡ Simulador Interativo: experimenta clicar em <strong>COMEÇAR</strong> ou <strong>IGNORAR</strong> para sentir como o Skipless responde na prática.
            </div>
          </div>
        </div>
      </section>

      {/* The Anti-To-Do Thesis Section */}
      <section className="thesis-section" id="manifesto">
        <div className="container">
          <div className="section-tag">A DIFERENÇA</div>
          <h2 className="section-heading">Porque o Skipless converte planos em execução.</h2>
          <p className="section-lead">
            Menos organização infinita, mais progresso concreto no que importa para a tua vida e trabalho.
          </p>

          <div className="comparison-grid">
            {/* Traditional Apps */}
            <div className="comparison-card card-traditional">
              <div className="comparison-badge badge-fail">ABORDAGEM ANTIGA</div>
              <h3 className="comparison-title">Apps Tradicionais</h3>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <X size={18} color="#ff453a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Listas sem fim:</strong> tudo parece urgente, mas poucas tarefas saem do papel.</span>
                </li>
                <li className="comparison-item">
                  <X size={18} color="#ff453a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Gamificação vazia:</strong> gera distração e sensação de progresso sem resultado real.</span>
                </li>
                <li className="comparison-item">
                  <X size={18} color="#ff453a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Adiar sem consequência:</strong> o atraso acumula e a pressão aparece tarde demais.</span>
                </li>
                <li className="comparison-item">
                  <X size={18} color="#ff453a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Muito ruído:</strong> excesso de funcionalidades que complicam o que devia ser simples.</span>
                </li>
              </ul>
            </div>

            {/* Skipless Protocol */}
            <div className="comparison-card card-skipless">
              <div className="comparison-badge badge-success">ABORDAGEM SKIPLESS</div>
              <h3 className="comparison-title">O Protocolo Skipless</h3>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <Check size={18} color="#ff9f0a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Prioridade clara:</strong> sabes exatamente o que fazer agora, sem dispersão.</span>
                </li>
                <li className="comparison-item">
                  <Check size={18} color="#ff9f0a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Lembretes inteligentes:</strong> o sistema adapta-se para evitar que tarefas críticas sejam esquecidas.</span>
                </li>
                <li className="comparison-item">
                  <Check size={18} color="#ff9f0a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Foco sem distrações:</strong> sem pontos, sem confetis, sem ruído desnecessário.</span>
                </li>
                <li className="comparison-item">
                  <Check size={18} color="#ff9f0a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Privacidade por padrão:</strong> os teus dados ficam contigo, sempre.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Mechanics Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-tag">COMO FUNCIONA</div>
          <h2 className="section-heading">4 benefícios para agir sem adiar.</h2>
          <p className="section-lead">
            Tudo o que precisas para concluir tarefas importantes com consistência.
          </p>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <AlertTriangle size={22} />
              </div>
              <h4 className="feature-box-title">1. Clareza imediata</h4>
              <p className="feature-box-desc">
                Define o compromisso de cada tarefa e elimina a ambiguidade que alimenta a procrastinação.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <Volume2 size={22} />
              </div>
              <h4 className="feature-box-title">2. Prioridade ativa</h4>
              <p className="feature-box-desc">
                Se adiares algo importante, o Skipless reforça o alerta para te devolver ao essencial.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <Clock size={22} />
              </div>
              <h4 className="feature-box-title">3. Arranque rápido</h4>
              <p className="feature-box-desc">
                Começa em segundos e ganha tração com blocos curtos que reduzem o atrito inicial.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={22} />
              </div>
              <h4 className="feature-box-title">4. Privacidade total</h4>
              <p className="feature-box-desc">
                A tua rotina é pessoal. O Skipless protege os teus dados e não vende a tua atenção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof Section */}
      <section className="stats-section" id="stats">
        <div className="container">
          <div className="section-tag">RESULTADOS</div>
          <h2 className="section-heading">Resultados de quem já usa diariamente.</h2>
          <p className="section-lead">
            Progresso visível para profissionais com rotinas exigentes.
          </p>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">84%</div>
              <div className="stat-label">MENOS ATRASOS EM TAREFAS IMPORTANTES</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">GAMIFICAÇÃO OU ALERTAS DE CULPA</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">CONTROLO DOS DADOS PELO UTILIZADOR</div>
            </div>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Tinha 32 tarefas em atraso no Todoist que simplesmente ignorava todos os dias. No Skipless coloco apenas 3 coisas essenciais. Ou faço na hora ou assumo a consequência."
              </p>
              <div>
                <div className="testimonial-author">Tomás Vaz</div>
                <div className="testimonial-role">Fundador de startup</div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "O facto de não haver pontinhos e gamificação foi o que me conquistou. É uma ferramenta séria para quem quer despachar trabalho sério e viver a vida."
              </p>
              <div>
                <div className="testimonial-author">Dra. Sofia Martins</div>
                <div className="testimonial-role">Advogada</div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "O botão de Começar com contagem de 10 minutos elimina o atrito de começar. Quando dou por mim, já passei a fase difícil e acabei a tarefa."
              </p>
              <div>
                <div className="testimonial-author">Diogo Ribeiro</div>
                <div className="testimonial-role">Consultor de estratégia</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="container">
          <div className="section-tag">DÚVIDAS</div>
          <h2 className="section-heading">Perguntas Frequentes.</h2>
          <p className="section-lead">
            As respostas essenciais antes de entrares na lista de espera.
          </p>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'faq-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className="faq-chevron" />
                  </button>
                  {isOpen && <div className="faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="container">
        <div className="cta-banner">
          <div className="cta-banner-glow" />
          <h2 className="cta-heading">Pronto para parar de negociar contigo próprio?</h2>
          <p className="cta-lead">
            Junta-te à lista de espera e recebe acesso prioritário ao Skipless no iPhone.
            Sem compromissos, sem spam.
          </p>

          <div style={{ maxWidth: '440px', margin: '0 auto' }}>
            {!bottomSubmitted ? (
              <form onSubmit={(e) => handleWaitlistSubmit(e, true)} className="waitlist-form">
                <input
                  type="email"
                  className="waitlist-input"
                  placeholder="O teu email para TestFlight..."
                  value={bottomEmail}
                  onChange={(e) => setBottomEmail(e.target.value)}
                  required
                />
                <button type="submit" className="waitlist-btn">
                  Pedir Convite
                </button>
              </form>
            ) : (
              <div className="waitlist-success">
                <CheckCircle2 size={18} color="#30d158" />
                <span>Vaga #{queueNumber} confirmada! Fica atento à tua caixa de entrada.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <img src="./logo-symbol.png" alt="Skipless Logo" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
            <span style={{ fontWeight: 800, letterSpacing: '1px', color: '#ffffff' }}>SKIPLESS</span>
            <span style={{ marginLeft: '12px' }}>— You Cannot Skip What Matters.</span>
          </div>

          <div className="footer-links">
            <a
              href="#manifesto"
              className="footer-link"
            >
              Como Funciona
            </a>
            <a
              href="#features"
              className="footer-link"
            >
              Benefícios
            </a>
            <a
              href="#faq"
              className="footer-link"
            >
              Perguntas Frequentes
            </a>
            <span style={{ color: '#656573' }}>
              © 2026 Skipless. Todos os direitos reservados.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
