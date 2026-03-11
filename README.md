<p align="center">
  <img src="nodes/Ploomes/ploomes.png" alt="Ploomes CRM" width="80" />
</p>

<h1 align="center">n8n-nodes-ploomes</h1>

<p align="center">
  <strong>Community node para <a href="https://n8n.io">n8n</a> que integra com a API do <a href="https://www.ploomes.com">Ploomes CRM</a></strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-ploomes"><img src="https://img.shields.io/npm/v/n8n-nodes-ploomes?style=flat-square&color=ff6d5a" alt="npm version" /></a>
  <a href="https://github.com/Ploomes/n8n-nodes-ploomes/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Ploomes/n8n-nodes-ploomes?style=flat-square" alt="license" /></a>
  <a href="https://developers.ploomes.com/"><img src="https://img.shields.io/badge/API%20Docs-developers.ploomes.com-blue?style=flat-square" alt="API docs" /></a>
  <a href="https://n8n.io"><img src="https://img.shields.io/badge/n8n-community%20node-ff6d5a?style=flat-square&logo=n8n" alt="n8n community node" /></a>
</p>

---

## Sobre

Este node permite automatizar e integrar o **Ploomes CRM** com centenas de outros apps no n8n. Oferece cobertura completa da API REST, com suporte nativo a OData v4 e construtores visuais para filtros e expansoes complexas.

---

## Funcionalidades

| Recurso | Descricao |
|---|---|
| **126 acoes** | Cobertura completa de 50 recursos da API |
| **Credenciais seguras** | Autenticacao via header `User-Key` com teste de conexao |
| **OData otimizado** | Defaults inteligentes: `$top=1`, `$select=Id`, `$orderby=Id` |
| **Filter Builder visual** | Construa filtros `$filter` pela interface sem escrever OData |
| **Expand Builder visual** | Monte `$expand` com `$select`, `$filter` e `$expand` aninhados |
| **Filtros de propriedades customizadas** | Suporte a `OtherProperties/any(...)` via interface |
| **Modo raw** | Alterne para modo texto livre para queries OData avancadas |
| **Acoes especiais** | Deal Win/Lose/Reopen, Task Finish, Quote Review |
| **Custom API Call** | Recurso generico para endpoints nao mapeados |

---

## Instalacao

### Via n8n (recomendado)

1. Acesse **Settings > Community Nodes** no seu n8n
2. Clique em **Install a community node**
3. Digite `n8n-nodes-ploomes` e instale

### Via npm

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-ploomes
```

### Desenvolvimento local

```bash
git clone https://github.com/Ploomes/n8n-nodes-ploomes.git
cd n8n-nodes-ploomes
npm install
npm run build
npm link

# Em outro terminal
cd ~/.n8n/nodes
npm link n8n-nodes-ploomes
```

---

## Configuracao de Credenciais

1. No n8n, adicione o node **Ploomes CRM** ao seu workflow
2. Clique em **Select Credential > Create new credential**
3. Insira sua **User-Key** da API do Ploomes
4. Clique em **Save** - a conexao sera testada automaticamente

> Para obter sua User-Key, acesse sua conta Ploomes em **Configuracoes > Integracao > API**.
> Documentacao: [developers.ploomes.com](https://developers.ploomes.com/)

---

## Recursos Disponiveis

### Entidades Principais

| Recurso | Operacoes |
|---|---|
| **Contact** | Get Many, Create, Update, Delete |
| **Deal** | Get Many, Create, Update, Delete, Win, Lose, Reopen |
| **Quote** | Get Many, Create, Update, Delete, Review |
| **Task** | Get Many, Create, Update, Delete, Finish |
| **Order** | Get Many, Create, Update, Delete |
| **Product** | Get Many, Create, Update, Delete |
| **Document** | Get Many, Create, Update, Delete |
| **Interaction Record** | Get Many, Create, Update, Delete |

### Configuracao e Administracao

| Recurso | Operacoes |
|---|---|
| **Account** | Get Many, Update |
| **User** | Get Many, Create, Update |
| **Role** | Get Many, Create |
| **Team** | Get Many, Create, Update, Delete |
| **Department** | Get Many, Create, Update, Delete |
| **Field** | Get Many, Create, Update, Delete |
| **Webhook** | Get Many, Create, Update, Delete |

### Sub-recursos de Contato

| Recurso | Operacoes |
|---|---|
| Contact Line of Business | CRUD |
| Contact Number of Employees | CRUD |
| Contact Origin | CRUD |
| Contact Product | CRUD |
| Contact Relationship | Get Many |
| Contact Status | Get Many |
| Contact Type | Get Many |

### Sub-recursos de Negocio

| Recurso | Operacoes |
|---|---|
| Deal Pipeline | CRUD |
| Deal Stage | Get Many |
| Deal Status | Get Many |
| Deal Loss Reason | Get Many |

### Sub-recursos de Produto

| Recurso | Operacoes |
|---|---|
| Product Family | CRUD |
| Product Group | CRUD |
| Product Part | CRUD |

### Outros Recursos

| Recurso | Operacoes |
|---|---|
| City, Country, State | Get Many |
| Currency | Get Many |
| Document Template | Get Many |
| Field Entity, Field Type | Get Many |
| Field Options Table | Get Many, Create |
| Order Stage | CRUD |
| Phone Type | Get Many |
| Quote Approval Status | Get Many |
| Relative Date | Get Many |
| Tag | CRUD |
| Task Type, Task Email Reminder | Get Many |
| User Profile | Get Many |
| Webhook Action | Get Many |

---

## Construtor de Filtros OData

O node inclui um construtor visual que permite criar queries `$filter` complexas sem precisar escrever OData manualmente.

### Filtros simples

Adicione condicoes com campo, operador e valor:

```
Campo: Name    Operador: contains    Valor: Ploomes    Tipo: String
Campo: Id      Operador: eq          Valor: 12345      Tipo: Number
```

Resultado gerado:
```
$filter=contains(Name,'Ploomes') and Id eq 12345
```

### Operadores disponiveis

| Operador | Descricao | Exemplo |
|---|---|---|
| `eq` | Igual | `Id eq 123` |
| `ne` | Diferente | `Status ne 'Closed'` |
| `gt` / `ge` | Maior / Maior ou igual | `Amount gt 1000` |
| `lt` / `le` | Menor / Menor ou igual | `Amount le 5000` |
| `contains` | Contem texto | `contains(Name,'test')` |
| `startswith` | Comeca com | `startswith(Name,'A')` |
| `endswith` | Termina com | `endswith(Email,'.com')` |

### Filtros de propriedades customizadas

Para filtrar por campos customizados (`OtherProperties`), use o construtor dedicado:

```
FieldKey: contact_cf_123    Operador: eq    Valor: test    Tipo: String
```

Resultado gerado:
```
$filter=OtherProperties/any(p: p/FieldKey eq 'contact_cf_123' and p/StringValue eq 'test')
```

---

## Construtor de Expand OData

Monte queries `$expand` complexas visualmente, com suporte a aninhamento:

### Exemplo complexo via interface

O seguinte expand pode ser construido inteiramente pelo builder visual:

```
$expand=Stage($select=Id,Ordination,PipelineId,LastPipelineStage),
       Status,
       Owner($select=Id,Name),
       Creator($select=Id,Name),
       Pipeline($select=Id,ForbiddenStageReturn,MustPassAllStages,Stages;$expand=Stages),
       OtherProperties($expand=CurrencyValue;$filter=FieldId eq 40006914 or FieldId eq 40006915)
```

### Como configurar

1. **Expand Relations**: Adicione cada relacao com seu `$select` opcional
2. **Expand Nested Filters**: Adicione filtros dentro de expansoes (ex: filtrar `OtherProperties` por `FieldId`)

---

## Otimizacao OData por Padrao

Todas as requests GET sao otimizadas automaticamente:

| Parametro | Padrao | Descricao |
|---|---|---|
| `$top` | `1` | Limite de registros retornados |
| `$skip` | `0` | Offset para paginacao |
| `$select` | `Id` | Campos retornados (reduz payload) |
| `$orderby` | `Id` | Ordenacao dos resultados |

> Todos os parametros sao editaveis - ajuste conforme necessario para sua automacao.

---

## Exemplos de Uso

### Buscar contatos com filtro

```
Resource: Contact
Operation: Get Many
$top: 10
$select: Id,Name,Email
$filter: contains(Name,'Silva')
```

### Criar um negocio

```
Resource: Deal
Operation: Create
Body: { "ContactId": 123, "Title": "Novo negocio", "Amount": 5000 }
```

### Ganhar um negocio

```
Resource: Deal
Operation: Win
ID: 456
Body: { "WonAmount": 5000, "WonProductsAmount": 5000 }
```

### Buscar negocios com expand complexo

```
Resource: Deal
Operation: Get Many
$top: 50
$select: Id,Title,Amount
$expand: Stage($select=Id,Ordination),Owner($select=Id,Name),Pipeline($select=Id;$expand=Stages)
```

---

## Limites da API

| Limite | Valor |
|---|---|
| Requisicoes por minuto | 120 por conta |
| Tamanho maximo do payload | 10 MB |
| Registros por pagina | 300 (Contacts, Deals, Cities, Tasks, Orders, Quotes) |

---

## Desenvolvimento

```bash
# Instalar dependencias
npm install

# Build
npm run build

# Lint
npm run lint

# Formatar codigo
npm run format

# Watch mode
npm run dev
```

---

## Licenca

[MIT](LICENSE)

---

<p align="center">
  Feito com &#10084;&#65039; por <a href="https://www.ploomes.com">Ploomes</a>
</p>
