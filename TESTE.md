# Guia de Teste - Fases 0 e 1

## 🚀 Como Testar

### 1. Iniciar o servidor
```bash
npm run dev
```

Abra: **http://localhost:5173**

### 2. Fluxo Esperado

#### **Loading Screen**
- ✅ Loading spinner aparece
- ✅ Barra de progresso preenche
- ✅ Transição suave para o jogo

#### **Fase 0: Prólogo**

**Sequência de eventos:**

1. **Tela preta inicial** (1s)

2. **Carta voando**
   - Envelope aparece de baixo
   - Sobe até o centro
   - Balança suavemente

3. **Carta se abre**
   - Gira 360°
   - Partículas douradas aparecem
   - Texto aparece: "Prezada Aurora, você foi aceita..."
   - Aguarda 3s
   - Carta desaparece

4. **Chapéu Seletor aparece**
   - Cone marrom com olhos amarelos
   - Cresce com animação "bounce"
   - Balança suavemente (idle)

5. **Narração do Chapéu** (6 diálogos):
   - "Bem-vinda, Aurora."
   - "Sou o Chapéu Seletor..."
   - "Você foi escolhida..."
   - "Ao longo do caminho..."
   - "Está pronta?"
   - "Então vamos começar."

6. **Solicitação de carta**
   - Texto: "Pegue a primeira carta de Edwiges..."
   - Modal de input aparece após 2s

7. **Input da carta**
   - Digite: **AURORA1**
   - Clique "Confirmar"
   - Mensagem: "Fase 1 desbloqueada!"
   - Transição para Fase 1

#### **Fase 1: Coragem (Gryffindor)**

**Ambiente:**
- Fundo vermelho escuro (#4a0e0e)
- Luz quente alaranjada
- "Lareira" pulsando (luz laranja animada)

**Objetos visíveis (5):**

| Objeto | Posição | Aparência |
|--------|---------|-----------|
| **Espada** | Esquerda | Lâmina prata + cabo marrom |
| **Leão** | Direita superior | Esfera dourada com "juba" de spikes |
| **Varinha** | Centro inferior | Cilindro marrom + ponta brilhante |
| **Pergaminho** | Esquerda superior | Cilindro bege horizontal |
| **Chave** | Direita inferior | Corpo + anel dourado girando |

**Gameplay:**

1. **Introdução do Chapéu**
   - 3 textos de introdução
   - Última mensagem: "Clique nos objetos dourados..."

2. **Indicador de Progresso**
   - Canto superior direito
   - Mostra: "0/5 Objetos Encontrados"
   - Barra de progresso vazia

3. **Clicar nos objetos**
   - Ao clicar em qualquer objeto:
     - ✨ Partículas douradas explodem
     - 🔊 Som de clique
     - 📖 Texto aparece com narração + versículo
     - 📊 Progresso atualiza (1/5, 2/5, etc.)
     - ⏱️ Aguarda ~4s
     - Texto desaparece

**Conteúdo dos objetos:**

- **Espada**: "A coragem não está na força da lâmina..." | Josué 1:9
- **Leão**: "O leão ruge, mas há um Leão maior..." | Apocalipse 5:5
- **Varinha**: "Instrumentos são úteis, mas quem age..." | Zacarias 4:6
- **Pergaminho**: "A Palavra guia os corajosos." | Salmos 119:105
- **Chave**: "A coragem abre portas que o medo tranca." | Mateus 7:7

4. **Conclusão (5/5)**
   - 🎉 Explosão de partículas por toda tela
   - 🔊 Som de vitória
   - 📖 Mensagem sobre São Jorge
   - ⭕ Portal dourado aparece no centro (anel girando)
   - 📜 Texto: "Um portal se abriu..."
   - 📧 Solicitação da próxima carta

5. **Input próxima carta**
   - Digite: **AURORA2** (para testar validação)
   - Ou qualquer código inválido para ver erro

---

## ✅ Checklist de Testes

### Fase 0
- [ ] Loading screen funciona
- [ ] Carta voa e se abre
- [ ] Partículas aparecem
- [ ] Chapéu aparece corretamente
- [ ] 6 diálogos aparecem sequencialmente
- [ ] Modal de carta aparece
- [ ] Código "AURORA1" funciona
- [ ] Transição para Fase 1 ocorre

### Fase 1
- [ ] Cenário vermelho escuro
- [ ] Luzes funcionam (quente + lareira pulsante)
- [ ] 5 objetos visíveis e flutuando
- [ ] Introdução do Chapéu (3 textos)
- [ ] Indicador de progresso visível
- [ ] Cliques funcionam em todos objetos
- [ ] Partículas aparecem ao clicar
- [ ] Textos + versículos aparecem
- [ ] Progresso atualiza (1/5 → 5/5)
- [ ] Não pode clicar objeto duas vezes
- [ ] Conclusão dispara aos 5/5
- [ ] Portal dourado aparece
- [ ] Modal de próxima carta aparece

### Sistema Geral
- [ ] Save/Load funciona (recarregar página mantém progresso)
- [ ] Código inválido mostra erro
- [ ] Código já usado mostra erro
- [ ] Transições são suaves
- [ ] Performance é boa (60fps)
- [ ] Console não mostra erros críticos

---

## 🐛 Problemas Conhecidos

### Assets Mockados
- ⚠️ **Áudio não toca** (arquivos vazios)
  - Música de fundo comentada
  - Vozes comentadas
  - SFX pode não tocar

- ⚠️ **Modelos 3D simples**
  - Objetos são formas geométricas básicas
  - Chapéu é um cone simples
  - Substituir por modelos reais depois

### Próximas Melhorias
- [ ] Gravar dublagens reais
- [ ] Adicionar músicas de fundo
- [ ] Substituir objetos por modelos 3D reais
- [ ] Adicionar backgrounds de alta qualidade
- [ ] Melhorar animações do Chapéu "falando"

---

## 🎮 Controles de Debug

### Atalhos de Teclado
- **Ctrl+R** - Resetar progresso completo
- **Ctrl+S** - Mostrar dados de save no console

### Console
```javascript
// Acessar instância do jogo
window.game

// Ver estado atual
window.game.state

// Ir para fase específica
window.game.loadPhase(0)  // Fase 0
window.game.loadPhase(1)  // Fase 1

// Desbloquear fase manualmente
window.game.state.validateCard('AURORA1')
window.game.state.validateCard('AURORA2')

// Ver progresso
window.game.state.phaseProgress

// Limpar save e recomeçar
window.game.state.resetProgress()
location.reload()
```

---

## 📝 Feedback para Desenvolvimento

Ao testar, anote:
- ⏱️ **Timing**: Diálogos muito rápidos/lentos?
- 🎨 **Visual**: Cores, tamanhos, posicionamentos
- 🎵 **Áudio**: Volumes, sincronização
- 🐛 **Bugs**: Erros no console, crashes
- 💡 **Ideias**: Melhorias, novos efeitos

---

**Boa sorte testando! 🪄✝️**
