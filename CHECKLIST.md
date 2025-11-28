# ✅ Checklist de Desenvolvimento - Jornada Aurora

## 🏗️ Fundação do Projeto

### Setup Inicial
- [x] Inicializar npm
- [x] Instalar dependências (Three.js, GSAP, Howler)
- [x] Configurar Vite
- [x] Criar estrutura de pastas
- [x] Configurar Git

### Sistemas Core
- [x] SceneManager (Three.js)
- [x] AudioManager (Howler.js)
- [x] GameState (save/load)
- [x] Transitions (GSAP)
- [x] HTML base
- [x] CSS base
- [x] main.js orquestrador

### Documentação
- [x] README.md
- [x] Enredo.MD (detalhamento de fases)
- [x] DESENVOLVIMENTO.md (guia técnico)
- [x] CHECKLIST.md (este arquivo)
- [x] .gitignore

---

## 🎮 Fase 0: Prólogo

### Assets
- [ ] Background místico (carta voando)
- [ ] Modelo/Sprite Chapéu Seletor
- [ ] Música: Intro misteriosa
- [ ] SFX: Coruja (Edwiges)
- [ ] Voz: Chapéu - Introdução (~40s)

### Implementação
- [ ] Criar `Phase0_Intro.js`
- [ ] Animação carta voando (GSAP)
- [ ] Aparição Chapéu Seletor
- [ ] Sistema de diálogo/texto
- [ ] Integrar áudio
- [ ] Input de código da carta
- [ ] Transição para Fase 1

### Testes
- [ ] Jogo carrega sem erros
- [ ] Animações funcionam
- [ ] Áudio sincroniza
- [ ] Input aceita código
- [ ] Save funciona

---

## 🦁 Fase 1: Coragem (Gryffindor)

### Assets
- [ ] Background: Sala Comunal Gryffindor
- [ ] Modelo: Espada de Gryffindor
- [ ] Modelo: Leão
- [ ] Modelo: Varinha
- [ ] Modelo: Pergaminho
- [ ] Modelo: Chave dourada
- [ ] Música: Tema heroico
- [ ] SFX: Mágica (partículas)
- [ ] SFX: Vitória
- [ ] Voz: Chapéu - Intro Fase 1
- [ ] Voz: Chapéu - 5 falas (objetos)
- [ ] Imagem: São Jorge (sutil)

### Implementação
- [ ] Criar `Phase1_Courage.js`
- [ ] Carregar background
- [ ] Posicionar 5 objetos na cena
- [ ] Sistema de cliques (raycasting)
- [ ] Handler de cada objeto
- [ ] Sistema de partículas
- [ ] Mostrar texto + versículo
- [ ] Contador de objetos (5/5)
- [ ] Animação de conclusão
- [ ] Prompt próxima carta

### Conteúdo
- [ ] Escrever textos dos 5 objetos
- [ ] Selecionar versículos bíblicos
- [ ] Escrever narração São Jorge
- [ ] Gravar dublagens

### Carta Física #1
- [ ] Design da carta (Canva)
- [ ] Imprimir
- [ ] Envelope
- [ ] Selo/Lacre

### Testes
- [ ] Cena carrega corretamente
- [ ] Todos objetos clicáveis
- [ ] Partículas aparecem
- [ ] Áudio toca
- [ ] Textos aparecem
- [ ] Conclusão funciona
- [ ] Transição próxima fase

---

## 🦅 Fase 2: Sabedoria (Ravenclaw)

### Assets
- [ ] Background: Biblioteca Hogwarts
- [ ] Modelo: Águia de bronze
- [ ] Modelos: Livros (3-5)
- [ ] Música: Tema sábio/misterioso
- [ ] Voz: Chapéu - Intro + feedback
- [ ] Imagem: Santo Tomás de Aquino

### Implementação
- [ ] Criar `Phase2_Wisdom.js`
- [ ] Sistema de Quiz
- [ ] UI para perguntas/respostas
- [ ] 3 enigmas implementados
- [ ] Feedback visual (livro brilha)
- [ ] Mostrar passagens bíblicas
- [ ] Animação de conclusão

### Conteúdo
- [ ] Escrever 3 enigmas
- [ ] Selecionar versículos
- [ ] Gravar dublagens

### Carta Física #2
- [ ] Design
- [ ] Imprimir
- [ ] Envelope

### Testes
- [ ] Quiz funciona
- [ ] Respostas corretas/erradas
- [ ] Visual feedback
- [ ] Conclusão

---

## 🦡 Fase 3: Lealdade (Hufflepuff)

### Assets
- [ ] Background: Jardim/Campo
- [ ] Modelo: Texugo
- [ ] Sprites: 6 cartões (vida São José)
- [ ] Música: Tema pastoral/calmo
- [ ] Voz: Chapéu - Intro + conclusão
- [ ] Imagem: São José

### Implementação
- [ ] Criar `Phase3_Loyalty.js`
- [ ] Sistema Drag & Drop
- [ ] UI cartões embaralhados
- [ ] Verificação de ordem correta
- [ ] Animação árvore crescendo
- [ ] Pergunta extra (3 escolhas)

### Conteúdo
- [ ] 6 eventos da vida de São José
- [ ] Ilustrações dos eventos
- [ ] Gravar dublagens

### Carta Física #3
- [ ] Design
- [ ] Imprimir
- [ ] Envelope

### Testes
- [ ] Drag funciona
- [ ] Ordem verifica
- [ ] Animação conclusão

---

## 🐍 Fase 4: Ambição Redimida (Slytherin)

### Assets
- [ ] Background: Masmorra verde
- [ ] Modelo: Serpente animada
- [ ] Música: Tema tenso/menor
- [ ] Voz: Chapéu - Narração + feedback
- [ ] Imagem: São Paulo

### Implementação
- [ ] Criar `Phase4_Ambition.js`
- [ ] Sistema de escolhas (visual novel)
- [ ] 3 situações morais
- [ ] Tracking de escolhas
- [ ] Feedback baseado em decisões
- [ ] Mensagem final

### Conteúdo
- [ ] 3 situações escritas
- [ ] Análise de cada escolha
- [ ] Conexão com São Paulo
- [ ] Gravar dublagens

### Carta Física #4
- [ ] Design
- [ ] Imprimir
- [ ] Envelope

### Testes
- [ ] Escolhas funcionam
- [ ] Feedback correto
- [ ] Diferentes finais

---

## 🦌 Fase 5: O Patrono

### Assets
- [ ] Background: Floresta sombria
- [ ] Efeitos: Sombras (dementadores)
- [ ] Partículas: Luz divina
- [ ] Música: Tensa → Épica
- [ ] SFX: Cliques, explosão luz
- [ ] Voz: Chapéu - Intro + revelação
- [ ] Imagem: São Miguel Arcanjo

### Implementação
- [ ] Criar `Phase5_Patronus.js`
- [ ] Parte 1: Escolher memórias
- [ ] Parte 2: Escolher oração
- [ ] Parte 3: Cliques rápidos (30s)
- [ ] Sistema de timer
- [ ] Sombras se aproximando
- [ ] Explosão de luz (vitória)

### Conteúdo
- [ ] 6 ícones de memórias
- [ ] Textos das orações
- [ ] Gravar dublagens

### Carta Física #5
- [ ] Design
- [ ] Imprimir
- [ ] Envelope

### Testes
- [ ] Timer funciona
- [ ] Cliques registram
- [ ] Dificuldade balanceada
- [ ] Vitória satisfatória

---

## 🌲 Fase 6: Tentação (Floresta Proibida)

### Assets
- [ ] Background: Floresta densa
- [ ] Elementos: Árvores, névoa
- [ ] Música: Sombria, sussurros
- [ ] SFX: Vozes distorcidas
- [ ] Voz: Chapéu - Orientação
- [ ] Versículos: Luz no chão

### Implementação
- [ ] Criar `Phase6_Temptation.js`
- [ ] Labirinto top-down
- [ ] Sistema de movimento
- [ ] Vozes sussurrantes
- [ ] Loops em caminhos errados
- [ ] Versículos como guia
- [ ] Botão "Pedir Ajuda"

### Conteúdo
- [ ] 4 tentações escritas
- [ ] 4 verdades (versículos)
- [ ] Gravar sussurros
- [ ] Gravar dublagens Chapéu

### Carta Física #6
- [ ] Design
- [ ] Imprimir
- [ ] Envelope

### Testes
- [ ] Labirinto funciona
- [ ] Vozes tocam
- [ ] Frustração intencional
- [ ] Solução satisfatória

---

## 🌑 Fase 7: Escuridão

### Assets
- [ ] Background: Câmara escura
- [ ] Efeitos: Sombras, luz mínima
- [ ] Música: Ameaçadora
- [ ] Voz: Chapéu - Dicas confusas

### Implementação
- [ ] Criar `Phase7_Darkness.js`
- [ ] Puzzle impossível
- [ ] Timer de frustração
- [ ] Luz diminuindo
- [ ] Botão "Desistir" (após 10 tentativas)
- [ ] Transição Fase 8

### Conteúdo
- [ ] Puzzle matemático/lógico
- [ ] Gravar dublagens

### Carta Física #7
- [ ] Design
- [ ] Imprimir
- [ ] Envelope

### Testes
- [ ] Impossibilidade confirmada
- [ ] Frustração crescente
- [ ] Preparação para Fase 8

---

## ✝️ Fase 8: GRAÇA (A MAIS IMPORTANTE)

### Assets
- [ ] Background: Salão escuro
- [ ] Silhueta: Voldemort
- [ ] Efeitos: Luz verde, luz dourada
- [ ] Música: Tensa → Celestial
- [ ] SFX: Batida cardíaca, Avada Kedavra
- [ ] Voz: Chapéu - Narração final
- [ ] Música final: Emocionante
- [ ] Foto: Aurora (upload)

### Implementação
- [ ] Criar `Phase8_Grace.js`
- [ ] Puzzle impossível (60s)
- [ ] Timer vermelho
- [ ] Sequência Avada Kedavra
- [ ] Flash verde
- [ ] Tela preta (5s silêncio)
- [ ] Luz dourada
- [ ] Texto rolando (60s)
- [ ] Sistema de foto
- [ ] Mensagem final personalizada
- [ ] Botão "Revelar Segredo"

### Conteúdo
- [ ] Texto final completo (revisado)
- [ ] Gravar narração emocionada
- [ ] Vídeo final explicativo (opcional)

### Carta Física #8
- [ ] Design especial
- [ ] Imprimir
- [ ] Envelope especial

### Testes
- [ ] Sequência emocional funciona
- [ ] Timing perfeito
- [ ] Música sincroniza
- [ ] Foto aparece
- [ ] Mensagem impacta

---

## 🎨 Polimento Final

### Visual
- [ ] Todos backgrounds em alta qualidade
- [ ] Modelos 3D otimizados
- [ ] Partículas ajustadas
- [ ] Transições suaves
- [ ] UI polida

### Áudio
- [ ] Todas músicas balanceadas
- [ ] SFX sincronizados
- [ ] Dublagens claras
- [ ] Volume ajustado

### Mecânicas
- [ ] Save/Load testado
- [ ] Todas cartas funcionam
- [ ] Progressão fluida
- [ ] Sem bugs críticos

### Performance
- [ ] FPS estável (60fps)
- [ ] Carregamento rápido
- [ ] Sem memory leaks
- [ ] Mobile responsivo (opcional)

---

## 🚀 Deploy

### Build
- [ ] `npm run build`
- [ ] Testar build local
- [ ] Otimizar assets finais

### Hospedagem
- [ ] Criar conta Netlify/Vercel
- [ ] Deploy do projeto
- [ ] Testar URL pública
- [ ] Criar URL customizada (opcional)

### Preparação Física
- [ ] Imprimir todas 8 cartas
- [ ] Envelopes numerados
- [ ] Gaiola de Edwiges decorada
- [ ] Organizar ordem das cartas
- [ ] QR Code (link do jogo)

### Apresentação
- [ ] Carta de apresentação inicial
- [ ] Instruções de como jogar
- [ ] Vídeo explicativo final
- [ ] Mensagem de amor escrita

---

## 🎁 Entrega

- [ ] Testar jogo completo uma última vez
- [ ] Verificar todas cartas
- [ ] Preparar ambiente físico
- [ ] Gravar reação (opcional)
- [ ] Aproveitar o momento! ❤️

---

## 📊 Progresso Geral

**Sprint 1**: ✅ 100% Completo
**Sprint 2**: ⏳ 0% (Próximo)
**Sprint 3**: ⏳ 0%
**Sprint 4**: ⏳ 0%
**Sprint 5**: ⏳ 0%
**Sprint 6**: ⏳ 0%

**Progresso Total**: █░░░░░░░░░ 15%

---

**Última atualização**: 28/11/2024
**Tempo estimado restante**: 10-13 semanas (ritmo confortável)

💪 Você consegue! Este projeto será incrível! 🪄✝️
