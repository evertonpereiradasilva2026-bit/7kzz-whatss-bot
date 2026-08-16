# Estrutura do Projeto

## Arquivos Principais

### `src/index.js`
Arquivo principal do bot. Contém:
- Inicialização da conexão com WhatsApp
- Event listeners (conexão, mensagens, grupos)
- Processamento de comandos
- Sistema de moderação automática
- Lógica de proteção de grupos
- Gerenciamento de avisos

### `src/config.js`
Configurações do bot carregadas via variáveis de ambiente:
- `OWNER_NUMBER`: Número do dono do bot
- `BOT_NAME`: Nome do bot
- `PREFIX`: Prefixo dos comandos

### `src/store.js`
Gerenciamento de dados persistentes (data.json):
- Configurações do bot
- Grupos conectados
- Usuários bloqueados
- Lista VIP
- Configurações de segurança por grupo
- Mensagens de boas-vindas
- Configuração do comando "oii"

### `src/menu.js`
Menus e submenus organizados:
- `mainMenu`: Menu principal
- `submenu`: Submenus por categoria
- Grupos de comandos categorizados

### `src/security.js`
Sistema de segurança:
- Detecção de links
- Detecção de palavras proibidas
- Classificação de texto (pornô, gore, violência, fake)
- Identificação de tipo de mídia

## Dependências

```json
{
  "@whiskeysockets/baileys": "^6.7.18",
  "dotenv": "^16.4.5",
  "pino": "^9.3.2",
  "qrcode-terminal": "^0.12.0",
  "qrcode": "^1.5.4",
  "sharp": "^0.33.5"
}
```

## Fluxo de Execução

1. **Inicialização** → `start()` conecta ao WhatsApp
2. **QR Code** → Exibe QR para autenticação
3. **Event Listeners** → Aguarda conexão e mensagens
4. **Moderação** → Valida mensagem antes de processar comando
5. **Comando** → Processa e responde

## Armazenamento

- **data.json**: Arquivo local com todas as configurações
- **./auth**: Pasta com credenciais de autenticação (Baileys)

## Categorias de Comandos

- **Dono**: setprefix, setbotname, grupos, block, unblock, broadcast, oii, oiimenu
- **Administração**: add, kick, ban, promote, demote, mute, unmute, tagall, hidetag, linkgp, setname, setdesc, groupinfo, open, close
- **Proteção**: antilink, antispam, antiflood, antiporno, antigore, antiviolence, antipalavra, antimedia, antifake, protecao, punicao, warn, warnings, clearwarn
- **Ferramentas**: ping, runtime, info, id, calc, say, menu, help
- **Diversão**: sticker, toimg, rpg
- **VIP**: vip, addvip, delvip, listvip
