# Comandos do 7kzz Bot

## 🔐 Comandos do Dono

| Comando | Uso | Descrição |
|---------|-----|-----------|
| `.setprefix` | `.setprefix !` | Altera o prefixo dos comandos |
| `.setbotname` | `.setbotname NovoNome` | Altera o nome do bot |
| `.grupos` | `.grupos` | Mostra grupos registrados |
| `.block` | `.block 5511999999999` | Bloqueia um usuário |
| `.unblock` | `.unblock 5511999999999` | Desbloqueia um usuário |
| `.broadcast` | `.broadcast mensagem` | Envia mensagem para todos os grupos |
| `.oii` | `.oii` | Envia atualização configurada |
| `.oiimenu` | `.oiimenu texto/foto/titulo/descricao/ver` | Configura mensagem de atualização |
| `.addvip` | `.addvip 5511999999999` | Adiciona usuário VIP |
| `.delvip` | `.delvip 5511999999999` | Remove usuário VIP |
| `.listvip` | `.listvip` | Lista usuários VIP |

## 🛡️ Proteção de Grupos

### Ativar/Desativar Proteções
```
.antilink on/off         - Bloqueia links e convites
.antispam on/off         - Detecta repetição de mensagens
.antiflood on/off        - Limita mensagens em sequência
.antiporno on/off        - Bloqueia termos de conteúdo sexual
.antigore on/off         - Bloqueia termos de gore
.antiviolence on/off     - Bloqueia termos de violência
.antipalavra on/off      - Usa lista personalizada de palavras
.antimedia on/off        - Bloqueia mídia recebida
.antifake on/off         - Bloqueia termos de golpes/fraudes
```

### Configurar Proteções
```
.protecao                - Mostra estado de todas as proteções
.punicao delete|warn|kick - Define ação após detecção
.antispamlimite 5        - Define limite do anti-spam
.antifloodlimite 8       - Define limite do anti-flood
.addpalavra termo        - Adiciona palavra à lista bloqueada
.delpalavra termo        - Remove palavra da lista
```

### Sistema de Advertências
```
.warn @user              - Aplicar advertência manual
.warnings @user          - Ver advertências do usuário
.clearwarn @user         - Zerar advertências
```

## 👥 Administração de Grupos

| Comando | Uso | Descrição |
|---------|-----|-----------|
| `.add` | `.add @user` | Adiciona membro |
| `.kick` | `.kick @user` | Remove membro |
| `.promote` | `.promote @user` | Promove a admin |
| `.demote` | `.demote @user` | Remove admin |
| `.ban` | `.ban @user` | Bane membro |
| `.unban` | `.unban @user` | Remove banimento |
| `.mute` | `.mute @user` | Silencia membro |
| `.unmute` | `.unmute @user` | Dessilencia membro |
| `.tagall` | `.tagall mensagem` | Marca todos |
| `.hidetag` | `.hidetag mensagem` | Marca todos (oculto) |
| `.linkgp` | `.linkgp` | Gera link do grupo |
| `.setname` | `.setname novo nome` | Altera nome do grupo |
| `.setdesc` | `.setdesc nova desc` | Altera descrição |
| `.groupinfo` | `.groupinfo` | Info do grupo |
| `.open` | `.open` | Abre grupo para membros |
| `.close` | `.close` | Fecha grupo para membros |

## 🛠️ Ferramentas

| Comando | Uso | Descrição |
|---------|-----|-----------|
| `.ping` | `.ping` | Verifica se bot está online |
| `.runtime` | `.runtime` | Status de operacional |
| `.info` | `.info` | Informações do bot |
| `.id` | `.id` | Mostra ID do chat |
| `.calc` | `.calc 2+2*3` | Calcula expressão |
| `.say` | `.say mensagem` | Repete mensagem |
| `.menu` / `.help` | `.menu` | Mostra menu principal |

## 🎮 Stickers

| Comando | Uso | Descrição |
|---------|-----|-----------|
| `.sticker` / `.s` | Enviar com imagem | Converte imagem em sticker |
| `.toimg` | Enviar com sticker | Converte sticker em imagem |

## 👤 Perfil/VIP

| Comando | Uso | Descrição |
|---------|-----|-----------|
| `.vip` | `.vip` | Verifica se é VIP |
| `.perfil` | `.perfil` | Mostra perfil |

## 🎯 RPG (Base simples)

| Comando | Uso | Descrição |
|---------|-----|-----------|
| `.rpg` | `.rpg` | Menu do RPG |
| `.rpgstart` | `.rpgstart` | Inicia RPG |
| `.rpgperfil` | `.rpgperfil` | Perfil do RPG |

## 📌 Notas Importantes

- ⚠️ O WhatsApp não oferece modo garantido de impedir exclusão de mensagens
- 🎯 Mensagens de catálogo/produto não podem ser indestrutíveis
- 📸 Detecção visual de mídia requer serviço externo (não implementado)
- 🔑 Apenas o dono pode usar comandos de dono
- 🛡️ Proteções automáticas não atingem o dono do bot
