# Jornada Aurora

Uma experiência interativa mágica que conecta o universo de Harry Potter com o Catolicismo, criada com amor para Aurora.

## 🎮 Sobre o Projeto

Este é um jogo narrativo em 3D que combina storytelling, puzzles, enigmas e uma profunda conexão teológica entre o sacrifício redentor em Harry Potter e o Plano de Salvação de Cristo.

### Tecnologias Utilizadas

- **Three.js** - Renderização 3D e cenas interativas
- **GSAP** - Animações suaves e transições
- **Howler.js** - Sistema de áudio (música, SFX, dublagens)
- **Vite** - Build tool moderno e rápido
- **Vanilla JavaScript** (ES Modules) - Sem frameworks complexos

## 📂 Estrutura do Projeto

```
jornada-aurora/
├── index.html                 # Entrada principal
├── package.json              # Dependências
│
├── styles/                   # Estilos CSS
│   ├── main.css             # Estilos globais
│   ├── phases.css           # Estilos por fase
│   └── animations.css       # Animações
│
├── assets/                   # Assets do jogo
│   ├── models/              # Modelos 3D (.glb/.gltf)
│   ├── textures/            # Imagens de fundo
│   ├── audio/
│   │   ├── music/           # Músicas de fundo
│   │   ├── voices/          # Dublagens do Chapéu
│   │   └── sfx/             # Efeitos sonoros
│   ├── images/
│   │   ├── ui/              # Elementos de interface
│   │   └── icons/           # Ícones
│   └── fonts/               # Fontes customizadas
│
└── src/                      # Código fonte
    ├── main.js              # Inicialização do jogo
    │
    ├── core/                # Sistemas principais
    │   ├── SceneManager.js  # Gerenciamento Three.js
    │   ├── AudioManager.js  # Sistema de áudio
    │   └── GameState.js     # State machine + save
    │
    ├── phases/              # Implementação das fases
    │   ├── Phase0_Intro.js
    │   ├── Phase1_Courage.js
    │   ├── Phase2_Wisdom.js
    │   ├── Phase3_Loyalty.js
    │   ├── Phase4_Ambition.js
    │   ├── Phase5_Patronus.js
    │   ├── Phase6_Temptation.js
    │   ├── Phase7_Darkness.js
    │   └── Phase8_Grace.js
    │
    ├── mechanics/           # Mecânicas reutilizáveis
    │   ├── ClickableObject.js
    │   ├── Quiz.js
    │   ├── DragAndDrop.js
    │   └── Timer.js
    │
    └── utils/               # Utilitários
        ├── Loader.js
        ├── Transitions.js
        └── Particles.js
```

## 🚀 Como Rodar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abre em: http://localhost:5173

### Build de Produção

```bash
npm run build
```

### Preview do Build

```bash
npm run preview
```

## 🎯 Sistema de Fases

O jogo possui 9 fases (0-8):

| Fase | Nome | Casa HP | Tema Católico | Mecânica |
|------|------|---------|---------------|----------|
| 0 | Prólogo | - | Chamado/Vocação | Visual Novel |
| 1 | Coragem | Gryffindor | São Jorge | Encontrar Objetos |
| 2 | Sabedoria | Ravenclaw | Sto. Tomás de Aquino | Quiz/Enigmas |
| 3 | Lealdade | Hufflepuff | São José | Ordenar Eventos |
| 4 | Ambição Redimida | Slytherin | São Paulo | Escolhas Morais |
| 5 | O Patrono | - | São Miguel | Cliques Rápidos |
| 6 | Tentação | - | Deserto de Cristo | Labirinto |
| 7 | Escuridão | - | Getsêmani | Puzzle Impossível |
| 8 | Graça | - | Sacrifício de Cristo | Revelação Final |

## 🔐 Sistema de Cartas

O jogo utiliza cartas físicas para desbloquear fases. Códigos padrão (podem ser alterados em `src/core/GameState.js`):

- `AURORA1` → Fase 1
- `AURORA2` → Fase 2
- `AURORA3` → Fase 3
- `AURORA4` → Fase 4
- `AURORA5` → Fase 5
- `AURORA6` → Fase 6
- `AURORA7` → Fase 7
- `AURORA8` → Fase 8

## 🛠️ Próximos Passos de Desenvolvimento

### Sprint 1: Fundação ✅
- [x] Setup do projeto
- [x] Estrutura de pastas
- [x] SceneManager (Three.js)
- [x] AudioManager (Howler)
- [x] GameState (save/load)
- [x] Transitions (GSAP)
- [x] CSS base

### Sprint 2: Fase 0 + 1 (Em desenvolvimento)
- [ ] Buscar assets (Chapéu Seletor, backgrounds)
- [ ] Implementar Phase0_Intro.js
- [ ] Implementar Phase1_Courage.js
- [ ] Sistema de partículas
- [ ] Gravar primeira dublagem
- [ ] Criar carta física #1

### Sprint 3-6: Demais fases
Consulte [Enredo.MD](Enredo.MD) para detalhamento completo.

## 🎨 Assets Necessários

### Modelos 3D
- Chapéu Seletor (animado)
- Espada de Gryffindor
- Águia de bronze
- Texugo
- Serpente
- Objetos diversos (varinha, pergaminho, chave)

**Onde buscar**: Sketchfab, CGTrader, Free3D

### Imagens de Fundo
- Sala Comunal Gryffindor
- Biblioteca de Hogwarts
- Jardim/Campo
- Masmorra Slytherin
- Floresta sombria
- Floresta proibida
- Câmara escura
- Salão final

**Onde buscar**: Midjourney, Leonardo.AI, Unsplash

### Áudio
- Músicas de fundo (8 tracks)
- Efeitos sonoros (mágica, clique, vitória)
- Dublagens do Chapéu Seletor

## 🐛 Debug

### Atalhos (modo desenvolvimento)

- `Ctrl+R` - Reset completo do progresso
- `Ctrl+S` - Mostrar dados de save no console

### Console Commands

```javascript
// Acessar instância do jogo
window.game

// Ver estado atual
window.game.state

// Ir para fase específica
window.game.loadPhase(3)

// Desbloquear fase manualmente
window.game.state.validateCard('AURORA5')
```

## 📝 Notas Importantes

- O save é automático (localStorage)
- Cada carta só pode ser usada uma vez
- Progresso é preservado entre sessões
- Sistema funciona offline após primeiro carregamento

## 💡 Conceito Teológico Central

> *"Assim como Harry Potter foi salvo pelo sacrifício de sua mãe,*
> *você, Aurora, foi salva pelo sacrifício do Filho de Deus."*

A jornada culmina na Fase 8, onde um enigma impossível representa a incapacidade humana de alcançar a salvação por mérito próprio. Quando o "Avada Kedavra" é disparado e tudo parece perdido, a Graça de Deus intervém, revelando que a vitória já foi conquistada na Cruz.

## ❤️ Dedicatória

Este projeto foi feito com todo amor e carinho para Aurora,
combinando duas coisas que amamos: Harry Potter e nossa fé católica.

---

**Desenvolvido com 🪄 e ✝️**
