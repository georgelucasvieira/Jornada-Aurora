# Guia de Desenvolvimento - Jornada Aurora

## 🎯 Status Atual

### ✅ Completo (Sprint 1)
- Estrutura do projeto
- Sistema de gerenciamento de cenas (Three.js)
- Sistema de áudio (Howler.js)
- State machine e sistema de save
- Sistema de transições (GSAP)
- UI base e estilos CSS
- Servidor de desenvolvimento funcionando

### 🚧 Próximos Passos Imediatos

## Sprint 2: Protótipo Jogável (Fase 0 + 1)

### 1. Buscar/Criar Assets

#### Modelos 3D Necessários
- **Chapéu Seletor** (prioridade ALTA)
  - Procurar em: Sketchfab ("sorting hat")
  - Alternativa: Modelar cone simples no Blender
  - Formato: `.glb` ou `.gltf`
  - Colocar em: `assets/models/sorting-hat.glb`

- **Objetos Fase 1** (5 objetos)
  - Espada simples
  - Leão (low-poly)
  - Varinha
  - Pergaminho
  - Chave dourada
  - Colocar em: `assets/models/phase1/`

#### Backgrounds/Texturas
- **Fase 0**: Fundo místico/carta voando
  - Opção 1: Gerar com IA (Midjourney/Leonardo)
  - Prompt sugerido: "Hogwarts acceptance letter flying, magical particles, dark background, cinematic --ar 16:9"
  - Colocar em: `assets/textures/phase0-bg.jpg`

- **Fase 1**: Sala Comunal Gryffindor
  - Buscar: Google Images (Creative Commons) ou gerar com IA
  - Prompt: "Gryffindor common room, warm fireplace, cozy, red and gold colors, magical atmosphere --ar 16:9"
  - Colocar em: `assets/textures/gryffindor-room.jpg`

#### Áudio

**Música de Fundo**
- Fase 0: Tema introdutório misterioso
  - Fonte: YouTube Audio Library, Incompetech, ou compor
  - Duração: 2-3 min (loop)
  - Colocar em: `assets/audio/music/intro.mp3`

- Fase 1: Tema heroico/aventureiro
  - Colocar em: `assets/audio/music/courage.mp3`

**Efeitos Sonoros**
- Clique/select: `assets/audio/sfx/click.mp3`
- Mágica/partículas: `assets/audio/sfx/magic.mp3`
- Vitória: `assets/audio/sfx/victory.mp3`
- Coruja: `assets/audio/sfx/owl.mp3`

**Dublagens do Chapéu**
- Intro: "Bem-vinda, Aurora! Sou eu quem guiará você..."
  - Gravar com voz modificada (grave, misteriosa)
  - Duração: ~30-40s
  - Colocar em: `assets/audio/voices/hat-intro.mp3`

- Fase 1 intro: Apresentação da missão de coragem
  - Colocar em: `assets/audio/voices/hat-phase1-intro.mp3`

- Fase 1 objetos: 5 falas curtas para cada objeto
  - `assets/audio/voices/hat-phase1-sword.mp3`
  - `assets/audio/voices/hat-phase1-lion.mp3`
  - etc.

### 2. Implementar Fase 0

Criar arquivo: `src/phases/Phase0_Intro.js`

**Checklist:**
- [ ] Classe base Phase0_Intro
- [ ] Método `init()` - Setup da cena
- [ ] Animação da carta voando (GSAP)
- [ ] Aparição do Chapéu Seletor
- [ ] Áudio: música + voz do Chapéu
- [ ] Transição para input de carta
- [ ] Método `destroy()` - Cleanup

**Exemplo de estrutura:**
```javascript
export class Phase0_Intro {
    constructor(sceneManager, audioManager, gameState) {
        this.scene = sceneManager;
        this.audio = audioManager;
        this.state = gameState;
    }

    async init() {
        // 1. Configurar cena
        this.scene.setBackgroundColor('#0a0a15');

        // 2. Adicionar carta (sprite ou modelo)
        // 3. Animação com GSAP
        // 4. Tocar música e voz
        // 5. Mostrar UI
    }

    destroy() {
        // Limpar cena
        this.scene.clear();
    }
}
```

### 3. Implementar Fase 1

Criar arquivo: `src/phases/Phase1_Courage.js`

**Checklist:**
- [ ] Carregar background Gryffindor
- [ ] Adicionar 5 objetos clicáveis na cena
- [ ] Sistema de raycasting (já existe no SceneManager)
- [ ] Handler de cliques
- [ ] Criar partículas ao clicar (já existe método)
- [ ] Mostrar texto + versículo quando clicar
- [ ] Tocar áudio correspondente
- [ ] Verificar conclusão (5/5 objetos)
- [ ] Animação de portal/conclusão
- [ ] Mostrar prompt para próxima carta

### 4. Conectar Fases ao Main

Editar `src/main.js`:

```javascript
import { Phase0_Intro } from './phases/Phase0_Intro.js';
import { Phase1_Courage } from './phases/Phase1_Courage.js';

// No construtor da classe Game:
this.phases = {
    0: Phase0_Intro,
    1: Phase1_Courage
    // Adicionar outras conforme desenvolver
};

async loadPhase(phaseNumber) {
    // Transição
    if (this.currentPhase) {
        await Transitions.fadeOut(0.5);
        this.currentPhase.destroy();
    }

    // Instanciar nova fase
    const PhaseClass = this.phases[phaseNumber];
    this.currentPhase = new PhaseClass(
        this.scene,
        this.audio,
        this.state
    );

    await this.currentPhase.init();
    await Transitions.fadeIn(0.5);
}
```

### 5. Gravar Dublagens

**Ferramentas:**
- Gravador: Audacity (gratuito)
- Efeitos de voz:
  - Baixar pitch (-20% para voz mais grave)
  - Adicionar reverb leve
  - EQ para remover agudos

**Roteiro Fase 0:**
```
"Bem-vinda, Aurora.

Sou o Chapéu Seletor, e serei eu quem guiará você
nesta jornada extraordinária.

Você foi escolhida para uma missão especial...
uma jornada que testará sua coragem, sabedoria,
lealdade e fé.

Ao longo do caminho, você descobrirá verdades profundas
sobre o amor que vence a morte.

Está pronta?

Então vamos começar.

Pegue a primeira carta de Edwiges e insira o código."
```

**Roteiro Fase 1:**
```
"Aqui está a Sala Comunal de Gryffindor,
onde os corajosos se reúnem.

Mas coragem verdadeira não vem apenas do coração...
vem de algo maior.

Procure pelos 5 objetos escondidos nesta sala.
Cada um revelará uma verdade sobre a coragem."
```

### 6. Criar Cartas Físicas

**Carta #1 (Fase 1 - Coragem)**

Usar Canva ou Photoshop:
- Tamanho: A5 ou Postal
- Estilo: Pergaminho envelhecido
- Elementos:
  - Selo de cera (símbolo Gryffindor)
  - Texto em fonte gótica
  - Código em destaque

**Texto sugerido:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━

          HOGWARTS
    Escola de Magia e Bruxaria

━━━━━━━━━━━━━━━━━━━━━━━━━━

Prezada Aurora,

Você foi selecionada para iniciar
sua jornada na Casa de Gryffindor,
onde a coragem habita.

"Sede fortes e corajosos,
não temais..."
— Josué 1:9

Para acessar esta fase,
insira o código abaixo:

╔════════════════════╗
║     AURORA1        ║
╚════════════════════╝

Que sua coragem seja guiada
pela fé.

             ⚡
   Alvo Dumbledore
   Diretor
```

**Envelope:**
- Lacrar com selo de cera (opcional)
- Escrever "Carta #1" no verso
- Incluir número da sequência

### 7. Testar Fluxo Completo

**Checklist de Testes:**
- [ ] Jogo carrega sem erros
- [ ] Loading screen aparece
- [ ] Fase 0 inicia automaticamente
- [ ] Música toca
- [ ] Voz do Chapéu funciona
- [ ] Input de carta aparece
- [ ] Código "AURORA1" desbloqueia Fase 1
- [ ] Transição entre fases funciona
- [ ] Fase 1 carrega com background
- [ ] Objetos são clicáveis
- [ ] Partículas aparecem ao clicar
- [ ] Textos e versículos aparecem
- [ ] Áudio de objetos toca
- [ ] 5/5 objetos = conclusão
- [ ] Save funciona (recarregar página mantém progresso)

## 🔧 Ferramentas Úteis

### Para Assets 3D
- **Blender** (modelagem básica)
- **Sketchfab** (download de modelos)
- **Mixamo** (se precisar animações de personagens)

### Para Imagens
- **Midjourney** (~$10/mês) - Melhor qualidade
- **Leonardo.AI** (gratuito com limite)
- **GIMP** (edição, gratuito)

### Para Áudio
- **Audacity** (gravação/edição)
- **Incompetech** (música CC)
- **Freesound.org** (SFX)
- **ElevenLabs** (IA para voz, se não quiser dublar)

### Para Cartas
- **Canva** (design gráfico fácil)
- **Photoshop/Affinity Photo**

## 📝 Dicas de Desenvolvimento

### Começar Simples
- Não precisa de modelos 3D complexos no início
- Use sprites 2D (PNG) se necessário
- Pode usar placeholders (cubos coloridos) para testar mecânicas

### Testes Incrementais
- Teste cada feature isoladamente
- Use `console.log()` liberalmente
- Aproveite os atalhos de debug (Ctrl+S, Ctrl+R)

### Assets Temporários
- Use assets "placeholder" enquanto busca os finais
- Marque claramente o que precisa substituir

### Commit Frequente (Git)
```bash
git add .
git commit -m "Implementa Fase 0: Prólogo"
git push
```

## 🎬 Próximas Sprints (Resumo)

### Sprint 3: Fases 2-4
- Implementar Quiz (Fase 2)
- Implementar Drag&Drop (Fase 3)
- Implementar Escolhas (Fase 4)
- Buscar assets correspondentes
- Gravar dublagens

### Sprint 4: Fases 5-7
- Mecânicas especiais (cliques, labirinto, puzzle)
- Assets mais complexos
- Ajuste de dificuldade

### Sprint 5: Fase 8 + Polimento
- **Fase mais importante!**
- Sequência Avada Kedavra
- Texto final emocionante
- Upload de foto da Aurora
- Polimento geral

### Sprint 6: Deploy
- Build de produção
- Deploy em Netlify/Vercel
- QR Code/Link
- Preparação física (gaiola + cartas)
- Vídeo final

## ❓ FAQ de Desenvolvimento

**P: Não consigo encontrar modelos 3D bons?**
R: Use imagens PNG com transparência posicionadas como "billboards" no Three.js.

**P: Minha voz ficou estranha na gravação?**
R: Use ElevenLabs (IA) ou peça pra um amigo com voz grave.

**P: O jogo está lento?**
R: Reduza qualidade de texturas, use modelos low-poly, otimize partículas.

**P: Three.js é muito complexo?**
R: O SceneManager já abstrai o básico. Foca em usar os métodos prontos.

**P: Como faço X?**
R: Consulte o código existente ou pergunte! Está tudo bem pedir ajuda.

---

**Lembre-se:** O importante é o amor e a mensagem, não a perfeição técnica. Faça com calma e aproveite o processo! 💛
