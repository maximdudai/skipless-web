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
    a: 'Porque streaks criam falsa sensação de produtividade e ansiedade contraproducente. No dia em que perdes uma streak de 40 dias, a probabilidade de abandonares o hábito duplica. O Skipless trata-te como um adulto funcional: o foco é a execução da tarefa atual, sem pontuações ou confetis infantis.',
  },
  {
    q: 'O que acontece quando ignoro repetidamente uma tarefa?',
    a: 'O motor de escalonamento do Skipless monitoriza o número de vezes que uma notificação foi silenciada ou ignorada. A partir de 3 rejeições consecutivas, a tarefa é promovida automaticamente a estado Urgente/Crítico, aumentando o volume de insistência sonora e destacando a consequência real que tu próprio definiste.',
  },
  {
    q: 'Os meus dados ou tarefas são enviados para algum servidor?',
    a: 'Absolutamente nada. O Skipless é 100% Local-First. As tuas tarefas, horários e consequências ficam guardadas exclusivamente na base de dados SQLite protegida no chip do teu próprio iPhone. Zero contas, zero cookies, zero telemetria na nuvem.',
  },
  {
    q: 'Como funciona o acesso antecipado ao TestFlight?',
    a: 'Estamos a aprovar vagas em lotes fechados de 200 utilizadores para garantir feedback de alta densidade técnica. Ao registares o teu email na lista de espera, recebes um link direto de convite para instalar a versão Beta oficial via Apple TestFlight assim que o teu lote for ativado.',
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
            <img src="/logo-symbol.png" alt="Skipless Logo" className="nav-logo" />
            <span className="nav-title">SKIPLESS</span>
            <span className="nav-badge">TESTFLIGHT V1.0</span>
          </a>

          <nav className="nav-links">
            <a href="#manifesto" className="nav-link">O Manifesto</a>
            <a href="#features" className="nav-link">Mecânica</a>
            <a href="#simulator" className="nav-link">Simulador</a>
            <a href="#stats" className="nav-link">Impacto</a>
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
            <span>O PROTOCOLO ANTI-PROCRASTINAÇÃO PARA IOS</span>
          </div>

          <h1 className="hero-title">
            O fim da negociação contigo próprio.
          </h1>

          <p className="hero-subtitle">
            A maioria das to-do lists serve apenas para arquivar tarefas que nunca vais fazer.
            O Skipless força decisões binárias com pressão progressiva, timers irreversíveis e zero desculpas.
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
              <span>Nativo em Swift & Expo</span>
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
                        src="/logo-symbol.png"
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

                        <div className="mockup-local-notice">
                          <Lock size={12} color="#30d158" />
                          <span>Armazenamento SQLite Local • Zero Conexões Cloud</span>
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
              ⚡ Simulador Interativo: experimenta clicar em <strong>COMEÇAR</strong> ou <strong>IGNORAR</strong> para veres a resposta imediata do motor.
            </div>
          </div>
        </div>
      </section>

      {/* The Anti-To-Do Thesis Section */}
      <section className="thesis-section" id="manifesto">
        <div className="container">
          <div className="section-tag">O PARADIGMA</div>
          <h2 className="section-heading">Porque as outras apps te deixam procrastinar.</h2>
          <p className="section-lead">
            As aplicações comerciais foram desenhadas para que passes o dia a organizar listas bonitas em vez de executares. O Skipless foi desenhado para te fazer fechar o telemóvel.
          </p>

          <div className="comparison-grid">
            {/* Traditional Apps */}
            <div className="comparison-card card-traditional">
              <div className="comparison-badge badge-fail">O CEMITÉRIO DO CONFORTO</div>
              <h3 className="comparison-title">Apps de Tarefas Comuns</h3>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <X size={18} color="#ff453a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Listas infinitas de 200 itens:</strong> Tornam-se silos de culpa acumulada onde as tarefas morrem esquecidas.</span>
                </li>
                <li className="comparison-item">
                  <X size={18} color="#ff453a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Gamificação infantil:</strong> Streaks artificiais, confetis e níveis que te dão falsa dopamina sem trabalho real.</span>
                </li>
                <li className="comparison-item">
                  <X size={18} color="#ff453a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Adiar indefinidamente sem atrito:</strong> Carregas em "Amanhã" dez vezes seguidas sem qualquer fricção psicológica.</span>
                </li>
                <li className="comparison-item">
                  <X size={18} color="#ff453a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Telemetria e contas na nuvem:</strong> Os teus hábitos mais vulneráveis são sincronizados e monitorizados em servidores de terceiros.</span>
                </li>
              </ul>
            </div>

            {/* Skipless Protocol */}
            <div className="comparison-card card-skipless">
              <div className="comparison-badge badge-success">EXECUÇÃO INELUDÍVEL</div>
              <h3 className="comparison-title">O Protocolo Skipless</h3>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <Check size={18} color="#ff9f0a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Decisão Binária Obrigatória:</strong> Ou executas o bloco agora, ou assumes a consequência explicada com clareza.</span>
                </li>
                <li className="comparison-item">
                  <Check size={18} color="#ff9f0a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Pressão Progressiva:</strong> Silenciar um alerta não o desliga; aumenta a urgência e a frequência de chamada.</span>
                </li>
                <li className="comparison-item">
                  <Check size={18} color="#ff9f0a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Zero Gamificação Tóxica:</strong> Sem pontuações, sem desespero de streaks perdidas. O teu prémio é a tarefa terminada.</span>
                </li>
                <li className="comparison-item">
                  <Check size={18} color="#ff9f0a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>100% Local-First:</strong> Protegido por encriptação local no chip do teu iPhone. Sem login, sem rastreamento.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Mechanics Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-tag">A ARQUITETURA</div>
          <h2 className="section-heading">4 Mecânicas que quebram a tua inércia.</h2>
          <p className="section-lead">
            Engenharia de comportamento humano transposta para código nativo no teu bolso.
          </p>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <AlertTriangle size={22} />
              </div>
              <h4 className="feature-box-title">1. A Consequência Explícita</h4>
              <p className="feature-box-desc">
                Ao criar uma tarefa, defines a dor real de falhar ("Ter de pagar jantar", "Reunião tensa com o cliente"). O teu cérebro reage ao custo real, não ao texto abstrato.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <Volume2 size={22} />
              </div>
              <h4 className="feature-box-title">2. Escalonamento de Pressão</h4>
              <p className="feature-box-desc">
                Ignorar uma notificação não a empurra para debaixo do tapete. O Skipless escala automaticamente o alerta para o modo Urgente, exigindo ação imediata.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <Clock size={22} />
              </div>
              <h4 className="feature-box-title">3. Blocos de Foco Irreversíveis</h4>
              <p className="feature-box-desc">
                Ao carregar em "COMEÇAR", entras num túnel de tempo rígido (10 a 60m). Sem pausas complacentes. Fazes o arranque e o ritmo natural do trabalho assume o controlo.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={22} />
              </div>
              <h4 className="feature-box-title">4. Privacidade Blindada (Zero Cloud)</h4>
              <p className="feature-box-desc">
                Os teus planos e fraquezas de produtividade não pertencem aos servidores de ninguém. O motor opera inteiramente offline na base de dados SQLite do iOS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof Section */}
      <section className="stats-section" id="stats">
        <div className="container">
          <div className="section-tag">VALIDAÇÃO</div>
          <h2 className="section-heading">Métricas de teste em ambiente real.</h2>
          <p className="section-lead">
            Testado internamente por quem tem dias de alta intensidade e não tem tempo para brincar com listas.
          </p>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">84%</div>
              <div className="stat-label">REDUÇÃO NO ATRASO DE TAREFAS CRÍTICAS</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">STREAKS OU NOTIFICAÇÕES DE CULPA INÚTIL</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">PRIVACIDADE LOCAL NO CHIP DO IPHONE</div>
            </div>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Tinha 32 tarefas em atraso no Todoist que simplesmente ignorava todos os dias. No Skipless coloco apenas 3 coisas essenciais. Ou faço na hora ou assumo a consequência."
              </p>
              <div>
                <div className="testimonial-author">Tomás Vaz</div>
                <div className="testimonial-role">Engenheiro de Software & Fundador</div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "O facto de não haver pontinhos e gamificação foi o que me conquistou. É uma ferramenta séria para quem quer despachar trabalho sério e viver a vida."
              </p>
              <div>
                <div className="testimonial-author">Dra. Sofia Martins</div>
                <div className="testimonial-role">Advogada Contencioso</div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "O botão de Começar com contagem de 10 minutos elimina o atrito de começar. Quando dou por mim, já passei a fase difícil e acabei a tarefa."
              </p>
              <div>
                <div className="testimonial-author">Diogo Ribeiro</div>
                <div className="testimonial-role">Consultor de Estratégia</div>
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
            Tudo o que precisas de saber sobre o funcionamento e o lançamento do Skipless.
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
            As primeiras vagas no TestFlight estão limitadas para garantir suporte e refinamento próximo.
            Regista o teu email e recebe o convite imediato assim que a validação abrir.
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
            <img src="/logo-symbol.png" alt="Skipless Logo" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
            <span style={{ fontWeight: 800, letterSpacing: '1px', color: '#ffffff' }}>SKIPLESS</span>
            <span style={{ marginLeft: '12px' }}>— You Cannot Skip What Matters.</span>
          </div>

          <div className="footer-links">
            <a
              href="#manifesto"
              className="footer-link"
            >
              Manifesto
            </a>
            <a
              href="#features"
              className="footer-link"
            >
              Mecânica
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
