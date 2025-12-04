# 🐛 Guia de Debug Rápido

## ✅ Correções Aplicadas

### 1. **Tela Preta**
- ✅ Overlay de transição inicializado corretamente
- ✅ Loading não quebra com assets mockados (try/catch)
- ✅ Iluminação 3D corrigida e intensificada

### 2. **Input de Carta**
- ✅ Maxlength aumentado para 10 caracteres

### 3. **Iluminação 3D**
- ✅ Luz ambiente: 0.8 (aumentada)
- ✅ Luz direcional: 1.0 (aumentada)
- ✅ Luz frontal adicional: 0.5 (nova)
- ✅ Luzes marcadas como permanentes (não são removidas ao trocar fase)

### 4. **Áudio Mockado**
- ✅ Todos os `playSFX()` e `playMusic()` envolvidos em try/catch
- ✅ Console mostra avisos mas não quebra execução

---

## 🧪 Como Testar Agora

### Passo 1: Recarregar Página
```
Ctrl + Shift + R (ou Cmd + Shift + R no Mac)
```
Isso limpa o cache e recarrega tudo.

### Passo 2: Abrir Console do Navegador
```
F12 → Aba Console
```

### Passo 3: Verificar Logs
Você DEVE ver:
```
✅ Iniciando Jornada Aurora...
✅ Carregando assets...
✅ Assets carregados!
✅ Jogo iniciado com sucesso!
✅ Carregando fase 0...
✅ Iniciando Fase 0: Prólogo
```

⚠️ Pode ver avisos (warnings) de áudio - isso é NORMAL:
```
⚠️ Alguns assets de áudio não foram carregados (normal com arquivos mockados)
⚠️ Música não disponível
⚠️ SFX coruja não disponível
```

### Passo 4: O Que Você DEVE Ver

**Após ~3 segundos:**
- 🎬 Fundo azul escuro (#0a0a15)
- 📧 Carta (retângulo bege) voando de baixo para cima
- ✨ Partículas douradas quando carta abre
- 💬 Texto: "Prezada Aurora, você foi aceita..."

**Depois:**
- 🎩 Chapéu Seletor (cone marrom com 2 olhos amarelos)
- 💬 6 textos do Chapéu aparecendo sequencialmente
- 📝 Modal para inserir código da carta

---

## 🔍 Se Ainda Estiver com Tela Preta

### Verificação 1: Console Tem Erros?
Procure por mensagens em VERMELHO no console.

**Se ver erro de THREE.js:**
```javascript
// No console, execute:
window.game.scene.scene
```
Se retornar `undefined`, há problema na inicialização.

### Verificação 2: Canvas Está Renderizando?
```javascript
// No console:
window.game.scene.renderer.info
```
Deve mostrar estatísticas de renderização.

### Verificação 3: Fase Foi Carregada?
```javascript
// No console:
window.game.currentPhase
```
Deve retornar um objeto Phase0_Intro.

### Verificação 4: Forçar Recarga da Fase
```javascript
// No console:
window.game.loadPhase(0)
```

---

## 🎨 Verificação de Iluminação

### Se objetos 3D não aparecem:

```javascript
// No console, verificar luzes:
window.game.scene.scene.children.filter(c => c.isLight)
```

Deve retornar **3 luzes**:
1. AmbientLight
2. DirectionalLight (posição 5, 10, 7.5)
3. DirectionalLight (posição 0, 0, 10)

### Forçar Luz Extra (debug):
```javascript
const extraLight = new THREE.AmbientLight(0xffffff, 2.0);
window.game.scene.scene.add(extraLight);
```

---

## 📊 Estatísticas Úteis

```javascript
// Ver estado do jogo
window.game.state

// Ver fase atual
window.game.state.currentPhase

// Ver fases desbloqueadas
window.game.state.unlockedPhases

// Ver objetos na cena
window.game.scene.scene.children.length

// Ver FPS (aproximado)
window.game.scene.renderer.info.render.frame
```

---

## 🚨 Problemas Comuns

### Problema: "Cannot read property 'init' of undefined"
**Causa:** Fase não foi importada no main.js
**Solução:** Verificar imports no topo de main.js

### Problema: Modelos 3D muito escuros
**Causa:** Iluminação insuficiente
**Solução:** Já corrigido, mas pode aumentar mais:
```javascript
// No console (temporário):
window.game.scene.scene.children
  .filter(c => c.isLight)[0]
  .intensity = 3.0;
```

### Problema: Partículas não aparecem
**Causa:** Sistema de partículas não está atualizando
**Solução:** Verificar se animation loop está rodando:
```javascript
window.game.scene.isAnimating
// Deve retornar: true
```

---

## 🎯 Checklist de Funcionamento

Execute no console para verificar tudo:

```javascript
console.log({
  gameExists: !!window.game,
  sceneExists: !!window.game?.scene,
  phaseExists: !!window.game?.currentPhase,
  isAnimating: window.game?.scene?.isAnimating,
  lightsCount: window.game?.scene?.scene.children.filter(c => c.isLight).length,
  objectsCount: window.game?.scene?.currentObjects.length,
  currentPhaseNumber: window.game?.state?.currentPhase
});
```

**Resultado esperado:**
```javascript
{
  gameExists: true,
  sceneExists: true,
  phaseExists: true,
  isAnimating: true,
  lightsCount: 3,
  objectsCount: > 0,
  currentPhaseNumber: 0
}
```

---

## 💡 Atalhos Úteis

- **Ctrl+R**: Reset completo
- **Ctrl+S**: Ver save data
- **F5**: Reload normal
- **Ctrl+Shift+R**: Hard reload (limpa cache)
- **F12**: Abrir DevTools

---

Se tudo isso foi verificado e ainda não funciona, me mande:
1. Screenshot do console
2. Resultado do checklist acima
3. Versão do navegador (Chrome/Firefox/Safari)

